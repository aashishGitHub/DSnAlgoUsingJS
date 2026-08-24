// Package cyclicsort exploits values that are their own indices.
//
// PATTERN         Cyclic Sort / index-as-hash
// WHEN TO USE     "array of n numbers in the range 1..n (or 0..n)" plus
//
//	missing / duplicate / smallest-absent questions.
//
// WASTE IT KILLS  A sort (O(n log n)) or a hash set (O(n) space) when the
//
//	values themselves already tell you where they belong.
//
// THE INSIGHT: if a value's correct home is a known index, the ARRAY IS THE
// HASH TABLE. Put each value home in O(1); whatever is missing shows up as a
// slot holding the wrong thing. O(n) time, O(1) extra space.
//
// TWO WAYS TO USE THE ARRAY AS STORAGE:
//  1. SWAP values into place        (CyclicSort, FirstMissingPositive)
//  2. NEGATE a[v-1] as a "seen" bit (FindDisappearedNumbers, FindDuplicates)
//
// Both mutate the input. If the problem forbids that, use Floyd's cycle
// detection instead — see linkedlist.FindDuplicate.
package cyclicsort

// CyclicSort sorts an array containing exactly 1..n. O(n) time, O(1) space.
//
// Each swap places at least one value in its final home, so there are at most n
// swaps overall even though the loop looks nested.
//
// COMPARE nums[i] != nums[home], NOT i != home: with duplicates present the
// index test spins forever, while the value test recognises "the home slot
// already holds this value" and moves on.
func CyclicSort(nums []int) {
	i := 0
	for i < len(nums) {
		home := nums[i] - 1
		if nums[i] != nums[home] {
			nums[i], nums[home] = nums[home], nums[i]
		} else {
			i++ // this slot is settled
		}
	}
}

// MissingNumber finds the absent value in 0..n (LC268). O(n) time, O(1) space.
//
// XOR SOLUTION: every present value cancels its own index, and the one index
// with no partner survives. No sum, so no overflow risk on large inputs — the
// answer to give when asked "what if n is huge?".
func MissingNumber(nums []int) int {
	missing := len(nums) // the index n that has no slot of its own
	for i, n := range nums {
		missing ^= i ^ n
	}
	return missing
}

// MissingNumberSum is the arithmetic-series variant: total − actual.
// Simpler to explain; mention the overflow caveat in other languages.
func MissingNumberSum(nums []int) int {
	n := len(nums)
	want := n * (n + 1) / 2
	got := 0
	for _, v := range nums {
		got += v
	}
	return want - got
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

// FindDisappearedNumbers returns every value in 1..n absent from nums (LC448).
// O(n) time, O(1) extra space (the output does not count).
//
// SIGN AS A VISITED BIT: for each value v, flag slot v-1 by negating it. The
// magnitude still holds the original value, so read through abs() — and guard
// the negation so a value seen twice does not flip the slot back to positive.
func FindDisappearedNumbers(nums []int) []int {
	for _, v := range nums {
		idx := abs(v) - 1
		if nums[idx] > 0 {
			nums[idx] = -nums[idx]
		}
	}
	out := []int{}
	for i, v := range nums {
		if v > 0 { // nobody ever flagged this slot
			out = append(out, i+1)
		}
	}
	return out
}

// FindDuplicates returns every value appearing twice in 1..n (LC442).
// The mirror image of the above: report when a slot is ALREADY flagged.
func FindDuplicates(nums []int) []int {
	out := []int{}
	for _, v := range nums {
		idx := abs(v) - 1
		if nums[idx] < 0 {
			out = append(out, abs(v)) // second sighting
		} else {
			nums[idx] = -nums[idx]
		}
	}
	return out
}

// FirstMissingPositive finds the smallest absent positive integer (LC41).
// O(n) time, O(1) space — a Hard question that this pattern makes routine.
//
// THE BOUNDING ARGUMENT THAT UNLOCKS IT: with n slots, the answer is always in
// [1, n+1]. So values <= 0 or > n are irrelevant and can be ignored entirely;
// everything else gets swapped home, and the first slot holding the wrong value
// names the answer.
func FirstMissingPositive(nums []int) int {
	n := len(nums)
	for i := 0; i < n; i++ {
		// while nums[i] is in range and not already home, send it home
		for nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
			home := nums[i] - 1
			nums[i], nums[home] = nums[home], nums[i]
		}
	}
	for i := 0; i < n; i++ {
		if nums[i] != i+1 {
			return i + 1
		}
	}
	return n + 1 // 1..n all present
}
