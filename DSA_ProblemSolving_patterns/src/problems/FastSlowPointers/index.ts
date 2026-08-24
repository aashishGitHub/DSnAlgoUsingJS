/**
 * Fast & Slow Pointers (Hare-Tortoise) Pattern - Main Export
 *
 * This module exports all fast and slow pointer pattern implementations.
 * Perfect for cycle detection, middle finding, and position-based problems.
 *
 * NOTE: explicit export list (no `export *`) so name clashes with other
 * pattern folders can be resolved deliberately:
 * - `isPalindrome` here is the LINKED-LIST version (LeetCode 234); the
 *   canonical string `isPalindrome` lives in 2Pointers/palindrome.ts, so this
 *   one is exported as `isPalindromeLinkedList` to the master barrel.
 * - `isHappy` / `findDuplicate` here are the Floyd's-cycle versions — these
 *   own the canonical names; the Set-based variants in HashMap/ are exported
 *   there as `isHappySet` / `findDuplicateSet`.
 */

export {
    ListNode,
    middleNode,
    hasCycle,
    detectCycle,
    isHappy,
    circularArrayLoop,
    reorderList,
    isPalindrome as isPalindromeLinkedList,
    removeNthFromEnd,
    findDuplicate,
    reverseList,
    createLinkedList,
    linkedListToArray,
    createCycle
} from './fastSlowPointers';
