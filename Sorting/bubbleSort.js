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

function checkBubbleSort(){
    var arr = [1, 6, 8, 4, 80, 23, 57];
    var sortedArray = bubbleSort(arr);
    console.log(sortedArray);
}

checkBubbleSort();