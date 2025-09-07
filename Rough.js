/* move 0s to end while keeping the order of non 0 the same

const input = [0,1,0,3,12]
 */


// function moveZero(input) {
//     let zeroTracker = null;  // null | number
//
//     for(let i = 0; i<input.length; i++) {
//        // first find zeroTracker
//         if(zeroTracker === null) {
//             if(input[i] === 0) { // [1,0,1]
//                 zeroTracker = i;
//             }
//             continue;
//         }
//
//         // [0,1,0]
//         if(input[i] !==0){
//             [input[zeroTracker] ,input[i]] = [input[i], input[zeroTracker]];
//             zeroTracker = i;
//         }
//     }
//     return input;
// }

function moveZero(input) {
    let zeroTracker = 0;

    for(let i = 0; i<input.length; i++) {
        // [0,1,0]
        if(input[i] !==0){
            [input[zeroTracker] ,input[i]] = [input[i], input[zeroTracker]];
            zeroTracker++;
        }
    }
    return input;
}


console.log(moveZero([0,1,0,3,12]));

/*
[0,1,0,3,10]
[1,0,0,3,12]
[1,3,0,0,12]
[1,3,12,0,0]


[1,0,2,0,3]
[1,0,2,0,3]
[1,2,0,0,3]
[1,2,3,0,0]
 */