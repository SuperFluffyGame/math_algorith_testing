import { Token, token, tokenize } from "./lexer";

export type UnaryOp = "neg" | "plus";
export interface UnaryExpr {
    type: UnaryOp;
    value: Expr;
}

export type BinaryOp = "add" | "sub" | "mul" | "div" | "exp";
export interface BinaryExpr {
    type: BinaryOp;
    lhs: Expr;
    rhs: Expr;
}

export type Op = UnaryOp | BinaryOp;

export const precedence = (o: string): number => {
    switch (o) {
        case "+":
        case "-":
            return 40;
        case "*":
        case "/":
            return 50;
        case "u-":
        case "u+":
            return 55;
        case "^":
            return 60;
        default:
            return 0;
    }
};

export const associativity = (o: BinaryOp): "l" | "r" => {
    switch (o) {
        case "exp":
            return "r";
        default:
            return "l";
    }
};

export const isUnary = (o: string): boolean => {
    switch (o) {
        case "+":
            return true;

        case "-":
            return true;

        default:
            return false;
    }
};

export type Expr = BinaryExpr | UnaryExpr | number | string;

export interface ParserResult {
    error: boolean | string;
    value: Expr | null;
}

export const parse = (toks: Token[]) => {
    // Parse Parenthesis
    const tokens: Token[] = [];
    let lastParenIndex = 0;
    let parenDepth = 0;
    let inParen: Token[] = [];

    for (let i = 0; i < toks.length; i++) {
        const t = toks[i];

        switch (t.type) {
            case "lparen": {
                parenDepth++;
                lastParenIndex = t.index;
                break;
            }
            case "rparen": {
                parenDepth--;

                tokens.push(token("expr", parse(inParen), lastParenIndex));
                break;
            }
            default: {
                if (parenDepth == 0) {
                    tokens.push(t);
                } else {
                    inParen.push(t);
                }
            }
        }
    }
    if (parenDepth != 0) {
        return {
            error: `Unmatched Parenthesis at index ${lastParenIndex}`,
            value: "",
        };
    }

    let opStack: any[] = [];
    let valStack: Expr[] = [];

    let lastToken: "op" | "val" | null = null;

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];

        if (t.type === "number") {
            valStack.push(t.value);
            lastToken = "val";
        } else if (t.type === "operator") {
            if (lastToken === "val") {
                while (opStack.length !== 0) {
                    let thisOpPrecedence = precedence(t.value);
                    let lastOpPrecedence = precedence(
                        opStack[opStack.length - 1]
                    );

                    if (
                        thisOpPrecedence < lastOpPrecedence ||
                        (thisOpPrecedence == lastOpPrecedence &&
                            associativity(t.value) == "l")
                    ) {
                        if (
                            t.value.startsWith?.("u") ||
                            opStack[opStack.length - 1].startsWith("u")
                        ) {
                            valStack.push({
                                type: opStack.pop()!,
                                value: valStack.pop()!,
                            });
                        } else {
                            valStack.push({
                                type: opStack.pop()!,
                                rhs: valStack.pop()!,
                                lhs: valStack.pop()!,
                            });
                        }
                    } else {
                        break;
                    }
                }
                opStack.push(t.value);
            } else if (isUnary(t.value)) {
                opStack.push("u" + t.value);
            }
            lastToken = "op";
        } else if (t.type === "expr") {
            valStack.push(t.value);
            lastToken = "val";
        }
    }

    while (opStack.length !== 0) {
        if (opStack[opStack.length - 1].startsWith?.("u")) {
            valStack.push({
                type: opStack.pop()!,
                value: valStack.pop()!,
            });
        } else {
            valStack.push({
                type: opStack.pop()!,
                rhs: valStack.pop()!,
                lhs: valStack.pop()!,
            });
        }
    }
    return valStack.pop();
};
