import { tokenize, Token, token } from "./lexer";

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
        case "^": {
            return 60;
        }
    }
    return 0;
};

const associativity = (op: string) => {
    switch (op) {
        case "^": {
            return "r";
        }
    }
    return "l";
};

interface BinaryOp {
    lhs: string | BinaryOp;
    op: string;
    rhs: string | BinaryOp;
}

const parse = (tokens: Token[]): string | BinaryOp => {
    let toks: any[] = [];
    let parenDepth = 0;
    let inParen: any[] = [];
    for (const t of tokens) {
        if (parenDepth === 0) {
            if (t.type === "lparen") {
                parenDepth++;
            } else {
                toks.push(t);
            }
        } else {
            if (t.type === "lparen") {
                parenDepth++;
            } else if (t.type === "rparen") {
                parenDepth--;

                if (parenDepth === 0) {
                    toks.push({
                        type: "paren",
                        value: inParen,
                    });
                    inParen = [];
                }
            } else {
                inParen.push(t);
            }
        }
    }

    let l: BinaryOp | string | null = null;
    let op: string | null = null;
    let r: BinaryOp | string | null = null;

    let side: "l" | "r" = "l";

    for (let i = 0; i < toks.length; i++) {
        const t = toks[i];

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
            case "paren": {
                switch (side) {
                    case "l": {
                        l = parse(t.value);
                        break;
                    }
                    case "r": {
                        r = parse(t.value);
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

                        let thisOpAssociativity = associativity(t.value);

                        // if (tokens[i + 1] == null) {
                        //     console.log({
                        //         op,
                        //         lhs: l,
                        //         rhs: r,
                        //     });
                        //     throw "Invalid Right Hand Side";
                        // }

                        if (
                            oldOpPrecedence > thisOpPrecedence ||
                            (oldOpPrecedence == thisOpPrecedence &&
                                thisOpAssociativity === "l")
                        ) {
                            l = {
                                op: op!,
                                lhs: l!,
                                rhs: r!,
                            } as BinaryOp;

                            op = t.value;
                            r = null;
                        } else {
                            let v =
                                toks[i + 1].type === "paren"
                                    ? parse(toks[i + 1].value)
                                    : toks[i + 1].value;
                            i++;
                            r = {
                                op: t.value,
                                lhs: r!,
                                rhs: v,
                            } as BinaryOp;
                        }
                    }
                }
                break;
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

const evalExpr = (b: BinaryOp | string): number => {
    if (typeof b === "string") {
        return parseFloat(b);
    }

    // if lhs is null, it means its a unary operator.
    // i cant believe how easy that is
    if (b.lhs == null) {
        switch (b.op) {
            case "-":
                return -evalExpr(b.rhs);
            case "+":
                return +evalExpr(b.rhs);
        }
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
        case "^":
            return lhs ** rhs;

        default:
            return 0;
    }
};

// was going good until this
let str = "2 ^ 2 ^ 4";

const t = tokenize(str);
console.log(t);

console.time("PARSE");
const p = parse(t);
console.timeEnd("PARSE");

console.log(JSON.stringify(p, null, 4));

console.log(evalExpr(p));
