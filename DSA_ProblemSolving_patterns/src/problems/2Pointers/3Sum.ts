/**
 * Print all triplets/ group of 3 numbers in an array whose sum is 0
 */
export function findSumOfThree1(nums: number[], target: number): number[] {
    if (!Array.isArray(nums) || typeof target !== 'number') {
        return [];
    }

    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        let low = i + 1;
        let high = nums.length - 1;

        while (low < high) {
            if (nums[i] + nums[low] + nums[high] < target) {
                low++;
            } else if (nums[i] + nums[low] + nums[high] === target) {
                return [nums[i], nums[low], nums[high]];
            } else {
                high--;
            }
        }
    }

    return [];
}

findSumOfThree1([3, 7, 1, 2, 8, 4, 5], 10);

// considering duplicates
export function threeSum(arr: number[]): number[][] {
    if(arr.length < 3) {
        return [];
    }
    let result: number[][] = [];
    arr.sort((a, b) => a - b);
    for(let i = 0; i< arr.length -2; i++) {
        if(i==0 || arr[i] != arr[i-1]) {
            let j = i+1;
            let k = arr.length -1;

            while(j < k) {
                let sum = arr[i] + arr[j] + arr[k];

                if(sum == 0) {
                    result.push([arr[i], arr[j], arr[k]]);

                    while( j<k && arr[j] == arr[j+1] ) j++;
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
// Example usage:
// let in1 = [6,3,9,1,4,-1,-5,-2,-7, -3];
let in2 = [-1,0, 1,2,-1,-4];
let result = threeSum(in2);
console.log(result);

//result 
// 0: (3) [-1, -1, 2]
// 1: (3) [-1, 0, 1]



/**
 * 
 * @param nums Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

 

Example 1:

Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Example 2:

Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:

Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.

 
 * @returns 
 */
export function threeSum2(nums: number[]): number[][] {
    if (!nums || nums.length < 3) {
        return [];
    }

    const result: number[][] = [];

    const sortedNums = nums.sort((a, b) => a - b);
    for (let i = 0; i < sortedNums.length - 2; i++) {
        const first = sortedNums[i];
        
        // Skip duplicates for the first element
        if (i > 0 && sortedNums[i] === sortedNums[i - 1]) {
            continue;
        }

        // find all pairs whose sum is -first (so that first + second + third = 0)
        const twoSumResults = twoSumAll(sortedNums.slice(i + 1), -first);

        for (const pair of twoSumResults) {
            result.push([first, ...pair]);
        }
    }
    return result;
};
// nums is sorted - find all valid pairs that sum to target
function twoSumAll(nums: number[], target: number): number[][] {
    const result: number[][] = [];
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            const leftVal = nums[left];
            const rightVal = nums[right] === 0 ? 0 : nums[right]; // Handle -0 vs 0
            result.push([leftVal, rightVal]);
            
            // Skip duplicates
            while (left < right && nums[left] === leftVal) left++;
            while (left < right && nums[right] === rightVal) right--;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return result;
}
