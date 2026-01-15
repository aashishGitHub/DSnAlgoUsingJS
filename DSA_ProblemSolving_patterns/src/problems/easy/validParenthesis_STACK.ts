/**
 * VALID PARENTHESES / BALANCED BRACKETS
 * Pattern: Stack-based matching
 * LeetCode #20 - Easy
 *
 * @description
 * Given a string containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid (balanced).
 *
 * @example Real-World: Code Editor Bracket Matching
 * // IDE validating user's code
 * isValid("function foo() { if(x) { return; } }") // conceptually ✓
 * isValid("function foo() { if(x) { return; }") // conceptually ✗ - missing }
 *
 * @example Real-World: JSON Validator
 * // API validating request body structure
 * isValid("{}") // ✓ - valid empty object
 * isValid("[{},{}]") // ✓ - valid array of objects
 * isValid("[{]") // ✗ - malformed JSON structure
 *
 * @example Real-World: Math Expression Validator
 * // Calculator app checking user input
 * isValid("((3+2)*5)") // conceptually ✓
 * isValid("((3+2)*5))") // ✗ - extra closing paren
 *
 * Time Complexity: O(n) - single pass through string
 * Space Complexity: O(n) - stack can hold up to n/2 opening brackets
 */

const closingBrackets = [")", "}", "]"];
const openingBrackets = ["(", "{", "["];

/**
 * Helper function to check if opening and closing brackets form a valid pair
 * @param start - The opening bracket (popped from stack)
 * @param end - The closing bracket (current character)
 * @returns true if they match, false otherwise
 */
function isPair(start: string | undefined, end: string): boolean {
  if (!start) {
    return false;
  }
  // Both brackets must be at the same index in their respective arrays
  // e.g., '(' is at index 0 in opening, ')' is at index 0 in closing
  return (
    openingBrackets.indexOf(start) !== -1 &&
    openingBrackets.indexOf(start) === closingBrackets.indexOf(end)
  );
}

/**
 * Validates if a string of brackets is balanced
 *
 * @param s - String containing only bracket characters
 * @returns true if all brackets are properly balanced, false otherwise
 *
 * @example
 * isValid("()") // true - simple match
 * isValid("()[]{}") // true - multiple pairs
 * isValid("([])") // true - nested brackets
 * isValid("([)]") // false - wrong order
 * isValid("(]") // false - mismatched types
 */
export function isValid(s: string): boolean {
  // Stack to track unmatched opening brackets
  const stack: string[] = [];

  for (let item of s) {
    if (stack.length > 0 && closingBrackets.includes(item)) {
      // Closing bracket found - try to match with last opening
      const lastItem = stack.pop();
      if (isPair(lastItem, item)) {
        // Valid pair found, continue
        continue;
      } else {
        // Mismatch - invalid string
        return false;
      }
    } else {
      // Opening bracket found - push to stack
      stack.push(item);
    }
  }

  // Stack should be empty if all brackets matched
  return stack.length === 0;
}

// Test cases - uncomment to run manually
// console.log("Test Cases:");
// console.log("'()' =>", isValid('()'), "(expected: true)");
// console.log("'()[]{}' =>", isValid('()[]{}'), "(expected: true)");
// console.log("'([])' =>", isValid('([])'), "(expected: true)");
// console.log("'([)]' =>", isValid('([)]'), "(expected: false)");
// console.log("'(]' =>", isValid('(]'), "(expected: false)");
// console.log("'((})){{[}]' =>", isValid('((})){{[}]'), "(expected: false)");
