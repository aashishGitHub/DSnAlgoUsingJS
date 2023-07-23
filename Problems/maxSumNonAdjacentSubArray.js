/**
 * Solution 
Runtime complexity 
The runtime complexity of this solution is linear,  ( )O(n).

Memory complexity 
The memory complexity of this solution is linear,  ( )O(n).

A naive solution to this problem is to calculate the sum of all possible subsequences with no adjacent elements and keep track of the subsequence with the maximum sum. The time complexity of this approach is  ( 2)O(n​2​​).

This can be improved by using dynamic programming.
Iterate over the entire input array, and in every iteration pick the maximum of these two values:
	• Max Sum of the last iteration.
	• Max Sum of second last iteration + current iteration index.

    1 -1 6 -4 2 2

    0  0 0 0 0 0
    1 
    1  1
    1  1 7 
    1  1 7  7
    1  1 7  7  9
    1  1 7  7  9 9
    
    Max sum of nonadjacent subsequence: 9

 * 
 */
let findMaxSumNonadjacent = function (a) {
    if (a.length < 1) {
        return 0;
    } else if (a.length === 1) {
        return a[0];
    }

    let lengthA = a.length;
    let result = [];
    result.push(a[0]);

    for (var i = 1; i < lengthA; i++) {
        result.push(Math.max(a[i], result[i - 1]));
        if (i - 2 >= 0) {
            result[i] = Math.max(result[i], a[i] + result[i - 2]);
        }
    }

    return result[lengthA - 1];
};

let v = [1, -1, 6, -4, 2, 2]
let sum = findMaxSumNonadjacent(v);
console.log("Max sum of nonadjacent subsequence: " + sum);