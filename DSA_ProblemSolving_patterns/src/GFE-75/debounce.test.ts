import { debounce } from "./debounce";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Run manually:
// cd /Users/aashishkumar/Documents/GitHub/DSnAlgoUsingJS/DSA_ProblemSolving_patterns
//  npm test -- debounce.test.ts
describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns a function", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);
    expect(debounced).toBeInstanceOf(Function);
  });

  test("calls the function after the specified delay", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("does not call the function before the delay", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("resets the timer on subsequent calls", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    vi.advanceTimersByTime(50);

    debounced(); // Reset timer
    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("only executes once after multiple rapid calls", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    debounced();
    debounced();
    debounced();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("passes arguments to the debounced function", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced("hello", "world", 123);
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith("hello", "world", 123);
  });

  test("uses the latest arguments when called multiple times", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced("first");
    vi.advanceTimersByTime(50);

    debounced("second");
    vi.advanceTimersByTime(50);

    debounced("third");
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("third");
  });

  test("handles multiple separate debounce cycles", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    // First cycle
    debounced("first");
    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("first");

    // Second cycle
    debounced("second");
    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith("second");
  });

  test("works with different delay times", () => {
    const func = vi.fn();
    const debounced = debounce(func, 500);

    debounced();
    vi.advanceTimersByTime(400);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("handles functions with return values", () => {
    const func = vi.fn(() => "result");
    const debounced = debounce(func, 100);

    debounced();
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalled();
    expect(func()).toBe("result");
  });

  test("works with complex arguments", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    const obj = { name: "test" };
    const arr = [1, 2, 3];
    debounced(obj, arr, null, undefined, 42);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledWith(obj, arr, null, undefined, 42);
  });

  test("handles rapid succession calls correctly", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    // Simulate rapid typing
    for (let i = 0; i < 10; i++) {
      debounced(`call-${i}`);
      vi.advanceTimersByTime(30); // Each call 30ms apart
    }

    // Should not have been called yet
    expect(func).not.toHaveBeenCalled();

    // Wait for the final delay
    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("call-9");
  });

  test("works with zero delay", () => {
    const func = vi.fn();
    const debounced = debounce(func, 0);

    debounced();
    vi.advanceTimersByTime(0);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("cancels previous timeout on new call", () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced("first");
    vi.advanceTimersByTime(99); // Almost done

    debounced("second"); // This should cancel the first
    vi.advanceTimersByTime(1); // Complete the first timeout

    expect(func).not.toHaveBeenCalled(); // First was cancelled

    vi.advanceTimersByTime(99); // Complete the second timeout
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("second");
  });
});
