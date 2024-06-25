

const rotateArrayByN= (arr: number[], n: number): void => {
    n = n % arr.length;
    if(n < 0) {
        n += arr.length;
    }
    let temp = arr.splice(0, n);
    arr.push(...temp); //  can also use arr.unshift(...temp);
}

// test cases
console.log(rotateArrayByN([1,2,3,4,5,6,7], 3)); // [5,6,7,1,2,3,4]
console.log(rotateArrayByN([-1,-100,3,99], 2)); // [3,99,-1,-100]
console.log(rotateArrayByN([1,2,3,4,5,6,7], 3)); // [5,6,7,1,2,3,4]

const rotateArrayByN1 = (arr: number[], n: number): void => {
    n = n % arr.length;
    if(n < 0) {
        n += arr.length;
    }

    for (let i = 0; i < n; i++) {
       
    }
   
}
