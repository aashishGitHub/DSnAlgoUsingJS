function reverseString(inputString){
    let stringArray = inputString.split("");    
    let reversedArray = stringArray.reverse();    
    let finalReversedString = reversedArray.join("");    
    return finalReversedString;
}

function checkReverseString(){
    let string = "farmer";
    let res = reverseString(string);
    console.log(res);
}


let inputWord = "Analogous";
// reverse using Reduce
let res = inputWord.split("").reduce((acc, curr) => {
    return curr+acc;

}, "");

checkReverseString();



//----------------------------------------------------------------
// WITHOUT ANY BUILT In FUNCTIONS
//----------------------------------------------------------------
var reverseWords = function (s) {
    var stack = [];
    var currentStack = [];
    var result = "";

    for (let i = 0; i <= s.length; i++) {

        if (s[i] == ' ' || i==s.length) {

            if (currentStack.length > 0) {
                stack.push(currentStack.join(""));
                currentStack = [];
            }

        } else {
            currentStack.push(s[i])
        }
    }

    for (let i = stack.length - 1; i >= 0; i--) {
        i == 0 ? result += stack.pop() : result += stack.pop() + " ";
    }
    return result;
};

console.log(reverseWords("The sky is blue"));