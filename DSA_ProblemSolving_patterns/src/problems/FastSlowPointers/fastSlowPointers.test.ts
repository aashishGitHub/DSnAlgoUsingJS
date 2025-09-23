import { 
    ListNode,
    middleNode,
    hasCycle,
    detectCycle,
    isHappy,
    circularArrayLoop,
    reorderList,
    isPalindrome,
    removeNthFromEnd,
    findDuplicate,
    createLinkedList,
    linkedListToArray,
    createCycle
} from './fastSlowPointers';

describe('Fast & Slow Pointers (Hare-Tortoise) Pattern', () => {
    
    describe('Middle of Linked List', () => {
        test('should find middle node correctly', () => {
            // Test case 1: [1,2,3,4,5] -> middle is 3
            const list1 = createLinkedList([1, 2, 3, 4, 5]);
            const middle1 = middleNode(list1);
            expect(middle1?.val).toBe(3);
            
            // Test case 2: [1,2,3,4,5,6] -> middle is 4 (second middle)
            const list2 = createLinkedList([1, 2, 3, 4, 5, 6]);
            const middle2 = middleNode(list2);
            expect(middle2?.val).toBe(4);
            
            // Test case 3: [1] -> middle is 1
            const list3 = createLinkedList([1]);
            const middle3 = middleNode(list3);
            expect(middle3?.val).toBe(1);
        });
        
        test('should handle empty list', () => {
            expect(middleNode(null)).toBeNull();
        });
    });
    
    describe('Linked List Cycle Detection', () => {
        test('should detect cycle correctly', () => {
            // Test case 1: No cycle
            const list1 = createLinkedList([1, 2, 3, 4]);
            expect(hasCycle(list1)).toBe(false);
            
            // Test case 2: Cycle at position 1
            const list2 = createLinkedList([3, 2, 0, -4]);
            createCycle(list2, 1);
            expect(hasCycle(list2)).toBe(true);
            
            // Test case 3: Cycle at position 0
            const list3 = createLinkedList([1, 2]);
            createCycle(list3, 0);
            expect(hasCycle(list3)).toBe(true);
        });
        
        test('should handle single node', () => {
            const list = createLinkedList([1]);
            expect(hasCycle(list)).toBe(false);
        });
    });
    
    describe('Detect Cycle Start', () => {
        test('should find cycle start correctly', () => {
            // Test case 1: Cycle at position 1
            const list1 = createLinkedList([3, 2, 0, -4]);
            createCycle(list1, 1);
            const cycleStart1 = detectCycle(list1);
            expect(cycleStart1?.val).toBe(2);
            
            // Test case 2: Cycle at position 0
            const list2 = createLinkedList([1, 2]);
            createCycle(list2, 0);
            const cycleStart2 = detectCycle(list2);
            expect(cycleStart2?.val).toBe(1);
        });
        
        test('should return null for no cycle', () => {
            const list = createLinkedList([1, 2, 3, 4]);
            expect(detectCycle(list)).toBeNull();
        });
    });
    
    describe('Happy Number', () => {
        test('should identify happy numbers correctly', () => {
            expect(isHappy(19)).toBe(true);
            expect(isHappy(1)).toBe(true);
            expect(isHappy(7)).toBe(true);
        });
        
        test('should identify non-happy numbers correctly', () => {
            expect(isHappy(2)).toBe(false);
            expect(isHappy(4)).toBe(false);
        });
    });
    
    describe('Circular Array Loop', () => {
        test('should detect circular array loops', () => {
            expect(circularArrayLoop([2, -1, 1, 2, 2])).toBe(true);
            expect(circularArrayLoop([-1, 2])).toBe(false);
            expect(circularArrayLoop([-2, 1, -1, -2, -2])).toBe(false);
        });
        
        test('should handle edge cases', () => {
            expect(circularArrayLoop([])).toBe(false);
            expect(circularArrayLoop([1])).toBe(false);
        });
    });
    
    describe('Reorder Linked List', () => {
        test('should reorder list correctly', () => {
            const list = createLinkedList([1, 2, 3, 4]);
            reorderList(list);
            expect(linkedListToArray(list)).toEqual([1, 4, 2, 3]);
            
            const list2 = createLinkedList([1, 2, 3, 4, 5]);
            reorderList(list2);
            expect(linkedListToArray(list2)).toEqual([1, 5, 2, 4, 3]);
        });
        
        test('should handle single node', () => {
            const list = createLinkedList([1]);
            reorderList(list);
            expect(linkedListToArray(list)).toEqual([1]);
        });
    });
    
    describe('Palindrome Linked List', () => {
        test('should detect palindromes correctly', () => {
            const list1 = createLinkedList([1, 2, 2, 1]);
            expect(isPalindrome(list1)).toBe(true);
            
            const list2 = createLinkedList([1, 2, 3, 2, 1]);
            expect(isPalindrome(list2)).toBe(true);
            
            const list3 = createLinkedList([1, 2, 3, 4]);
            expect(isPalindrome(list3)).toBe(false);
        });
        
        test('should handle edge cases', () => {
            expect(isPalindrome(null)).toBe(true);
            expect(isPalindrome(createLinkedList([1]))).toBe(true);
        });
    });
    
    describe('Remove Nth Node From End', () => {
        test('should remove nth node correctly', () => {
            const list1 = createLinkedList([1, 2, 3, 4, 5]);
            const result1 = removeNthFromEnd(list1, 2);
            expect(linkedListToArray(result1)).toEqual([1, 2, 3, 5]);
            
            const list2 = createLinkedList([1, 2]);
            const result2 = removeNthFromEnd(list2, 1);
            expect(linkedListToArray(result2)).toEqual([1]);
            
            const list3 = createLinkedList([1, 2]);
            const result3 = removeNthFromEnd(list3, 2);
            expect(linkedListToArray(result3)).toEqual([2]);
        });
        
        test('should handle single node', () => {
            const list = createLinkedList([1]);
            const result = removeNthFromEnd(list, 1);
            expect(result).toBeNull();
        });
    });
    
    describe('Find Duplicate Number', () => {
        test('should find duplicate correctly', () => {
            expect(findDuplicate([1, 3, 4, 2, 2])).toBe(2);
            expect(findDuplicate([3, 1, 3, 4, 2])).toBe(3);
            expect(findDuplicate([1, 1])).toBe(1);
        });
    });
    
    describe('Utility Functions', () => {
        test('createLinkedList should work correctly', () => {
            const list = createLinkedList([1, 2, 3, 4]);
            expect(linkedListToArray(list)).toEqual([1, 2, 3, 4]);
        });
        
        test('createCycle should work correctly', () => {
            const list = createLinkedList([1, 2, 3, 4]);
            createCycle(list, 1);
            expect(hasCycle(list)).toBe(true);
        });
    });
});
