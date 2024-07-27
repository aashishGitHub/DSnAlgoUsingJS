/****************************************************************************
 * Given a string find the character in the string which is repeated max no of times
*****************************************************************************/
function maxChars(inputString) {
    let charObj = getCharacterMap(inputString.toLowerCase());
    return Object.entries(charObj).sort(x=>x.values);
}

function getCharacterMap(word){
    var characterMap = {};
    for(let char of word){
        characterMap[char] = ++characterMap[char] || 1;
    }
    return characterMap;
}

function checkMaxChars(word){
   
    return maxChars(word)[0];
}

let word = "Bhubaneswar";
console.log(checkMaxChars(word)); // [b: 2]
