/**
 * ============================================================================
 * BINARY SEARCH (Classic) - Search in Sorted Array
 * ============================================================================
 *
 * PATTERN: Binary Search (see PATTERN_CATEGORIZATION_GUIDE.md)
 *
 * WHEN TO USE:
 * - Sorted arrays (ascending or descending)
 * - Search optimization: O(log n) instead of O(n)
 * - Finding position/boundaries in sorted data
 * - Square root, nth root, "search in sorted array" problems
 *
 * KEY INDICATORS:
 * - "Sorted array"
 * - "O(log n) time"
 * - "Search" / "Find position"
 * - "Target in nums"
 *
 * TIME: O(log n)  |  SPACE: O(1)
 *
 * MORE BINARY SEARCH PATTERNS (rotated array, sqrt, median of two arrays, etc.):
 * → DSA_ProblemSolving_patterns/src/problems/BinarySearch/binarySearchPatterns.ts
 */

/**
 * Classic binary search: find index of target in a sorted array.
 * Input must be sorted in ascending order.
 *
 * @param {number[]} sortedArray - Array sorted in ascending order
 * @param {number} itemToSearch - Target value to find
 * @returns {number} Index of target, or -1 if not found
 *
 * @example
 * binarySearch([1, 3, 5, 9, 12], 9);  // 3
 * binarySearch([1, 3, 5, 9, 12], 2);  // -1
 */
function binarySearch(sortedArray, itemToSearch) {
  var startIndex = 0;
  var endIndex = sortedArray.length - 1;

  while (startIndex <= endIndex) {
    var midIndex = Math.floor((startIndex + endIndex) / 2);

    if (itemToSearch === sortedArray[midIndex]) {
      return midIndex;
    }
    if (itemToSearch < sortedArray[midIndex]) {
      endIndex = midIndex - 1;
    } else {
      startIndex = midIndex + 1;
    }
  }

  return -1;
}

/**
 * Demo: binary search requires a sorted array.
 * For sorting, see: Sorting/bubbleSort.js (or use .sort() for quick checks.)
 */
function checkBinarySearch() {
  var sortedArray = [1, 4, 5, 7, 9, 11, 17];
  var itemIndex = binarySearch(sortedArray, 11);
  console.log("Item found at index", itemIndex, "in", sortedArray);
}

checkBinarySearch();

module.exports = { binarySearch };
