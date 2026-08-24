// Package greedy takes the locally best choice and never revisits it.
//
// PATTERN         Greedy
// WHEN TO USE     Reachability, jumps, fuel/interval coverage, "minimum number
// of X to cover Y" — when a local rule provably cannot cost you the optimum.
// WASTE IT KILLS  A DP table over states you can prove are never needed.
//
// GREEDY OR DP? THE TEST THAT DECIDES IT: can you argue that taking the locally
// best option never rules out the global optimum? If yes, greedy is O(n) and DP
// is over-engineering. If a locally worse choice can pay off later (CoinChange
// with coins {1,3,4}), greedy is simply WRONG and you need DP.
//
// In an interview, state the exchange argument out loud — "any solution using X
// can be rewritten to use my choice without getting worse". That sentence is
// what separates a justified greedy from a lucky guess.
package greedy

// CanJump reports whether the last index is reachable (LC55). O(n), O(1) space.
//
// GREEDY INSIGHT: only the FARTHEST reachable index matters, not which path got
// there. If the loop ever stands beyond that frontier, there is a gap that no
// earlier jump could clear.
func CanJump(nums []int) bool {
	reach := 0
	for i, n := range nums {
		if i > reach {
			return false // unreachable gap
		}
		reach = max(reach, i+n)
	}
	return true
}

// Jump returns the minimum number of jumps to reach the end (LC45). O(n).
//
// THIS IS BFS IN DISGUISE, which is the clean way to explain it: `curEnd` is the
// boundary of the current "level" of reachable indices. Scanning to that
// boundary discovers everything reachable in one more jump, so hitting it means
// one jump has been consumed and a new level begins.
//
// The loop stops at len(nums)-1: arriving AT the last index needs no jump from it.
func Jump(nums []int) int {
	jumps, curEnd, farthest := 0, 0, 0
	for i := 0; i < len(nums)-1; i++ {
		farthest = max(farthest, i+nums[i])
		if i == curEnd { // the current level is exhausted
			jumps++
			curEnd = farthest
		}
	}
	return jumps
}

// CanCompleteCircuit returns a valid starting station for the circular route,
// or -1 (LC134). O(n) time, O(1) space.
//
// TWO INDEPENDENT FACTS, and both are needed:
//  1. FEASIBILITY — if total gas < total cost, no start works. Full stop.
//  2. WHICH START — whenever the running tank goes negative, no station in the
//     stretch just walked can be the answer (each one would start with even less
//     fuel), so the next station becomes the only remaining candidate.
//
// Given (1) holds, the surviving candidate is guaranteed correct — which is why
// one pass suffices instead of trying all n starts.
func CanCompleteCircuit(gas, cost []int) int {
	total, tank, start := 0, 0, 0
	for i := range gas {
		diff := gas[i] - cost[i]
		total += diff
		tank += diff
		if tank < 0 { // this stretch cannot be part of a valid start
			start = i + 1
			tank = 0
		}
	}
	if total < 0 {
		return -1 // not enough fuel overall
	}
	return start
}

// PartitionLabels splits s so each letter appears in exactly one part, making
// the parts as many as possible (LC763). O(n) time, O(1) space.
//
// THE PRECOMPUTATION IS THE TRICK: record each letter's LAST index first. Then
// sweep, stretching the current part's end to the last occurrence of everything
// seen. When the cursor reaches that end, no letter inside spills over — so cut.
func PartitionLabels(s string) []int {
	var last [26]int
	for i := 0; i < len(s); i++ {
		last[s[i]-'a'] = i // later writes win, leaving the final position
	}
	out := []int{}
	start, end := 0, 0
	for i := 0; i < len(s); i++ {
		end = max(end, last[s[i]-'a'])
		if i == end { // everything in [start..i] is contained here
			out = append(out, end-start+1)
			start = i + 1
		}
	}
	return out
}
