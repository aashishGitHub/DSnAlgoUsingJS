package hashmap

import (
	"reflect"
	"slices"
	"testing"
)

func TestTwoSum(t *testing.T) {
	cases := []struct {
		nums   []int
		target int
		want   []int
	}{
		{[]int{2, 7, 11, 15}, 9, []int{0, 1}},
		{[]int{3, 2, 4}, 6, []int{1, 2}},
		{[]int{3, 3}, 6, []int{0, 1}},
		{[]int{1, 2, 3}, 99, nil},
	}
	for _, c := range cases {
		if got := TwoSum(c.nums, c.target); !slices.Equal(got, c.want) {
			t.Errorf("TwoSum(%v, %d) = %v, want %v", c.nums, c.target, got, c.want)
		}
		// The brute force is the oracle: both must agree.
		if got, want := TwoSum(c.nums, c.target), TwoSumBrute(c.nums, c.target); !slices.Equal(got, want) {
			t.Errorf("TwoSum disagrees with brute on %v/%d: %v vs %v", c.nums, c.target, got, want)
		}
	}
}

func TestContainsDuplicate(t *testing.T) {
	if !ContainsDuplicate([]int{1, 2, 3, 1}) {
		t.Error("expected duplicate")
	}
	if ContainsDuplicate([]int{1, 2, 3, 4}) {
		t.Error("expected no duplicate")
	}
	if ContainsDuplicate(nil) {
		t.Error("empty slice has no duplicate")
	}
}

func TestIsAnagram(t *testing.T) {
	cases := []struct {
		s, t string
		want bool
	}{
		{"anagram", "nagaram", true},
		{"rat", "car", false},
		{"a", "ab", false},
		{"", "", true},
	}
	for _, c := range cases {
		if got := IsAnagram(c.s, c.t); got != c.want {
			t.Errorf("IsAnagram(%q,%q) = %v", c.s, c.t, got)
		}
		if got := IsAnagramUnicode(c.s, c.t); got != c.want {
			t.Errorf("IsAnagramUnicode(%q,%q) = %v", c.s, c.t, got)
		}
	}
	// Unicode variant must handle multi-byte runes the [26]int version cannot.
	if !IsAnagramUnicode("héllo", "olléh") {
		t.Error("IsAnagramUnicode should handle accented runes")
	}
}

func TestGroupAnagrams(t *testing.T) {
	got := GroupAnagrams([]string{"eat", "tea", "tan", "ate", "nat", "bat"})
	// Map iteration order is random, so normalise before comparing.
	for _, g := range got {
		slices.Sort(g)
	}
	slices.SortFunc(got, func(a, b []string) int { return slices.Compare(a, b) })
	want := [][]string{{"ate", "eat", "tea"}, {"bat"}, {"nat", "tan"}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("GroupAnagrams = %v, want %v", got, want)
	}
}

func TestTopKFrequent(t *testing.T) {
	got := TopKFrequent([]int{1, 1, 1, 2, 2, 3}, 2)
	slices.Sort(got)
	if !slices.Equal(got, []int{1, 2}) {
		t.Errorf("TopKFrequent = %v, want [1 2]", got)
	}
	if got := TopKFrequent([]int{1}, 1); !slices.Equal(got, []int{1}) {
		t.Errorf("TopKFrequent single = %v", got)
	}
}

func TestFirstUniqChar(t *testing.T) {
	cases := []struct {
		s    string
		want int
	}{
		{"leetcode", 0},
		{"loveleetcode", 2},
		{"aabb", -1},
	}
	for _, c := range cases {
		if got := FirstUniqChar(c.s); got != c.want {
			t.Errorf("FirstUniqChar(%q) = %d, want %d", c.s, got, c.want)
		}
	}
}

func TestLongestConsecutive(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{100, 4, 200, 1, 3, 2}, 4},
		{[]int{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}, 9},
		{nil, 0},
		{[]int{1, 1, 1}, 1},
	}
	for _, c := range cases {
		if got := LongestConsecutive(c.nums); got != c.want {
			t.Errorf("LongestConsecutive(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestEncodeDecodeRoundTrip(t *testing.T) {
	// The payloads deliberately contain the '#' delimiter and empty strings —
	// exactly what a naive "join with a separator" solution gets wrong.
	inputs := [][]string{
		{"hello", "world"},
		{"", ""},
		{"a#b", "3#c", ""},
		{},
	}
	for _, in := range inputs {
		got := Decode(Encode(in))
		if len(in) == 0 && len(got) == 0 {
			continue
		}
		if !slices.Equal(got, in) {
			t.Errorf("round trip of %q gave %q", in, got)
		}
	}
}

func TestFrequency(t *testing.T) {
	got := Frequency([]string{"a", "b", "a"})
	if got["a"] != 2 || got["b"] != 1 {
		t.Errorf("Frequency = %v", got)
	}
}
