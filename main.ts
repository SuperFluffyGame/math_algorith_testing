let str = "1 + 2 * (3 - 4)";

interface Token {
    type: string;
    value: string;
}

let token = (t: string, v: string) => {
    return {
        type: t,
        value: v,
    };
};

let tokenize = (str: string) => {
    const toks: Token[] = [];

    let tokIndex = 0;

    let n = "";

    const chars = str.split("");
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        if (/[\d\.]/.test(c)) {
            if (n == "number") {
                toks[tokIndex].value += c;
            } else if (n == "") {
                n = "number";
                toks[tokIndex] = token("number", c);
            }
        } else if (/\s/.test(c)) {
            if (n == "number") {
                n = "";
                tokIndex++;
            }
        } else if (/[\+\-\*\/]/.test(c)) {
            toks.push(token("operator", c));
            tokIndex++;
        } else if (/\(/.test(c)) {
            toks.push({
                type: "lparen",
                value: "",
            });
            tokIndex++;
        } else if (/\)/.test(c)) {
            toks.push({
                type: "rparen",
                value: "",
            });
            tokIndex++;
        }
    }

    return toks;
};

const t = tokenize(str);
console.log(t);

/////////////

const precedence = (op: string) => {
    switch (op) {
        case "+": {
            return 40;
        }
        case "-": {
            return 40;
        }
        case "*": {
            return 50;
        }
        case "/": {
            return 50;
        }
    }
    return 0;
};

interface BinaryOp {
    lhs: string | BinaryOp;
    op: string;
    rhs: string | BinaryOp;
}

const parse = (tokens: Token[]): string | BinaryOp => {
    const tree: object = {};

    let l: BinaryOp | string | null = null;
    let op: string | null = null;
    let r: BinaryOp | string | null = null;

    let side: "l" | "r" = "l";

    let parenDepth = 0;
    let inParen: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        console.log(t.type);

        if (parenDepth === 0) {
            switch (t.type) {
                case "number": {
                    switch (side) {
                        case "l": {
                            l = t.value;
                            break;
                        }
                        case "r": {
                            r = t.value;
                            break;
                        }
                    }
                    break;
                }
                case "operator": {
                    switch (side) {
                        case "l": {
                            op = t.value;
                            side = "r";
                            break;
                        }
                        case "r": {
                            let oldOpPrecedence = precedence(op!);
                            let thisOpPrecedence = precedence(t.value);

                            if (
                                oldOpPrecedence > thisOpPrecedence ||
                                tokens[i + 1] == null
                            ) {
                                l = {
                                    op: op!,
                                    lhs: l!,
                                    rhs: r!,
                                } as BinaryOp;

                                op = t.value;
                                r = null;
                            } else {
                                r = {
                                    op: t.value,
                                    lhs: r!,
                                    rhs: tokens[++i].value,
                                } as BinaryOp;
                            }
                        }
                    }
                    break;
                }

                case "lparen": {
                    parenDepth++;

                    break;
                }
            }
        } else {
            switch (t.type) {
                case "lparen": {
                    parenDepth++;
                    break;
                }
                case "rparen": {
                    parenDepth--;
                    if (parenDepth === 0) {
                        let v = parse(inParen);

                        switch (side) {
                            case "l": {
                                l = v;
                                break;
                            }
                            case "r": {
                                r = v;
                                break;
                            }
                        }
                    }
                    break;
                }
                default: {
                    inParen.push(t);
                    break;
                }
            }
        }
    }

    if (op !== null) {
        l = {
            op: op!,
            lhs: l!,
            rhs: r!,
        } as BinaryOp;
    }
    return l!;
};

console.time("PARSE");
let p = parse(t);
console.timeEnd("PARSE");

console.log(JSON.stringify(p, null, 4));

console.log(evalExpr(p));

function evalExpr(b: BinaryOp | string): number {
    if (typeof b === "string") {
        return parseFloat(b);
    }

    let lhs: number;
    let rhs: number;
    if (typeof b.lhs === "object") {
        lhs = evalExpr(b.lhs);
    } else {
        lhs = parseFloat(b.lhs);
    }
    if (typeof b.rhs === "object") {
        rhs = evalExpr(b.rhs);
    } else {
        rhs = parseFloat(b.rhs);
    }

    switch (b.op) {
        case "+":
            return lhs + rhs;
        case "-":
            return lhs - rhs;
        case "*":
            return lhs * rhs;
        case "/":
            return lhs / rhs;

        default:
            return 0;
    }
}
