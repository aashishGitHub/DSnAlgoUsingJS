package backtracking

import (
	"reflect"
	"slices"
	"testing"
)

// normalize sorts each inner slice and then the outer one, so results can be
// compared regardless of the order the recursion happened to produce them in.
func normalize(groups [][]int) [][]int {
	out := make([][]int, len(groups))
	for i, g := range groups {
		c := slices.Clone(g)
		slices.Sort(c)
		out[i] = c
	}
	slices.SortFunc(out, func(a, b []int) int { return slices.Compare(a, b) })
	return out
}

func TestSubsets(t *testing.T) {
	got := normalize(Subsets([]int{1, 2, 3}))
	want := normalize([][]int{
		{}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3},
	})
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Subsets = %v, want %v", got, want)
	}
	if got := Subsets(nil); len(got) != 1 || len(got[0]) != 0 {
		t.Errorf("Subsets(nil) = %v, want [[]]", got)
	}
}

func TestSubsetsAreIndependentCopies(t *testing.T) {
	// The bug this guards: appending `path` without cloning makes every recorded
	// subset alias the same backing array, so they all end up identical/empty.
	got := Subsets([]int{1, 2, 3})
	if len(got) != 8 {
		t.Fatalf("expected 8 subsets, got %d", len(got))
	}
	sizes := map[int]int{}
	for _, s := range got {
		sizes[len(s)]++
	}
	// One empty, three singletons, three pairs, one triple.
	if sizes[0] != 1 || sizes[1] != 3 || sizes[2] != 3 || sizes[3] != 1 {
		t.Errorf("subset sizes = %v — results are aliasing one another", sizes)
	}
}

func TestSubsetsWithDup(t *testing.T) {
	got := normalize(SubsetsWithDup([]int{1, 2, 2}))
	want := normalize([][]int{{}, {1}, {2}, {1, 2}, {2, 2}, {1, 2, 2}})
	if !reflect.DeepEqual(got, want) {
		t.Errorf("SubsetsWithDup = %v, want %v", got, want)
	}
	// 2^3 == 8 raw subsets collapse to 4 distinct ones here.
	if got := SubsetsWithDup([]int{0, 0, 0}); len(got) != 4 {
		t.Errorf("SubsetsWithDup([0,0,0]) has %d subsets, want 4", len(got))
	}
}

func TestCombinationSum(t *testing.T) {
	got := normalize(CombinationSum([]int{2, 3, 6, 7}, 7))
	want := normalize([][]int{{2, 2, 3}, {7}})
	if !reflect.DeepEqual(got, want) {
		t.Errorf("CombinationSum = %v, want %v", got, want)
	}
	got = normalize(CombinationSum([]int{2, 3, 5}, 8))
	want = normalize([][]int{{2, 2, 2, 2}, {2, 3, 3}, {3, 5}})
	if !reflect.DeepEqual(got, want) {
		t.Errorf("CombinationSum = %v, want %v", got, want)
	}
	if got := CombinationSum([]int{2}, 1); len(got) != 0 {
		t.Errorf("CombinationSum = %v, want empty", got)
	}
}

func TestPermute(t *testing.T) {
	got := normalize(Permute([]int{1, 2, 3}))
	// Every permutation normalises to the same sorted slice, so check the count
	// separately from the contents.
	if len(got) != 6 {
		t.Errorf("Permute returned %d results, want 6", len(got))
	}
	seen := map[string]bool{}
	for _, p := range Permute([]int{1, 2, 3}) {
		key := ""
		for _, n := range p {
			key += string(rune('0' + n))
		}
		if seen[key] {
			t.Errorf("duplicate permutation %s", key)
		}
		seen[key] = true
		if len(p) != 3 {
			t.Errorf("permutation %v has wrong length", p)
		}
	}
	if got := Permute([]int{1}); len(got) != 1 {
		t.Errorf("Permute([1]) = %v", got)
	}
}

