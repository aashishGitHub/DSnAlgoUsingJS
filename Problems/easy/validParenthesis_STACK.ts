
const closingBrackets = [')', '}', ']' ];
const openingBrackets = ['(', '{', '['];
function isPair(start: string | undefined, end: string) {
  if(!start){
    return false;
  }
  return openingBrackets.indexOf(start) !==-1 && openingBrackets.indexOf(start) === closingBrackets.indexOf(end);
}

function isValid(s: string): boolean {
  
  const stack: string[] = [];
  
    for (let item of s) {
      if(stack.length > 0 && closingBrackets.includes(item)) {
        // closing bracket is found
        const lastItem = stack.pop();
        if(isPair(lastItem, item)) {
         
          continue;
        } else {
          return false;
        }
      } else {
        // opening bracket is found
        stack.push(item);
      }
    }
    return stack.length ===0;
}

console.log(isValid('((})){{[}]'));