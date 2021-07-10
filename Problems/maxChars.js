/****************************************************************************
 * Given a string find the maximum number of repeated character in the string
*****************************************************************************/
function maxChars(inputString){
    let charObj = getCharacterMap(inputString.toLowerCase());
    
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