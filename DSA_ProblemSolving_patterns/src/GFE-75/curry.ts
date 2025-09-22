/**
 * Currying is the technique of converting a function that takes multiple arguments into a 
 * sequence of functions that each takes a single argument.
 *
 * Implement the curry function which accepts a function as the only argument and returns a function that accepts single arguments
 * and can be repeatedly called until at least the minimum number of arguments have been provided (determined by how many 
 * arguments the original function accepts). The initial function argument is then invoked with the provided arguments.
 * 
 * @example
 * function add(a, b) {
 *   return a + b;
 * }
 *
 * const curriedAdd = curry(add);
 * curriedAdd(3)(4); // 7
 *
 * const alreadyAddedThree = curriedAdd(3);
 * alreadyAddedThree(4); // 7
 *
 * @example
 * function multiplyThreeNumbers(a, b, c) {
 *   return a * b * c;
 * }
 *
 * const curriedMultiplyThreeNumbers = curry(multiplyThreeNumbers);
 * curriedMultiplyThreeNumbers(4)(5)(6); // 120
 *
 * const containsFour = curriedMultiplyThreeNumbers(4);
 * const containsFourMulFive = containsFour(5);
 * containsFourMulFive(6); // 120
 */
/**
 * Basic curry implementation using bind for argument accumulation
 * @param func - The function to curry
 * @returns A curried function
 */
export function curry(func: Function) {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }
    // When there are few args passed, we bind the function 
    // to the this object and the args passed so far
    return curried.bind(this, ...args);
  };
}


/**
 * Curry implementation with undefined/null handling
 * Skips undefined/null values and empty calls during currying
 * @param func - The function to curry
 * @returns A curried function that skips undefined/null values
 */
export function curryWithUndefinedHandling(func: Function) {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= func.length) {
      return func.call(this, ...args);
    }

    // Return a function that accepts multiple arguments (using rest parameters)
    // This allows calls like curried('A')('B', 'C') to work properly
    return (...arg2s: any[]) => {
      // Skip if no arguments OR single undefined/null argument
      if (arg2s.length === 0 || 
          (arg2s.length === 1 && (arg2s[0] === undefined || arg2s[0] === null))) {
        return curried.call(this, ...args);
      }
      return curried.call(this, ...args, ...arg2s);
    };
  };
}


