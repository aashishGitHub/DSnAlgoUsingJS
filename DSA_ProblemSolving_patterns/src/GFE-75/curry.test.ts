import { curry, curryWithUndefinedHandling } from './curry';
import { describe, test, expect } from 'vitest';



const empty = () => 0;
const square = (a: number) => a * a;
const mul = (a: number, b: number) => a * b;
const add = (a: number, b: number) => a + b;
const joinThree = (a: string, b: string, c: string) => `${a}-${b}-${c}`;

describe('Original curry implementation', () => {
  test('returns function', () => {
    const curried = curry(square);
    expect(curried).toBeInstanceOf(Function);
  });

  test('empty function', () => {
    const curried = curry(empty);
    expect(curried()).toBe(0);
  });

  test('single argument', () => {
    const curried = curry(square);
    expect(curried()).toBeInstanceOf(Function);
    expect(curried(2)).toBe(4);
  });

  test('two arguments', () => {
    const curried = curry(mul);
    expect(curried()).toBeInstanceOf(Function);
    expect(curried(7)(3)).toBe(21);
  });

  test('multiple arguments in one call', () => {
    const curried = curry(mul);
    expect(curried(7, 3)).toBe(21);
  });

  test('mixed argument calls', () => {
    const curried = curry(joinThree);
    expect(curried('A')('B')('C')).toBe('A-B-C');
    expect(curried('A', 'B')('C')).toBe('A-B-C');

    // expect(curried('A')('')('C')).toBe('A-C');
  });

  test('function reuse', () => {
    const curriedAdd = curry(add);
    const addFive = curriedAdd(5);
    expect(addFive(3)).toBe(8);
    expect(addFive(10)).toBe(15);
  });

  test('undefined treated as value', () => {
    const curriedAdd = curry(add);
    const addFive = curriedAdd(5);
    expect(addFive(undefined)).toBeNaN(); // 5 + undefined = NaN
  });
});

describe('New curry implementation (with undefined handling)', () => {
  test('basic functionality', () => {
    const curried = curryWithUndefinedHandling(mul);
    expect(curried(7)(3)).toBe(21);
  });

  test('undefined skipping', () => {
    const curriedAdd = curryWithUndefinedHandling(add);
    const addFive = curriedAdd(5);
    expect(addFive(undefined)).toBeInstanceOf(Function);
    expect(addFive(undefined)(3)).toBe(8);
    
  });

  test('multiple undefined skips', () => {
    const curried = curryWithUndefinedHandling(joinThree);
    const step1 = curried('A')(undefined);
    const step2 = step1('B');
    expect(step2(undefined)('C')).toBe('A-B-C');

    // expect(curried('A')(undefined)(undefined)).toBe('A')
    
    // expect(curried('A')(undefined)).toBe('A')
  });

  test('mixed argument calls', () => {
    const curried = curryWithUndefinedHandling(joinThree);
    expect(curried('A')('B')('C')).toBe('A-B-C');
    expect(curried('A', 'B')('C')).toBe('A-B-C');
  });

  test('function reuse', () => {
    const curriedAdd = curryWithUndefinedHandling(add);
    const addFive = curriedAdd(5);
    expect(addFive(3)).toBe(8);
    expect(addFive(10)).toBe(15);
  });

  test('immediate execution with sufficient args', () => {
    const curried = curryWithUndefinedHandling(mul);
    expect(curried(7, 3)).toBe(21);
  });
});
