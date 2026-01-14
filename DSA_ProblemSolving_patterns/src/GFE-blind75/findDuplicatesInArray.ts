/**
 * FIND DUPLICATES IN ARRAY / CONTAINS DUPLICATE
 * Pattern: HashSet for O(1) lookup
 *
 * @see Implementation: ../problems/HashMap/hashSetPatterns.ts (containsDuplicate)
 * @see Also: ../problems/2Pointers/containsDuplicate.ts (Two Pointer approach for sorted)
 * @link https://www.greatfrontend.com/interviews/study/blind75/questions/algo/array-find-duplicate
 *
 * ## Problem Statement
 * Given an array of integers `numbers`, determine whether the array contains
 * any duplicate values. A duplicate is any number appearing more than once.
 *
 * ## Examples
 * [5,7,1,3]         → false  | All unique
 * [10,7,0,0,9]      → true   | 0 appears twice
 * [3,2,6,5,0,3,10]  → true   | 3 appears twice
 *
 * ## Complexity
 * HashSet: Time O(n) | Space O(n)
 * Sorting: Time O(n log n) | Space O(1) - if allowed to modify array
 *
 * ============================================================================
 * WHY HASHSET? - "HAVE I SEEN THIS BEFORE?" PATTERN RECOGNITION
 * ============================================================================
 *
 * Use HashSet/HashMap when you need:
 *
 * 1. O(1) EXISTENCE CHECK - "Is X in my collection?"
 *    → Brute force O(n²) with nested loops → O(n) with Set
 *    → Trade space for time
 *
 * 2. TRACKING SEEN ELEMENTS - Remember what you've encountered
 *    → Duplicates: Have I seen this number before?
 *    → Two Sum: Have I seen the complement before?
 *    → Cycle detection: Have I visited this state before?
 *
 * 3. FREQUENCY/COUNT - How many times does X appear?
 *    → Map<element, count> for frequency tracking
 *    → Anagram checking, majority element, top K frequent
 *
 * 4. GROUPING BY KEY - Cluster related elements together
 *    → Group anagrams by sorted key
 *    → Group by some computed property
 *
 * MENTAL MODEL: Think of it as a "guest list at a party"
 * - As each guest (number) arrives, check if their name is on the list
 * - If yes → duplicate found!
 * - If no → add them to the list, continue
 *
 * ============================================================================
 * ALGORITHM APPROACHES
 * ============================================================================
 *
 * APPROACH 1: HashSet (Optimal for unsorted)
 * - Iterate array, for each element: seen.has(x) ? return true : seen.add(x)
 * - Time O(n), Space O(n)
 *
 * APPROACH 2: Sorting (Space optimal, modifies array)
 * - Sort array, then check adjacent elements: nums[i] === nums[i+1]
 * - Time O(n log n), Space O(1)
 *
 * APPROACH 3: Brute Force (Never use in interviews)
 * - Nested loop comparing every pair
 * - Time O(n²), Space O(1)
 *
 * ============================================================================
 * REAL-WORLD APPLICATIONS
 * ============================================================================
 *
 * DATA VALIDATION:
 * - Unique usernames/emails - prevent duplicate registrations
 * - Primary key validation - ensure no duplicate IDs in database
 * - Form input validation - detect duplicate entries in multi-select
 *
 * DEDUPLICATION:
 * - Remove duplicate contacts in phone sync
 * - Merge duplicate records in CRM systems
 * - Deduplicate log entries, events, or transactions
 *
 * FRAUD/SECURITY:
 * - Detect duplicate payment attempts
 * - Identify repeated failed login attempts
 * - Flag duplicate IP addresses in request logs
 *
 * DATA PROCESSING:
 * - Count unique visitors to a website
 * - Find unique words in a document
 * - Identify unique products in shopping cart
 *
 * INVENTORY/ASSET MANAGEMENT:
 * - Detect duplicate SKUs or barcodes
 * - Find duplicate file names in upload
 * - Identify duplicate serial numbers
 *
 * ============================================================================
 * RELATED PROBLEMS (Same Pattern)
 * ============================================================================
 * - LeetCode #217: Contains Duplicate (this problem)
 * - LeetCode #1: Two Sum (HashSet variant)
 * - LeetCode #242: Valid Anagram (frequency map)
 * - LeetCode #49: Group Anagrams (group by key)
 * - LeetCode #287: Find the Duplicate Number
 * - LeetCode #442: Find All Duplicates in Array
 * - LeetCode #349: Intersection of Two Arrays
 *
 * ============================================================================
 * INTERVIEW TIPS
 * ============================================================================
 * - Always clarify: sorted array? → can use O(1) space with adjacent check
 * - Always clarify: can modify input? → sorting approach available
 * - Mention trade-offs: HashSet (time optimal) vs Sort (space optimal)
 * - Edge cases: empty array, single element, all duplicates
 */

// See implementation at: ../problems/HashMap/hashSetPatterns.ts
export { containsDuplicate } from "../problems/HashMap/hashSetPatterns";

/**
 * Alternative: Two-pointer approach for SORTED arrays (space optimal)
 *
 * For sorted arrays, duplicates are adjacent, so just check neighbors.
 * Time: O(n), Space: O(1)
 */
export function containsDuplicateSorted(nums: number[]): boolean {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) {
      return true;
    }
  }
  return false;
}
