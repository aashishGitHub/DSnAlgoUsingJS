
// It accepts and Array of sorted numbers
// prints the pairs whose sum is 0
function sumZero(input) {
    if (!input || input.length == 0) {
        console.log("No such pair")
    }

    var start = 0;
    var end = input.length - 1;

    while (start < end) {
        var sum = input[start] + input[end];
        if (sum == 0) {
            console.log(`${input[start]} and ${input[end]}`);
            start++;
        } else if (sum < 0) {
            // if the sum is -ve, then make it +ve by moving the start to right
            start++;
        } else {
            end--;
        }
    }
}

sumZero([-3,-2, -1, 0, 1, 2, 3, 4, 6]);