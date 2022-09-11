/**
 *
 * Find the sum of any continuous sub-arrays from the given array so that this sum is maximum possible
 * Approch is called Kadance's algorithm.
 * [1,2,-1,3,4,5,6,7,8,9,10,11]
 * Smax 1 3 9
 * Ak   1 2 -1 3
 *  */

function maxSubarraySum(nums) {
  let Smax = nums[0];
  let S_sumIncCurr = nums[0];

  for (let i = 1; i < arr.length; i++) {
    // Either take the ith element and discard the others
    // and carry the previous elements and add the new element and move forward calculating the Max
    S_sumIncCurr = Math.max(nums[i], S_sumIncCurr + nums[i]);

    // We update the Max only when there is a greater value
    Smax = Math.max(Smax, S_sumIncCurr);
  }
  return Smax;
}     
