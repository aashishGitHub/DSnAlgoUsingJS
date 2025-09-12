// Recursive Programs to find Minimum and Maximum elements of array
/*
Input: arr = {1, 4, 3, -5, -4, 8, 6};
Output: min = -5, max = 8

Input: arr = {1, 4, 45, 6, 10, -8};
Output: min = -8, max = 45
*/

function findMinRec(A, n) 
{ 
      
    // If size = 0 means whole 
    // array has been traversed 
    if (n == 1) 
        return A[0]; 
          
    return Math.min(A[n - 1],  findMinRec(A, n - 1)); 
} 
  
// Driver Code 
let A1 = [ 1, 4, 45, 6, -50, 10, 2 ]; 
let n1 = A.length; 
  
console.log( findMinRec(A1, n1));  // -50

//////////////////// MMMM AAAAA XXXXXX

function findMaxRec(A, n) 
{ 
      
    // If size = 0 means whole array 
    // has been traversed 
    if (n == 1) 
        return A[0]; 
      
    return Math.max(A[n - 1],  
        findMaxRec(A, n - 1)); 
} 
  
// Driver code 
let A2 = [ 1, 4, 45, 6, -50, 10, 2 ]; 
let n2 = A.length; 
  
// Function calling 
console.log( findMaxRec(A2, n2));  // -50
