/*******************************************************************
 * A string is said to be palindrome if reverse of the string will
 * result in the same string. e.g Heeh
********************************************************************/
function palindrome(inputString){
    var originalString = inputString.toLowerCase();
    var stringArray = originalString.split("");
    var reverseArray = stringArray.reverse();
    var finalString = reverseArray.join("");
    return originalString === finalString;
}

function palindrome2(inputString){
    var originalString = inputString.toLowerCase();
    var stringArray = originalString.split("");
    /********************************************************* *
     * every() will run the callback function for every item in
     * an array and will return true if the underlying condition
     * will return true for every element else will return false
    ************************************************************/
    var isPalindrome = stringArray.every((char,index) => {
        return char === inputString[inputString.length-index-1];
    });
    return isPalindrome;
}

function checkPalindrome(){
    var str = "abbas";
    console.log(palindrome(str));
}

function checkPalindrome2(){
    var str = "abba";
    console.log(palindrome2(str));
}

//checkPalindrome();
checkPalindrome2();