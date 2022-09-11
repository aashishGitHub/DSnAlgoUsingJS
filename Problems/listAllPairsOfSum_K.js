let arr = [1, 3, 2, 6, 1, 8, 9, 3, 6, 7, 2, 8, 6, 5];
let k = 8;
// output {1,7}, {3, 5}, {2,6}, etc
// rough
/*
hash = {
    key: value
    {7: 1},
    {5: 3,
    {6: 2}, 
    {2: 6},
    {1: 7},
    ...
}
*/
function listAllPairsOfSum_K(arr, k) {
  let hash = {};
  let result = [[]];
  arr.forEach((element) => {
    if (hash[element]) {
      result.push([element, hash[element]]);
    } else {
      hash[k - element] = element;
    }
  });
  return result;
}
let result = listAllUniquePairsOfSum_K(arr, k);
console.log(result);
