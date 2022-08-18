type TokenType = "number" | "operator" | "lparen" | "rparen" | "expr";

export interface Token {
    type: TokenType;
    value: any;
    index: number;
}
export const token = (t: TokenType, v: any, start: number): Token => {
    return {
        type: t,
        value: v,
        index: start,
    };
};

export const tokenize = (s: string): Token[] => {
    const toks: Token[] = [];

    let tokIndex = 0;

    let n = "";

    const chars = s.split("");
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        if (/[\d\.]/.test(c)) {
            if (n == "number") {
                toks[tokIndex].value += c;
            } else if (n == "") {
                n = "number";
                toks[tokIndex] = token("number", c, i);
            }
        } else if (/\s/.test(c)) {
            if (n == "number") {
                n = "";
                tokIndex++;
            }
        } else if (/[\+\-\*\/\^]/.test(c)) {
            if (n == "number") {
                n = "";
                tokIndex++;
            }
            toks.push(token("operator", c, i));
            tokIndex++;
        } else if (/\(/.test(c)) {
            toks.push(token("lparen", "(", i));
            tokIndex++;
        } else if (/\)/.test(c)) {
            toks.push(token("rparen", ")", i));
            tokIndex++;
        }
    }

    return toks;
};

class Tokenizer {
    constructor(private str: string) {}
}
