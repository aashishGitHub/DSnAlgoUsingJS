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

function checkPalindrome(){
    var str = "abbas";
    console.log(palindrome(str));
}

checkPalindrome();