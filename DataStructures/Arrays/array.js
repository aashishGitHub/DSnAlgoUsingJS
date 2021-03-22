'use strict'

class CustomArray {
    constructor(){
        this.length = 0;
        this.data = {};        
    }
    get(index){
        return this.data[index];
    }
    push(item){
        this.data[this.length] = item;
        this.length++;
    }
}

function checkArray(){
    var arr = new CustomArray();
    arr.push('a');
    arr.push('b');
    console.log(arr);
    console.log(arr.get(0));
}

checkArray();