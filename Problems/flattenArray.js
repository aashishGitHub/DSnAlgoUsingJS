
function flatten(arr) {
    return arr.flat(Infinity)
}

const numArr = [1, [2, [3], 4, [5, 6, [7]]]];

flatten(numArr) // [1, 2, 3, 4, 5, 6, 7]

// 2. Using Recursion and Reduce
function flatten(arr) {
    const newArr = arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
            acc = acc.concat(flatten(item));
        } else {
            acc.push(item);
        }

        return acc;
    }, []);

    return newArr;
}

const numArr2 = [1, [2, [3], 4, [5, 6, [7]]]];

flatten(numArr2) // [1, 2, 3, 4, 5, 6, 7]