/**
 * Fast & Slow Pointers (Hare-Tortoise) Pattern - Main Export
 * 
 * This module exports all fast and slow pointer pattern implementations.
 * Perfect for cycle detection, middle finding, and position-based problems.
 */

export * from './fastSlowPointers';

// Re-export specific functions for convenience
export {
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
    reverseList,
    createLinkedList,
    linkedListToArray,
    createCycle
} from './fastSlowPointers';
