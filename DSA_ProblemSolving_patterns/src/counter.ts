import { threeSum2 } from "./problems/2Pointers/3Sum.ts";
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    // const nums = [1, 1, 2];
    // const result = removeDuplicates3(nums);
    // console.log(result);

    const nums = [-1, 0, 1, 2, -1, -4];
    const result = threeSum2(nums);
    console.log(result);
    element.innerHTML = `count is ${counter} 
    result: ${result}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
