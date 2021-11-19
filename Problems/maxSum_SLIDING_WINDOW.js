/** 
 * Find the sum of sub arrays of length N, from the given array 
 * Approch in 2nd solution is called SLIDING WINDOW PATTERN 
 * 
 * 
*/

function maxSubarraySum(arr, num) {
    if ( num > arr.length){
      return null;
    }
    var max = -Infinity;
    for (let i = 0; i < arr.length - num + 1; i ++){
      temp = 0;
      for (let j = 0; j < num; j++){
        temp += arr[i + j];
      }
      if (temp > max) {
        max = temp;
      }
    }
    return max;
  }
  
  maxSubarraySum([2,6,9,2,1,8,5,6,3],3)


  function maxSubarraySum2(arr, num) {
    let maxSum = 0;
    let tempSum = 0;
    if (arr.length < num) return null;
    for (let i = 0; i < num; i++) {
      maxSum += arr[i];
    }
    tempSum = maxSum;
    for (let i = num; i < arr.length; i++) {
      tempSum = tempSum - arr[i - num] + arr[i];
      maxSum = Math.max(maxSum, tempSum);
    }
    return maxSum;
  }
  
  maxSubarraySum2([2,6,9,2,1,8,5,6,3],3)
  

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