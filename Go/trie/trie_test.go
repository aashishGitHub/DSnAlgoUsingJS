package trie

import (
	"slices"
	"testing"
)

func TestTrie(t *testing.T) {
	tr := NewTrie()
	tr.Insert("apple")

	if !tr.Search("apple") {
		t.Error("Search(apple) should be true")
	}
	// "app" is a prefix but was never inserted as a word — this is exactly what
	// the isWord flag exists to distinguish.
	if tr.Search("app") {
		t.Error("Search(app) should be false before inserting it")
	}
	if !tr.StartsWith("app") {
		t.Error("StartsWith(app) should be true")
	}
	tr.Insert("app")
	if !tr.Search("app") {
		t.Error("Search(app) should be true after inserting it")
	}
	if tr.Search("appl") {
		t.Error("Search(appl) should be false")
	}
	if tr.StartsWith("banana") {
		t.Error("StartsWith(banana) should be false")
	}
	if !tr.Search("apple") {
		t.Error("inserting a prefix must not break the longer word")
	}
	// The empty string is a prefix of everything.
	if !tr.StartsWith("") {
		t.Error("StartsWith(\"\") should be true")
	}
}

func TestWordDictionary(t *testing.T) {
	d := NewWordDictionary()
	d.AddWord("bad")
	d.AddWord("dad")
	d.AddWord("mad")

	cases := []struct {
		word string
		want bool
	}{
		{"pad", false},
		{"bad", true},
		{".ad", true},
		{"b..", true},
		{"b.", false}, // wildcards match one char each, so length must agree
		{"...", true},
		{"....", false},
		{"b.d", true},
		{"b.x", false},
	}
	for _, c := range cases {
		if got := d.Search(c.word); got != c.want {
			t.Errorf("Search(%q) = %v, want %v", c.word, got, c.want)
		}
	}
}

func TestFindWords(t *testing.T) {
	board := [][]byte{
		[]byte("oaan"),
		[]byte("etae"),
		[]byte("ihkr"),
		[]byte("iflv"),
	}
	// Keep a copy: the DFS marks cells with '#' and must restore every one.
	original := make([][]byte, len(board))
	for i, row := range board {
		original[i] = slices.Clone(row)
	}

	got := FindWords(board, []string{"oath", "pea", "eat", "rain"})
	slices.Sort(got)
	if !slices.Equal(got, []string{"eat", "oath"}) {
		t.Errorf("FindWords = %v, want [eat oath]", got)
	}
	for i := range board {
		if !slices.Equal(board[i], original[i]) {
			t.Errorf("board row %d not restored: %q vs %q", i, board[i], original[i])
		}
	}
}

func TestFindWordsDeduplicates(t *testing.T) {
	// "aa" is traceable along several paths; it must be reported exactly once.
	board := [][]byte{[]byte("aa"), []byte("aa")}
	got := FindWords(board, []string{"aa"})
	if !slices.Equal(got, []string{"aa"}) {
		t.Errorf("FindWords = %v, want exactly one [aa]", got)
	}
}

func TestFindWordsEdgeCases(t *testing.T) {
	if got := FindWords(nil, []string{"a"}); got != nil {
		t.Errorf("empty board = %v, want nil", got)
	}
	// A single cell cannot spell a two-letter word: no cell reuse allowed.
	if got := FindWords([][]byte{[]byte("a")}, []string{"aa"}); len(got) != 0 {
		t.Errorf("FindWords = %v, want empty", got)
	}
	if got := FindWords([][]byte{[]byte("a")}, []string{"a"}); !slices.Equal(got, []string{"a"}) {
		t.Errorf("FindWords = %v, want [a]", got)
	}
}
