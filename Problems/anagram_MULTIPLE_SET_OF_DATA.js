/*
This approach is useful whenever you have multiple sets of data, and we have to check if they are same/related if they are same values squared
or somehow mapped by some formula.
*/

function validAnagram(first, second) {
    if (first.length !== second.length) {
      return false;
    }
  
    const lookup = {};
  
    for (let i = 0; i < first.length; i++) {
      let letter = first[i];
      // if letter exists, increment, otherwise set to 1
      lookup[letter] ? lookup[letter] += 1 : lookup[letter] = 1;
    }
    console.log(lookup)
  
    for (let i = 0; i < second.length; i++) {
      let letter = second[i];
      // can't find letter or letter is zero then it's not an anagram
      if (!lookup[letter]) {
        return false;
      } else {
        // this is not required for this solution, it is only for future use
        // lookup[letter] -= 1;
      }
    }
  
    return true;
  }
  
  // {a: 0, n: 0, g: 0, r: 0, m: 0,s:1}
  validAnagram('anagrams', 'nagaramm')


// gpt solution
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const map = {};
  for (const char of s) {
    map[char] = (map[char] || 0) + 1;
  }
  for (const cha                                                                                                                                                   r of t) {
    if (!map[char]) return false;
    map[char]--;
  }
  return true;
}

