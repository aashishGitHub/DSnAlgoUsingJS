// Top K Frequent Elements (LeetCode 347)
// Given an integer array nums and an integer k, return the k most frequent elements.
// You may return the answer in any order.

// Example 1:
// Input: nums = [1,1,1,2,2,3], k = 2
// Output: [1,2]

// Example 2:
// Input: nums = [1], k = 1
// Output: [1]

/**
 * Approach 1: Hash Map + Sorting
 * Time: O(N log N) - due to sorting
 * Space: O(N) for the frequency map
 */
function topKFrequent1(nums: number[], k: number): number[] {
    // Step 1: Count frequencies
    const freqMap = new Map<number, number>();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Sort by frequency and take top k
    return Array.from(freqMap.entries())
        .sort((a, b) => b[1] - a[1])  // Sort by frequency descending
        .slice(0, k)                  // Take top k
        .map(entry => entry[0]);      // Extract the numbers
}

/**
 * Approach 2: Hash Map + Min Heap (Optimal for large datasets)
 * Time: O(N log k) - much better when k << N
 * Space: O(N + k) for the frequency map and heap
 */
class MinHeap {
    private heap: [number, number][] = []; // [value, frequency] pairs
    
    size(): number {
        return this.heap.length;
    }
    
    peek(): [number, number] | undefined {
        return this.heap[0];
    }
    
    push(item: [number, number]): void {
        this.heap.push(item);
        this.bubbleUp();
    }
    
    pop(): [number, number] | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.bubbleDown();
        return min;
    }
    
    private bubbleUp(): void {
        let index = this.heap.length - 1;
        
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.heap[index][1] >= this.heap[parentIndex][1]) break;
            
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }
    
    private bubbleDown(): void {
        let index = 0;
        
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && this.heap[leftChild][1] < this.heap[minIndex][1]) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && this.heap[rightChild][1] < this.heap[minIndex][1]) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}

function topKFrequent2(nums: number[], k: number): number[] {
    // Step 1: Count frequencies
    const freqMap = new Map<number, number>();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Use min heap to keep only k most frequent elements
    const minHeap = new MinHeap();
    
    for (const [num, freq] of freqMap.entries()) {
        minHeap.push([num, freq]);
        
        // If heap size exceeds k, remove the least frequent element
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    // Step 3: Extract all elements from heap
    const result: number[] = [];
    while (minHeap.size() > 0) {
        const item = minHeap.pop();
        if (item) {
            result.push(item[0]);
        }
    }
    
    return result;
}

/**
 * Approach 3: Bucket Sort (Linear time)
 * Time: O(N) - when we can use bucket sort
 * Space: O(N) for the frequency map and buckets
 */
function topKFrequent3(nums: number[], k: number): number[] {
    // Step 1: Count frequencies
    const freqMap = new Map<number, number>();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Create buckets where index = frequency, value = array of numbers
    const buckets: number[][] = Array(nums.length + 1).fill(null).map(() => []);
    
    for (const [num, freq] of freqMap.entries()) {
        buckets[freq].push(num);
    }
    
    // Step 3: Traverse buckets from high frequency to low and collect k elements
    const result: number[] = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        for (const num of buckets[i]) {
            result.push(num);
            if (result.length === k) break;
        }
    }
    
    return result;
}

/**
 * Approach 4: Using JavaScript's built-in tools (concise but not optimal)
 */
function topKFrequent4(nums: number[], k: number): number[] {
    const freq = nums.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);
    
    return Object.keys(freq)
        .map(Number)
        .sort((a, b) => freq[b] - freq[a])
        .slice(0, k);
}

// Test cases
function runTests(): void {
    const testCases: [number[], number][] = [
        [[1,1,1,2,2,3], 2],
        [[1], 1],
        [[1,2], 2],
        [[1,1,1,2,2,3,3,3,3], 2],
        [[4,1,-1,2,-1,2,3], 2]
    ];
    
    console.log('Testing Top K Frequent Elements:\n');
    
    testCases.forEach(([nums, k], index) => {
        console.log(`Test case ${index + 1}: nums = [${nums}], k = ${k}`);
        console.log('Sort approach:', topKFrequent1(nums, k));
        console.log('Heap approach:', topKFrequent2(nums, k));
        console.log('Bucket approach:', topKFrequent3(nums, k));
        console.log('Built-in approach:', topKFrequent4(nums, k));
        console.log('---');
    });
}

// Key insights for Top K Frequent Elements:
// 1. Always start with frequency counting using hash map
// 2. For small k relative to n, heap approach is most efficient
// 3. Bucket sort gives linear time but uses more space
// 4. This pattern (hash map + heap) appears in many "top K" problems

// Pattern Recognition:
// - "Top K" problems often use heap data structure
// - Hash map for frequency counting is almost always the first step
// - Consider the relationship between k and n to choose optimal approach

export { topKFrequent1, topKFrequent2, topKFrequent3, topKFrequent4, runTests };
