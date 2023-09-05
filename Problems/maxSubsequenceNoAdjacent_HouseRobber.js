/**
 * Maximum sum of non-adjacent elements (DP 5)
 * Given an array of ‘N’  positive integers, 
 * we need to return the maximum sum of the subsequence such that no two elements of the subsequence are adjacent elements
 *  in the array.

Note: A subsequence of an array is a list with elements of the array where some elements are deleted ( or not deleted at all) 
and the elements should be in the same order in the subsequence as in the array.
 * 
 * 
 * 
 * /** */
// Assuming all +ve values
var rob = function (nums) {
    let rob1 = nums[0];
    let rob2 = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {

        // We can either select the last to the previous element and the current element. 
        // Or the previous element and discard the current element
        let temp = Math.max(rob1 + nums[i], rob2);

        // Move forward in the iteration by shifting the 2 placeholdrs
        rob1 = rob2;
        rob2 = temp;
    }

    return rob2;
};




/***
 There are two examples, one in which nums = [1,2,3,1,2] and the other with nums = [1,3,1,3,1]

var rob =(nums) => {
// Edge case: If the length is 0, return 0
if (!nums.length) return 0;

// Edge case: If the length is 1, return the element at the first index
if (nums.length === 1) return nums[0];

// Edge case: If the length is 2, return the greater of the two values
if (nums.length === 2) return Math.max(nums[0], nums[1]);


// -------------------------------------------------------------------

// Example 1: nums = [1, 2, 3, 1, 2]

let maxAtTwoBefore = nums[0]; // 1

//        2                      1         2
let maxAtOneBefore = Math.max(nums[0], nums[1]);

for (let i = 2; i < nums.length; i++) {

// interation 1 

    //         4                  nums[2] = 3 + 1 = 4              2
    const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    maxAtTwoBefore = maxAtOneBefore; //  2
    maxAtOneBefore = maxAtCurrent;   //  4

  // interation 2

    //            4                  nums[3] = 1 + 2 = 3              4
    // const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    // maxAtTwoBefore = maxAtOneBefore;   4
    // maxAtOneBefore = maxAtCurrent;   3

  // interation 3

    //            4                  nums[4] = 2 + 4 = 6              3
    // const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    // maxAtTwoBefore = maxAtOneBefore;   3
    // maxAtOneBefore = maxAtCurrent;   6
}

    // ------------------------------------------


// Example 2: nums = [1, 3, 1, 3, 1]


// let maxAtTwoBefore = nums[0]; 1

//         3                    1         3
// let maxAtOneBefore = Math.max(nums[0], nums[1]);

// for (let i = 2; i < nums.length; i++) {
  // interation 1 

    //            3                  nums[2] = 1 + 1 = 2              3
    // const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    // maxAtTwoBefore = maxAtOneBefore;  3
    // maxAtOneBefore = maxAtCurrent;   3

  // interation 2

    //            6                  nums[3] = 3 + 3 = 6              3
    // const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    // maxAtTwoBefore = maxAtOneBefore;   3
    // maxAtOneBefore = maxAtCurrent;   6

  // interation 3

    //            6                  nums[4] = 1 + 3 = 4              6
    // const maxAtCurrent = Math.max(nums[i] + maxAtTwoBefore, maxAtOneBefore);

    // maxAtTwoBefore = maxAtOneBefore;  6
    // maxAtOneBefore = maxAtCurrent;  6
// }

return maxAtOneBefore;
 * 
 * 
 * **/

/**
 * class Solution {
    public String mergeAlternately(String word1, String word2) {
        int len = word1.length() + word2.length();
        int i, j;
        char[] arr = new char[len];

        if (word1.length() < word2.length()) {
            j = 0;
            for (i = 0; i < word1.length(); i++) {
                arr[j] = word1.charAt(i);
                arr[j+1] = word2.charAt(i);
                j+=2;
            }

            while (j < len) {
                arr[j++] = word2.charAt(i++);
            }
        }
        else {
            j = 0;

            for (i = 0; i < word2.length(); i++) {
                arr[j] = word1.charAt(i);
                arr[j+1] = word2.charAt(i);
                j+=2;
            }

            while (j < len) {
                arr[j++] = word1.charAt(i++);
            }
        }
        return new String(arr);
    }
}
 * 
 * 
*/



//Type 2
// Houses are in circular form, so cannot rob 1st and last together, either of these are possible

const robCircularStreet = (nums) => {
    const inputsSkipStart = nums.slice(1);
    const inputsSkipEnd = nums.slice(0, nums.length - 1);

    Math.max(
        rob(inputsSkipStart),
        rob(inputsSkipEnd));

}