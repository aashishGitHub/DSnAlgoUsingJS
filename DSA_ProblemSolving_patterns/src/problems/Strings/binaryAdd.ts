/**
 * ============================================================================
 * ADD BINARY (LeetCode 67)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given two binary strings a and b, return their sum as a binary string.
 *
 *   Input:  a = "1010", b = "1011"
 *   Output: "10101"
 *
 * PATTERN:
 * - **Grade-school addition, right to left, with a carry.** Two pointers
 *   start at the ENDS of both strings; each step adds digit + digit + carry.
 *   The pointers are independent, so unequal lengths need no padding.
 *
 * WHY NOT parseInt(a, 2) + parseInt(b, 2)?
 * - Binary strings can be hundreds of bits; JS numbers lose integer precision
 *   past 2⁵³ (BigInt works, but the manual method is what's being tested —
 *   it's the same skill as Add Two Numbers on linked lists, LC2).
 *
 * COMPLEXITY: Time O(max(m, n)). Space O(max(m, n)) for the result.
 * ============================================================================
 */

/**
 * THE DIGIT TABLE that makes the code obvious — sum ∈ {0,1,2,3}:
 *
 *   sum | digit written (sum % 2) | carry out (sum > 1)
 *    0  |           0             |        0
 *    1  |           1             |        0
 *    2  |           0             |        1     ← "10" in binary
 *    3  |           1             |        1     ← "11" in binary
 *
 * DRY-RUN on a="11", b="1":
 *   i='1',j='1': sum=2 → write 0, carry 1
 *   i='1',j=—  : sum=1+1=2 → write 0, carry 1
 *   loop ends, carry=1 → prepend "1"
 *   → "100" ✓  (3 + 1 = 4)
 */
export function addBinary(a: string, b: string): string {
  let i = a.length - 1; // pointer into a (from the right)
  let j = b.length - 1; // pointer into b (from the right)
  let carry = 0;
  let result = "";

  while (i >= 0 || j >= 0) {
    let sum = carry;
    if (i >= 0) sum += Number(a[i--]); // add a's digit if any remain
    if (j >= 0) sum += Number(b[j--]); // add b's digit if any remain

    result = (sum % 2) + result; // the digit for this column
    carry = sum > 1 ? 1 : 0;     // 2 or 3 → carry a 1
  }

  if (carry) result = "1" + result; // e.g. "1" + "1" = "10"
  return result;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The final carry check AFTER the loop is the classic miss ("1"+"1").
 * 2. Prepending with `digit + result` is O(n²) string building in theory —
 *    fine for interviews; mention pushing to an array + reverse + join for
 *    the strictly-linear version.
 * 3. Same skeleton solves: Add Strings (LC415, base 10), Add Two Numbers
 *    (LC2, linked lists), Plus One (LC66, carry over an array).
 */