/**
 * CURRY IMPLEMENTATION COMPARISON
 * 
 * Comparison of two curry approaches focusing on argument accumulation mechanism.
 *
 * ## Core Difference: How Arguments Are Accumulated
 *
 * ### Approach 1: Using `bind`
 * ```typescript
 * export function curry(func: Function) {
 *   return function curried(...args: any[]) {
 *     if (args.length >= func.length) {
 *       return func.apply(this, args);
 *     }
 *     return curried.bind(this, ...args); // 🔑 KEY: Uses bind
 *   };
 * }
 * ```
 *
 * ### Approach 2: Using `call` (without undefined handling)
 * ```typescript
 * function curryWithCall(func: Function) {
 *   return function curried(...args: any[]) {
 *     if (args.length >= func.length) {
 *       return func.call(this, ...args);
 *     }
 *     return (arg: any) => curried.call(this, ...args, arg); // 🔑 KEY: Uses call
 *   };
 * }
 * ```
 *
 * ## Key Differences
 *
 * ### 1. Argument Collection Strategy
 *
 * **With `bind`:**
 * ```typescript
 * return curried.bind(this, ...args);
 * // Creates a NEW function with args "baked in"
 * // Can accept MULTIPLE arguments in next call
 * ```
 *
 * **With `call`:**
 * ```typescript
 * return (arg: any) => curried.call(this, ...args, arg);
 * // Returns function that accepts SINGLE argument
 * // Manually passes accumulated args + new arg
 * ```
 *
 * ### 2. Flexibility in Subsequent Calls
 *
 * **Example with 3-argument function:**
 * ```typescript
 * const multiply = (a: number, b: number, c: number) => a * b * c;
 * ```
 *
 * **Using `bind` approach:**
 * ```typescript
 * const curriedBind = curry(multiply);
 *
 * // All these work:
 * curriedBind(2)(3)(4)           // ✅ One at a time
 * curriedBind(2, 3)(4)           // ✅ Multiple, then one  
 * curriedBind(2)(3, 4)           // ✅ One, then multiple
 * curriedBind(2, 3, 4)           // ✅ All at once
 * ```
 *
 * **Using `call` approach:**
 * ```typescript
 * const curriedCall = curryWithCall(multiply);
 *
 * // Limited flexibility:
 * curriedCall(2)(3)(4)           // ✅ One at a time (only way)
 * curriedCall(2, 3)(4)           // ✅ First call can be multiple
 * curriedCall(2)(3, 4)           // ❌ Second call only accepts one arg
 * curriedCall(2, 3, 4)           // ✅ All at once (first call)
 * ```
 *
 * ### 3. Internal Mechanism
 *
 * **`bind` creates persistent partial application:**
 * ```typescript
 * const step1 = curriedBind(2);     // Returns: curried.bind(this, 2)
 * const step2 = step1(3);           // Returns: curried.bind(this, 2, 3)  
 * const result = step2(4);          // Returns: multiply(2, 3, 4)
 * ```
 *
 * **`call` creates wrapper functions:**
 * ```typescript
 * const step1 = curriedCall(2);     // Returns: (arg) => curried.call(this, 2, arg)
 * const step2 = step1(3);           // Returns: (arg) => curried.call(this, 2, 3, arg)
 * const result = step2(4);          // Returns: multiply(2, 3, 4)
 * ```
 *
 * ### 4. Performance Implications
 *
 * **`bind` approach:**
 * - ✅ More flexible argument handling
 * - ✅ Native JavaScript optimization
 * - ⚠️ Creates new function objects
 *
 * **`call` approach:**  
 * - ✅ Explicit control over arguments
 * - ✅ Predictable one-argument-at-a-time pattern
 * - ⚠️ Manual argument management
 *
 * ### 5. Function Signature Differences
 *
 * **`bind` returned function:**
 * ```typescript
 * // Can accept any number of arguments
 * (...args: any[]) => any
 * ```
 *
 * **`call` returned function:**
 * ```typescript  
 * // Only accepts single argument
 * (arg: any) => any
 * ```
 *
 * ## Summary
 *
 * | Aspect | bind Approach | call Approach |
 * |--------|---------------|---------------|
 * | Argument Flexibility | High - multiple args per call | Low - single arg after first |
 * | Implementation | Native bind method | Manual wrapper functions |
 * | Predictability | Less predictable | More predictable |
 * | Control | JavaScript handles it | Developer controls it |
 * | Use Case | General-purpose currying | Strict single-argument currying |
 *
 * ## Bottom Line
 *
 * **Without considering `undefined` handling:**
 *
 * - **`bind` approach** = More flexible, JavaScript-native, supports multiple arguments per call
 * - **`call` approach** = More controlled, predictable single-argument pattern, explicit argument management
 *
 * The `bind` approach is more **versatile**, while the `call` approach is more **rigid** but gives you **explicit control** over the currying process.
 */

// ============================================================================
// PRACTICAL EXAMPLES: Setting First Argument of a Function
// ============================================================================

// How can I set first arg of a function, say sum of 2 numbers to 5 and 
// then call this new function with last arg as 3?

const sum = (a: number, b: number) => a + b;

// Method 1: Manual wrapper function
const fivePlusSum = (arg: number) => sum(5, arg);
fivePlusSum(3); // 8

// Method 2: Using call
const fivePlusSum3 = (arg: number) => sum.call(null, 5, arg);
fivePlusSum3(3); // 8

/**
 * Method 3: Using bind
 * For a given function, creates a bound function that has the same body as the original function. 
 * The this object of the bound function is associated with the specified object, 
 * and has the specified initial parameters.
 * @param thisArg — The object to be used as the this object.
 * @param args — Arguments to bind to the parameters of the function.
 */
const fivePlusSum2 = sum.bind(null, 5);
fivePlusSum2(3); // 8
