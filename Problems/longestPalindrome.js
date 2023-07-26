// Given an array of strings,
// form palindrome of largest length and return this length.
/*
["ab", "ba", "gg", "kc", "na", "ck", "an"]
result 7
bcoz  ab kc an gg na ck ba 
    ->  7
*/

const getPalindrome = (str) => {
    let i = str.length - 1;
    let result = "";
    while (i >= 0) {
        result += str[i];
        i--;
    }
    return result;
}

const getLongestPalindrome = (arr) => {
    let result = "";
    let lookup = {};
    for (let i = 0; i < arr.length; i++) {

        let palindrome = getPalindrome(arr[i]);

        if (lookup[palindrome]) {
            lookup[palindrome] = arr[i];
        } else lookup[arr[i]] = null;
    }
    // at this momemnt I will have
    // { "ab": 'ba', 'gg':null, 'kc':'ck', 'na':'an'}

    // and Object.entries gives and array of arrays [["ab","ba"],["gg",null]]
    Object.entries(lookup).map((item) => {
        if (item[1]) {
            result = item[0] + result + item[1];
        } else {
            
        }
    })
}
