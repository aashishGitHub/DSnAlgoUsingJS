import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import throttle from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes the callback immediately on the first call (leading edge)", () => {
    let i = 0;
    const throttled = throttle(() => i++, 100);

    throttled();
    expect(i).toBe(1);
  });

  it("ignores calls made during the wait window", () => {
    let i = 0;
    const throttled = throttle(() => i++, 100);

    throttled(); // t=0 → i=1
    vi.advanceTimersByTime(50);
    throttled(); // t=50 → still throttled, i stays 1
    expect(i).toBe(1);
  });

  it("allows the callback again after the wait duration elapses", () => {
    let i = 0;
    const throttled = throttle(() => i++, 100);

    throttled(); // t=0 → i=1
    vi.advanceTimersByTime(101); // wait window passes
    throttled(); // now allowed → i=2
    expect(i).toBe(2);
  });

  it("forwards arguments and `this` to the callback", () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);
    const context = { label: "ctx" };

    throttled.call(context, "a", "b");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("a", "b");
    expect(spy.mock.instances[0]).toBe(context);
  });

  it("throttles a burst to one leading call, then allows one more after the window", () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled(); // t=0   → fires (leading)
    vi.advanceTimersByTime(30);
    throttled(); // t=30  → throttled
    vi.advanceTimersByTime(30);
    throttled(); // t=60  → throttled
    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50); // t=110 → the wait window (100ms) has elapsed
    throttled(); // t=110 → fires again
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
