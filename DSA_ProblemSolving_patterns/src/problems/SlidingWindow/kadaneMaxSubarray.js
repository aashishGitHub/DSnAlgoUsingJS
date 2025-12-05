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


 // Solving Max subarray sum problem using brute force approach

 // On3 time complexity
 function maxSubarraySumCompleteBruteForce(nums) {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    
    for (let j = i; j < nums.length; j++) {
      let currentSum = 0;
      for (let k = i; k <= j; k++) {
        currentSum += nums[k];
        maxSum = Math.max(maxSum, currentSum);
      }
    }
  }
  return maxSum;
 }

 // On2 time complexity
 function maxSubarraySumBruteForce(nums) {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }
  return maxSum;
 }

/**
 * ============================================================================
 * OPTIMAL SOLUTION - Kadane's Algorithm
 * ============================================================================
 * 
 * 🎯 KEY INSIGHT: At each position, ask yourself:
 *    "Should I start fresh here, or continue my current streak?"
 * 
 * 💡 MEMORY AID: Think of it like a running race where you can:
 *    - Start a new lap (start fresh from current element)
 *    - Continue your current lap (extend existing subarray)
 *    You always choose the option that gives you the best time (max sum)!
 * 
 * 📊 VISUALIZATION EXAMPLE:
 *    Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *    
 *    Step-by-step walkthrough:
 *    ┌─────┬──────────────┬─────────────┬──────────┬─────────────────────────┐
 *    │ i   │ nums[i]      │ currentSum  │ maxSum   │ Decision                │
 *    ├─────┼──────────────┼─────────────┼──────────┼─────────────────────────┤
 *    │ 0   │ -2           │ -2          │ -2       │ Initialize              │
 *    │ 1   │  1           │  1          │  1       │ Start fresh (1 > -2+1)  │
 *    │ 2   │ -3           │ -2          │  1       │ Continue (-2 > -3)       │
 *    │ 3   │  4           │  4          │  4       │ Start fresh (4 > -2+4)   │
 *    │ 4   │ -1           │  3          │  4       │ Continue (3 > -1)        │
 *    │ 5   │  2           │  5          │  5       │ Continue (5 > 2)         │
 *    │ 6   │  1           │  6          │  6       │ Continue (6 > 1) ✨ MAX  │
 *    │ 7   │ -5           │  1          │  6       │ Continue (1 > -5)        │
 *    │ 8   │  4           │  5          │  6       │ Continue (5 > 4)         │
 *    └─────┴──────────────┴─────────────┴──────────┴─────────────────────────┘
 *    
 *    Result: Max sum = 6, Subarray = [4, -1, 2, 1]
 * 
 * 🔑 CORE LOGIC:
 *    currentSum = max(nums[i], currentSum + nums[i])
 *    
 *    This means:
 *    - If currentSum is negative, starting fresh (nums[i]) is better
 *    - If currentSum is positive, extending (currentSum + nums[i]) is better
 * 
 * ⏱️  Time Complexity: O(n) - Single pass through the array
 * 💾 Space Complexity: O(1) - Only using a few variables
 * 
 * @param {number[]} nums - Array of integers
 * @returns {number} Maximum sum of contiguous subarray
 */
