/*
The stocks of a company are being surveyed to analyse the net profit of the company over a period of several months.
For an analysis parameter k, a group of k consecutive months is said to be highly profitable if the values of
 the stock prices are strictly increasing for those months. 
 Given the stock prices of the company for n months and the analysis parameter k, find the number of highly profitable months.
the stock prices be stockPrices = [5, 6, 5
    , 7, 8] and the analysis parameter be k = 3. 
answer is 2


Approach

 [1, 7, 3, 4, 8, 5, 7, 8]
              *
 iterate from the first item till k find the first qualifying sequence : brut force way
 
 check the next item in the input
    if it is < the last in the qualifying sequence, 
        start again from the next item and find the qualifying sequence
   
    if it is > the last in the qualifying sequence, 
        it implies that this is another QS 
        -- go repeat the same    
 
 
 Result will be the no of such QS 

*/

// Solution 1 : Brut force way
let arr = [1,2,3,5,1,77,8,4,2,9,12,56,83,3];

const increasingSequences = (arr, k) => {
    if (arr && arr.length <k) return []; // no sequence found 

    

}
