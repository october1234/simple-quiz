import { useEffect, useRef, useState } from "react"
import "./App.css"
import { colourSeed } from "./colourseed";

import emerald from "./assets/emerald.png";
import ruby from "./assets/ruby.png";
import sapphire from "./assets/sapphire.png";

const enum Stage {
  WELCOME = "WELCOME",
  QUESTIONS = "QUESTIONS",
  ENDING = "ENDING",
}

type GemStatus = {
  sapphire: boolean,
  emerald: boolean,
  ruby: boolean,
}

function App() {
  const [stage, setStage] = useState<Stage>(Stage.WELCOME);
  const stageRef = useRef<Stage>(stage);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const answers = useRef([false, false, false, false]);
  const gemStatus = useRef<GemStatus>({
    sapphire: false,
    emerald: false,
    ruby: false,
  });
  const [borderColourRN, setBorderColourRN] = useState(0);

  console.log("===RENDER===")
  console.log(`當前階段: ${stage}`);
  console.log(`當前階段Ref: ${stageRef.current}`);
  console.log(`當前問題Ref: ${currentQuestion}`);
  console.log(`答案: ${answers.current}`);
  console.log(`寶石狀態: ${JSON.stringify(gemStatus.current)}`);
  console.log("============")

  function answerQuestion(ans: boolean) {
    if (stageRef.current !== Stage.QUESTIONS)
      return
    setCurrentQuestion(v => {
      answers.current[v] = ans;
      if (v < 3) {
        return v + 1;
      } else {
        setStage(Stage.ENDING);
        return 0;
      }
    });
  }

  function start() {
    if (stageRef.current !== Stage.WELCOME)
      return;
    console.log("開始挑戰");
    setStage(Stage.QUESTIONS);
    setCurrentQuestion(0);
    answers.current = [false, false, false, false];
    gemStatus.current = {
      sapphire: Math.random() < 0.5,
      emerald: Math.random() < 0.5,
      ruby: Math.random() < 0.5,
    };
  }

  function cancel() {
    console.log("取消挑戰");
    setStage(Stage.WELCOME);
    setCurrentQuestion(0);
    answers.current = [false, false, false, false];
    gemStatus.current = {
      sapphire: false,
      emerald: false,
      ruby: false,
    }
  }

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          answerQuestion(true);
          return;
        case "s":
          answerQuestion(false);
          return;
        case "a":
          start();
          return;
        case "d":
          cancel();
          return;
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBorderColourRN(Math.floor(Math.random() * 3))
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const colourCalc = colourSeed(gemStatus.current.ruby, gemStatus.current.sapphire, gemStatus.current.emerald)
  const borderColourClass = colourCalc[currentQuestion] ?
  ["border-red-500", "border-yellow-500", "border-blue-500", "border-amber-800"] :
  ["border-green-500", "border-orange-500", "border-pink-500", "border-purple-500"];

  console.log(borderColourClass[borderColourRN])
  return (
    <div className={`${borderColourClass[borderColourRN]} border-2 box-content p-16`}>
      <IfStage stage={Stage.WELCOME} currentStage={stage}>
        <Welcome/>
      </IfStage>
      <IfStage stage={Stage.QUESTIONS} currentStage={stage}>
        <div className="flex flex-col gap-20 items-center">
          <div>
            <div className="flex gap-8 justify-center">
              <div className="flex flex-col gap-2 items-center">
                <div className="h-24 w-24 p-2">
                  <img className="" src={ruby} alt="" />
                </div>
                <p className="text-xl">狀態：<GemStatus status={gemStatus.current.ruby}/></p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <img className="h-24 w-24" src={sapphire} alt="" />
                <p className="text-xl">狀態：<GemStatus status={gemStatus.current.sapphire}/></p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <img className="h-24 w-24" src={emerald} alt="" />
                <p className="text-xl">狀態：<GemStatus status={gemStatus.current.emerald}/></p>
              </div>
            </div>
          </div>
          <Question q={currentQuestion}/>
        </div>
      </IfStage>
      <IfStage stage={Stage.ENDING} currentStage={stage}>
        <Ending gemStatus={gemStatus.current} answers={answers.current} restart={cancel}/>
      </IfStage>
    </div>
  );
}

function IfStage({ stage, currentStage, children }: { stage: Stage, currentStage: Stage, children?: React.ReactNode | React.ReactNode[] }) {
  return stage === currentStage ? <>{children}</> : <></>;
}

function Welcome() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-6xl">歡迎來到挑戰</h1>
      <p className="text-2xl">點擊<span className="text-blue-400">開始遊戲</span>，點擊<span className="text-yellow-500">取消</span>可回到這裡</p>
    </div>
  )
}

function Ending({gemStatus, answers, restart}: {gemStatus: GemStatus, answers: boolean[], restart: () => void}) {
  // ((ruby&&sapphire)==q1)&&((ruby||emerald)==q2)&&((!sapphire&&emerald)==q3)&&((ruby&&(sapphire||emerald))==q4)
  const [countdown, setCountdown] = useState(15);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(v => {
        if (v <= 0) {
          restart();
        }
        return v - 1
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const result =
    (answers[0] === (gemStatus.ruby && gemStatus.sapphire)) &&
    (answers[1] === (gemStatus.ruby || gemStatus.emerald)) &&
    (answers[2] === (!gemStatus.sapphire && gemStatus.emerald)) &&
    (answers[3] === (gemStatus.ruby && (gemStatus.sapphire || gemStatus.emerald)))
  return (
    <div>
      {result && <h1 className="text-5xl">答對了!</h1>}
      {!result && <h1 className="text-5xl">很遺憾，你答錯了 {":("}</h1>}
      <p className="text-xl text-gray-500 mt-4">將在{countdown}秒後返回開始畫面</p>
    </div>
  )
}

function GemStatus({status}: {status: boolean}) {
  return status ? <span className="text-green-500">True</span> : <span className="text-red-500">False</span>;
}

const questionNames = ["機關 A", "機關 B", "機關 C", "機關 D"];

function Question({q}: {q: number}) {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-6xl">{questionNames[q]}</h1>
        <p className="text-3xl">請選擇 <span className="text-green-500">True</span> 或 <span className="text-red-500">False</span></p>
      </div>
      <div className="flex gap-10 justify-center w-full">
        <div className="py-4 px-10 bg-green-500 text-black font-bold text-4xl">True</div>
        <div className="py-4 px-10 bg-red-500 text-black font-bold text-4xl">False</div>
      </div>
    </>
  )
}

export default App
