/**
 * Print all triplets/ group of 3 numbers in an array whose sum is 0
 */

function threeSum(arr) {
    if(arr.length < 3) {
        return [];
    }
    let result = [[]];
    arr.sort();
    for(let i = 0; i< arr.length -2; i++) {
        if(i==0 || arr[i] != arr[i-1]) {
            let j = i+1;
            let k = arr.length -1;

            while(j < k) {
                let sum = arr[i] + arr[j] + arr[k];

                if(sum == 0) {
                    result.push([arr[i], arr[j], arr[k]]);

                    while(j<k && arr[j] == arr[j+1] ) j++;
                    while(j<k && arr[k] == arr[k-1] ) k--;
                    j++;
                    k--;                    
                } else if(sum>0) { k--;}
                else{ j++;}
            }
        }
    }    

    return result;
}
let in1 = [6,3,9,1,4,-1,-5,-2,-7, -3];
let in2 = [-1,0, 1,2,-1,-4];
let result = threeSum(in2);
console.log(result);

//result 
// 0: (3) [-1, -1, 2]
// 1: (3) [-1, 0, 1]