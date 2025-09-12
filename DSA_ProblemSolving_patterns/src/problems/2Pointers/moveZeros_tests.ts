/**
 * COMPREHENSIVE TEST SUITE FOR MOVE ZEROS PATTERN
 * 
 * This file contains tests to validate your understanding of the pattern
 * and help you identify edge cases and performance characteristics.
 */

import {
    moveNegativesToEnd,
    moveEvensToFront,
    moveValueToEnd,
    moveZerosMinSwaps,
    moveZerosNoSwaps,
    moveMultipleValues,
    partitionByCondition,
    moveZerosNewArray,
    moveSpacesToEnd,
    moveVowelsToFront
} from './moveZeros_solutions';

// ========== TEST UTILITIES ==========

interface TestCase<T> {
    input: T[];
    expected: T[];
    description: string;
}

function runTest<T>(
    testName: string,
    testCases: TestCase<T>[],
    fn: (arr: T[]) => void,
    compareFn?: (a: T[], b: T[]) => boolean
): void {
    console.log(`\\n=== ${testName} ===`);
    
    const compare = compareFn || ((a, b) => JSON.stringify(a) === JSON.stringify(b));
    
    testCases.forEach((testCase, index) => {
        const input = [...testCase.input];
        fn(input);
        
        const passed = compare(input, testCase.expected);
        const status = passed ? '✅ PASS' : '❌ FAIL';
        
        console.log(`Test ${index + 1}: ${status} - ${testCase.description}`);
        
        if (!passed) {
            console.log(`  Input: [${testCase.input.join(', ')}]`);
            console.log(`  Expected: [${testCase.expected.join(', ')}]`);
            console.log(`  Got: [${input.join(', ')}]`);
        }
    });
}

// ========== MOVE ZEROS TESTS ==========

const moveZerosTestCases: TestCase<number>[] = [
    {
        input: [0, 1, 0, 3, 12],
        expected: [1, 3, 12, 0, 0],
        description: "Basic case with mixed zeros and non-zeros"
    },
    {
        input: [0],
        expected: [0],
        description: "Single zero"
    },
    {
        input: [1],
        expected: [1],
        description: "Single non-zero"
    },
    {
        input: [],
        expected: [],
        description: "Empty array"
    },
    {
        input: [0, 0, 0],
        expected: [0, 0, 0],
        description: "All zeros"
    },
    {
        input: [1, 2, 3],
        expected: [1, 2, 3],
        description: "No zeros"
    },
    {
        input: [0, 0, 1, 2, 3],
        expected: [1, 2, 3, 0, 0],
        description: "Zeros at beginning"
    },
    {
        input: [1, 2, 3, 0, 0],
        expected: [1, 2, 3, 0, 0],
        description: "Zeros at end"
    },
    {
        input: [0, 1, 0, 2, 0, 3, 0],
        expected: [1, 2, 3, 0, 0, 0, 0],
        description: "Alternating zeros and non-zeros"
    },
    {
        input: [-1, 0, -2, 0, 3],
        expected: [-1, -2, 3, 0, 0],
        description: "With negative numbers"
    }
];

// ========== MOVE NEGATIVES TESTS ==========

const moveNegativesTestCases: TestCase<number>[] = [
    {
        input: [1, -2, 3, -4, 5],
        expected: [1, 3, 5, -2, -4],
        description: "Mixed positive and negative"
    },
    {
        input: [-1, -2, -3],
        expected: [-1, -2, -3],
        description: "All negative"
    },
    {
        input: [1, 2, 3],
        expected: [1, 2, 3],
        description: "All positive"
    },
    {
        input: [0, -1, 2, -3],
        expected: [0, 2, -1, -3],
        description: "With zero (zero is positive)"
    }
];

// ========== MOVE EVENS TESTS ==========

