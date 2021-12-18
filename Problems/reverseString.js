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