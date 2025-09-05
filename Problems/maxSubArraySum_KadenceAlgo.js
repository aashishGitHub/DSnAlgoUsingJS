/**
 *
 * Find the sum of any continuous sub-arrays from the given array so that this sum is maximum possible
 * Approach is called Kadance's algorithm.
 * [1,2,-1,3,4,5,6,7,8,9,10,11]
 * Smax 1 3 9
 * Ak   1 2 -1 3
 *  */

function maxSubarraySum(nums) {
  let Smax = nums[0];
  let S_sumIncCurr = nums[0];

  for (let i = 1; i < arr.length; i++) {
    // Either take the ith element (nums[i]) and discard the others
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



/***
 * The basic idea of Kadane’s algorithm is to scan the entire array and at each position
 *  find the maximum sum of the subarray ending there. This is achieved by keeping a current_max
 *  for the current array index and a global_max. The algorithm is as follows:

current_max = A[0]
global_max = A[0]
for i = 1 -> size of A
    if current_max is less than 0
        then current_max = A[i]
    otherwise 
        current_max = current_max + A[i]
    if global_max is less than current_max
        then global_max = current_max


 */

const kadence = (numArr) => {
  let current_max = numArr[0];
  let global_max = numArr[0];

  let startIndex = 0;
  let endIndex = 0;

  for (let i = 1; i < numArr.length; i++) {

    // If i'th item is a negative number then start fresh sequence.
    // Means currentMax is reset and we are already keeping a record of maxSoFar
    // otherwise for a positive number, add the new item to the current sequence 
    if (numArr[i] < 0 ) {
      current_max = numArr[i];
      startIndex = i;
    } else current_max = current_max + numArr[i];

    if(current_max > global_max) 
    global_max = current_max;
    endIndex = i;
  }
  console.log("startIndex " + startIndex + " lastendex " + endIndex);
  return global_max;
}


// Check this worked 
/*
const solution = (s: string): string => {
  // write your solution here..
  let maxLength: number = 0;
  let start = 0;
  let longestSubstring = '';
     const charIndexMap = new Map<string, number>();
  for(let end = 0; end < s.length; end++) {
     const char = s[end];
 
     if(charIndexMap.has(char) && charIndexMap.get(char)! >= start) {
         start = charIndexMap.get(char)! + 1;
     }
 
     charIndexMap.set(char, end)
 
     if(end - start + 1 > maxLength) {
         maxLength = end - start + 1;
         longestSubstring = s.substring(start, end + 1)
     }
  }
  return longestSubstring;
 };
 
 // console.log(solution("abc"))
 // console.log(solution("abcb"))
 // console.log(solution("abcdabcdef"))
 console.log(solution("abcderfgb"))


 */