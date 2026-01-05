/**
 * Comprehensive Array Pattern Problems
 * 
 * This file contains implementations of all array problems from the video list,
 * organized by pattern with detailed explanations and visualizations.
 * 
 * Patterns covered:
 * - Two Pointers
 * - Array Manipulation
 * - Matrix Traversal
 * - Sorting (Divide & Conquer)
 * - HashMap
 */

// ============================================================================
// 1. SORT COLORS (Dutch National Flag Problem)
// ============================================================================
// Pattern: Two Pointers (Partitioning)
// Time: O(n), Space: O(1)

/**
 * Sort an array of 0s, 1s, and 2s in-place
 * 
 * PROBLEM STATEMENT:
 * Given an array nums with n objects colored red, white, or blue,
 * sort them in-place so that objects of the same color are adjacent.
 * 0 = red, 1 = white, 2 = blue
 * 
 * PATTERN: Two Pointers (Three-way Partitioning)
 * 
 * KEY INSIGHT: Use three pointers:
 * - low: boundary for 0s (all elements before low are 0s)
 * - mid: current element being examined
 * - high: boundary for 2s (all elements after high are 2s)
 * 
 * VISUALIZATION:
 * 
 * Initial: [2, 0, 2, 1, 1, 0]
 *          ↑              ↑
 *         low            high
 *         mid
 * 
 * Step 1: mid=0, nums[0]=2 → swap with high, high--
 *         [0, 0, 2, 1, 1, 2]
 *          ↑           ↑
 *         low         high
 *         mid
 * 
 * Step 2: mid=0, nums[0]=0 → swap with low, low++, mid++
 *         [0, 0, 2, 1, 1, 2]
 *             ↑        ↑
 *            low      high
 *            mid
 * 
 * Step 3: mid=1, nums[1]=0 → swap with low, low++, mid++
 *         [0, 0, 2, 1, 1, 2]
 *                ↑     ↑
 *               low   high
 *               mid
 * 
 * Step 4: mid=2, nums[2]=2 → swap with high, high--
 *         [0, 0, 1, 1, 2, 2]
 *                ↑  ↑
 *               low high
 *               mid
 * 
 * Step 5: mid=2, nums[2]=1 → no swap, mid++
 *         [0, 0, 1, 1, 2, 2]
 *                ↑  ↑
 *               low high
 *                  mid
 * 
 * Result: [0, 0, 1, 1, 2, 2] ✅
 * 
 * @param nums - Array of 0s, 1s, and 2s
 */
export function sortColors(nums: number[]): void {
    let low = 0;        // All elements before low are 0s
    let mid = 0;        // Current element being examined
    let high = nums.length - 1;  // All elements after high are 2s
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            // Move 0 to the left section
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            // 1 stays in the middle section
            mid++;
        } else {
            // nums[mid] === 2, move to the right section
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // Don't increment mid because we need to check the swapped element
        }
    }
}

// ============================================================================
// 2. NEXT PERMUTATION
// ============================================================================
// Pattern: Array Manipulation (Permutation)
// Time: O(n), Space: O(1)

/**
 * Find the next lexicographically greater permutation
 * 
 * PROBLEM STATEMENT:
 * Given an array of integers, rearrange it to the next lexicographically
 * greater permutation. If no such permutation exists, rearrange to the
 * lowest possible order (sorted in ascending order).
 * 
 * PATTERN: Array Manipulation (In-place Permutation)
 * 
 * KEY INSIGHT:
 * 1. Find the largest index i such that nums[i] < nums[i+1]
 * 2. Find the largest index j > i such that nums[j] > nums[i]
 * 3. Swap nums[i] and nums[j]
 * 4. Reverse the suffix starting at i+1
 * 
 * VISUALIZATION:
 * 
 * Example: [1, 3, 5, 4, 2]
 * 
 * Step 1: Find pivot (rightmost element smaller than next)
 *         [1, 3, 5, 4, 2]
 *              ↑  ↑
 *              i  i+1
 *         nums[1]=3 < nums[2]=5, so i=1
 * 
 * Step 2: Find rightmost element greater than nums[i]
 *         [1, 3, 5, 4, 2]
 *              ↑     ↑
 *              i     j
 *         nums[3]=4 > nums[1]=3, so j=3
 * 
 * Step 3: Swap nums[i] and nums[j]
 *         [1, 4, 5, 3, 2]
 * 
 * Step 4: Reverse suffix starting at i+1
 *         [1, 4, 2, 3, 5]
 * 
 * Result: [1, 4, 2, 3, 5] ✅
 * 
 * @param nums - Array to permute
 */
