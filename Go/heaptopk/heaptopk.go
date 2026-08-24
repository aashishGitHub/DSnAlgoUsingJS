// Package heaptopk answers "top k" and "streaming median" questions.
//
// PATTERN         Heap / Top-K (and QuickSelect as the O(n) alternative)
// WHEN TO USE     "k largest/smallest", "k most frequent", "k closest",
// "median of a stream", "merge k sorted things".
// WASTE IT KILLS  Fully sorting (O(n log n)) when only k elements matter.
//
// THE COUNTER-INTUITIVE BIT, and the thing to say out loud:
// for the k LARGEST you keep a MIN-heap of size k. The heap's root is the
// weakest survivor, so it is the cheapest thing to evict when a better
// candidate arrives. O(n log k), and O(k) space instead of O(n).
//
// GO NOTE — container/heap is an ALGORITHM, not a container. You supply the
// storage by implementing heap.Interface (Len, Less, Swap, Push, Pop):
//   - Len/Less/Swap take VALUE receivers — they only read or swap in place.
//   - Push/Pop take POINTER receivers — they change the slice LENGTH.
//   - Always call the package functions heap.Push(h, x) / heap.Pop(h), never
//     h.Push / h.Pop directly: yours only append and truncate, while the
//     package's versions also re-establish the heap invariant.
//   - Flip Less to flip the direction. That single line is min-heap vs max-heap.
package heaptopk

import (
	"container/heap"
	"slices"
)

// ---------------------------------------------------------------------------
// The two boilerplate heaps
// ---------------------------------------------------------------------------

// MinIntHeap is a min-heap of ints: the smallest value sits at index 0.
type MinIntHeap []int

func (h MinIntHeap) Len() int           { return len(h) }
func (h MinIntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinIntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinIntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinIntHeap) Pop() any          { old := *h; n := len(old) - 1; x := old[n]; *h = old[:n]; return x }
func (h MinIntHeap) Peek() int          { return h[0] }

// MaxIntHeap is the same type with ONE character changed in Less.
type MaxIntHeap []int

func (h MaxIntHeap) Len() int           { return len(h) }
func (h MaxIntHeap) Less(i, j int) bool { return h[i] > h[j] } // <- the only difference
func (h MaxIntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MaxIntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MaxIntHeap) Pop() any          { old := *h; n := len(old) - 1; x := old[n]; *h = old[:n]; return x }
func (h MaxIntHeap) Peek() int          { return h[0] }

// item pairs a sort key with an arbitrary payload; itemHeap takes its direction
// from a comparator, so one type serves both min- and max-heap needs.
type item struct {
	key int
	val any
}

type itemHeap struct {
	items []item
	less  func(a, b item) bool
}

func (h itemHeap) Len() int           { return len(h.items) }
func (h itemHeap) Less(i, j int) bool { return h.less(h.items[i], h.items[j]) }
func (h itemHeap) Swap(i, j int)      { h.items[i], h.items[j] = h.items[j], h.items[i] }
func (h *itemHeap) Push(x any)        { h.items = append(h.items, x.(item)) }
func (h *itemHeap) Pop() any          { n := len(h.items) - 1; x := h.items[n]; h.items = h.items[:n]; return x }

// ---------------------------------------------------------------------------
// Kth largest — three ways, in increasing cleverness
// ---------------------------------------------------------------------------

// FindKthLargestSort is the two-line baseline. O(n log n) — always mention it
// first: for small n it is the correct engineering answer.
func FindKthLargestSort(nums []int, k int) int {
	sorted := slices.Clone(nums)
	slices.Sort(sorted)
	return sorted[len(sorted)-k]
}

// FindKthLargest keeps a MIN-heap of the k best so far (LC215).
// O(n log k) time, O(k) space — the answer when the input is a stream, or when
// n is huge and k is small.
func FindKthLargest(nums []int, k int) int {
	h := &MinIntHeap{}
	for _, n := range nums {
		heap.Push(h, n)
		if h.Len() > k {
			heap.Pop(h) // evict the weakest survivor
		}
	}
	if h.Len() == 0 {
		return 0
	}
	return h.Peek() // the root is now the kth largest overall
}

// partition puts nums[hi] in its final sorted position and returns that index:
// everything left of it is smaller, everything right is >=.
func partition(nums []int, lo, hi int) int {
	pivot := nums[hi]
	i := lo
	for j := lo; j < hi; j++ {
		if nums[j] < pivot {
			nums[i], nums[j] = nums[j], nums[i]
			i++
		}
	}
	nums[i], nums[hi] = nums[hi], nums[i]
	return i
}

// FindKthLargestQuickSelect runs in O(n) average, O(n²) worst case.
//
// WHY IT BEATS THE HEAP: quicksort recurses into BOTH halves; the kth element
// lives in exactly one of them, so recursing into just that side gives
// n + n/2 + n/4 + … = O(n). Randomising the pivot is what defends the worst
// case — worth stating, since a sorted input hits O(n²) with a fixed pivot.
func FindKthLargestQuickSelect(nums []int, k int) int {
	if len(nums) == 0 {
		return 0
	}
	work := slices.Clone(nums) // do not disturb the caller's slice
	target := len(work) - k    // kth largest == this index once sorted ascending
	lo, hi := 0, len(work)-1
	for {
		p := partition(work, lo, hi)
		switch {
		case p == target:
			return work[p]
		case p < target:
			lo = p + 1
		default:
			hi = p - 1
		}
	}
}

