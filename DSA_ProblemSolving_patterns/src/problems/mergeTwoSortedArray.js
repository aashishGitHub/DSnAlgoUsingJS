
// Merge sorted arrays to obtain a sorted array again
// APPROACH
// Take a pointer for each of the arrays
// 
function mergeTwoSortedArray(array1, array2){
    var resultantArray = [];
    var i = 0;
    var j = 0;
    while(i !== array1.length && j !== array2.length){
        if(array1[i] >= array2[j]){
            resultantArray.push(array2[j]);
            ++j;
            if(j===array2.length)
                resultantArray.push(array1);
        }else{
            resultantArray.push(array1[i]);
            ++i;
            if(i===array1.length)
                resultantArray.push(array2);
        }
    }  
    return resultantArray;
}

function checkMergeTwoSortedArray(){
    let firstArray = [1,5,8,15,23,67];
    let secondArray = [2,4,7,45,57,110];
    var resultArray = mergeTwoSortedArray(firstArray,secondArray);
    console.log(resultArray);
}

checkMergeTwoSortedArray();
