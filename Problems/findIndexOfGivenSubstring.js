
//  Find the first index of the substring. 
// Condition: Do not use java library function or regular expressions. 
// And measure the performance of your implementation with the standard java library function. 
// Examples: String 1: “abcdefg” String 2: “bcd” Should return 1
// String 1: “abcdefg” String 2: “x” Should return -1

/**
 * abcdef
 * 
 * cde
 * @param {} str 
 * @param {*} subStr 
 * @returns 
 */
 const findIndexOfGivenSubstring = (str, subStr) => {
    let resultIndex = -1;
    let subStrLength = subStr.length;
    if(!str || !subStr || str.length < subStr.length) {
        return -1;
    }

    for(let i=0; i< str.length-subStrLength; i++){

        if(str[i] === subStr[0]) {
            resultIndex = i;
            for(let j=1; j<subStrLength; j++) {
                if(str[i+j] !== subStr[j]) {
                    resultIndex = -1;
                    break;
                } else if(j==subStrLength-1) {
                    return resultIndex;
                }
            }
        }
    }
    return resultIndex;
}

let s = findIndexOfGivenSubstring("abcdefg", "cde");
console.log(s);