export function nextPermutation(nums: number[]): void {
    const n = nums.length;
    
    // Step 1: Find the largest index i such that nums[i] < nums[i+1]
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    // If no such index exists, array is in descending order
    // Reverse it to get the smallest permutation
    if (i < 0) {
        nums.reverse();
        return;
    }
    
    // Step 2: Find the largest index j > i such that nums[j] > nums[i]
    let j = n - 1;
    while (nums[j] <= nums[i]) {
        j--;
    }
    
    // Step 3: Swap nums[i] and nums[j]
    [nums[i], nums[j]] = [nums[j], nums[i]];
    
    // Step 4: Reverse the suffix starting at i+1
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
}

// ============================================================================
// 3. NEXT GREATER NUMBER (Digit Rearrangement)
// ============================================================================
// Pattern: Array Manipulation (Permutation)
// Time: O(n), Space: O(1)

/**
 * Find the next greater number with the same set of digits
 * 
 * PROBLEM STATEMENT:
 * Given a number represented as an array of digits, find the next greater
 * number that can be formed using the same digits. If no such number exists,
 * return the smallest possible number.
 * 
 * PATTERN: Same as Next Permutation (it's the same problem!)
 * 
 * Example:
 * Input: [2, 1, 8, 7, 6, 5]
 * Output: [2, 5, 1, 6, 7, 8]
 * 
 * @param digits - Array of digits representing a number
 * @returns Next greater number as array of digits
 */
export function nextGreaterNumber(digits: number[]): number[] {
    const nums = [...digits]; // Make a copy
    nextPermutation(nums);
    return nums;
}

// ============================================================================
// 4. SPIRAL MATRIX
// ============================================================================
// Pattern: Matrix Traversal (Boundary Traversal)
// Time: O(m×n), Space: O(1) excluding output

/**
 * Print matrix in spiral order
 * 
 * PROBLEM STATEMENT:
 * Given an m×n matrix, return all elements in spiral order.
 * 
 * PATTERN: Matrix Traversal (Boundary Tracking)
 * 
 * KEY INSIGHT: Traverse in layers (boundaries)
 * - Top row: left to right
 * - Right column: top to bottom
 * - Bottom row: right to left
 * - Left column: bottom to top
 * 
 * VISUALIZATION:
 * 
 * Matrix: [[1, 2, 3],
 *          [4, 5, 6],
 *          [7, 8, 9]]
 * 
 * Layer 1 (outer boundary):
 *   Top:    1 → 2 → 3
 *   Right:  6 → 9
 *   Bottom: 8 → 7
 *   Left:   4
 * 
 * Layer 2 (inner):
 *   Center: 5
 * 
 * Result: [1, 2, 3, 6, 9, 8, 7, 4, 5]
 * 
 * @param matrix - 2D array
 * @returns Array of elements in spiral order
 */
export function spiralOrder(matrix: number[][]): number[] {
    if (matrix.length === 0) return [];
    
    const result: number[] = [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse top row: left to right
        for (let i = left; i <= right; i++) {
            result.push(matrix[top][i]);
        }
        top++;
        
        // Traverse right column: top to bottom
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        // Traverse bottom row: right to left (if still valid)
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                result.push(matrix[bottom][i]);
            }
            bottom--;
        }
        
        // Traverse left column: bottom to top (if still valid)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}

// ============================================================================
// 5. ROTATE MATRIX 90 DEGREES (In-Place)
// ============================================================================
// Pattern: Matrix Manipulation (In-Place Transformation)
// Time: O(n²), Space: O(1)

/**
 * Rotate matrix 90 degrees clockwise in-place
 * 
 * PROBLEM STATEMENT:
 * Given an n×n matrix, rotate it 90 degrees clockwise in-place.
 * 
 * PATTERN: Matrix Manipulation (Transpose + Reverse)
 * 
 * KEY INSIGHT: Two-step process
 * 1. Transpose the matrix (swap matrix[i][j] with matrix[j][i])
 * 2. Reverse each row
 * 
 * VISUALIZATION:
 * 
 * Original:    Transpose:    Reverse rows:
 * [1, 2, 3]    [1, 4, 7]     [7, 4, 1]
 * [4, 5, 6] →  [2, 5, 8]  →  [8, 5, 2]
 * [7, 8, 9]    [3, 6, 9]     [9, 6, 3]
 * 
 * Alternative: Layer-by-layer rotation
 * Rotate elements in concentric layers
 * 
 * @param matrix - n×n matrix to rotate
 */
export function rotateMatrix90(matrix: number[][]): void {
    const n = matrix.length;
    
    // Step 1: Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        let left = 0;
        let right = n - 1;
        while (left < right) {
            [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
            left++;
            right--;
        }
    }
}

