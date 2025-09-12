/*******************************************************************
 * A string is said to be palindrome if reverse of the string will
 * result in the same string. e.g Heeh
 ********************************************************************/
function palindrome(inputString) {
  var originalString = inputString.toLowerCase();
  var stringArray = originalString.split("");
  var reverseArray = stringArray.reverse();
  var finalString = reverseArray.join("");
  return originalString === finalString;
}

function palindrome2(inputString) {
  var originalString = inputString.toLowerCase();
  var stringArray = originalString.split("");
  /********************************************************* *
   * every() will run the callback function for every item in
   * an array and will return true if the underlying condition
   * will return true for every element else will return false
   ************************************************************/
  var isPalindrome = stringArray.every((char, index) => {
    return char === inputString[inputString.length - index - 1];
  });
  return isPalindrome;
}

// COMPARE TILL HALF OF THE ARRAY
function palindrome3(inputString) {
  var originalString = inputString.toLowerCase();
  var stringArray = originalString.split("");

  // We can iterate only till half the length of Array and compare with the other half.
  for (let i = 0; i < stringArray.length / 2; i++) {
    if (stringArray[i] != stringArray[stringArray.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

// Simple and 2 pointer based solution
export function isPalindrome(s) {
  // Replace this placeholder return statement with your code
  if (typeof s != "string") return false;

  let start = 0;
  let end = s.length - 1;
  while (start <= end) {
    if (s[start] !== s[end]) {
      return false;
    } else {
      start++;
      end--;
    }
  }

  return true;
}
// Time complexity
// The time complexity is

// O(n), where n is the number of characters in the string.However, our algorithm will only run(n / 2)
// times, since two pointers are traversing toward each other.

function checkPalindrome() {
  var str = "abbas";
  console.log(palindrome(str));
}

function checkPalindrome2() {
  var str = "abba";
  console.log(palindrome2(str));
}

function checkPalindrome3() {
  var str = "abba";
  console.log(palindrome3(str));
}

//checkPalindrome();
checkPalindrome2();
checkPalindrome3();

function isPalindrome2(input) {
  const halfString = input.slice(0, input.length / 2);

  const isPalindromeOrNot = halfString.split("").every((char, index) => {
    return char === input[input.length - 1 - index];
  });
  return isPalindromeOrNot;
}

console.log(isPalindrome2("abccba"));
console.log(isPalindrome2("abcba"));
console.log(isPalindrome2("abcdba"));
