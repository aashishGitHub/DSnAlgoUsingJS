/**
 i    |
 * [1,3,5,2,7,26,11,33,64,89,21]
 j  ^   
 *  1 1
 * L
 * 
 * 
 */
maxIncreasingSubsequence = (arr) => {

    let L = [];
    L[0] = 1;

    for(let i = 1; i<arr.length; i++) {
        L[i] = 1;
        let temp = 0;

        for(let j = 0; j< i; j++) {
            if(arr[j] < arr[i] 
                && L[J]+1  > L[i]) {

                    L[i]+=1;
                }
        }
    }

    let max = Math.max.apply(null, L);
    return max;
}
