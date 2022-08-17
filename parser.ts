import { Token } from "./lexer";

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

export const precedence = (o: BinaryOp | UnaryOp) => {
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

export type Expr = BinaryExpr | UnaryExpr | number | string;

export interface ParserResult {
    error: boolean | string;
    value: Expr | null;
}

export const parse = (toks: Token[]): ParserResult => {
    // Parse Parenthesis
    const tokens: Token[] = [];
    let parenDepth = 0;
    let inParen: Token[] = [];
    for (let i = 0; i < toks.length; i++) {
        
    }
};