/**
 * Alternative: Layer-by-layer rotation (more intuitive)
 */
export function rotateMatrix90LayerByLayer(matrix: number[][]): void {
    const n = matrix.length;
    
    // Rotate layer by layer
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;
        
        for (let i = first; i < last; i++) {
            const offset = i - first;
            const top = matrix[first][i]; // Save top
            
            // Left → Top
            matrix[first][i] = matrix[last - offset][first];
            
            // Bottom → Left
            matrix[last - offset][first] = matrix[last][last - offset];
            
            // Right → Bottom
            matrix[last][last - offset] = matrix[i][last];
            
            // Top → Right
            matrix[i][last] = top;
        }
    }
}

// ============================================================================
// 6. CELEBRITY PROBLEM
// ============================================================================
// Pattern: Two Pointers (Elimination)
// Time: O(n), Space: O(1)

/**
 * Find the celebrity in a party
 * 
 * PROBLEM STATEMENT:
 * In a party of n people, there is one celebrity who:
 * - Knows nobody
 * - Is known by everybody
 * 
 * You have a function knows(a, b) that returns true if a knows b.
 * Find the celebrity in O(n) time.
 * 
 * PATTERN: Two Pointers (Elimination Strategy)
 * 
 * KEY INSIGHT:
 * 1. Use elimination: if A knows B, A can't be celebrity (eliminate A)
 * 2. If A doesn't know B, B can't be celebrity (eliminate B)
 * 3. After elimination, verify the candidate
 * 
 * VISUALIZATION:
 * 
 * knows matrix (row knows column):
 *       0  1  2  3
 *    0 [0, 1, 1, 1]  → 0 knows 1,2,3
 *    1 [1, 0, 1, 1]  → 1 knows 0,2,3
 *    2 [0, 0, 0, 0]  → 2 knows nobody (candidate!)
 *    3 [0, 0, 1, 0]  → 3 knows 2
 * 
 * Step 1: Compare 0 and 1
 *   knows(0, 1) = true → eliminate 0, candidate = 1
 * 
 * Step 2: Compare 1 and 2
 *   knows(1, 2) = true → eliminate 1, candidate = 2
 * 
 * Step 3: Compare 2 and 3
 *   knows(2, 3) = false → eliminate 3, candidate = 2
 * 
 * Step 4: Verify candidate 2
 *   - 2 knows nobody? ✓ (row 2 is all 0s)
 *   - Everybody knows 2? ✓ (column 2 has 1s except itself)
 * 
 * Result: Celebrity is 2 ✅
 * 
 * @param n - Number of people
 * @param knows - Function that returns true if a knows b
 * @returns Index of celebrity, or -1 if none exists
 */
export function findCelebrity(
    n: number,
    knows: (a: number, b: number) => boolean
): number {
    // Step 1: Find candidate using elimination
    let candidate = 0;
    
    for (let i = 1; i < n; i++) {
        if (knows(candidate, i)) {
            // Candidate knows i, so candidate can't be celebrity
            candidate = i;
        }
        // If candidate doesn't know i, i can't be celebrity (we keep candidate)
    }
    
    // Step 2: Verify the candidate
    for (let i = 0; i < n; i++) {
        if (i !== candidate) {
            // Celebrity should know nobody
            if (knows(candidate, i)) {
                return -1; // Candidate knows someone, not a celebrity
            }
            // Everyone should know celebrity
            if (!knows(i, candidate)) {
                return -1; // Someone doesn't know candidate
            }
        }
    }
    
    return candidate;
}

// ============================================================================
// 7. COUNT INVERSIONS (Using Merge Sort)
// ============================================================================
// Pattern: Sorting (Divide & Conquer)
// Time: O(n log n), Space: O(n)

/**
 * Count inversions in an array using merge sort
 * 
 * PROBLEM STATEMENT:
 * Given an array, count the number of inversions.
 * An inversion is a pair (i, j) where i < j and arr[i] > arr[j].
 * 
 * PATTERN: Merge Sort (Divide & Conquer)
 * 
 * KEY INSIGHT:
 * During merge step, when we copy from right subarray, all remaining
 * elements in left subarray form inversions with the current right element.
 * 
 * VISUALIZATION:
 * 
 * Array: [2, 4, 1, 3, 5]
 * 
 * Merge Sort Process:
 * 
 * Split:        [2, 4, 1, 3, 5]
 *              /              \
 *         [2, 4, 1]        [3, 5]
 *         /        \       /     \
 *      [2, 4]     [1]    [3]    [5]
 *      /    \      |      |      |
 *    [2]   [4]    [1]    [3]    [5]
 * 
 * Merge and count:
 * 
 * Merge [2] and [4]: no inversions
 * Merge [2, 4] and [1]:
 *   - 2 > 1 → inversion (2 inversions: (2,1) and (4,1))
 *   Result: [1, 2, 4], inversions = 2
 * 
 * Merge [3] and [5]: no inversions
 * 
 * Merge [1, 2, 4] and [3, 5]:
 *   - 1 < 3, copy 1, no inversion
 *   - 2 < 3, copy 2, no inversion
 *   - 4 > 3, copy 3, inversion (1 inversion: (4,3))
 *   - 4 < 5, copy 4, no inversion
 *   - copy 5, no inversion
 * 
 * Total inversions: 2 + 1 = 3
 * 
 * @param arr - Array to count inversions in
 * @returns Number of inversions
 */
