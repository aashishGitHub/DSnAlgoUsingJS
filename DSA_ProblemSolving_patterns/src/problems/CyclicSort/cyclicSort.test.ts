import { 
    cyclicSort,
    findDisappearedNumbers,
    findDuplicates,
    findFirstKMissingPositive,
    findDuplicate,
    missingNumber,
    findErrorNums,
    firstMissingPositive,
    correctArray,
    findMissingInRange,
    isCorrectlySorted,
    getCorrectIndex,
    isValidForCyclicSort,
    countSwaps
} from './cyclicSort';

describe('Cyclic Sort Pattern', () => {
    
    describe('Cyclic Sort Basic', () => {
        test('should sort array correctly', () => {
            const nums1 = [3, 1, 4, 2, 5];
            cyclicSort(nums1);
            expect(nums1).toEqual([1, 2, 3, 4, 5]);
            
            const nums2 = [2, 6, 4, 3, 1, 5];
            cyclicSort(nums2);
            expect(nums2).toEqual([1, 2, 3, 4, 5, 6]);
            
            const nums3 = [1, 5, 6, 4, 3, 2];
            cyclicSort(nums3);
            expect(nums3).toEqual([1, 2, 3, 4, 5, 6]);
        });
        
        test('should handle already sorted array', () => {
            const nums = [1, 2, 3, 4, 5];
            cyclicSort(nums);
            expect(nums).toEqual([1, 2, 3, 4, 5]);
        });
        
        test('should handle single element', () => {
            const nums = [1];
            cyclicSort(nums);
            expect(nums).toEqual([1]);
        });
    });
    
    describe('Find Disappeared Numbers', () => {
        test('should find missing numbers correctly', () => {
            const nums1 = [4, 3, 2, 7, 8, 2, 3, 1];
            expect(findDisappearedNumbers(nums1)).toEqual([5, 6]);
            
            const nums2 = [1, 1];
            expect(findDisappearedNumbers(nums2)).toEqual([2]);
            
            const nums3 = [1, 2, 3, 4, 5];
            expect(findDisappearedNumbers(nums3)).toEqual([]);
        });
        
        test('should handle edge cases', () => {
            expect(findDisappearedNumbers([])).toEqual([]);
            expect(findDisappearedNumbers([1])).toEqual([]);
        });
    });
    
    describe('Find Duplicates', () => {
        test('should find duplicate numbers correctly', () => {
            const nums1 = [4, 3, 2, 7, 8, 2, 3, 1];
            const result1 = findDuplicates(nums1);
            expect(result1).toContain(2);
            expect(result1).toContain(3);
            expect(result1).toHaveLength(2);
            
            const nums2 = [1, 1, 2];
            expect(findDuplicates(nums2)).toEqual([1]);
            
            const nums3 = [1, 2, 3, 4, 5];
            expect(findDuplicates(nums3)).toEqual([]);
        });
    });
    
    describe('Find First K Missing Positive', () => {
        test('should find first k missing positive numbers', () => {
            const nums1 = [3, -1, 4, 5, 5];
            const result1 = findFirstKMissingPositive(nums1, 3);
            expect(result1).toEqual([1, 2, 6]);
            
            const nums2 = [2, 3, 4];
            const result2 = findFirstKMissingPositive(nums2, 3);
            expect(result2).toEqual([1, 5, 6]);
            
            const nums3 = [-2, -3, 4];
            const result3 = findFirstKMissingPositive(nums3, 2);
            expect(result3).toEqual([1, 2]);
        });
    });
    
    describe('Find Duplicate', () => {
        test('should find duplicate number correctly', () => {
            expect(findDuplicate([1, 3, 4, 2, 2])).toBe(2);
            expect(findDuplicate([3, 1, 3, 4, 2])).toBe(3);
            expect(findDuplicate([1, 1])).toBe(1);
            expect(findDuplicate([1, 1, 2])).toBe(1);
        });
    });
    
    describe('Missing Number', () => {
        test('should find missing number correctly', () => {
            expect(missingNumber([3, 0, 1])).toBe(2);
            expect(missingNumber([0, 1])).toBe(2);
            expect(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
            expect(missingNumber([0])).toBe(1);
        });
    });
    
    describe('Find Error Nums', () => {
        test('should find duplicate and missing numbers', () => {
            const result1 = findErrorNums([1, 2, 2, 4]);
            expect(result1).toEqual([2, 3]);
            
            const result2 = findErrorNums([1, 1]);
            expect(result2).toEqual([1, 2]);
            
            const result3 = findErrorNums([2, 2]);
            expect(result3).toEqual([2, 1]);
        });
    });
    
    describe('First Missing Positive', () => {
        test('should find first missing positive correctly', () => {
            expect(firstMissingPositive([1, 2, 0])).toBe(3);
            expect(firstMissingPositive([3, 4, -1, 1])).toBe(2);
            expect(firstMissingPositive([7, 8, 9, 11, 12])).toBe(1);
            expect(firstMissingPositive([1, 2, 3, 4, 5])).toBe(6);
        });
    });
    
    describe('Correct Array', () => {
        test('should correct array by placing numbers in correct positions', () => {
            const nums1 = [3, 1, 4, 2, 5];
            const result1 = correctArray(nums1);
            expect(result1).toEqual([1, 2, 3, 4, 5]);
            
            const nums2 = [2, 6, 4, 3, 1, 5];
            const result2 = correctArray(nums2);
            expect(result2).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
    
    describe('Find Missing In Range', () => {
        test('should find missing numbers in specific range', () => {
            const nums = [4, 3, 2, 7, 8, 2, 3, 1];
            expect(findMissingInRange(nums, 1, 8)).toEqual([5, 6]);
            expect(findMissingInRange(nums, 1, 4)).toEqual([5]);
            expect(findMissingInRange(nums, 5, 8)).toEqual([5, 6]);
        });
    });
    
    describe('Utility Functions', () => {
        test('isCorrectlySorted should work correctly', () => {
            expect(isCorrectlySorted([1, 2, 3, 4, 5])).toBe(true);
            expect(isCorrectlySorted([1, 2, 4, 3, 5])).toBe(false);
            expect(isCorrectlySorted([2, 1, 3, 4, 5])).toBe(false);
        });
        
        test('getCorrectIndex should work correctly', () => {
            expect(getCorrectIndex(1)).toBe(0);
            expect(getCorrectIndex(5)).toBe(4);
            expect(getCorrectIndex(10)).toBe(9);
        });
        
        test('isValidForCyclicSort should work correctly', () => {
            expect(isValidForCyclicSort(1, 5)).toBe(true);
            expect(isValidForCyclicSort(5, 5)).toBe(true);
            expect(isValidForCyclicSort(0, 5)).toBe(false);
            expect(isValidForCyclicSort(6, 5)).toBe(false);
        });
        
        test('countSwaps should work correctly', () => {
            expect(countSwaps([1, 2, 3, 4, 5])).toBe(0);
            expect(countSwaps([5, 4, 3, 2, 1])).toBeGreaterThan(0);
            expect(countSwaps([2, 1, 3, 4, 5])).toBe(1);
        });
    });
    
    describe('Edge Cases', () => {
        test('should handle empty array', () => {
            const nums: number[] = [];
            cyclicSort(nums);
            expect(nums).toEqual([]);
            expect(findDisappearedNumbers([])).toEqual([]);
            expect(findDuplicates([])).toEqual([]);
        });
        
        test('should handle single element', () => {
            const nums = [1];
            cyclicSort(nums);
            expect(nums).toEqual([1]);
            expect(findDisappearedNumbers([1])).toEqual([]);
            expect(findDuplicates([1])).toEqual([]);
        });
        
        test('should handle two elements', () => {
            const nums1 = [1, 2];
            cyclicSort(nums1);
            expect(nums1).toEqual([1, 2]);
            
            const nums2 = [2, 1];
            cyclicSort(nums2);
            expect(nums2).toEqual([1, 2]);
        });
    });
});
