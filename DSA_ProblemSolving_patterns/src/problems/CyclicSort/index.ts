/**
 * Cyclic Sort Pattern - Main Export
 *
 * This module exports all cyclic sort pattern implementations.
 * Perfect for problems with array values in a fixed range and missing/duplicate numbers.
 *
 * NOTE: explicit export list (no `export *`) so name clashes with other
 * pattern folders can be resolved deliberately:
 * - `missingNumber` / `findDisappearedNumbers` are canonically Cyclic Sort
 *   problems — this folder owns the plain names (the Set-based variants in
 *   HashMap/ are exported there as `missingNumberSet` / `findDisappearedNumbersSet`).
 * - `findDuplicate` is canonically the Floyd's-cycle problem (LeetCode 287) in
 *   FastSlowPointers/ — the cyclic-sort variant here is exported as
 *   `findDuplicateCyclicSort`.
 */

export {
    cyclicSort,
    findDisappearedNumbers,
    findDuplicates,
    findFirstKMissingPositive,
    findDuplicate as findDuplicateCyclicSort,
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
