// I want to implement debounce in TypeScript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: any, ...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// test it like this

// let i = 0;
// function increment() {
//   i++;
//   console.log(i);
// }

// const debInc = debounce(increment, 10);
// debInc(); // at t=0, the log should not be printed
// debInc(); // gets ignored

// setTimeout(() => debInc(), 1000);
// debInc();
// debInc();

// console.log('hello');

// JS Implementation

// function debounce(func, delay) {
//   let timeOutId = null;

//   return function (...args) {
//     if (timeOutId) {
//       clearTimeout(timeOutId);
//     }

//     timeOutId = setTimeout(() => {
//       func.apply(args);
//     }, delay);
//   };
// }
