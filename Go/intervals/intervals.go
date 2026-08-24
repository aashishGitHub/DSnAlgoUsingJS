// Package intervals sorts ranges so overlaps become adjacent.
//
// PATTERN         Merge Intervals (sort + single sweep)
// WHEN TO USE     meetings, bookings, ranges, "merge", "how many rooms".
// WASTE IT KILLS  Comparing all O(n²) interval pairs.
//
// THE ONE DECISION THAT DEFINES THE PROBLEM: sort by START or by END?
//   - by START: you are building/merging a combined range  (Merge, Insert)
//   - by END:   you are greedily keeping as many as possible (EraseOverlap)
//
// Getting this backwards is the single most common failure on this pattern.
package intervals

import (
	"cmp"
	"slices"
)

// sortedCopy returns intervals sorted by the chosen field without disturbing
// the caller's slice.
//
// GO GOTCHA: copy() on a [][]int is SHALLOW — it duplicates the outer headers
// but the inner slices are still shared. Sorting the copy is therefore safe
// (only headers move), but writing to iv[1] would be visible to the caller. So
// every function below allocates fresh inner slices before mutating one.
func sortedCopy(intervals [][]int, byIndex int) [][]int {
	out := make([][]int, len(intervals))
	copy(out, intervals)
	slices.SortFunc(out, func(a, b []int) int { return cmp.Compare(a[byIndex], b[byIndex]) })
	return out
}

// Merge combines all overlapping intervals (LC56). O(n log n) time.
//
// AFTER SORTING BY START, an interval can only overlap its immediate
// predecessor in the output — so one sweep suffices and no lookback is needed.
// Touching ranges ([1,4] and [4,5]) count as overlapping here; ask which
// convention the interviewer wants, since `<` vs `<=` is the whole difference.
func Merge(intervals [][]int) [][]int {
	if len(intervals) == 0 {
		return nil
	}
	sorted := sortedCopy(intervals, 0)
	out := [][]int{{sorted[0][0], sorted[0][1]}} // fresh copy: safe to mutate
	for _, iv := range sorted[1:] {
		last := out[len(out)-1]
		if iv[0] <= last[1] {
			last[1] = max(last[1], iv[1]) // extend; nested intervals need max
		} else {
			out = append(out, []int{iv[0], iv[1]})
		}
	}
	return out
}

// Insert adds one interval into an already sorted, non-overlapping list (LC57).
// O(n) — no sort needed, which is the point of the exercise.
//
// THREE PHASES: copy everything strictly before, absorb everything that
// touches, copy everything strictly after.
func Insert(intervals [][]int, newInterval []int) [][]int {
	out := [][]int{}
	i, n := 0, len(intervals)

	for i < n && intervals[i][1] < newInterval[0] {
		out = append(out, intervals[i]) // ends before the new one starts
		i++
	}
	merged := []int{newInterval[0], newInterval[1]}
	for i < n && intervals[i][0] <= merged[1] {
		merged[0] = min(merged[0], intervals[i][0])
		merged[1] = max(merged[1], intervals[i][1])
		i++
	}
	out = append(out, merged)
	for i < n {
		out = append(out, intervals[i])
		i++
	}
	return out
}

// EraseOverlapIntervals returns the minimum removals to make the rest
// non-overlapping (LC435). O(n log n).
//
// SORT BY END, and the greedy choice is provably optimal: among intervals that
// conflict, keeping the one that finishes earliest leaves the most room for
// everything after it. This is the classic activity-selection argument.
func EraseOverlapIntervals(intervals [][]int) int {
	if len(intervals) == 0 {
		return 0
	}
	sorted := sortedCopy(intervals, 1) // by END
	kept, end := 1, sorted[0][1]
	for _, iv := range sorted[1:] {
		if iv[0] >= end { // starts after the last kept one finished
			kept++
			end = iv[1]
		}
	}
	return len(intervals) - kept
}

// CanAttendMeetings reports whether no two meetings overlap (LC252).
func CanAttendMeetings(intervals [][]int) bool {
	sorted := sortedCopy(intervals, 0)
	for i := 1; i < len(sorted); i++ {
		if sorted[i][0] < sorted[i-1][1] {
			return false
		}
	}
	return true
}

// MinMeetingRooms returns the peak number of concurrent meetings (LC253).
// O(n log n) time, O(n) space. Also known as "minimum platforms".
//
// THE REFRAME THAT MAKES IT EASY: you do not care WHICH meeting is in which
// room, only how many are running at once. So decouple the endpoints: sort all
// starts and all ends separately, then sweep chronologically. Every start adds
// a room, every end frees one, and the answer is the high-water mark.
//
// `ends[j] <= starts[i]` treats a room freed at 10:00 as reusable at 10:00.
// Flip to `<` if the interviewer wants cleanup time between meetings.
func MinMeetingRooms(intervals [][]int) int {
	starts := make([]int, 0, len(intervals))
	ends := make([]int, 0, len(intervals))
	for _, iv := range intervals {
		starts = append(starts, iv[0])
		ends = append(ends, iv[1])
	}
	slices.Sort(starts)
	slices.Sort(ends)

	rooms, best, j := 0, 0, 0
	for i := 0; i < len(starts); i++ {
		for j < len(ends) && ends[j] <= starts[i] {
			rooms-- // a meeting finished before this one starts
			j++
		}
		rooms++
		best = max(best, rooms)
	}
	return best
}

// IntervalIntersection intersects two sorted interval lists (LC986). O(m+n).
//
// TWO POINTERS OVER TWO LISTS: the overlap of the two front intervals is
// [max(starts), min(ends)], non-empty only when lo <= hi. Then advance whichever
// interval ends first — it can have no further intersections.
func IntervalIntersection(a, b [][]int) [][]int {
	out := [][]int{}
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		lo := max(a[i][0], b[j][0])
		hi := min(a[i][1], b[j][1])
		if lo <= hi {
			out = append(out, []int{lo, hi})
		}
		if a[i][1] < b[j][1] {
			i++
		} else {
			j++
		}
	}
	return out
}
