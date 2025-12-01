/*
Array Rotation - Optimized Solutions
Current solution: O(n*k) time, O(1) space - INEFFICIENT for large k

Better approaches:
1. Three Reversals: O(n) time, O(1) space
2. Cyclic Replacements: O(n) time, O(1) space  
3. Extra Array: O(n) time, O(n) space
4. Built-in methods: O(n) time, O(n) space
*/

/**
 * Method 1: Three Reversals Approach (BEST for in-place)
 * Key Insight: To rotate right by k, reverse whole array, then reverse first k, then reverse remaining
 * 
 * Example: [1,2,3,4,5,6,7], k=3 (rotate right by 3)
 * Step 1: Reverse entire array → [7,6,5,4,3,2,1]
 * Step 2: Reverse first k elements → [5,6,7,4,3,2,1]  
 * Step 3: Reverse remaining elements → [5,6,7,1,2,3,4]
 * 
 * Time: O(n), Space: O(1)
 */
function rotateArrayReversals(nums, k) {
    const n = nums.length;
    // HINT: Rotating by array length brings us back to start, so k=7 and k=2 are same for array of length 5
    k = k % n; // Handle cases where k > array length (e.g., k=12, n=5 → effective k=2)
    
    // HINT: If k becomes 0 after modulo, no rotation needed (k was multiple of array length)
    if (k === 0) return nums;
    
    // Helper function to reverse array between start and end indices
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }
    
    // Step 1: Reverse entire array
    // HINT: [1,2,3,4,5] → [5,4,3,2,1]
    reverse(nums, 0, n - 1);
    
    // Step 2: Reverse first k elements  
    // HINT: [5,4,3,2,1] with k=2 → [4,5,3,2,1] (reverse first 2)
    reverse(nums, 0, k - 1);
    
    // Step 3: Reverse remaining n-k elements
    // HINT: [4,5,3,2,1] → [4,5,1,2,3] (reverse last 3)
    reverse(nums, k, n - 1);
    
    return nums;
}

/**
 * Method 2: Cyclic Replacements (Advanced O(1) space)
 * Key Insight: Move elements to their final positions in cycles
 * 
 * Time: O(n), Space: O(1)
 * More complex but educational
 */
function rotateArrayCyclic(nums, k) {
    const n = nums.length;
    // HINT: Same optimization - handle k > n case
    k = k % n;
    
    if (k === 0) return nums;
    
    let count = 0; // Number of elements moved to their final positions
    
    for (let start = 0; count < n; start++) {
        let current = start;
        let prev = nums[start];
        
        do {
            // HINT: Calculate where current element should go (current position + k steps, wrapping around)
            const next = (current + k) % n;
            // HINT: Swap elements - put current element in its final position
            [nums[next], prev] = [prev, nums[next]];
            current = next;
            count++;
        } while (start !== current); // Continue until we complete the cycle
    }
    
    return nums;
}

/**
 * Method 3: Extra Array Approach (Simplest to understand)
 * Key Insight: Calculate final position for each element
 * 
 * Time: O(n), Space: O(n)
 */
function rotateArrayExtraSpace(nums, k) {
    const n = nums.length;
    // HINT: Same modulo logic applies to all methods
    k = k % n;
    
    if (k === 0) return nums;
    
    const result = new Array(n);
    
    // HINT: Each element at index i goes to position (i + k) % n
    for (let i = 0; i < n; i++) {
        // HINT: Element at position 0 goes to position k, element at 1 goes to k+1, etc.
        result[(i + k) % n] = nums[i];
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
        nums[i] = result[i];
    }
    
    return nums;
}

/**
 * Method 4: Using Built-in Array Methods (Most Readable)
 * 
 * Time: O(n), Space: O(n)
 */
function rotateArrayBuiltIn(nums, k) {
    const n = nums.length;
    // HINT: Always normalize k first
    k = k % n;
    
    if (k === 0) return nums;
    
    // HINT: Take last k elements and put them at front
    // slice(-k) gets last k elements, slice(0, -k) gets everything except last k
    const rotated = nums.slice(-k).concat(nums.slice(0, -k));
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
        nums[i] = rotated[i];
    }
    
    return nums;
}

/**
 * Method 5: Left Rotation (if needed)
 * To rotate left by k, we can rotate right by (n-k)
 */
function rotateArrayLeft(nums, k) {
    // HINT: Left rotation by k = Right rotation by (n-k)
    // Example: [1,2,3,4,5] left by 2 = [1,2,3,4,5] right by (5-2)=3
    return rotateArrayReversals(nums, nums.length - (k % nums.length));
}

// Test functions
function testRotationMethods() {
    console.log("=== Array Rotation Performance Comparison ===\n");
    
    const testCases = [
        { arr: [1, 2, 3, 4, 5, 6, 7], k: 3, desc: "Basic case" },
        { arr: [1, 2], k: 1, desc: "Small array" },
        { arr: [1, 2, 3, 4, 5], k: 7, desc: "k > array length" },
        { arr: [1], k: 1, desc: "Single element" },
        { arr: [1, 2, 3, 4, 5, 6], k: 0, desc: "No rotation" }
    ];
    
    testCases.forEach((test, index) => {
        console.log(`Test ${index + 1}: ${test.desc}`);
        console.log(`Input: [${test.arr}], k=${test.k}`);
        
        // Test each method
        const methods = [
            { name: "Three Reversals", fn: rotateArrayReversals },
            { name: "Cyclic Replacement", fn: rotateArrayCyclic },
            { name: "Extra Array", fn: rotateArrayExtraSpace },
            { name: "Built-in Methods", fn: rotateArrayBuiltIn }
        ];
        
        methods.forEach(method => {
            const arrCopy = [...test.arr];
            const result = method.fn(arrCopy, test.k);
            console.log(`${method.name}: [${result}]`);
        });
        
        console.log();
    });
}

// Performance comparison for large arrays
function performanceTest() {
    console.log("=== Performance Test (Large Array) ===");
    
    const sizes = [1000, 10000, 100000];
    
    sizes.forEach(size => {
        console.log(`\nArray size: ${size}`);
        
        const largeArray = Array.from({ length: size }, (_, i) => i);
        const k = Math.floor(size / 3);
        
        // Test each method
        const methods = [
            { name: "Original O(n*k)", fn: rotateArrayOriginal },
            { name: "Three Reversals O(n)", fn: rotateArrayReversals },
            { name: "Extra Array O(n)", fn: rotateArrayExtraSpace }
        ];
        
        methods.forEach(method => {
            const arrCopy = [...largeArray];
            const start = performance.now();
            method.fn(arrCopy, k);
            const end = performance.now();
            console.log(`${method.name}: ${(end - start).toFixed(2)}ms`);
        });
    });
}

// Original inefficient method for comparison
function rotateArrayOriginal(array, k) {
    let resArray = [...array];
    for (let i = 0; i < k; i++) {
        const first = resArray.shift();
        resArray.push(first);
    }
    return resArray;
}

// Run tests
testRotationMethods();

// Uncomment to run performance test
// performanceTest();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rotateArrayReversals,
        rotateArrayCyclic,
        rotateArrayExtraSpace,
        rotateArrayBuiltIn,
        rotateArrayLeft
    };
}
