// Container With Most Water:
// Question: Given n non - negative integers representing an elevation map where the width of each bar is 1, compute the maximum area of water that can be contained between any two bars.
// Acceptable Solution:

function maxArea(height) {
    let maxArea = 0;
    let left = 0;
    let right = height.length - 1;
    while (left < right) {
        const minHeight = Math.min(height[left], height[right]);
        const width = right - left;
        maxArea = Math.max(maxArea, minHeight * width);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}