func TestLetterCombinations(t *testing.T) {
	got := LetterCombinations("23")
	slices.Sort(got)
	want := []string{"ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"}
	if !slices.Equal(got, want) {
		t.Errorf("LetterCombinations(23) = %v, want %v", got, want)
	}
	if got := LetterCombinations(""); len(got) != 0 {
		t.Errorf("LetterCombinations(\"\") = %v, want empty", got)
	}
	if got := LetterCombinations("7"); len(got) != 4 { // pqrs has four letters
		t.Errorf("LetterCombinations(7) = %v, want 4 results", got)
	}
}

func TestGenerateParenthesis(t *testing.T) {
	got := GenerateParenthesis(3)
	slices.Sort(got)
	want := []string{"((()))", "(()())", "(())()", "()(())", "()()()"}
	slices.Sort(want)
	if !slices.Equal(got, want) {
		t.Errorf("GenerateParenthesis(3) = %v, want %v", got, want)
	}
	if got := GenerateParenthesis(1); !slices.Equal(got, []string{"()"}) {
		t.Errorf("GenerateParenthesis(1) = %v", got)
	}
	// Catalan numbers: 1, 2, 5, 14 …
	if got := GenerateParenthesis(4); len(got) != 14 {
		t.Errorf("GenerateParenthesis(4) has %d results, want 14", len(got))
	}
}

func TestExist(t *testing.T) {
	newBoard := func() [][]byte {
		return [][]byte{[]byte("ABCE"), []byte("SFCS"), []byte("ADEE")}
	}
	cases := []struct {
		word string
		want bool
	}{
		{"ABCCED", true},
		{"SEE", true},
		{"ABCB", false}, // would need to reuse the B
		{"ABCESEEEFS", false},
		{"A", true},
		{"Z", false},
	}
	for _, c := range cases {
		if got := Exist(newBoard(), c.word); got != c.want {
			t.Errorf("Exist(%q) = %v, want %v", c.word, got, c.want)
		}
	}
	// The board must be restored after a successful search too.
	board := newBoard()
	Exist(board, "ABCCED")
	if !slices.Equal(board[0], []byte("ABCE")) {
		t.Errorf("board not restored: %q", board[0])
	}
}

func TestPartition(t *testing.T) {
	got := Partition("aab")
	want := [][]string{{"a", "a", "b"}, {"aa", "b"}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Partition(aab) = %v, want %v", got, want)
	}
	if got := Partition("a"); !reflect.DeepEqual(got, [][]string{{"a"}}) {
		t.Errorf("Partition(a) = %v", got)
	}
	// No multi-character palindrome exists, so only the all-singles split works.
	if got := Partition("abc"); len(got) != 1 {
		t.Errorf("Partition(abc) = %v, want 1 partition", got)
	}
}

func TestSolveNQueens(t *testing.T) {
	got := SolveNQueens(4)
	if len(got) != 2 {
		t.Fatalf("SolveNQueens(4) returned %d solutions, want 2", len(got))
	}
	want := [][]string{
		{".Q..", "...Q", "Q...", "..Q."},
		{"..Q.", "Q...", "...Q", ".Q.."},
	}
	for _, w := range want {
		found := slices.ContainsFunc(got, func(s []string) bool {
			return slices.Equal(s, w)
		})
		if !found {
			t.Errorf("missing expected solution %v in %v", w, got)
		}
	}
	if got := SolveNQueens(1); !reflect.DeepEqual(got, [][]string{{"Q"}}) {
		t.Errorf("SolveNQueens(1) = %v", got)
	}
	// 2 and 3 queens are famously impossible.
	if got := SolveNQueens(3); len(got) != 0 {
		t.Errorf("SolveNQueens(3) = %v, want none", got)
	}
	if got := SolveNQueens(8); len(got) != 92 {
		t.Errorf("SolveNQueens(8) returned %d solutions, want 92", len(got))
	}
}
