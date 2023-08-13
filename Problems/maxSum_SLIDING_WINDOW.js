/** 
 * Find the sum of any sub-arrays of given length N, from the given array so that this sum is maximum possible
 * Approch in 2nd solution is called SLIDING WINDOW PATTERN 
 * 
 * 
*/

// brut force way
function maxSubarraySum(arr, num) {
    if ( num > arr.length){
      return null;
    }
    var max = -Infinity;
    for (let i = 0; i < arr.length - num + 1; i++){
     var temp = 0;
      for (let j = 0; j < num; j++) {
        temp += arr[i + j];
      }

      if (temp > max) {
        max = temp;
      }
    }
    return max;
  }
  
  maxSubarraySum([2,6,9,2,1,8,5,6,3],3)

/**
 * SLIDING WINDOW PATTERN
 * @param {*} arr 
 * @param {*} num 
 * @returns 
 */
  function maxSubarraySum2(arr, num) {
    let maxSum = 0;
    let tempSum = 0;
    if (arr.length < num) return null;

    // Calculate the sum of 1st subarray of length num from the start.
    for (let i = 0; i < num; i++) {
      maxSum += arr[i];
    }

    // Store this sum temporarily
    tempSum = maxSum;

    // Start from size (in a 0 indexed loop, starting from length num, means we are now starting from the (num+1) th item )
    // and we will loop till last
    for (let i = num; i < arr.length; i++) {
      // Substaract item from Array at index i-num is the 1st index of last sub-array,
      // And add the ith item
      // this calculates the sum of new subarray 
      tempSum = tempSum - arr[i - num] + arr[i];

      // Now we check and update the max of the calculated and previous sum of array
      maxSum = Math.max(maxSum, tempSum);
    }
    return maxSum;
  }
  
  maxSubarraySum2([2,6,9,2,1,8,5,6,3],3)  // results 19
  

  /**
   * Find the max possible sum of sub arrays items of any length, from the given array
   */
  
//   public int maxSumSubArray(int[] input) {
//     if(input.length ==0) {return 0;}
    
//     int maxSum = input[0];
//     int sumIncludingCurrent = input[0];
    
//     for(int i=1; i<input.length; i++)
//     {
//         int val = input[i];
//         sumIncludingCurrent = Math.max(sumIncludingCurrent+val, val);
//         maxSum = Math.max(maxSum, sumIncludingCurrent);
        
//     }
//     return maxSum;
// }