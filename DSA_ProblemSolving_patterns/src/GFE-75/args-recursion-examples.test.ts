import { describe, test, expect } from 'vitest';
import { pipe } from "./args-recursion-examples";

/**
 * TESTS for ...args Recursion Examples
 * Progressive complexity from simple to business use cases
 */

// ============================================================================
// LEVEL 1: SIMPLE ACCUMULATOR TESTS
// ============================================================================

describe("Level 1: Simple Accumulator Examples", () => {
  // Simple Sum Accumulator
  function sum(...args: number[]): number {
    if (args.length === 0) return 0;
    if (args.length === 1) return args[0];

    const [first, ...rest] = args;
    return first + sum(...rest);
  }

  test("sum function", () => {
    expect(sum()).toBe(0);
    expect(sum(5)).toBe(5);
    expect(sum(1, 2, 3, 4)).toBe(10);
    expect(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)).toBe(55);
  });

  // Find Maximum
  function findMax(...args: number[]): number {
    if (args.length === 0) return -Infinity;
    if (args.length === 1) return args[0];

    const [first, ...rest] = args;
    const maxOfRest = findMax(...rest);
    return first > maxOfRest ? first : maxOfRest;
  }

  test("findMax function", () => {
    expect(findMax()).toBe(-Infinity);
    expect(findMax(5)).toBe(5);
    expect(findMax(5, 2, 8, 1, 9, 3)).toBe(9);
    expect(findMax(-1, -5, -2)).toBe(-1);
  });

  // String Concatenator
  function concat(...args: string[]): string {
    if (args.length === 0) return "";
    if (args.length === 1) return args[0];

    const [first, ...rest] = args;
    return first + concat(...rest);
  }

  test("concat function", () => {
    expect(concat()).toBe("");
    expect(concat("Hello")).toBe("Hello");
    expect(concat("Hello", " ", "World", "!")).toBe("Hello World!");
  });
});

// ============================================================================
// LEVEL 2: INTERMEDIATE TRANSFORMATION TESTS
// ============================================================================

describe("Level 2: Intermediate Transformation Examples", () => {
  // Recursive Filter
  function recursiveFilter<T>(
    predicate: (item: T) => boolean,
    ...args: T[]
  ): T[] {
    if (args.length === 0) return [];

    const [first, ...rest] = args;
    const filteredRest = recursiveFilter(predicate, ...rest);

    return predicate(first) ? [first, ...filteredRest] : filteredRest;
  }

  test("recursiveFilter function", () => {
    const isEven = (n: number) => n % 2 === 0;
    const isPositive = (n: number) => n > 0;

    expect(recursiveFilter(isEven)).toEqual([]);
    expect(recursiveFilter(isEven, 1, 2, 3, 4, 5, 6)).toEqual([2, 4, 6]);
    expect(recursiveFilter(isPositive, -2, -1, 0, 1, 2)).toEqual([1, 2]);
  });

  // Recursive Map
  function recursiveMap<T, U>(transform: (item: T) => U, ...args: T[]): U[] {
    if (args.length === 0) return [];

    const [first, ...rest] = args;
    return [transform(first), ...recursiveMap(transform, ...rest)];
  }

  test("recursiveMap function", () => {
    const double = (n: number) => n * 2;
    const toString = (n: number) => n.toString();

    expect(recursiveMap(double)).toEqual([]);
    expect(recursiveMap(double, 1, 2, 3, 4)).toEqual([2, 4, 6, 8]);
    expect(recursiveMap(toString, 1, 2, 3)).toEqual(["1", "2", "3"]);
  });
});

// ============================================================================
// LEVEL 3: ADVANCED FUNCTION COMPOSITION TESTS
// ============================================================================

describe("Level 3: Advanced Function Composition", () => {
  // Recursive Compose
  function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    if (fns.length === 0) return (x: T) => x;
    if (fns.length === 1) return fns[0];

    const [first, ...rest] = fns;
    const composedRest = compose(...rest);

    return (x: T) => first(composedRest(x));
  }

  test("compose function", () => {
    const addOne = (x: number) => x + 1;
    const multiplyByTwo = (x: number) => x * 2;
    const square = (x: number) => x * x;

    // Identity function
    const identity = compose<number>();
    expect(identity(5)).toBe(5);

    // Single function
    const singleFn = compose(addOne);
    expect(singleFn(5)).toBe(6);

    // Multiple functions: square(multiplyByTwo(addOne(x)))
    const composedFn = compose(square, multiplyByTwo, addOne);
    expect(composedFn(5)).toBe(144); // ((5+1)*2)^2 = (6*2)^2 = 12^2 = 144
  });

  test("pipe function", () => {
    const addOne = (x: number) => x + 1;
    const multiplyByTwo = (x: number) => x * 2;
    const square = (x: number) => x * x;

    // Identity function
    const identity = pipe<number>();
    expect(identity(5)).toBe(5);

    // Single function
    const singleFn = pipe(addOne);
    expect(singleFn(5)).toBe(6);

    // Multiple functions: square(multiplyByTwo(addOne(x)))
    const pipedFn = pipe(addOne, multiplyByTwo, square);
    expect(pipedFn(5)).toBe(144); // square(multiplyByTwo(addOne(5))) = square(12) = 144
  });
});

