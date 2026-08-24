package linkedlist

import (
	"slices"
	"testing"
)

func TestFromToSlice(t *testing.T) {
	if got := ToSlice(FromSlice([]int{1, 2, 3})); !slices.Equal(got, []int{1, 2, 3}) {
		t.Errorf("round trip = %v", got)
	}
	if got := ToSlice(FromSlice(nil)); len(got) != 0 {
		t.Errorf("empty round trip = %v", got)
	}
}

func TestReverseList(t *testing.T) {
	for _, in := range [][]int{{1, 2, 3, 4, 5}, {1, 2}, {1}, nil} {
		want := slices.Clone(in)
		slices.Reverse(want)

		if got := ToSlice(ReverseList(FromSlice(in))); !slices.Equal(got, want) {
			t.Errorf("ReverseList(%v) = %v, want %v", in, got, want)
		}
		if got := ToSlice(ReverseListRecursive(FromSlice(in))); !slices.Equal(got, want) {
			t.Errorf("ReverseListRecursive(%v) = %v, want %v", in, got, want)
		}
	}
}

func TestMergeTwoLists(t *testing.T) {
	got := ToSlice(MergeTwoLists(FromSlice([]int{1, 2, 4}), FromSlice([]int{1, 3, 4})))
	if !slices.Equal(got, []int{1, 1, 2, 3, 4, 4}) {
		t.Errorf("MergeTwoLists = %v", got)
	}
	if got := ToSlice(MergeTwoLists(nil, FromSlice([]int{0}))); !slices.Equal(got, []int{0}) {
		t.Errorf("MergeTwoLists with nil = %v", got)
	}
	if got := MergeTwoLists(nil, nil); got != nil {
		t.Errorf("MergeTwoLists(nil,nil) = %v, want nil", got)
	}
}

func TestMergeKLists(t *testing.T) {
	lists := []*ListNode{
		FromSlice([]int{1, 4, 5}),
		FromSlice([]int{1, 3, 4}),
		FromSlice([]int{2, 6}),
	}
	got := ToSlice(MergeKLists(lists))
	if !slices.Equal(got, []int{1, 1, 2, 3, 4, 4, 5, 6}) {
		t.Errorf("MergeKLists = %v", got)
	}
	if got := MergeKLists(nil); got != nil {
		t.Errorf("MergeKLists(nil) = %v, want nil", got)
	}
	// An odd count exercises the "carry the last list forward" branch.
	odd := []*ListNode{FromSlice([]int{1}), FromSlice([]int{2}), FromSlice([]int{3})}
	if got := ToSlice(MergeKLists(odd)); !slices.Equal(got, []int{1, 2, 3}) {
		t.Errorf("MergeKLists odd count = %v", got)
	}
	if got := ToSlice(MergeKLists([]*ListNode{nil, nil})); len(got) != 0 {
		t.Errorf("MergeKLists of empty lists = %v", got)
	}
}

func TestRemoveNthFromEnd(t *testing.T) {
	cases := []struct {
		in   []int
		n    int
		want []int
	}{
		{[]int{1, 2, 3, 4, 5}, 2, []int{1, 2, 3, 5}},
		{[]int{1}, 1, nil},
		{[]int{1, 2}, 2, []int{2}}, // removing the head
		{[]int{1, 2}, 1, []int{1}},
	}
	for _, c := range cases {
		got := ToSlice(RemoveNthFromEnd(FromSlice(c.in), c.n))
		if len(c.want) == 0 && len(got) == 0 {
			continue
		}
		if !slices.Equal(got, c.want) {
			t.Errorf("RemoveNthFromEnd(%v,%d) = %v, want %v", c.in, c.n, got, c.want)
		}
	}
}

