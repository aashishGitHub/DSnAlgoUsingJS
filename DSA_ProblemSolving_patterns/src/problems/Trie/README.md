# Trie / Prefix Tree Pattern

**When to Use**: anything about PREFIXES — autocomplete, "starts with", wildcard
word search, finding many words at once in a grid or text.
**Time Complexity**: O(L) per operation (L = query length) | **Space**: O(N · L)

## Why a trie and not a hash set

A hash set gives O(1) exact lookup but **cannot answer prefix questions at all** —
hashing destroys the prefix relationship, so `"app"` and `"apple"` land in
unrelated buckets. A trie keeps prefixes structurally adjacent, and its query
cost depends only on the query length, *not* on how many words are stored.

## Files

- **`triePatterns.ts`**
  - `TrieNode` — `children: Map<string, TrieNode>` + `isEnd`
  - `Trie` — LC208: `insert` / `search` / `startsWith`
  - `WordDictionary` — LC211: `.` wildcard turns the walk into a branching DFS
  - `findWords` — LC212 Word Search II: the trie as a **pruning oracle**

## The one thing to get right: `isEnd`

Inserting `"apple"` creates a node for `"app"` as a by-product. Without an
explicit `isEnd` flag, `search("app")` wrongly returns `true`. **`isEnd` is the
entire difference between `search` and `startsWith`** — say it before coding.

## The LC212 insight

Running Word Search once per word re-walks shared prefixes over and over. Put
all words in a trie, walk the grid **once** carrying a trie pointer, and abandon
a branch the moment no word shares the current prefix. The trie is not storage
here — it is the pruning.

## Related

- [`../Backtracking/`](../Backtracking/) — `exist` (LC79) is LC212 for a single word
- [`../IslandsMatrix/`](../IslandsMatrix/) — the other grid-DFS family

> **Tests:** no vitest file yet. Verified against LeetCode samples (including
> that `findWords` restores the board it mutates), but that check is not committed.
