import { tokenize, Token, token } from "./lexer";
import { Expr, parse } from "./parser";

// const precedence = (op: string) => {
//     switch (op) {
//         case "+": {
//             return 40;
//         }
//         case "-": {
//             return 40;
//         }
//         case "*": {
//             return 50;
//         }
//         case "/": {
//             return 50;
//         }
//         case "^": {
//             return 60;
//         }
//     }
//     return 0;
// };

// const associativity = (op: string) => {
//     switch (op) {
//         case "^": {
//             return "r";
//         }
//     }
//     return "l";
// };

// interface BinaryOp {
//     lhs: string | BinaryOp;
//     op: string;
//     rhs: string | BinaryOp;
// }

// const parse = (tokens: Token[]): string | BinaryOp => {
//     let toks: any[] = [];
//     let parenDepth = 0;
//     let inParen: any[] = [];
//     for (const t of tokens) {
//         if (parenDepth === 0) {
//             if (t.type === "lparen") {
//                 parenDepth++;
//             } else {
//                 toks.push(t);
//             }
//         } else {
//             if (t.type === "lparen") {
//                 parenDepth++;
//             } else if (t.type === "rparen") {
//                 parenDepth--;

//                 if (parenDepth === 0) {
//                     toks.push({
//                         type: "paren",
//                         value: inParen,
//                     });
//                     inParen = [];
//                 }
//             } else {
//                 inParen.push(t);
//             }
//         }
//     }

//     let l: BinaryOp | string | null = null;
//     // change op to an op stack
//     // i guess we just have to make a value stack and go full shunting yard?
//     // oh well
//     let op: string | null = null;
//     let r: BinaryOp | string | null = null;

//     let expectedToken: "val" | "op" | null = null;
//     // if we get an operator when last token is operator, this operator
//     // is a unary operator and we do whatever for that

//     // remove this, just check if l is null
//     let side: "l" | "r" = "l";

//     for (let i = 0; i < toks.length; i++) {
//         const t = toks[i];

//         switch (t.type) {
//             case "number": {
//                 switch (side) {
//                     case "l": {
//                         l = t.value;
//                         break;
//                     }
//                     case "r": {
//                         r = t.value;
//                         break;
//                     }
//                 }
//                 break;
//             }
//             case "paren": {
//                 switch (side) {
//                     case "l": {
//                         l = parse(t.value);
//                         break;
//                     }
//                     case "r": {
//                         r = parse(t.value);
//                         break;
//                     }
//                 }
//                 break;
//             }
//             case "operator": {
//                 switch (side) {
//                     case "l": {
//                         op = t.value;
//                         side = "r";
//                         break;
//                     }
//                     case "r": {
//                         let oldOpPrecedence = precedence(op!);
//                         let thisOpPrecedence = precedence(t.value);

//                         let thisOpAssociativity = associativity(t.value);

//                         if (
//                             oldOpPrecedence > thisOpPrecedence ||
//                             (oldOpPrecedence == thisOpPrecedence &&
//                                 thisOpAssociativity === "l")
//                         ) {
//                             l = {
//                                 op: op!,
//                                 lhs: l!,
//                                 rhs: r!,
//                             } as BinaryOp;

//                             op = t.value;
//                             r = null;
//                         } else {
//                             let v =
//                                 toks[i + 1].type === "expr"
//                                     ? parse(toks[i + 1].value)
//                                     : toks[i + 1].value;
//                             i++;
//                             r = {
//                                 op: t.value,
//                                 lhs: r!,
//                                 rhs: v,
//                             } as BinaryOp;
//                         }
//                     }
//                 }
//                 break;
//             }
//         }
//     }

//     if (op !== null) {
//         l = {
//             op: op!,
//             lhs: l!,
//             rhs: r!,
//         } as BinaryOp;
//     }

//     return l!;
// };

const evalExpr = (b: any): number => {
    if (typeof b === "string") {
        return parseFloat(b);
    } else if (typeof b === "number") {
        return b;
    }

    if (b.type === "u-") {
        return -b.value;
    } else if (b.type === "u+") {
        return +b.value;
    }

    let lhs: number = evalExpr(b.lhs);
    let rhs: number = evalExpr(b.rhs);

    if (b.type === "+") {
        return lhs + rhs;
    } else if (b.type === "-") {
        return lhs - rhs;
    } else if (b.type === "*") {
        return lhs * rhs;
    } else if (b.type === "/") {
        return lhs / rhs;
    } else if (b.type === "^") {
        return lhs ** rhs;
    }

    return 0;
};

let str = "2 ^ -3";

const t = tokenize(str);
console.log(t);

console.time("PARSE");
const p = parse(t);
console.timeEnd("PARSE");

console.log(JSON.stringify(p, null, 4));

console.log(evalExpr(p));
