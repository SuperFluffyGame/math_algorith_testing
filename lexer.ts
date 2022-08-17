type TokenType = "number" | "operator" | "lparen" | "rparen" | "paren";

export interface Token {
    type: TokenType;
    value: any;
}
export const token = (t: TokenType, v: any): Token => {
    return {
        type: t,
        value: v,
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
                toks[tokIndex] = token("number", c);
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
