function removeStars_Buggy(s) {
    let removeLength = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === '*') {
            removeLength++;
            s = s.slice(0, i) + s.slice(i + 1);
        } else {
            while (removeLength > 0 && i >= 0 && s[i] !=='*') {
                s = s.slice(0, i) + s.slice(i + 1)
                i--;
                removeLength--;
            }
        }
    }
    return s;
}
removeStars_Buggy("g*****x*");

// ******* How It Solves the Problem  ******* 

// Counting Stars: By counting the stars as you traverse the array from right to left, you ensure that you know how many non-star characters need to be removed.
// Marking Characters for Removal: By marking characters for removal (setting them to '*'), you effectively remove the closest non-star character to the left of each star.
// Filtering and Joining: Finally, by filtering out all stars and joining the array, you get the desired string with all stars and their corresponding closest non-star characters removed.

function removeStarsSolved(s: string): string {
    let sArr = s.split('');
    let stars = 0;
    for(let i = sArr.length -1 ; i >= 0; i--) {
        if(sArr[i] === '*') {
            stars++;
        }
        else if (stars) {
            sArr[i] = '*';
            stars--;
        }
    }

    return sArr.filter(x => x !== '*').join('');
};

// explanation:
// The provided function removeStars solves the problem by using a two-pass approach. Here's a step-by-step explanation of how it works:

// Step-by-Step Explanation
// Convert the String to an Array:

// The string s is converted into an array sArr to facilitate easy manipulation of individual characters.
// Initialize a Counter for Stars:

// A variable stars is initialized to keep track of the number of stars encountered.
// Traverse the Array from Right to Left:

// The array sArr is traversed from the last character to the first character.
// Count Stars and Mark Characters for Removal:

// stars--;
// If the current character is a star (*), increment the stars counter.
// If the current character is not a star and there are stars to be processed (stars > 0), mark the current character for removal by setting it to '*' and decrement the stars counter.
// Filter Out All Stars and Join the Array:

// After the traversal, filter out all the stars from the array.
// Join the remaining characters to form the resulting string.
// How It Solves the Problem
// Counting Stars: By counting the stars as you traverse the array from right to left, you ensure that you know how many non-star characters need to be removed.
// Marking Characters for Removal: By marking characters for removal (setting them to '*'), you effectively remove the closest non-star character to the left of each star.
// Filtering and Joining: Finally, by filtering out all stars and joining the array, you get the desired string with all stars and their corresponding closest non-star characters removed.
// Example Walkthrough
// For the input s = "leet**cod*e":

// Convert to array: sArr = ['l', 'e', 'e', 't', '*', '*', 'c', 'o', 'd', '*', 'e']
// Traverse from right to left:
// i = 10: sArr[10] = 'e' (no change, stars = 0)
// i = 9: sArr[9] = '*' (stars = 1)
// i = 8: sArr[8] = 'd' (sArr[8] = '*', stars = 0)
// i = 7: sArr[7] = 'o' (no change, stars = 0)
// i = 6: sArr[6] = 'c' (no change, stars = 0)
// i = 5: sArr[5] = '*' (stars = 1)
// i = 4: sArr[4] = '*' (stars = 2)
// i = 3: sArr[3] = 't' (sArr[3] = '*', stars = 1)
// i = 2: sArr[2] = 'e' (sArr[2] = '*', stars = 0)
// i = 1: sArr[1] = 'e' (no change, stars = 0)
// i = 0: sArr[0] = 'l' (no change, stars = 0)
// Filter and join: sArr = ['l', 'e', '*', '*', '*', '*', 'c', 'o', '*', 'e'] -> ['l', 'e', 'c', 'o', 'e'] -> "lecoe"
// Thus, the function correctly returns "lecoe" for the input "leet**cod*e".


// Simple solution using STACK
function removeStars(s: string): string {
    let sArr = s.split('');
    let stars = 0;
    for(let i = sArr.length -1 ; i >= 0; i--) {
        if(sArr[i] === '*') {
            stars++;
        }
        else if (stars) {
            sArr[i] = '*';
            stars--;
        }
    }

    return sArr.filter(x => x !== '*').join('');
};