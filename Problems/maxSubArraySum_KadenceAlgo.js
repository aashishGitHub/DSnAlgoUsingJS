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
    // Either take the ith element  (nums[i]) and discard the others
    // or carry the previous sequence and add the new element to move forward inorder to
    // calculate the Max
    S_sumIncCurr = Math.max(nums[i], S_sumIncCurr + nums[i]);

    // We update the Max only when there is a greater value
    Smax = Math.max(Smax, S_sumIncCurr);
  }
  return Smax;
}

// Should return the sequence where sum of all elements in the sequence are maximum
// solution

/**
 * additional variable resultingSequence = []
 * update start of resultingSequence whenever we discard the previous sequence.
 * i.e. when sum of existing sequences is -ve and next element is positive
 *
 * Update end of resultingSequence whenever we accept the new element in the current sequence
 */
function maxSubArraySum(nums) {
  let Smax = nums[0];
  let SumIncCurr = nums[0];
  let longestSequenceStart = nums[0];
  let longestSequenceEnd = nums[0];

  let tempEnd = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let givenNumber = nums[i];
    //
    if (givenNumber > givenNumber + SumIncCurr) {
      // The given number can discard the current sequence
      longestSequenceStart =givenNumber;
      longestSequenceEnd = givenNumber;

    } else if (givenNumber < (givenNumber + SumIncCurr) // We need to carry the current sequence with given number
                      && (givenNumber + SumIncCurr) < Smax) {
      // we just found a number which when added to the sequence, it increases the value but still less than Max, 
      //so this can be end of new sequence of higher value.
      tempEnd = nums[i];
    } else if (givenNumber + SumIncCurr > Smax) {
      // if we were holding the end of the sequence
      if(tempEnd != longestSequenceEnd) {
        longestSequenceEnd = givenNumber;
      }
    }
    SumIncCurr = Math.max(SumIncCurr + nums[i], nums[i]);
    Smax = Math.max(SumIncCurr, Smax);
  }
  return {
    longestSequenceLength: Smax,
    Start: longestSequenceStart,
    End: longestSequenceEnd,
  };
}

let input = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
let result = maxSubArraySum(input);
console.log(result);
