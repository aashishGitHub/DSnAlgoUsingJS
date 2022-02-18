/****************************************************************************
 * Given a string find the character in the string which is repeated max no of times
*****************************************************************************/
function maxChars(inputString) {
    let charObj = getCharacterMap(inputString.toLowerCase());
    Object.entries(charObj).sort(x=>x.values);
}

function getCharacterMap(word){
    var characterMap = {};
    for(let char of word){
        characterMap[char] = ++characterMap[char] || 1;
    }
    return characterMap;
}

function checkMaxChars(){
    let word = "Bhubaneswar";
    maxChars(word);
}

checkMaxChars();