func TestMiddleNode(t *testing.T) {
	if got := MiddleNode(FromSlice([]int{1, 2, 3, 4, 5})).Val; got != 3 {
		t.Errorf("MiddleNode odd = %d, want 3", got)
	}
	// Even length: the SECOND middle, per LC876.
	if got := MiddleNode(FromSlice([]int{1, 2, 3, 4, 5, 6})).Val; got != 4 {
		t.Errorf("MiddleNode even = %d, want 4", got)
	}
	if got := MiddleNode(FromSlice([]int{1})).Val; got != 1 {
		t.Errorf("MiddleNode single = %d", got)
	}
}

// withCycle builds a list whose tail points back to index `pos` (-1 for none).
func withCycle(vals []int, pos int) (head, entry *ListNode) {
	head = FromSlice(vals)
	if pos < 0 {
		return head, nil
	}
	var tail *ListNode
	i := 0
	for n := head; n != nil; n = n.Next {
		if i == pos {
			entry = n
		}
		tail = n
		i++
	}
	tail.Next = entry
	return head, entry
}

func TestHasCycle(t *testing.T) {
	head, _ := withCycle([]int{3, 2, 0, -4}, 1)
	if !HasCycle(head) {
		t.Error("expected a cycle")
	}
	head, _ = withCycle([]int{1, 2}, -1)
	if HasCycle(head) {
		t.Error("expected no cycle")
	}
	if HasCycle(nil) {
		t.Error("nil has no cycle")
	}
	// Self-loop: the tightest possible cycle.
	self, _ := withCycle([]int{1}, 0)
	if !HasCycle(self) {
		t.Error("expected a self-loop to count as a cycle")
	}
}

func TestDetectCycleStart(t *testing.T) {
	head, entry := withCycle([]int{3, 2, 0, -4}, 1)
	if got := DetectCycleStart(head); got != entry {
		t.Errorf("DetectCycleStart = %v, want the node with Val 2", got)
	}
	head, entry = withCycle([]int{1, 2}, 0)
	if got := DetectCycleStart(head); got != entry {
		t.Error("DetectCycleStart should find the head as the entry")
	}
	head, _ = withCycle([]int{1, 2, 3}, -1)
	if got := DetectCycleStart(head); got != nil {
		t.Errorf("DetectCycleStart = %v, want nil", got)
	}
}

func TestIsPalindromeList(t *testing.T) {
	cases := []struct {
		in   []int
		want bool
	}{
		{[]int{1, 2, 2, 1}, true},
		{[]int{1, 2, 3, 2, 1}, true}, // odd length
		{[]int{1, 2}, false},
		{[]int{1}, true},
	}
	for _, c := range cases {
		if got := IsPalindromeList(FromSlice(c.in)); got != c.want {
			t.Errorf("IsPalindromeList(%v) = %v, want %v", c.in, got, c.want)
		}
	}
}

func TestReorderList(t *testing.T) {
	cases := []struct {
		in, want []int
	}{
		{[]int{1, 2, 3, 4}, []int{1, 4, 2, 3}},
		{[]int{1, 2, 3, 4, 5}, []int{1, 5, 2, 4, 3}},
		{[]int{1, 2}, []int{1, 2}},
		{[]int{1}, []int{1}},
	}
	for _, c := range cases {
		head := FromSlice(c.in)
		ReorderList(head)
		if got := ToSlice(head); !slices.Equal(got, c.want) {
			t.Errorf("ReorderList(%v) = %v, want %v", c.in, got, c.want)
		}
	}
}

func TestFindDuplicate(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{1, 3, 4, 2, 2}, 2},
		{[]int{3, 1, 3, 4, 2}, 3},
		{[]int{1, 1}, 1},
		{[]int{2, 2, 2, 2, 2}, 2},
	}
	for _, c := range cases {
		before := slices.Clone(c.nums)
		if got := FindDuplicate(c.nums); got != c.want {
			t.Errorf("FindDuplicate(%v) = %d, want %d", before, got, c.want)
		}
		// The selling point of Floyd here: the input is left untouched.
		if !slices.Equal(c.nums, before) {
			t.Errorf("FindDuplicate mutated its input: %v -> %v", before, c.nums)
		}
	}
}
