// Package linkedlist covers pointer surgery and the Fast & Slow pattern.
//
// PATTERN         Fast & Slow Pointers (Floyd), pointer rewiring
// WHEN TO USE     cycle / middle / nth-from-end / palindrome / reorder;
//
//	and any "find the repeated value with O(1) space".
//
// WASTE IT KILLS  Storing every visited node in a set just to detect a repeat.
//
// TWO HABITS THAT PREVENT MOST BUGS:
//  1. Draw three nodes and a nil. Every rewiring bug shows up in three nodes.
//  2. Use a dummy head when the FIRST node may change — it removes the
//     "am I at the head?" special case from every loop.
package linkedlist

// ListNode is a singly linked list node.
type ListNode struct {
	Val  int
	Next *ListNode
}

// FromSlice builds a list — test helper, and handy for dry-running by hand.
func FromSlice(vals []int) *ListNode {
	dummy := &ListNode{}
	cur := dummy
	for _, v := range vals {
		cur.Next = &ListNode{Val: v}
		cur = cur.Next
	}
	return dummy.Next
}

// ToSlice flattens a list. Loops forever on a cyclic list, by design.
func ToSlice(head *ListNode) []int {
	out := []int{}
	for n := head; n != nil; n = n.Next {
		out = append(out, n.Val)
	}
	return out
}

// ---------------------------------------------------------------------------
// Rewiring
// ---------------------------------------------------------------------------

// ReverseList reverses a list iteratively (LC206). O(n) time, O(1) space.
//
// THE THREE-POINTER DANCE: save Next before overwriting it, or the rest of the
// list is lost. prev starts nil, and becomes the new head.
func ReverseList(head *ListNode) *ListNode {
	var prev *ListNode
	for cur := head; cur != nil; {
		next := cur.Next // 1. remember
		cur.Next = prev  // 2. flip
		prev = cur       // 3. advance
		cur = next
	}
	return prev
}

// ReverseListRecursive is the same thing expressed as recursion. O(n) stack.
// Read it as: "reverse the rest, then make my successor point back at me."
func ReverseListRecursive(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head // empty or single node is already reversed
	}
	newHead := ReverseListRecursive(head.Next)
	head.Next.Next = head
	head.Next = nil // the old head becomes the new tail
	return newHead
}

// MergeTwoLists merges two sorted lists (LC21). O(m+n) time, O(1) space.
// The dummy head is what makes this loop free of "is the result empty?" checks.
func MergeTwoLists(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val {
			tail.Next, a = a, a.Next
		} else {
			tail.Next, b = b, b.Next
		}
		tail = tail.Next
	}
	if a != nil { // at most one list remains; splice it wholesale
		tail.Next = a
	} else {
		tail.Next = b
	}
	return dummy.Next
}

// MergeKLists merges k sorted lists by divide and conquer (LC23).
// O(N log k) where N is the total node count.
//
// WHY PAIRWISE BEATS SEQUENTIAL: merging one list at a time re-walks the
// growing accumulator k times => O(N·k). Halving the number of lists each round
// means every node is touched only log k times. (A k-way min-heap gives the
// same complexity — see the heaptopk package.)
func MergeKLists(lists []*ListNode) *ListNode {
	if len(lists) == 0 {
		return nil
	}
	for len(lists) > 1 {
		merged := make([]*ListNode, 0, (len(lists)+1)/2)
		for i := 0; i < len(lists); i += 2 {
			if i+1 < len(lists) {
				merged = append(merged, MergeTwoLists(lists[i], lists[i+1]))
			} else {
				merged = append(merged, lists[i])
			}
		}
		lists = merged
	}
	return lists[0]
}

// RemoveNthFromEnd deletes the nth node from the end in ONE pass (LC19).
//
// THE GAP TRICK: move `fast` n steps ahead, then advance both. When fast falls
// off the end, slow is exactly n from the end. The dummy head makes deleting
// the actual head require no special case.
func RemoveNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{Next: head}
	fast, slow := dummy, dummy
	for i := 0; i < n; i++ {
		if fast.Next == nil {
			return head // n is larger than the list
		}
		fast = fast.Next
	}
	for fast.Next != nil {
		fast = fast.Next
		slow = slow.Next
	}
	slow.Next = slow.Next.Next
	return dummy.Next
}

// ---------------------------------------------------------------------------
// Fast & slow pointers
// ---------------------------------------------------------------------------

// MiddleNode returns the middle node, the second one if the length is even
// (LC876). fast moves twice per step, so when it exits slow is at the middle.
func MiddleNode(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	return slow
}

// HasCycle detects a cycle in O(1) space (LC141).
//
// WHY IT MUST MEET: inside a cycle, fast gains exactly one position per step on
// slow. A gap that shrinks by one every step cannot skip zero, so they collide.
func HasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}

// DetectCycleStart returns the node where the cycle begins, or nil (LC142).
//
// PHASE 2 (the part people forget): after the meeting, reset one pointer to the
// head and advance BOTH one step at a time. The distance from head to the cycle
// entry equals the distance from the meeting point to the entry, so they meet
// exactly there.
func DetectCycleStart(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast { // phase 2
			for p := head; p != slow; p = p.Next {
				slow = slow.Next
			}
			return slow
		}
	}
	return nil
}

// IsPalindromeList checks a list in O(n) time, O(1) space (LC234).
// COMPOSITION OF THREE PRIMITIVES: find middle, reverse the second half,
// compare the halves. Mutates the list — say so in an interview, and note that
// restoring it afterwards is a one-line follow-up.
func IsPalindromeList(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	second := ReverseList(slow)
	for a, b := head, second; b != nil; a, b = a.Next, b.Next {
		if a.Val != b.Val {
			return false
		}
	}
	return true
}

// ReorderList interleaves L0 -> Ln -> L1 -> Ln-1 … in place (LC143).
// Again three primitives: split at the middle, reverse the tail, zip together.
func ReorderList(head *ListNode) {
	if head == nil || head.Next == nil {
		return
	}
	// 1. Find the node before the second half and cut the list in two.
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	second := ReverseList(slow.Next)
	slow.Next = nil

	// 2. Zip. The first half is never shorter, so it drives the loop.
	first := head
	for second != nil {
		fNext, sNext := first.Next, second.Next
		first.Next = second
		second.Next = fNext
		first, second = fNext, sNext
	}
}

// ---------------------------------------------------------------------------
// The same pattern on an ARRAY — the transfer that impresses interviewers
// ---------------------------------------------------------------------------

// FindDuplicate finds the one repeated value in nums, where every value is in
// [1, n-1] (LC287). O(n) time, O(1) space, WITHOUT modifying the input.
//
// THE REFRAME: read i -> nums[i] as "node i points to node nums[i]". Because
// values are in [1, n-1], no edge leads to index 0, so index 0 can never be
// re-entered — the walk must therefore enter a cycle, and the duplicate is the
// value two different indices point at: the cycle's entry node.
//
// Cyclic sort (see the cyclicsort package) also solves this, but it mutates the
// array. Floyd is the answer when "do not modify the input" is a constraint.
func FindDuplicate(nums []int) int {
	slow, fast := 0, 0
	for {
		slow = nums[slow]
		fast = nums[nums[fast]]
		if slow == fast {
			break
		}
	}
	slow = 0 // phase 2: walk to the cycle entry
	for slow != fast {
		slow = nums[slow]
		fast = nums[fast]
	}
	return slow
}
