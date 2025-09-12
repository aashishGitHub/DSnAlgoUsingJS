//Input: arr = [8, 7, 2, 5, 3, 1] sum = 10

const getPiars = (arr, k) => {

    const hash = {};
    const result = [];

    for (let i = 0; i < arr.length; i++) {

        if (hash[arr[i]]) {

            result.push([arr[i], k - arr[i]])
        } else {
            hash[k - arr[i]] = 1;
        }
    }

    return result;

}
const r = getPiars([2, 5, 17, -1], 7);
console.log(r);

const get2Sum = (arr, k) => {
    const hash = {};

    for (let i = 0; i < arr.length; i++) {
        if (k-hash[arr[i]]) {

            result.push([arr[i], k - arr[i]])
        } else {
            hash[arr[i]] = 1;
        }
    }

}

