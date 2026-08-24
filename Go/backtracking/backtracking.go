// Package backtracking enumerates candidates by building and undoing choices.
//
// PATTERN         Backtracking (DFS over a decision tree)
// WHEN TO USE     "all combinations / subsets / permutations / partitions",
// "place N things without conflict", "does any arrangement work".
// COMPLEXITY      Exponential by nature — the skill is PRUNING, not avoiding it.
//
// THE TEMPLATE. Every function here is this shape:
//
//	backtrack(state):
//	    if state is a complete answer -> record a COPY, return
//	    for each candidate choice:
//	        if invalid -> skip (this is the pruning)
//	        apply the choice
//	        backtrack(next state)
//	        undo the choice          <- the "backtrack" step
//
// THE GO GOTCHA THAT BREAKS EVERY FIRST ATTEMPT: `out = append(out, path)`
// stores a slice HEADER that shares `path`'s backing array. The next undo
// mutates data already "saved", and every recorded answer silently changes.
// Always record slices.Clone(path) — or for strings, string(buf), which copies.
//
// COMBINATIONS vs PERMUTATIONS, the distinction to state out loud:
//   - order does NOT matter -> pass a `start` index so earlier elements are
//     never revisited. {1,2} and {2,1} are the same answer.
//   - order DOES matter -> loop over ALL elements with a `used` marker.
package backtracking

import (
	"bytes"
	"slices"
)

// ---------------------------------------------------------------------------
// Subsets and combinations: the `start` index family
// ---------------------------------------------------------------------------

// Subsets returns the power set (LC78). O(n·2ⁿ) time — 2ⁿ subsets, each copied.
//
// Every node of the recursion tree IS an answer, so the record happens on entry
// rather than at a leaf. `start` is what prevents {1,2} and {2,1} both appearing.
func Subsets(nums []int) [][]int {
	out := [][]int{}
	path := []int{}
	var backtrack func(start int)
	backtrack = func(start int) {
		out = append(out, slices.Clone(path)) // Clone: path keeps mutating
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i]) // choose
			backtrack(i + 1)             // explore (i+1: no reuse, no reordering)
			path = path[:len(path)-1]    // un-choose
		}
	}
	backtrack(0)
	return out
}

// SubsetsWithDup returns the power set of a multiset, without duplicate subsets
// (LC90).
//
// SORT FIRST so equal values sit together, then skip a value that repeats its
// predecessor AT THE SAME LEVEL. The `i > start` guard is the whole trick: it
// permits [2,2] going deeper (different levels) but blocks a second [2] branch
// at the same level, which would generate an identical subtree.
func SubsetsWithDup(nums []int) [][]int {
	sorted := slices.Clone(nums)
	slices.Sort(sorted)
	out := [][]int{}
	path := []int{}
	var backtrack func(start int)
	backtrack = func(start int) {
		out = append(out, slices.Clone(path))
		for i := start; i < len(sorted); i++ {
			if i > start && sorted[i] == sorted[i-1] {
				continue // same value already tried at this level
			}
			path = append(path, sorted[i])
			backtrack(i + 1)
			path = path[:len(path)-1]
		}
	}
	backtrack(0)
	return out
}

// CombinationSum finds every combination summing to target, with UNLIMITED
// reuse of each candidate (LC39).
//
// TWO DETAILS:
//   - recurse with i, not i+1 — that is what allows reusing a number.
//   - sorting enables `break`: once a candidate exceeds the remainder, so does
//     every later one. Real pruning, not cosmetic.
func CombinationSum(candidates []int, target int) [][]int {
	sorted := slices.Clone(candidates)
	slices.Sort(sorted)
	out := [][]int{}
	path := []int{}
	var backtrack func(start, remaining int)
	backtrack = func(start, remaining int) {
		if remaining == 0 {
			out = append(out, slices.Clone(path))
			return
		}
		for i := start; i < len(sorted); i++ {
			if sorted[i] > remaining {
				break // sorted: every later candidate is also too big
			}
			path = append(path, sorted[i])
			backtrack(i, remaining-sorted[i]) // i: reuse allowed
			path = path[:len(path)-1]
		}
	}
	backtrack(0, target)
	return out
}

// ---------------------------------------------------------------------------
// Permutations: the `used` marker family
// ---------------------------------------------------------------------------

// Permute returns every ordering (LC46). O(n·n!) time.
// No `start` index here — order matters, so every unused element is a candidate
// at every position. `used` is what stops an element appearing twice.
func Permute(nums []int) [][]int {
	out := [][]int{}
	used := make([]bool, len(nums))
	path := make([]int, 0, len(nums))
	var backtrack func()
	backtrack = func() {
		if len(path) == len(nums) {
			out = append(out, slices.Clone(path))
			return
		}
		for i, n := range nums {
			if used[i] {
				continue
			}
			used[i] = true
			path = append(path, n)
			backtrack()
			path = path[:len(path)-1]
			used[i] = false
		}
	}
	backtrack()
	return out
}

// digitLetters is the phone keypad. A table beats nested conditionals and makes
// the recursion trivial.
var digitLetters = map[byte]string{
	'2': "abc", '3': "def", '4': "ghi", '5': "jkl",
	'6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
}

