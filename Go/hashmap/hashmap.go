// Package hashmap holds the "remember what you've already seen" family.
//
// PATTERN         Hash Map / Set — trade O(n) space for O(1) recall.
// WHEN TO USE     "have I seen…", "group by…", "count of…", complement lookups.
// WASTE IT KILLS  Re-scanning the collection to find a partner or a duplicate.
package hashmap

import (
	"strconv"
	"strings"
)

// ---------------------------------------------------------------------------
// Two Sum (LC1) — the archetype of the whole pattern
// ---------------------------------------------------------------------------

// TwoSumBrute tries every pair. O(n²) time, O(1) space.
// Kept on purpose: it is the correctness oracle for TwoSum in the tests.
func TwoSumBrute(nums []int, target int) []int {
	for i := 0; i < len(nums); i++ {
		for j := i + 1; j < len(nums); j++ {
			if nums[i]+nums[j] == target {
				return []int{i, j}
			}
		}
	}
	return nil
}

// TwoSum remembers each value's index as it walks, so looking for the partner
// is O(1) instead of a rescan. O(n) time, O(n) space.
//
// The one trick: check BEFORE inserting, else nums[i]+nums[i] matches itself.
func TwoSum(nums []int, target int) []int {
	seen := make(map[int]int, len(nums)) // value -> index
	for i, n := range nums {
		if j, ok := seen[target-n]; ok {
			return []int{j, i}
		}
		seen[n] = i
	}
	return nil
}

// ---------------------------------------------------------------------------
// Set membership
// ---------------------------------------------------------------------------

// ContainsDuplicate answers "have I seen this?" in one pass. O(n)/O(n).
// map[T]struct{} is the idiomatic Go set: struct{} occupies zero bytes.
func ContainsDuplicate(nums []int) bool {
	seen := make(map[int]struct{}, len(nums))
	for _, n := range nums {
		if _, ok := seen[n]; ok {
			return true
		}
		seen[n] = struct{}{}
	}
	return false
}

// ---------------------------------------------------------------------------
// Frequency counting
// ---------------------------------------------------------------------------

// Frequency is the generic tally every counting problem starts from.
func Frequency[T comparable](xs []T) map[T]int {
	freq := make(map[T]int, len(xs))
	for _, x := range xs {
		freq[x]++
	}
	return freq
}

// IsAnagram compares letter tallies. O(n) time, O(1) space (26 slots).
//
// Assumes lowercase a-z (the LC242 constraint). A fixed array beats a map
// here: no hashing, no allocation, and Go compares arrays with ==.
func IsAnagram(s, t string) bool {
	if len(s) != len(t) {
		return false
	}
	var count [26]int
	for i := 0; i < len(s); i++ {
		count[s[i]-'a']++
		count[t[i]-'a']--
	}
	return count == [26]int{}
}

// IsAnagramUnicode is the version to reach for when the interviewer says
// "what if the input is not ASCII?" — range over a string yields runes.
func IsAnagramUnicode(s, t string) bool {
	count := map[rune]int{}
	for _, r := range s {
		count[r]++
	}
	for _, r := range t {
		count[r]--
		if count[r] == 0 {
			delete(count, r)
		}
	}
	return len(count) == 0
}

// GroupAnagrams buckets words by their letter tally. O(n·k) time.
//
// KEY IDEA: [26]int is comparable, so it can be a map key directly — no
// sorting each word (that would cost O(n·k log k)) and no string building.
// Group order is unspecified: Go randomises map iteration on purpose.
func GroupAnagrams(strs []string) [][]string {
	groups := make(map[[26]int][]string)
	for _, s := range strs {
		var key [26]int
		for i := 0; i < len(s); i++ {
			key[s[i]-'a']++
		}
		groups[key] = append(groups[key], s)
	}
	out := make([][]string, 0, len(groups))
	for _, g := range groups {
		out = append(out, g)
	}
	return out
}

// TopKFrequent returns the k most frequent values. O(n) time — no sort, no heap.
//
// WHY BUCKETS BEAT A HEAP: a count can never exceed n, so counts are a bounded
// key. Bucket by count and read the buckets from the top: O(n) beats O(n log k).
func TopKFrequent(nums []int, k int) []int {
	freq := Frequency(nums)
	buckets := make([][]int, len(nums)+1) // buckets[c] = values seen c times
	for n, c := range freq {
		buckets[c] = append(buckets[c], n)
	}
	out := make([]int, 0, k)
	for c := len(buckets) - 1; c >= 1 && len(out) < k; c-- {
		for _, n := range buckets[c] {
			out = append(out, n)
			if len(out) == k {
				break
			}
		}
	}
	return out
}

// FirstUniqChar returns the index of the first non-repeating character, or -1.
// Two passes: tally, then re-walk in order. O(n)/O(1).
func FirstUniqChar(s string) int {
	var count [26]int
	for i := 0; i < len(s); i++ {
		count[s[i]-'a']++
	}
	for i := 0; i < len(s); i++ {
		if count[s[i]-'a'] == 1 {
			return i
		}
	}
	return -1
}

// ---------------------------------------------------------------------------
// Set as a graph substitute
// ---------------------------------------------------------------------------

// LongestConsecutive finds the longest run of consecutive integers. O(n)/O(n).
//
// Sorting gives O(n log n); the set gives O(n). The trick that makes it linear:
// only start counting from a value whose predecessor is absent, so every run is
// walked exactly once no matter how many members it has.
func LongestConsecutive(nums []int) int {
	set := make(map[int]struct{}, len(nums))
	for _, n := range nums {
		set[n] = struct{}{}
	}
	best := 0
	for n := range set {
		if _, ok := set[n-1]; ok {
			continue // not the start of a run — someone else will count it
		}
		length := 1
		for {
			if _, ok := set[n+length]; !ok {
				break
			}
			length++
		}
		best = max(best, length)
	}
	return best
}

// ---------------------------------------------------------------------------
// Encode / Decode Strings — the "design a wire format" question
// ---------------------------------------------------------------------------

// Encode joins strings so they can be recovered even if they contain the
// delimiter. Length-prefixing ("5#hello") is the answer; any single separator
// character can appear in the payload and would break round-tripping.
func Encode(strs []string) string {
	var b strings.Builder
	for _, s := range strs {
		b.WriteString(strconv.Itoa(len(s)))
		b.WriteByte('#')
		b.WriteString(s)
	}
	return b.String()
}

// Decode reverses Encode. O(total length).
func Decode(s string) []string {
	out := []string{}
	for i := 0; i < len(s); {
		j := i
		for s[j] != '#' {
			j++
		}
		n, _ := strconv.Atoi(s[i:j])
		out = append(out, s[j+1:j+1+n])
		i = j + 1 + n
	}
	return out
}
