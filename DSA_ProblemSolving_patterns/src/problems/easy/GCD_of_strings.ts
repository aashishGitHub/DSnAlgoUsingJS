// 1071. Greatest Common Divisor of Strings
// Difficulty: Easy
// https://leetcode.com/problems/greatest-common-divisor-of-strings/description/?envType=study-plan-v2&envId=leetcode-75
function gcdOfStrings(str1: string, str2: string): string {
    
    // isSmallerContendInsideLarger
    if(str1.length < str2.length) {
        if(str2.length % str1.length === 0) {
            // means str1 is of size of a substring of str2
            // check if str1 is a substring of str2 ??
            let factor = str2.length / str1.length;
            let generateStr1 = '';
            for(let i = 0; i < factor; i++) {
                generateStr1 += str1;
            }
            if(generateStr1 === str2) {
                // means str1 is a substring of str2
                return str1;
            }
        }
    } else {
        if(str1.length % str2.length === 0) {
            // means str1 is of size of a substring of str2
            // check if str1 is a substring of str2 ??
            let factor = str1.length / str2.length;
            let generateStr2 = '';
            for(let i = 0; i < factor; i++) {
                generateStr2 += str2;
            }
            if(generateStr2 === str1) {
                // means str2 is a substring of str1
                return str2;
            }
        }
    }

    let smaller = str1.length < str2.length ? str1 : str2;
    

    return '';
};


