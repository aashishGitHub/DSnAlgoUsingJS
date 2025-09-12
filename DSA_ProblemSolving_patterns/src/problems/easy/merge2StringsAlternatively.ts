export function mergeAlternately(word1: string, word2: string): string {
    let shortestLength = Math.min(word1.length, word2.length);
    let i = 0;
    let result = '';
    while(i < shortestLength) {
        result+=word1[i];
        result+= word2[i];
        i++;
    }

    if(i < word1.length) {
        result+= word1.slice(i);
    }
     if(i < word2.length) {
        result+= word2.slice(i);
    }

    return result;

};