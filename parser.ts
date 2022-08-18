import { Token, token } from "./lexer";

export type UnaryOp = "neg" | "plus";
export interface UnaryExpr {
    type: UnaryOp;
    value: Expr;
}

export type BinaryOp = "add" | "sub" | "mul" | "div" | "exp";
export interface BinaryExpr {
    type: BinaryOp;
    value: Expr;
}

export const precedence = (o: BinaryOp | UnaryOp): number => {
    switch (o) {
        case "add":
        case "sub":
            return 40;
        case "mul":
        case "div":
            return 50;
        case "neg":
        case "plus":
            return 55;
        case "exp":
            return 60;
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

export type Expr = BinaryExpr | UnaryExpr | number | string;

export interface ParserResult {
    error: boolean | string;
    value: Expr | null;
}

export const parse = (toks: Token[]): ParserResult => {
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
            }
            case "rparen": {
                parenDepth--;

                tokens.push(token("expr", inParen, lastParenIndex));
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

    return {
        error: "",
        value: "",
    };
};
