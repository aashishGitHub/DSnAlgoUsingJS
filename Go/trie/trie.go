// Package trie stores strings by shared prefix.
//
// PATTERN         Trie (prefix tree)
// WHEN TO USE     autocomplete, "does any word start with…", wildcard search,
// and "match many words at once against a grid/stream".
// WASTE IT KILLS  Re-scanning every candidate word for every query. A hash set
// answers "is this an exact word?" in O(1) but cannot answer "is this a PREFIX
// of anything?" — that gap is the entire reason the trie exists.
//
// COMPLEXITY: insert/search are O(len(word)), independent of how many words are
// stored. Space is the tricky part — O(total characters) worst case, less when
// prefixes are shared.
//
// [26]*node vs map[byte]*node: the array is faster and needs no hashing but
// costs 26 pointers per node even for sparse data. Say the trade-off out loud;
// for a lowercase-only problem the array is the right default.
package trie

// ---------------------------------------------------------------------------
// Trie (LC208)
// ---------------------------------------------------------------------------

// Trie is a node and the whole tree at once — the root is just a node with no
// incoming edge.
type Trie struct {
	children [26]*Trie
	isWord   bool // true when a word ENDS here
}

func NewTrie() *Trie { return &Trie{} }

// Insert adds a word. O(len(word)).
func (t *Trie) Insert(word string) {
	node := t
	for i := 0; i < len(word); i++ {
		c := word[i] - 'a'
		if node.children[c] == nil {
			node.children[c] = &Trie{}
		}
		node = node.children[c]
	}
	node.isWord = true // "app" inside "apple" needs this flag to be findable
}

// find walks the trie and returns the node the string ends at, or nil.
func (t *Trie) find(s string) *Trie {
	node := t
	for i := 0; i < len(s); i++ {
		node = node.children[s[i]-'a']
		if node == nil {
			return nil
		}
	}
	return node
}

// Search reports whether the exact word was inserted. O(len(word)).
func (t *Trie) Search(word string) bool {
	node := t.find(word)
	return node != nil && node.isWord // reaching the node is not enough
}

// StartsWith reports whether any inserted word has this prefix. O(len(prefix)).
// This is the query a hash set cannot answer.
func (t *Trie) StartsWith(prefix string) bool {
	return t.find(prefix) != nil
}

// ---------------------------------------------------------------------------
// WordDictionary (LC211) — wildcards turn lookup into a search
// ---------------------------------------------------------------------------

// WordDictionary supports '.' matching any single character.
type WordDictionary struct {
	root *Trie
}

func NewWordDictionary() *WordDictionary { return &WordDictionary{root: &Trie{}} }

func (d *WordDictionary) AddWord(word string) { d.root.Insert(word) }

// Search handles '.' as a wildcard.
//
// A '.' forks the walk into up to 26 branches, so this is DFS with backtracking
// over the trie. Cost is O(len(word)) with no dots, up to O(26^dots · len) in
// the pathological case — the trie prunes hard in practice because a branch dies
// the moment no child exists.
func (d *WordDictionary) Search(word string) bool {
	var dfs func(node *Trie, i int) bool
	dfs = func(node *Trie, i int) bool {
		if node == nil {
			return false
		}
		if i == len(word) {
			return node.isWord
		}
		if word[i] != '.' {
			return dfs(node.children[word[i]-'a'], i+1)
		}
		for _, child := range node.children { // wildcard: try every branch
			if dfs(child, i+1) {
				return true
			}
		}
		return false
	}
	return dfs(d.root, 0)
}

// ---------------------------------------------------------------------------
// Word Search II (LC212) — the capstone: trie + grid backtracking
// ---------------------------------------------------------------------------

// wordTrie stores the finished word at its terminal node, so a DFS that reaches
// it can report the match without reconstructing the path.
type wordTrie struct {
	children [26]*wordTrie
	word     string
}

// FindWords returns every word from the list that can be traced through
// adjacent cells of the board, using each cell at most once per word.
//
// WHY A TRIE IS THE WHOLE ALGORITHM: searching the grid once per word costs
// O(words · cells · 4^len). Instead, walk the grid ONCE while descending the
// trie in lockstep — the moment the current path is not a prefix of ANY word,
// the branch dies. All the words are pruned simultaneously.
//
// TWO IMPLEMENTATION NOTES:
//   - '#' marks the current cell as in-use, then restores it. Standard
//     backtracking: mutate, recurse, undo.
//   - Clearing next.word after a hit deduplicates for free — a word reachable
//     by several paths is reported once.
func FindWords(board [][]byte, words []string) []string {
	root := &wordTrie{}
	for _, w := range words {
		node := root
		for i := 0; i < len(w); i++ {
			c := w[i] - 'a'
			if node.children[c] == nil {
				node.children[c] = &wordTrie{}
			}
			node = node.children[c]
		}
		node.word = w
	}

	rows := len(board)
	if rows == 0 || len(board[0]) == 0 {
		return nil
	}
	cols := len(board[0])
	out := []string{}

	var dfs func(r, c int, node *wordTrie)
	dfs = func(r, c int, node *wordTrie) {
		if r < 0 || r >= rows || c < 0 || c >= cols {
			return
		}
		ch := board[r][c]
		if ch == '#' { // already on the current path
			return
		}
		next := node.children[ch-'a']
		if next == nil { // dead prefix: no word can continue this way
			return
		}
		if next.word != "" {
			out = append(out, next.word)
			next.word = "" // report once
		}
		board[r][c] = '#'
		dfs(r+1, c, next)
		dfs(r-1, c, next)
		dfs(r, c+1, next)
		dfs(r, c-1, next)
		board[r][c] = ch // undo
	}

	for r := range rows {
		for c := range cols {
			dfs(r, c, root)
		}
	}
	return out
}