// ---------------------------------------------------------------------------
// Top-k variants
// ---------------------------------------------------------------------------

// TopKFrequentHeap returns the k most frequent values. O(n log k).
//
// The bucket-sort version in the hashmap package is O(n) and better here; this
// one is the answer when frequencies are unbounded or arrive as a stream.
func TopKFrequentHeap(nums []int, k int) []int {
	freq := map[int]int{}
	for _, n := range nums {
		freq[n]++
	}
	// Min-heap on count: the least frequent survivor sits at the root.
	h := &itemHeap{less: func(a, b item) bool { return a.key < b.key }}
	for n, c := range freq {
		heap.Push(h, item{key: c, val: n})
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	out := make([]int, 0, h.Len())
	for h.Len() > 0 {
		out = append(out, heap.Pop(h).(item).val.(int))
	}
	slices.Reverse(out) // popped least-frequent first, so flip to most-frequent first
	return out
}

// KClosest returns the k points nearest the origin (LC973). O(n log k).
//
// Compare SQUARED distances: the ordering is identical and it avoids both the
// float rounding and the cost of a square root.
func KClosest(points [][]int, k int) [][]int {
	// Max-heap on distance: the farthest survivor is at the root, ready to evict.
	h := &itemHeap{less: func(a, b item) bool { return a.key > b.key }}
	for _, p := range points {
		heap.Push(h, item{key: p[0]*p[0] + p[1]*p[1], val: p})
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	out := make([][]int, 0, h.Len())
	for h.Len() > 0 {
		out = append(out, heap.Pop(h).(item).val.([]int))
	}
	return out
}

// LastStoneWeight repeatedly smashes the two heaviest stones (LC1046).
// The textbook "always need the current maximum" signal => max-heap.
func LastStoneWeight(stones []int) int {
	h := MaxIntHeap(slices.Clone(stones))
	heap.Init(&h) // O(n) — cheaper than n pushes
	for h.Len() > 1 {
		a := heap.Pop(&h).(int)
		b := heap.Pop(&h).(int)
		if a != b {
			heap.Push(&h, a-b)
		}
	}
	if h.Len() == 0 {
		return 0
	}
	return h[0]
}

// LeastInterval is Task Scheduler (LC621) — solved by counting, not by a heap.
// O(n) time, O(1) space.
//
// THE PICTURE THAT REPLACES THE SIMULATION: lay the most frequent task out as
// (maxFreq-1) frames of width n+1, then append the final occurrences. Every
// other task fits into the idle slots. If there are more tasks than slots there
// are no idles at all, hence the max with len(tasks).
//
// Worth knowing BOTH: the heap simulation is the intuitive answer, this is the
// one that shows you found the structure.
func LeastInterval(tasks []byte, n int) int {
	var count [26]int
	maxFreq := 0
	for _, t := range tasks {
		count[t-'A']++
		maxFreq = max(maxFreq, count[t-'A'])
	}
	maxCount := 0 // how many tasks tie for most frequent
	for _, c := range count {
		if c == maxFreq {
			maxCount++
		}
	}
	return max((maxFreq-1)*(n+1)+maxCount, len(tasks))
}

// ---------------------------------------------------------------------------
// Two heaps: the streaming-median trick
// ---------------------------------------------------------------------------

// MedianFinder reports the running median of a stream (LC295).
// AddNum is O(log n); FindMedian is O(1).
//
// THE IDEA: split the data at the median. `low` is a MAX-heap of the smaller
// half, so its root is the largest small value; `high` is a MIN-heap of the
// larger half, so its root is the smallest large value. The median is at one or
// both roots. Keep low.Len() == high.Len() or exactly one more.
type MedianFinder struct {
	low  *MaxIntHeap // smaller half
	high *MinIntHeap // larger half
}

func NewMedianFinder() *MedianFinder {
	return &MedianFinder{low: &MaxIntHeap{}, high: &MinIntHeap{}}
}

// AddNum inserts through low, then hands low's maximum to high. The push-then-
// move dance keeps both halves correctly partitioned without any comparisons.
func (m *MedianFinder) AddNum(n int) {
	heap.Push(m.low, n)
	heap.Push(m.high, heap.Pop(m.low))
	if m.low.Len() < m.high.Len() { // low must never be the smaller half
		heap.Push(m.low, heap.Pop(m.high))
	}
}

func (m *MedianFinder) FindMedian() float64 {
	if m.low.Len() == 0 {
		return 0
	}
	if m.low.Len() > m.high.Len() {
		return float64(m.low.Peek()) // odd count: low holds the extra element
	}
	return float64(m.low.Peek()+m.high.Peek()) / 2
}