const moveEvensTestCases: TestCase<number>[] = [
    {
        input: [1, 2, 3, 4, 5, 6],
        expected: [2, 4, 6, 1, 3, 5],
        description: "Mixed even and odd"
    },
    {
        input: [1, 3, 5],
        expected: [1, 3, 5],
        description: "All odd"
    },
    {
        input: [2, 4, 6],
        expected: [2, 4, 6],
        description: "All even"
    },
    {
        input: [0, 1, 2],
        expected: [0, 2, 1],
        description: "With zero (zero is even)"
    }
];

// ========== STRING TESTS ==========

const moveSpacesTestCases: TestCase<string>[] = [
    {
        input: ['a', ' ', 'b', ' ', 'c'],
        expected: ['a', 'b', 'c', ' ', ' '],
        description: "Mixed characters and spaces"
    },
    {
        input: [' ', ' ', ' '],
        expected: [' ', ' ', ' '],
        description: "All spaces"
    },
    {
        input: ['a', 'b', 'c'],
        expected: ['a', 'b', 'c'],
        description: "No spaces"
    }
];

const moveVowelsTestCases: TestCase<string>[] = [
    {
        input: ['h', 'e', 'l', 'l', 'o'],
        expected: ['e', 'o', 'h', 'l', 'l'],
        description: "Mixed vowels and consonants"
    },
    {
        input: ['a', 'e', 'i', 'o', 'u'],
        expected: ['a', 'e', 'i', 'o', 'u'],
        description: "All vowels"
    },
    {
        input: ['b', 'c', 'd', 'f'],
        expected: ['b', 'c', 'd', 'f'],
        description: "No vowels"
    },
    {
        input: ['A', 'b', 'E', 'c'],
        expected: ['A', 'E', 'b', 'c'],
        description: "Mixed case vowels"
    }
];

// ========== PERFORMANCE TESTS ==========

function performanceTest(): void {
    console.log('\\n=== PERFORMANCE COMPARISON ===');
    
    const sizes = [1000, 10000, 100000];
    const zeroPercentages = [10, 30, 50, 90];
    
    sizes.forEach(size => {
        console.log(`\\nArray size: ${size}`);
        
        zeroPercentages.forEach(zeroPercent => {
            // Generate test array
            const nums = Array.from({ length: size }, () => 
                Math.random() * 100 < zeroPercent ? 0 : Math.floor(Math.random() * 100) + 1
            );
            
            // Test swap approach
            const nums1 = [...nums];
            const start1 = performance.now();
            const swaps = moveZerosMinSwaps(nums1);
            const time1 = performance.now() - start1;
            
            // Test overwrite approach
            const nums2 = [...nums];
            const start2 = performance.now();
            moveZerosNoSwaps(nums2);
            const time2 = performance.now() - start2;
            
            console.log(`${zeroPercent}% zeros: Swap=${time1.toFixed(2)}ms (${swaps} swaps), Overwrite=${time2.toFixed(2)}ms`);
        });
    });
}

// ========== STABILITY TESTS ==========

function stabilityTest(): void {
    console.log('\\n=== STABILITY TEST ===');
    console.log('Testing if relative order is preserved...');
    
    // Test with objects to verify stability
    interface NumberObj {
        value: number;
        id: string;
    }
    
    const testArray: NumberObj[] = [
        { value: 0, id: 'zero1' },
        { value: 1, id: 'one1' },
        { value: 0, id: 'zero2' },
        { value: 2, id: 'two1' },
        { value: 0, id: 'zero3' },
        { value: 1, id: 'one2' }
    ];
    
    // Custom move zeros for objects
    function moveZerosObjects(arr: NumberObj[]): void {
        let writeIndex = 0;
        
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value !== 0) {
                [arr[writeIndex], arr[i]] = [arr[i], arr[writeIndex]];
                writeIndex++;
            }
        }
    }
    
    const result = [...testArray];
    moveZerosObjects(result);
    
    console.log('Original order of non-zeros:', testArray.filter(x => x.value !== 0).map(x => x.id));
    console.log('Result order of non-zeros:', result.filter(x => x.value !== 0).map(x => x.id));
    
    const isStable = JSON.stringify(testArray.filter(x => x.value !== 0)) === 
                    JSON.stringify(result.filter(x => x.value !== 0));
    
    console.log(`Stability: ${isStable ? '✅ PRESERVED' : '❌ NOT PRESERVED'}`);
}

