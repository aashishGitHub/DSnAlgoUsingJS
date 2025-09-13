/**
 * Container With Most Water - Two Pointers Pattern
 * 
 * Problem: Given n non-negative integers representing an elevation map where 
 * the width of each bar is 1, compute the maximum area of water that can be 
 * contained between any two bars.
 * 
 * Example:
 * Input: height = [1,8,6,2,5,4,8,3,7]
 * Output: 49
 * Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. 
 * In this case, the max area of water (blue section) the container can contain is 49.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */

export function maxArea(height: number[]): number {
    if (!height || height.length < 2) {
        return 0;
    }
    
    let maxWater = 0;
    let left = 0;
    let right = height.length - 1;
    
    while (left < right) {
        // Calculate current area
        const minHeight = Math.min(height[left], height[right]);
        const width = right - left;
        const currentArea = minHeight * width;
        
        maxWater = Math.max(maxWater, currentArea);
        
        // Move the pointer with smaller height
        // This is the key insight: moving the taller pointer won't increase area
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}
