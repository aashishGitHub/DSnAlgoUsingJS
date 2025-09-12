
function flatten(arr) {
    return arr.flat(Infinity)
}

const numArr = [1, [2, [3], 4, [5, 6, [7]]]];

flatten(numArr) // [1, 2, 3, 4, 5, 6, 7]

// 2. Using Recursion and Reduce
function flatten(arr) {
    const newArr = arr.reduce((acc, item) => {
        if (Array.isArray(item)) {

            //(method) Array<any>.concat(...items: ConcatArray<any>[]): any[] (+1 overload)
            //Combines two or more arrays.This method returns a new array without modifying any existing arrays.
            //@paramitems — Additional arrays and / or items to add to the end of the array.
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


// See the many solutions in solutions section of https://www.greatfrontend.com/questions/javascript/flatten
