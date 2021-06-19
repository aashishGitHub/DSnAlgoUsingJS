function binarySearch(sortedArray,itemToSearch){    
    var startIndex = 0;
    var endIndex = sortedArray.length-1;    
    while(startIndex <= endIndex){
        var midIndex = (startIndex + endIndex)/2;        
        if(itemToSearch === sortedArray[midIndex]){
            return midIndex;
        }else if(itemToSearch < sortedArray[midIndex]){
            endIndex = midIndex - 1;
        }else if(itemToSearch > sortedArray[midIndex]){
            startIndex = midIndex + 1;
        }
    }
    return null;
}

function bubbleSort(array){
    for(var i=0;i<array.length;i++){
        for(var j=i+1;j<array.length;j++){
            if(array[i]>array[j]){
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
    return array;
}

function checkBinarySearch(){
    var arr = [9,7,1,5,11,17,4];
    //first and foremost requirement of binary search is to sort the array
    var sortedArray = bubbleSort(arr);
    var itemIndex = binarySearch(sortedArray,11);
    console.log(`Item found at index ${itemIndex} in [${sortedArray}] array`);
}

checkBinarySearch();