export function countInversions(arr: number[]): number {
    let inversionCount = 0;
    
    function mergeSort(arr: number[], left: number, right: number): void {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
    
    function merge(arr: number[], left: number, mid: number, right: number): void {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k++] = leftArr[i++];
            } else {
                // All remaining elements in leftArr form inversions
                inversionCount += (leftArr.length - i);
                arr[k++] = rightArr[j++];
            }
        }
        
        while (i < leftArr.length) {
            arr[k++] = leftArr[i++];
        }
        
        while (j < rightArr.length) {
            arr[k++] = rightArr[j++];
        }
    }
    
    const arrCopy = [...arr];
    mergeSort(arrCopy, 0, arrCopy.length - 1);
    return inversionCount;
}

// ============================================================================
// 8. COUNT FREQUENCIES O(n) TIME
// ============================================================================
// Pattern: HashMap / Array Indexing
// Time: O(n), Space: O(1) if using array, O(n) if using map

/**
 * Count frequencies of array elements in O(n) time
 * 
 * PROBLEM STATEMENT:
 * Given an array, count the frequency of each element.
 * 
 * PATTERN: HashMap or Array Indexing
 * 
 * Approach 1: Using HashMap (works for any range)
 * Approach 2: Using array indexing (when elements are in range 0 to n-1)
 * 
 * @param arr - Array of elements
 * @returns Map of element to frequency
 */
export function countFrequencies(arr: number[]): Map<number, number> {
    const freqMap = new Map<number, number>();
    
    for (const num of arr) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    return freqMap;
}

/**
 * Count frequencies using array indexing (O(1) space if range is 0 to n-1)
 */
export function countFrequenciesArrayIndexing(arr: number[]): number[] {
    // Find max to determine array size
    const max = Math.max(...arr);
    const frequencies = new Array(max + 1).fill(0);
    
    for (const num of arr) {
        frequencies[num]++;
    }
    
    return frequencies;
}

// ============================================================================
// 9. O(1) DATA STRUCTURE (Insert, Search, Delete, Random)
// ============================================================================
// Pattern: HashMap + Array
// Time: O(1) for all operations, Space: O(n)

/**
 * Design a data structure that supports:
 * - Insert(val): O(1)
 * - Remove(val): O(1)
 * - Search(val): O(1)
 * - GetRandom(): O(1) - returns random element
 * 
 * PATTERN: HashMap + Array
 * 
 * KEY INSIGHT:
 * - Use array to store values (for random access)
 * - Use HashMap to map value → index in array
 * - For removal: swap with last element, then pop (O(1))
 * 
 * @template T - Type of elements
 */
export class RandomizedSet<T> {
    private arr: T[] = [];
    private map: Map<T, number> = new Map();
    
    /**
     * Insert a value
     */
    insert(val: T): boolean {
        if (this.map.has(val)) {
            return false; // Already exists
        }
        
        this.arr.push(val);
        this.map.set(val, this.arr.length - 1);
        return true;
    }
    
    /**
     * Remove a value
     */
    remove(val: T): boolean {
        if (!this.map.has(val)) {
            return false; // Doesn't exist
        }
        
        const index = this.map.get(val)!;
        const lastElement = this.arr[this.arr.length - 1];
        
        // Swap with last element
        this.arr[index] = lastElement;
        this.map.set(lastElement, index);
        
        // Remove last element
        this.arr.pop();
        this.map.delete(val);
        
        return true;
    }
    
    /**
     * Search for a value
     */
    search(val: T): boolean {
        return this.map.has(val);
    }
    
    /**
     * Get a random element
     */
    getRandom(): T {
        const randomIndex = Math.floor(Math.random() * this.arr.length);
        return this.arr[randomIndex];
    }
    
    /**
     * Get size
     */
    size(): number {
        return this.arr.length;
    }
}

