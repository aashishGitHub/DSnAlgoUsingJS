
// Find Longest Substring Without Repeating Characters: Given a string, 
// find the length of the longest substring without repeating characters

const input1 = "albcadbk" // 4 for "bcadk"

//Try 1st But Buggy as the repeat char needs to be removed
const lcsNoDuplicate_BuggyTrial = (str) => {
    let result = [];
    let low = 0;
    let max = 0;
    const set1 = new Set();

    let i = 0;

    while (i < str.length) {
        if (!set1.has(str.charAt(i))) {
            set1.add(str.charAt(i));

        } else {
            low++;

        }
        max = Math.max(max, i - low + 1);
        i++;
    }

    return max;
}


const input = "aabcdampljd" // low:5  max:8 means 
const lcsNoDuplicate = (str) => {
    let low = 0;
    let max = 0;
    const set1 = new Set();

    for (let i = 0; i < str.length; i++) {

        // if the repeat char is found inbetween the 1st few characters, then remove from start(low) until there is no duplicates
        while (set1.has(str.charAt(i))) {
            const lowItem = str.charAt(low);
            set1.delete(lowItem);
            low += 1;
        }
        // Add the new character to the set list
        set1.add(str.charAt(i));

        max = Math.max(max, i - low + 1);
    }
    return { max, low };

}
const result = lcsNoDuplicate(input);
console.log(result.max);

// #include<bits/stdc++.h>
// using namespace std;
// int main(){
//     string s;
//     cin>>s;
//     int n = s.size(), i=0, j=0, ans=0;
//     unordered_set<char> st;
//     while(j<n){
//         while(!st.empty() && st.find(s[j]) != st.end()){
//             st.erase(s[i]);
//             i++;
//         }
//         st.insert(s[j]);
//         ans = max(ans, j-i+1);
//         j++;
//     }
//     cout<<ans;
// }