function kadaneMaxSubarray(nums) {
  // Edge case: empty array
  if (!nums || nums.length === 0) {
    return 0;
  }

  // Initialize: First element is our starting point
  let maxSum = nums[0];        // Global maximum we've seen so far
  let currentSum = nums[0];    // Sum of current subarray we're building

  // Process each element starting from index 1
  for (let i = 1; i < nums.length; i++) {
    // 🎯 THE KEY DECISION POINT:
    // Option 1: Start fresh from current element (nums[i])
    // Option 2: Extend existing subarray (currentSum + nums[i])
    // We choose whichever gives us a larger sum
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    
    // Update our global maximum if we found a better subarray
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

/**
 * ============================================================================
 * OPTIMAL SOLUTION - Kadane's Algorithm with Subarray Indices
 * ============================================================================
 * 
 * 🎯 EXTENDED VERSION: Tracks not just the max sum, but also WHERE it occurs!
 * 
 * 📊 VISUALIZATION EXAMPLE:
 *    Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *    Index:   0  1   2  3   4  5  6   7  8
 *    
 *    Step-by-step with indices:
 *    ┌─────┬──────┬─────────────┬──────────┬──────────┬──────────┬──────────────────────────────┐
 *    │ i   │ num  │ currentSum  │ maxSum   │ start   │ end     │ What's happening             │
 *    ├─────┼──────┼─────────────┼──────────┼──────────┼──────────┼──────────────────────────────┤
 *    │ 0   │ -2   │ -2         │ -2        │ 0        │ 0        │ Initialize                  │
 *    │ 1   │  1   │  1         │  1        │ 1        │ 1        │ Start fresh: 1 > -2+1        │
 *    │ 2   │ -3   │ -2         │  1        │ 1        │ 1        │ Continue: -2 > -3 (but < max)│
 *    │ 3   │  4   │  4         │  4        │ 3        │ 3        │ Start fresh: 4 > -2+4 ✨      │
 *    │ 4   │ -1   │  3         │  4        │ 3        │ 3        │ Continue: 3 > -1 (but < max) │
 *    │ 5   │  2   │  5         │  5        │ 3        │ 5        │ Continue: 5 > 4 ✨ NEW MAX   │
 *    │ 6   │  1   │  6         │  6        │ 3        │ 6        │ Continue: 6 > 5 ✨ NEW MAX   │
 *    │ 7   │ -5   │  1         │  6        │ 3        │ 6        │ Continue: 1 > -5 (but < max)│
 *    │ 8   │  4   │  5         │  6        │ 3        │ 6        │ Continue: 5 > 4 (but < max)  │
 *    └─────┴──────┴─────────────┴──────────┴──────────┴──────────┴──────────────────────────────┘
 *    
 *    Result: maxSum = 6, subarray = [4, -1, 2, 1] (indices 3 to 6)
 *    
 *    Visual representation:
 *    Array:  [-2,  1, -3,  4, -1,  2,  1, -5,  4]
 *    Index:   0   1   2   3   4   5   6   7   8
 *                    └─────────────┘
 *                    This is our max subarray!
 *                    Sum = 4 + (-1) + 2 + 1 = 6
 * 
 * 🔑 KEY TRACKING VARIABLES:
 *    - start: Beginning of the BEST subarray we've found so far
 *    - end: End of the BEST subarray we've found so far
 *    - tempStart: Beginning of the CURRENT subarray we're building
 * 
 * 💡 MEMORY AID:
 *    - When currentSum < 0: We "reset" and start a new subarray
 *    - When currentSum > maxSum: We found a new champion! Update start/end
 *    - tempStart tracks where our current streak began
 *    - start/end track where our BEST streak is
 * 
 * @param {number[]} nums - Array of integers
 * @returns {{maxSum: number, startIndex: number, endIndex: number, subarray: number[]}}
 */
function kadaneMaxSubarrayWithIndices(nums) {
  // Edge case: empty array
  if (!nums || nums.length === 0) {
    return { maxSum: 0, startIndex: -1, endIndex: -1, subarray: [] };
  }

  // Initialize with first element
  let maxSum = nums[0];        // Best sum we've found globally
  let currentSum = nums[0];    // Sum of current subarray we're building
  let start = 0;               // Start index of BEST subarray
  let end = 0;                 // End index of BEST subarray
  let tempStart = 0;           // Start index of CURRENT subarray

  // Process each element
  for (let i = 1; i < nums.length; i++) {
    // 🎯 DECISION: Should we start fresh or continue?
    if (currentSum < 0) {
      // Current sum is negative - it's dragging us down!
      // Better to start fresh from current element
      currentSum = nums[i];
      tempStart = i;  // Mark where our new streak begins
    } else {
      // Current sum is positive - keep extending!
      currentSum += nums[i];
    }

    // 🏆 CHAMPION CHECK: Did we find a better subarray?
    if (currentSum > maxSum) {
      maxSum = currentSum;        // New champion!
      start = tempStart;          // Update start to where current streak began
      end = i;                    // Update end to current position
    }
  }

  return {
    maxSum,
    startIndex: start,
    endIndex: end,
    subarray: nums.slice(start, end + 1)
  };
}

/**
 * ============================================================================
 * VISUALIZATION HELPER - Step-by-step walkthrough
 * ============================================================================
 * 
 * This function helps visualize how Kadane's algorithm works step by step
 * 
 * @param {number[]} nums - Array to visualize
 */
function visualizeKadane(nums) {
  if (!nums || nums.length === 0) {
    console.log('Empty array!');
    return;
  }

  console.log('\n📊 STEP-BY-STEP VISUALIZATION');
  console.log('='.repeat(80));
  console.log(`Array: [${nums.join(', ')}]`);
  console.log(`Index: [${nums.map((_, i) => i).join(', ')}]`);
  console.log('-'.repeat(80));

  let maxSum = nums[0];
  let currentSum = nums[0];
  
  console.log(`\nInitialization:`);
  console.log(`  currentSum = ${currentSum}, maxSum = ${maxSum}`);
  
  for (let i = 1; i < nums.length; i++) {
    const oldCurrentSum = currentSum;
    const option1 = nums[i];           // Start fresh
    const option2 = currentSum + nums[i]; // Continue
    
    currentSum = Math.max(option1, option2);
    const decision = option1 > option2 ? 'START FRESH' : 'CONTINUE';
    
    if (currentSum > maxSum) {
      maxSum = currentSum;
      console.log(`\nStep ${i}: nums[${i}] = ${nums[i]}`);
      console.log(`  Option 1 (start fresh): ${option1}`);
      console.log(`  Option 2 (continue): ${oldCurrentSum} + ${nums[i]} = ${option2}`);
      console.log(`  Decision: ${decision} → currentSum = ${currentSum} ✨ NEW MAX!`);
      console.log(`  maxSum updated to: ${maxSum}`);
    } else {
      console.log(`\nStep ${i}: nums[${i}] = ${nums[i]}`);
      console.log(`  Option 1 (start fresh): ${option1}`);
      console.log(`  Option 2 (continue): ${oldCurrentSum} + ${nums[i]} = ${option2}`);
      console.log(`  Decision: ${decision} → currentSum = ${currentSum}`);
      console.log(`  maxSum stays: ${maxSum}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`🎯 FINAL RESULT: Maximum subarray sum = ${maxSum}`);
  console.log('='.repeat(80) + '\n');
}

// Test cases with explanations
const testCases = [
  {
    arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    description: 'Classic example with negative prefix',
    expected: { sum: 6, subarray: [4, -1, 2, 1] }
  },
  {
    arr: [1, 2, 3, 4, 5],
    description: 'All positive - entire array is the answer',
    expected: { sum: 15, subarray: [1, 2, 3, 4, 5] }
  },
  {
    arr: [-1, -2, -3, -4],
    description: 'All negative - least negative element',
    expected: { sum: -1, subarray: [-1] }
  },
  {
    arr: [5, -4, 3, -2, 1],
    description: 'Positive start, then mixed',
    expected: { sum: 5, subarray: [5] }
  },
  {
    arr: [1, -3, 2, 1, -1],
    description: 'Subarray in the middle',
    expected: { sum: 3, subarray: [2, 1] }
  },
];

console.log('\n' + '='.repeat(80));
console.log('🧪 TESTING OPTIMAL KADANE\'S ALGORITHM');
console.log('='.repeat(80) + '\n');

testCases.forEach((testCase, index) => {
  console.log(`\n📝 Test Case ${index + 1}: ${testCase.description}`);
  console.log(`   Input: [${testCase.arr.join(', ')}]`);
  
  const result = kadaneMaxSubarray(testCase.arr);
  const resultWithIndices = kadaneMaxSubarrayWithIndices(testCase.arr);
  
  console.log(`   ✅ Max Sum: ${result}`);
  console.log(`   ✅ Subarray: [${resultWithIndices.subarray.join(', ')}]`);
  console.log(`   ✅ Indices: ${resultWithIndices.startIndex} to ${resultWithIndices.endIndex}`);
  
  // Visual representation
  const visual = testCase.arr.map((num, i) => {
    if (i >= resultWithIndices.startIndex && i <= resultWithIndices.endIndex) {
      return `[${num}]`;  // Highlight the subarray
    }
    return ` ${num} `;
  }).join(' ');
  console.log(`   📊 Visual: ${visual}`);
  
  // Verify result
  if (result === testCase.expected.sum) {
    console.log(`   ✨ PASSED!`);
  } else {
    console.log(`   ❌ FAILED! Expected ${testCase.expected.sum}, got ${result}`);
  }
  
  console.log('   ' + '-'.repeat(76));
});

// Uncomment to see detailed step-by-step visualization for the first test case
// console.log('\n\n');
// visualizeKadane(testCases[0].arr);

/**
 * ============================================================================
 * 📚 SUMMARY & MEMORY AIDS
 * ============================================================================
 * 
 * 🎯 THE ONE-LINER:
 *    "At each step, choose: start fresh OR continue your streak"
 * 
 * 💡 CORE FORMULA (Remember this!):
 *    currentSum = max(nums[i], currentSum + nums[i])
 *    maxSum = max(maxSum, currentSum)
 * 
 * 🧠 MEMORY TRICKS:
 * 
 *    1. Think of it as a "running total" that can reset:
 *       - If your running total becomes negative, it's better to start over
 *       - Otherwise, keep adding to it
 * 
 *    2. The "Greedy" approach:
 *       - Always make the locally optimal choice (max at each step)
 *       - This leads to the globally optimal solution
 * 
 *    3. Visual metaphor - "Snowball rolling downhill":
 *       - Start with a small snowball (first element)
 *       - As you roll, you can either:
 *         a) Keep adding snow (extend subarray)
 *         b) Start a new snowball (reset)
 *       - Track the biggest snowball you've seen (maxSum)
 * 
 * 📋 STEP-BY-STEP RECALL:
 * 
 *    1. Initialize: maxSum = nums[0], currentSum = nums[0]
 *    2. For each element from index 1:
 *       a) Calculate: currentSum = max(nums[i], currentSum + nums[i])
 *       b) Update: maxSum = max(maxSum, currentSum)
 *    3. Return maxSum
 * 
 * ⚠️  COMMON MISTAKES TO AVOID:
 * 
 *    ❌ Don't reset when currentSum becomes negative - check if it's < 0
 *    ❌ Don't forget to update maxSum at each step
 *    ❌ Don't initialize with 0 if array can have all negatives
 *    ❌ Don't use arr.length instead of nums.length (typo!)
 * 
 * ✅ WHEN TO USE KADANE'S:
 * 
 *    - Finding maximum/minimum sum of contiguous subarray
 *    - Problems involving "subarray" with optimal property
 *    - When you need O(n) time and O(1) space
 *    - Related problems:
 *      * Maximum Product Subarray (similar approach)
 *      * Best Time to Buy/Sell Stock (variant)
 *      * Maximum Sum Circular Subarray (extension)
 * 
 * 🔢 COMPLEXITY REMINDER:
 * 
 *    Time:  O(n) - single pass
 *    Space: O(1) - constant extra space
 * 
 * 🎓 PATTERN RECOGNITION:
 * 
 *    This is a "Dynamic Programming" pattern where:
 *    - We only need the previous state (currentSum)
 *    - We don't need to store all previous states
 *    - Optimal substructure: optimal solution contains optimal sub-solutions
 * 
 * ============================================================================
 */

 