// ============================================================================
// LEVEL 4: BUSINESS USE CASE TESTS
// ============================================================================

describe('Level 4: Business Use Cases', () => {
  
  // Data Transformation Pipeline
  interface DataTransform<T> {
    name: string;
    transform: (data: T) => T;
  }

  function createDataPipeline<T>(...transforms: DataTransform<T>[]) {
    return function processPipeline(data: T): T {
      function applyTransforms(currentData: T, index: number): T {
        if (index >= transforms.length) {
          return currentData;
        }
        
        const { transform } = transforms[index];
        const transformedData = transform(currentData);
        return applyTransforms(transformedData, index + 1);
      }
      
      return applyTransforms(data, 0);
    };
  }

  test('data transformation pipeline', () => {
    const normalizeEmail: DataTransform<any> = {
      name: "normalizeEmail",
      transform: (data) => ({
        ...data,
        email: data.email?.toLowerCase().trim()
      })
    };

    const validateAge: DataTransform<any> = {
      name: "validateAge", 
      transform: (data) => ({
        ...data,
        age: Math.max(0, Math.min(120, data.age || 0))
      })
    };

    const addTimestamp: DataTransform<any> = {
      name: "addTimestamp",
      transform: (data) => ({
        ...data,
        processed: true
      })
    };

    const pipeline = createDataPipeline(normalizeEmail, validateAge, addTimestamp);

    const userData = {
      email: "  JOHN.DOE@EXAMPLE.COM  ",
      age: 150,
      name: "John Doe"
    };

    const result = pipeline(userData);
    
    expect(result.email).toBe("john.doe@example.com");
    expect(result.age).toBe(120); // Clamped to max
    expect(result.processed).toBe(true);
    expect(result.name).toBe("John Doe");
  });

  // Event Handler Chain
  type Event = { type: string; target: string; data: any };
  type EventHandler = (event: Event) => boolean;

  function createEventChain(...handlers: EventHandler[]) {
    return function handleEvent(event: Event): boolean {
      function executeHandlers(index: number): boolean {
        if (index >= handlers.length) {
          return true;
        }
        
        const handler = handlers[index];
        const shouldContinue = handler(event);
        
        if (shouldContinue === false) {
          return false;
        }
        
        return executeHandlers(index + 1);
      }
      
      return executeHandlers(0);
    };
  }

  test('event handler chain', () => {
    const results: string[] = [];

    const securityHandler: EventHandler = (event) => {
      results.push("security");
      if (event.type === "dangerous_action") {
        return false; // Stop propagation
      }
      return true;
    };

    const analyticsHandler: EventHandler = (event) => {
      results.push("analytics");
      return true;
    };

    const businessLogicHandler: EventHandler = (event) => {
      results.push("business");
      return true;
    };

    const eventChain = createEventChain(securityHandler, analyticsHandler, businessLogicHandler);

    // Test safe event - should execute all handlers
    results.length = 0;
    const safeResult = eventChain({ type: "user_click", target: "button", data: {} });
    expect(safeResult).toBe(true);
    expect(results).toEqual(["security", "analytics", "business"]);

    // Test dangerous event - should stop at security
    results.length = 0;
    const dangerousResult = eventChain({ type: "dangerous_action", target: "admin_panel", data: {} });
    expect(dangerousResult).toBe(false);
    expect(results).toEqual(["security"]); // Stopped here
  });
});

// ============================================================================
// PERFORMANCE AND EDGE CASE TESTS
// ============================================================================

describe('Performance and Edge Cases', () => {
  
  function sum(...args: number[]): number {
    if (args.length === 0) return 0;
    if (args.length === 1) return args[0];
    
    const [first, ...rest] = args;
    return first + sum(...rest);
  }

  test('handles large number of arguments', () => {
    const largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
    const expected = (100 * 101) / 2; // Sum formula: n(n+1)/2
    expect(sum(...largeArray)).toBe(expected);
  });

  test('handles empty arguments gracefully', () => {
    expect(sum()).toBe(0);
  });

  test('handles single argument', () => {
    expect(sum(42)).toBe(42);
  });
});
