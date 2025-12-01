
/**
 * Given a sorted array, count the number of unique values
 * 
 * @param {
 * } arr 
 * @returns 
 */
/**
 * start as 
 * j
 *         |
 * 1,2,2,5,7,7,99
 *     ^
 * i
 *              |
 * 1,2,5,7,7,7,99
 *       ^
 * 
 * 1,2,5,7,99,7,99
 *          ^
 * 
 */

function countUniqueValuesInSortedArray(arr) {
    if (arr.length === 0) return 0;

    var i = 0;

    for (var j = 1; j < arr.length; j++) {
        if (arr[i] !== arr[j]) {
            i++;
            arr[i] = arr[j]
        }
    }
    return i + 1;
}
countUniqueValuesInSortedArray([1, 2, 2, 5, 7, 7, 99])

/**
 * Count unique values in a non sorted array
 * @param {[]} inputArray 
 * @returns []
 */
const noOfUniqueInNonSortedArray = (inputArray) => {
    let objectMap = inputArray.reduce((acc, input) => {
       acc[input] = acc[input] ? acc[input] + 1 : 1;
       return acc;

    }, {});
    
    const uniqueValues = Object.keys(objectMap);
    return uniqueValues;
   
}
console.log(noOfUniqueInNonSortedArray([1, 2, 2, 5, 7, 7, 99]));