// LetterCombinations returns every string a phone number could spell (LC17).
// The decision at each step is "which letter of THIS digit", so the depth is
// fixed at len(digits) — a cleaner tree than the subset problems.
func LetterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	out := []string{}
	buf := make([]byte, 0, len(digits))
	var backtrack func(i int)
	backtrack = func(i int) {
		if i == len(digits) {
			out = append(out, string(buf)) // string() copies — safe to record
			return
		}
		for j := 0; j < len(digitLetters[digits[i]]); j++ {
			buf = append(buf, digitLetters[digits[i]][j])
			backtrack(i + 1)
			buf = buf[:len(buf)-1]
		}
	}
	backtrack(0)
	return out
}

// GenerateParenthesis returns all valid combinations of n bracket pairs (LC22).
//
// THE PRUNING IS THE ALGORITHM: instead of generating all 2^(2n) strings and
// filtering, encode the two validity rules as the branch conditions —
//   - you may open while fewer than n are open
//   - you may close only while closers trail openers
//
// so every leaf reached is already valid and nothing is ever discarded.
func GenerateParenthesis(n int) []string {
	out := []string{}
	buf := make([]byte, 0, 2*n)
	var backtrack func(open, closed int)
	backtrack = func(open, closed int) {
		if len(buf) == 2*n {
			out = append(out, string(buf))
			return
		}
		if open < n {
			buf = append(buf, '(')
			backtrack(open+1, closed)
			buf = buf[:len(buf)-1]
		}
		if closed < open {
			buf = append(buf, ')')
			backtrack(open, closed+1)
			buf = buf[:len(buf)-1]
		}
	}
	backtrack(0, 0)
	return out
}

// ---------------------------------------------------------------------------
// Backtracking on a grid and on a string
// ---------------------------------------------------------------------------

// Exist reports whether word can be traced through adjacent cells, using each
// cell at most once (LC79). O(rows·cols·4^len(word)) worst case.
//
// THE VISITED SET IS THE BOARD ITSELF: overwrite the cell with '#', recurse,
// then restore it. That is O(1) extra space instead of a parallel bool grid —
// and the restore is exactly the "un-choose" step of the template.
func Exist(board [][]byte, word string) bool {
	if len(board) == 0 || len(board[0]) == 0 || len(word) == 0 {
		return false
	}
	rows, cols := len(board), len(board[0])

	var dfs func(r, c, i int) bool
	dfs = func(r, c, i int) bool {
		if i == len(word) {
			return true // every character matched
		}
		if r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word[i] {
			return false
		}
		saved := board[r][c]
		board[r][c] = '#' // mark in use
		found := dfs(r+1, c, i+1) || dfs(r-1, c, i+1) ||
			dfs(r, c+1, i+1) || dfs(r, c-1, i+1)
		board[r][c] = saved // restore
		return found
	}

	for r := range rows {
		for c := range cols {
			if dfs(r, c, 0) {
				return true
			}
		}
	}
	return false
}

// Partition returns every way to cut s into palindromic pieces (LC131).
//
// SHAPE: the choice at each step is "where does the next piece END". The
// palindrome check prunes the branch immediately, which is why this is fast
// enough despite the exponential answer count.
func Partition(s string) [][]string {
	isPalindrome := func(l, r int) bool {
		for l < r {
			if s[l] != s[r] {
				return false
			}
			l++
			r--
		}
		return true
	}
	out := [][]string{}
	path := []string{}
	var backtrack func(start int)
	backtrack = func(start int) {
		if start == len(s) {
			out = append(out, slices.Clone(path))
			return
		}
		for end := start; end < len(s); end++ {
			if !isPalindrome(start, end) {
				continue // prune: this prefix cannot begin a valid partition
			}
			path = append(path, s[start:end+1])
			backtrack(end + 1)
			path = path[:len(path)-1]
		}
	}
	backtrack(0)
	return out
}

// SolveNQueens places n non-attacking queens (LC51).
//
// THE O(1) CONFLICT CHECK is the insight worth remembering. Place one queen per
// row, so rows never clash. For the rest:
//   - a column is identified by c
//   - a "\" diagonal by r-c   (constant along the diagonal)
//   - a "/" diagonal by r+c
//
// Three sets of occupied keys turn "is this square attacked?" from an O(n) scan
// into three map lookups.
func SolveNQueens(n int) [][]string {
	out := [][]string{}
	cols := map[int]bool{}
	diagonal := map[int]bool{} // r - c
	antiDiag := map[int]bool{} // r + c

	board := make([][]byte, n)
	for i := range board {
		board[i] = bytes.Repeat([]byte("."), n)
	}

	var backtrack func(r int)
	backtrack = func(r int) {
		if r == n {
			solution := make([]string, n)
			for i, row := range board {
				solution[i] = string(row) // string() copies each row
			}
			out = append(out, solution)
			return
		}
		for c := range n {
			if cols[c] || diagonal[r-c] || antiDiag[r+c] {
				continue // attacked
			}
			cols[c], diagonal[r-c], antiDiag[r+c] = true, true, true
			board[r][c] = 'Q'

			backtrack(r + 1)

			board[r][c] = '.'
			cols[c], diagonal[r-c], antiDiag[r+c] = false, false, false
		}
	}
	backtrack(0)
	return out
}
