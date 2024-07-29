function removeCharAtIndex(str, index) {
    if (index < 0 || index >= str.length) {
      return str; // Return the original string if the index is out of bounds
    }
    return str.slice(0, index) + str.slice(index + 1);
  }
  
  // Example usage:
  const originalString = "Hello, World!";
  const indexToRemove = 8;
  const newString = removeCharAtIndex(originalString, indexToRemove);
  console.log(newString); // Output: "Hello, Wold!"



// In this function:

// str.slice(0, index) gets the substring from the start of the string up to (but not including) the character at the given index.
// str.slice(index + 1) gets the substring from the character after the given index to the end of the string.
// Concatenating these two substrings results in the original string with the character at the given index removed.