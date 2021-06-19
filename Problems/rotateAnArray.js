/*
Rotate an array by kth position
input array = [1,3,5,7,9]
Rotate by 2 position will give
output array = [5,7,9,1,3]
*/
function rotateArrayByKthPosition(array,k){
    let resArray = array;
    for(var i=0;i<k;i++){
        resArray = rotateArrayByOnePosition(resArray);
    }
    return resArray;
}

function rotateArrayByOnePosition(array){
    //pick first number
    let firstNumber = array[0];
    //copy first number to last of array
    array[array.length] = firstNumber;
    //now move every element in array by one position left            
    for(var i=1;i<=array.length-1;i++){
        array[i-1] = array[i];         
    }
    //remove last item as its a duplicate
    array.pop();
    return array;
}

function checkRotateArrayByOnePosition(){
    let testArray = [5,3,8,6,9];
    let rotatedByOneArray = rotateArrayByOnePosition(testArray);
    console.log(rotatedByOneArray);
}

function checkRotateArrayByKthPosition(){
    let testArray = [1,3,5,7,9];
    let rotatedByOneArray = rotateArrayByKthPosition(testArray,2);
    console.log(rotatedByOneArray);
}

checkRotateArrayByKthPosition();