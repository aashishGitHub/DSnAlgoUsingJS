/**
 * Cyclic Sort Pattern - Main Export
 * 
 * This module exports all cyclic sort pattern implementations.
 * Perfect for problems with array values in a fixed range and missing/duplicate numbers.
 */

export * from './cyclicSort';

// Re-export specific functions for convenience
export {
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
