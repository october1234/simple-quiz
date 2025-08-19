export function colourSeed(p1: boolean, p2: boolean, p3: boolean) {
    const c1 = p1 && p2;
    const c2 = p1 || p3;
    const c3 = !p2 && p3;
    const c4 = p1 && (p2 || p3);

    const isValid = (c1 === (p1 && p2)) &&
                    (c2 === (p1 || p3)) &&
                    (c3 === (!p2 && p3)) &&
                    (c4 === (p1 && (p2 || p3)));

    if (isValid) {
        return [ c1, c2, c3, c4 ];
    } else {
        return [false, false, false, false];
    }
}

