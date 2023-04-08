// Runtime Complexity
// Linear, O(m+n) where ‘m’ is number of rows and ‘n’ is number of columns.

// Memory Complexity
// Constant, O(1).

let search_in_matrix = function(matrix, value) {
    let M = matrix.length; // rows
    let N = matrix[0].length; // columns
  
    // Let's start searching from top right.
    // Alternatively, searching from bottom left
    // i.e. matrix[M-1][0] can also work.
  
    let i = 0;
    let j = N - 1;
  
    while (i < M && j >= 0) { 
      if (matrix[i][j] === value) {
        return [i, j];
      } else if (value < matrix[i][j]) {
        // search left
        j = j - 1;
      } else {
        // search down
        i = i + 1;
      }
    }
    return [-1, -1];
  };
  
  console.log("");
  console.log("");
  console.log("+++++++++++++++++++++++++++++++++++++++");
  console.log("Matrix Search");
  console.log("---------------------------------------");
  let matrix = [
  [1, 5, 45, 80, 81],
  [6, 7, 48, 82, 83],
  [20, 22, 49, 85, 86],
  [21, 23, 50, 90, 92]
      ];
  
  console.log("81 is at..");
  output = search_in_matrix(matrix,81);
  console.log(output);
  console.log("92 is at..");
  output = search_in_matrix(matrix,92);
  console.log(output);
  console.log("1 is at..");
  output = search_in_matrix(matrix,1);
  console.log(output);
  console.log("++++++ Test Done Successfully ++++++");