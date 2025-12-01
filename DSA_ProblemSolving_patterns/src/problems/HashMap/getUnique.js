const uniqueArray = (arrayInput) => {

    return arrayInput.filter((x, i) => 
    {
       return  arrayInput.indexOf(x) == i;
    }
   );
}

 const optimizedUnique = (inputArray) => {

    let objectMap= {};
    for(let i of inputArray) {
        objectMap[i] = objectMap[i] ? objectMap[i] +1 : 1;
    }

   let filteredArray = Object.keys(objectMap).filter(x=> x && x > 0);
   return filteredArray;
 }



//  2 2 2 2        
// [1,2,3,4,1,2,3,4]

let s = uniqueArray([1,2,1,1,2]);
console.log(s);