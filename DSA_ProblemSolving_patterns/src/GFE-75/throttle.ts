// https://www.greatfrontend.com/interviews/study/gfe75/questions/javascript/throttle

// Throttling is a technique used to control how many times we allow a function to be executed over time.
//  When a JavaScript function is said to be throttled with a wait time of X milliseconds, 
// it can only be invoked at most once every X milliseconds.
// The callback is invoked immediately and cannot be invoked again for the rest of the wait duration.

// Implement a throttle function which accepts a callback function and a wait duration. Calling throttle() returns a function which throttled invocations of the callback function following the behavior described above.

// let i = 0;
// function increment() {
//   i++;
// }
// const throttledIncrement = throttle(increment, 100);

// // t = 0: Call throttledIncrement(). i is now 1.
// throttledIncrement(); // i = 1

// // t = 50: Call throttledIncrement() again.
// //  i is still 1 because 100ms have not passed.
// throttledIncrement(); // i = 1

// // t = 101: Call throttledIncrement() again. i is now 2.
// //  i can be incremented because it has been more than 100ms
// //  since the last throttledIncrement() call at t = 0.
// throttledIncrement(); // i = 2

type ThrottleFunction<T extends any[]> = (this: any, ...args: T) => any;

export default function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  wait: number,
): ThrottleFunction<T> {
  let shouldThrottle = false;

  return function (...args) {
    if (shouldThrottle) {
      return;
    }

    shouldThrottle = true;
    setTimeout(function () {
      shouldThrottle = false;
    }, wait);

    func.apply(this, args);
  };
}


/**
 * @callback func
 * @param {number} wait
 * @return {Function}
 */
// export default function throttle(func, wait = 0) {
//   let shouldThrottle = false;

//   return function (...args) {
//     if (shouldThrottle) {
//       return;
//     }

//     shouldThrottle = true;
//     setTimeout(function () {
//       shouldThrottle = false;
//     }, wait);

//     func.apply(this, args);
//   };
// }


