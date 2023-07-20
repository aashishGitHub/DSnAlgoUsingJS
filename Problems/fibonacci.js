let getFibonacci = function (n) {

    if (n === 0 || n === 1) {
        return n;
    }

    let n1 = 1;
    let n2 = 0;
    let res = 0;

    let i = 2;
    while (i <= n) {
        res = n1 + n2;
        n2 = n1;
        n1 = res;
        i++;
    }

    return res;
};

inputs = [1, 5, 7, 10]

for (let i = 0; i < inputs.length; i++) {
    console.log("getFibonacci(" + (inputs[i]) + ") = " + getFibonacci(inputs[i]))
}

/***    
 * Fibonacci sequence using recursion
 */

const fib = (n) => {
    if(n === 1 || n === 0) { 
        return n;
    }

    return fib(n - 1) + fib(n - 2);
}

let inputs2 = [1, 5, 7, 10]

for (let i = 0; i < inputs2.length; i++) {
    console.log("recursive fibonacci(" + (inputs2[i]) + ") = " + fib(inputs2[i]))
}
