/**
 * BALANCED BRACKETS / VALID PARENTHESES
 * Pattern: Stack-based matching
 *
 * @see Implementation: ../problems/easy/validParenthesis_STACK.ts
 *
 * ## Problem Statement
 * Given a string str consisting of characters such as '(', ')', '{', '}', '[' and ']',
 * determine if the input string is properly balanced.
 *
 * A string is considered balanced if:
 * - Each opening bracket is closed by the same type of bracket
 * - Open brackets are closed in the correct order: ([]) ✓, ([)] ✗
 * - Nested subsets must also be balanced
 *
 * ## Examples
 * "[]"     → true   | "([]){}" → true
 * "([)]"   → false  | "(]"     → false
 *
 * ## Complexity
 * Time: O(n) | Space: O(n) - stack holds up to n/2 opening brackets
 *
 * ============================================================================
 * WHY STACK? - "MATCHING PAIRS IN ORDER" PATTERN RECOGNITION
 * ============================================================================
 *
 * Use Stack when you see these characteristics:
 *
 * 1. NESTED STRUCTURES - Elements can contain other elements
 *    → HTML: <div><span></span></div>
 *    → Code: function() { if() { } }
 *    → Math: ((a+b)*(c+d))
 *
 * 2. LIFO MATCHING - Last opened must be first closed
 *    → In "([{" the '{' opened last, so '}' must come before ']' and ')'
 *    → Like Russian nesting dolls - inner must close before outer
 *
 * 3. OPEN/CLOSE PAIRS - Every "start" needs a matching "end"
 *    → Brackets: ( ) { } [ ]
 *    → Tags: <tag> </tag>
 *    → Operations: begin/end, open/close, start/stop
 *
 * 4. ORDER MATTERS - Same elements, different order = different result
 *    → "([)]" has all matching pairs but WRONG ORDER → invalid
 *    → "()[]{}" correct order → valid
 *
 * MENTAL MODEL: Think of it like a "stack of plates"
 * - Opening bracket = add plate on top
 * - Closing bracket = remove top plate (must match!)
 * - Valid = all plates removed, none left over
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 * 1. Opening bracket → push to stack
 * 2. Closing bracket → pop & check match (no match = false)
 * 3. End → stack empty = valid, not empty = invalid
 *
 * ============================================================================
 * REAL-WORLD APPLICATIONS
 * ============================================================================
 *
 * CODE & SYNTAX:
 * - IDE bracket matching (VS Code, IntelliJ) - highlight mismatched braces
 * - Compiler/Interpreter parsing (V8, Python) - validate code structure
 * - SQL query validation - WHERE (a AND (b OR c))
 *
 * DATA FORMATS:
 * - JSON validation - {"user": {"name": "John"}} must balance {} and []
 * - HTML/XML parsing - <div><span></span></div> tag matching
 * - Regex pattern validation - ^(a(b|c)+)$ group matching
 *
 * RESOURCE MANAGEMENT:
 * - Transaction pairing - begin/commit, open/close file
 * - Undo/redo grouping - (cmd1 (cmd2 cmd3)) nested operations
 * - Resource leak detection - ensure every open() has close()
 *
 * DOMAIN-SPECIFIC:
 * - Math expressions - ((3+2)*5) calculator validation
 * - Chemistry formulas - Ca(OH)2 counting atoms in groups
 * - Spreadsheet formulas - =SUM((A1+B1)*C1) Excel/Sheets
 *
 * ============================================================================
 * RELATED PROBLEMS (Same Pattern)
 * ============================================================================
 * - LeetCode #20: Valid Parentheses
 * - LeetCode #22: Generate Parentheses (use stack thinking in reverse)
 * - LeetCode #32: Longest Valid Parentheses
 * - LeetCode #394: Decode String - k[encoded_string]
 * - LeetCode #856: Score of Parentheses
 * - LeetCode #1249: Minimum Remove to Make Valid Parentheses
 *
 */

// See implementation at: ../problems/easy/validParenthesis_STACK.ts
export { isValid } from "../problems/easy/validParenthesis_STACK";
