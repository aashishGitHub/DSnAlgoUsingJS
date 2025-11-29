function isSubsequence(s: string, t: string): boolean {
    let sp = 0, tp = 0

    while (sp < s.length && tp < t.length) {
        if (s[sp] === t[tp]) sp++
        tp++
    }

    return sp === s.length
};

// my solution
function isSubsequence2(s: string, t: string): boolean {
    let p1 = 0;

    for(let p2 = 0; p2< t.length; p2++) {
        if(s[p1] === t[p2]) {
            p1++;
        }
    }
    if(p1 === s.length) {
        return true;
    }
    return false;
};



console.log(isSubsequence("abc", "anbkch"));
  