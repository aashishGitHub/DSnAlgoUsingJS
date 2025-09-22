// I want to implement debounce in TypeScript
function debounce(func: Function, delay: number) {
  let timeoutId: number;
  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