// ========== EDGE CASE STRESS TESTS ==========

function stressTest(): void {
    console.log('\\n=== STRESS TESTS ===');
    
    // Test with very large numbers
    const largeNumbers = [0, Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0];
    const largeResult = [...largeNumbers];
    moveZerosNoSwaps(largeResult);
    console.log('Large numbers test:', JSON.stringify(largeResult));
    
    // Test with repeated patterns
    const pattern = [0, 1, 2];
    const repeated = Array(1000).fill(pattern).flat();
    const repeatedResult = [...repeated];
    const start = performance.now();
    moveZerosNoSwaps(repeatedResult);
    const time = performance.now() - start;
    console.log(`Repeated pattern (3000 elements): ${time.toFixed(2)}ms`);
    
    // Verify correctness
    const expectedNonZeros = repeated.filter(x => x !== 0);
    const actualNonZeros = repeatedResult.filter(x => x !== 0);
    const correct = JSON.stringify(expectedNonZeros) === JSON.stringify(actualNonZeros);
    console.log(`Correctness: ${correct ? '✅ CORRECT' : '❌ INCORRECT'}`);
}

// ========== MAIN TEST RUNNER ==========

function runAllTests(): void {
    console.log('🧪 MOVE ZEROS PATTERN - COMPREHENSIVE TESTING');
    console.log('='.repeat(50));
    
    // Basic pattern tests
    runTest('Move Zeros (No Swaps)', moveZerosTestCases, moveZerosNoSwaps);
    runTest('Move Zeros (Min Swaps)', moveZerosTestCases, (arr) => { moveZerosMinSwaps(arr); });
    
    // Variations
    runTest('Move Negatives to End', moveNegativesTestCases, moveNegativesToEnd);
    runTest('Move Evens to Front', moveEvensTestCases, moveEvensToFront);
    
    // String variations
    runTest('Move Spaces to End', moveSpacesTestCases, moveSpacesToEnd);
    runTest('Move Vowels to Front', moveVowelsTestCases, moveVowelsToFront);
    
    // Advanced tests
    stabilityTest();
    stressTest();
    performanceTest();
    
    console.log('\\n🎉 All tests completed!');
    console.log('\\n💡 Key Takeaways:');
    console.log('1. Two-pointer technique is versatile for array partitioning');
    console.log('2. Swap vs overwrite approaches have different trade-offs');
    console.log('3. Always test edge cases: empty, single element, all same');
    console.log('4. Consider stability requirements in your implementation');
    console.log('5. Performance can vary based on data distribution');
}

// ========== INTERACTIVE CHALLENGES ==========

/**
 * CHALLENGE PROBLEMS TO SOLVE:
 * 
 * 1. Implement Dutch National Flag problem (3-way partitioning)
 * 2. Move all duplicates to end while preserving first occurrence order
 * 3. Partition array into three parts: negatives, zeros, positives
 * 4. Move elements based on multiple conditions (e.g., even AND > 10)
 * 5. Implement stable partition (preserve relative order of both parts)
 */

function dutchFlagChallenge(nums: number[]): void {
    // TODO: Partition array into [0s, 1s, 2s]
    // Input: [2, 0, 2, 1, 1, 0] → Output: [0, 0, 1, 1, 2, 2]
}

function moveDuplicatesToEnd(nums: number[]): void {
    // TODO: Move duplicates to end, keep first occurrence in original position
    // Input: [1, 2, 3, 2, 4, 1] → Output: [1, 2, 3, 4, 2, 1] (or similar valid arrangement)
}

// Export test runner for external use
export { runAllTests, performanceTest, stabilityTest, stressTest };
