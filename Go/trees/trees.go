// Package trees covers binary-tree DFS and BFS.
//
// PATTERN         Tree DFS (recursion) and BFS (queue)
// WHEN TO USE     DFS for "path / validate / combine subtree answers";
// BFS for "level / depth / nearest / shortest".
// WASTE IT KILLS  Re-walking subtrees. Each node is visited once, O(n).
//
// THE ONE QUESTION THAT WRITES A DFS FOR YOU:
// "what do I need FROM my children, and what do I return TO my parent?"
// Often those differ — Diameter returns a height upward while recording the
// widest path in a closure; MaxPathSum returns a one-armed gain while recording
// a two-armed best. Noticing that split is the whole trick.
//
// THREE THINGS TO SAY ABOUT COMPLEXITY: time O(n); space O(h) for the recursion
// stack, which is O(log n) balanced but O(n) for a degenerate list-shaped tree.
package trees

import (
	"math"
	"strconv"
	"strings"
)

// TreeNode is a binary tree node.
type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

// Null marks an absent child in the level-order helpers below.
const Null = math.MinInt

// FromLevelOrder builds a tree from LeetCode-style level order, using Null for
// a missing child. Test helper — and the fastest way to hand-build examples.
func FromLevelOrder(vals []int) *TreeNode {
	if len(vals) == 0 || vals[0] == Null {
		return nil
	}
	root := &TreeNode{Val: vals[0]}
	queue := []*TreeNode{root}
	i := 1
	for len(queue) > 0 && i < len(vals) {
		node := queue[0]
		queue = queue[1:]
		if i < len(vals) {
			if vals[i] != Null {
				node.Left = &TreeNode{Val: vals[i]}
				queue = append(queue, node.Left)
			}
			i++
		}
		if i < len(vals) {
			if vals[i] != Null {
				node.Right = &TreeNode{Val: vals[i]}
				queue = append(queue, node.Right)
			}
			i++
		}
	}
	return root
}

// ---------------------------------------------------------------------------
// DFS: combine answers from below
// ---------------------------------------------------------------------------

// MaxDepth returns the height in nodes (LC104). The simplest possible
// "combine the children" recursion — the template for everything below.
func MaxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return 1 + max(MaxDepth(root.Left), MaxDepth(root.Right))
}

// InvertTree mirrors the tree (LC226). Swap, then recurse — or recurse, then
// swap. Both work, because the swap and the recursion are independent.
func InvertTree(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	root.Left, root.Right = InvertTree(root.Right), InvertTree(root.Left)
	return root
}

// IsSameTree compares structure AND values (LC100).
// Note the nil handling: both nil is true, one nil is false. Getting those two
// base cases right is most of the problem.
func IsSameTree(a, b *TreeNode) bool {
	if a == nil || b == nil {
		return a == b // true only when both are nil
	}
	return a.Val == b.Val && IsSameTree(a.Left, b.Left) && IsSameTree(a.Right, b.Right)
}

// IsSubtree reports whether sub appears as a complete subtree of root (LC572).
// O(m·n) worst case: try IsSameTree at every node.
func IsSubtree(root, sub *TreeNode) bool {
	if sub == nil {
		return true
	}
	if root == nil {
		return false
	}
	if IsSameTree(root, sub) {
		return true
	}
	return IsSubtree(root.Left, sub) || IsSubtree(root.Right, sub)
}

// DiameterOfBinaryTree returns the longest path in EDGES between any two nodes
// (LC543). O(n).
//
// THE SPLIT THAT MAKES IT ONE PASS: the recursion returns HEIGHT to the parent,
// but the answer is recorded in a closure. A node's best path through itself is
// leftHeight + rightHeight; the parent only needs the taller arm plus one.
func DiameterOfBinaryTree(root *TreeNode) int {
	best := 0
	var height func(*TreeNode) int
	height = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l, r := height(n.Left), height(n.Right)
		best = max(best, l+r) // path bending at n
		return 1 + max(l, r)  // what the parent needs
	}
	height(root)
	return best
}

// IsBalanced reports whether every node's subtrees differ in height by <= 1
// (LC110). O(n).
//
// THE TRICK: return -1 as a poison value meaning "already unbalanced below".
// Computing height and checking balance in the same pass avoids the O(n²) of
// calling a separate height() at every node.
func IsBalanced(root *TreeNode) bool {
	var check func(*TreeNode) int
	check = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l := check(n.Left)
		if l == -1 {
			return -1
		}
		r := check(n.Right)
		if r == -1 {
			return -1
		}
		if l-r > 1 || r-l > 1 {
			return -1
		}
		return 1 + max(l, r)
	}
	return check(root) != -1
}

// GoodNodes counts nodes with no strictly greater ancestor (LC1448).
// The template for "carry information DOWN the tree" as a parameter, rather
// than combining answers coming up.
func GoodNodes(root *TreeNode) int {
	if root == nil {
		return 0
	}
	var dfs func(n *TreeNode, maxSoFar int) int
	dfs = func(n *TreeNode, maxSoFar int) int {
		if n == nil {
			return 0
		}
		count := 0
		if n.Val >= maxSoFar {
			count = 1
		}
		best := max(maxSoFar, n.Val)
		return count + dfs(n.Left, best) + dfs(n.Right, best)
	}
	return dfs(root, root.Val)
}

// MaxPathSum is Binary Tree Maximum Path Sum (LC124). O(n).
//
// TWO IDEAS AT ONCE:
//  1. Clamp a negative arm to 0 — you may always decline to extend into a
//     subtree that would only subtract.
//  2. A path may bend at a node (use both arms) but a parent can only receive
//     ONE arm, so the return value and the recorded best differ.
func MaxPathSum(root *TreeNode) int {
	if root == nil {
		return 0
	}
	best := math.MinInt
	var gain func(*TreeNode) int
	gain = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l := max(gain(n.Left), 0) // clamp: decline negative arms
		r := max(gain(n.Right), 0)
		best = max(best, n.Val+l+r) // path bending here uses both arms
		return n.Val + max(l, r)    // the parent can only take one
	}
	gain(root)
	return best
}

// ---------------------------------------------------------------------------
// BST: sortedness is the extra tool
// ---------------------------------------------------------------------------

// IsValidBST validates a BST (LC98).
//
// THE CLASSIC WRONG ANSWER is comparing each node only with its children. A
// value must respect every ANCESTOR, so pass the allowed range down.
//
// Bounds are *TreeNode rather than ints on purpose: sentinel ints would break
// on a tree that legitimately contains math.MinInt.
func IsValidBST(root *TreeNode) bool {
	var check func(n, lo, hi *TreeNode) bool
	check = func(n, lo, hi *TreeNode) bool {
		if n == nil {
			return true
		}
		if lo != nil && n.Val <= lo.Val {
			return false
		}
		if hi != nil && n.Val >= hi.Val {
			return false
		}
		// Going left tightens the upper bound; going right the lower bound.
		return check(n.Left, lo, n) && check(n.Right, n, hi)
	}
	return check(root, nil, nil)
}

// InorderTraversal returns values in sorted order for a BST (LC94), iteratively.
//
// WHY ITERATIVE MATTERS: it is the honest answer to "can you do it without
// recursion?" and it is the engine behind KthSmallest's early exit.
func InorderTraversal(root *TreeNode) []int {
	out := []int{}
	stack := []*TreeNode{}
	for node := root; node != nil || len(stack) > 0; {
		for node != nil { // dive left, remembering the way back
			stack = append(stack, node)
			node = node.Left
		}
		node = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		out = append(out, node.Val)
		node = node.Right // the left subtree and node are done
	}
	return out
}

// KthSmallest returns the kth smallest value in a BST (LC230), 1-indexed.
// An inorder walk that STOPS at k: O(h + k), not O(n).
func KthSmallest(root *TreeNode, k int) int {
	stack := []*TreeNode{}
	seen := 0
	for node := root; node != nil || len(stack) > 0; {
		for node != nil {
			stack = append(stack, node)
			node = node.Left
		}
		node = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		seen++
		if seen == k {
			return node.Val
		}
		node = node.Right
	}
	return -1
}

// LowestCommonAncestorBST finds the LCA of two values in a BST (LC235).
// O(h) time, O(1) space — no recursion needed.
//
// THE SPLIT POINT IS THE ANSWER: while both targets sit on the same side, walk
// that way; the first node where they diverge (or equals one of them) is the LCA.
func LowestCommonAncestorBST(root *TreeNode, p, q int) *TreeNode {
	for n := root; n != nil; {
		switch {
		case p < n.Val && q < n.Val:
			n = n.Left
		case p > n.Val && q > n.Val:
			n = n.Right
		default:
			return n // diverged here
		}
	}
	return nil
}

// ---------------------------------------------------------------------------
// BFS: anything about levels
// ---------------------------------------------------------------------------

// LevelOrder returns node values level by level (LC102). O(n).
//
// THE ESSENTIAL DETAIL: capture len(queue) BEFORE the inner loop. That frozen
// count is exactly one level; reading len(queue) inside would keep growing as
// children are appended and the levels would smear together.
func LevelOrder(root *TreeNode) [][]int {
	out := [][]int{}
	if root == nil {
		return out
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue) // this level, frozen
		level := make([]int, 0, size)
		for range size {
			node := queue[0]
			queue = queue[1:]
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		out = append(out, level)
	}
	return out
}

// RightSideView returns the last node of each level (LC199).
// Same skeleton as LevelOrder — only what you record per level changes.
func RightSideView(root *TreeNode) []int {
	out := []int{}
	if root == nil {
		return out
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue)
		for i := range size {
			node := queue[0]
			queue = queue[1:]
			if i == size-1 { // rightmost of this level
				out = append(out, node.Val)
			}
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
	}
	return out
}

// ZigzagLevelOrder alternates direction per level (LC103).
// Do NOT reverse the queue — traverse normally and reverse the recorded level.
func ZigzagLevelOrder(root *TreeNode) [][]int {
	out := LevelOrder(root)
	for i := range out {
		if i%2 == 1 {
			level := out[i]
			for l, r := 0, len(level)-1; l < r; l, r = l+1, r-1 {
				level[l], level[r] = level[r], level[l]
			}
		}
	}
	return out
}

// ---------------------------------------------------------------------------
// Construct and serialise
// ---------------------------------------------------------------------------

// BuildTree reconstructs a tree from preorder + inorder (LC105). O(n).
//
// HOW THE TWO ORDERS COOPERATE: preorder hands you the root; inorder tells you
// how many nodes sit in its left subtree. The index map turns "find the root in
// inorder" from O(n) into O(1), which is what makes the whole thing linear.
func BuildTree(preorder, inorder []int) *TreeNode {
	pos := make(map[int]int, len(inorder))
	for i, v := range inorder {
		pos[v] = i
	}
	pre := 0
	var build func(lo, hi int) *TreeNode
	build = func(lo, hi int) *TreeNode {
		if lo > hi {
			return nil
		}
		val := preorder[pre]
		pre++
		node := &TreeNode{Val: val}
		mid := pos[val]
		node.Left = build(lo, mid-1)  // consumes the left subtree's preorder
		node.Right = build(mid+1, hi) // ...then the right subtree's
		return node
	}
	return build(0, len(inorder)-1)
}

// Serialize encodes a tree as preorder with '#' for nil (LC297).
//
// WHY PREORDER PLUS NIL MARKERS: the markers make the shape unambiguous, so one
// traversal suffices. Plain preorder without them cannot be decoded — many
// different trees share a preorder once the nils are dropped.
func Serialize(root *TreeNode) string {
	var b strings.Builder
	var dfs func(*TreeNode)
	dfs = func(n *TreeNode) {
		if n == nil {
			b.WriteString("#,")
			return
		}
		b.WriteString(strconv.Itoa(n.Val))
		b.WriteByte(',')
		dfs(n.Left)
		dfs(n.Right)
	}
	dfs(root)
	return b.String()
}

// Deserialize rebuilds what Serialize wrote. The shared cursor `i` is what lets
// one linear scan reconstruct the branching structure.
func Deserialize(data string) *TreeNode {
	tokens := strings.Split(data, ",")
	i := 0
	var build func() *TreeNode
	build = func() *TreeNode {
		if i >= len(tokens) {
			return nil
		}
		tok := tokens[i]
		i++
		if tok == "#" || tok == "" {
			return nil
		}
		v, _ := strconv.Atoi(tok)
		return &TreeNode{Val: v, Left: build(), Right: build()}
	}
	return build()
}

// ---------------------------------------------------------------------------
// PARITY BLOCK — mirrored from the JavaScript side
// (DSA_ProblemSolving_patterns/src/problems/TreeTraversal/treePatterns.ts).
//
// The teaching narrative — mental model, dry-runs, why each traversal order is
// the one the problem needs — lives in the JS file. Documented here is only
// what Go does differently, marked "GO NOTE".
// ---------------------------------------------------------------------------

// LowestCommonAncestor is LC236: the LCA in a PLAIN binary tree, with no
// ordering to exploit. O(n) time, O(h) space. JS: lowestCommonAncestor.
//
// Compare LowestCommonAncestorBST above: there, comparing values discards half
// the tree at every step (O(h), one downward walk). Here nothing hints where a
// value lives, so both subtrees must be searched. Being asked LC235 right
// after LC236 is a test of whether you notice and exploit the extra structure.
//
// THE RETURN VALUE CARRIES TWO MEANINGS, which is the trick: "I found one of
// the targets" on the way up, and "I am the split point" once both sides have
// reported a find. A node that hears back from BOTH children is the LCA.
//
// GO NOTE — p and q are VALUES (ints), not *TreeNode, matching
// LowestCommonAncestorBST's signature in this package. LeetCode's Go template
// passes nodes and compares pointers; values are equivalent here because
// LeetCode guarantees unique values, and they keep the two LCA functions
// callable the same way. If duplicate values were possible you would have to
// switch to pointer identity (node == p), since == on two *TreeNode compares
// ADDRESSES, while comparing the structs (*node == *p) would compare fields
// and match unrelated look-alike nodes.
func LowestCommonAncestor(root *TreeNode, p, q int) *TreeNode {
	if root == nil || root.Val == p || root.Val == q {
		return root // found a target, or ran out of tree
	}

	left := LowestCommonAncestor(root.Left, p, q)
	right := LowestCommonAncestor(root.Right, p, q)

	switch {
	case left != nil && right != nil:
		return root // one target on each side → this node is the split point
	case left != nil:
		return left // both targets are somewhere below-left
	default:
		return right
	}
}

// BuildTreeFromInorderPostorder rebuilds a tree from its inorder and postorder
// traversals (LC106). O(n) time and space.
// JS: buildTreeFromInorderPostorder.
//
// THE KEY FACTS: postorder's LAST element is always the root (preorder's FIRST
// is, which is the only real difference from LC105). Inorder then splits into
// everything left of the root and everything right of it, giving the two
// subtree sizes. Consume postorder from the BACK, and build the RIGHT subtree
// before the left — because the right subtree's nodes sit closer to the end.
//
// GO NOTE — the index map turns the O(n) "find the root in inorder" scan into
// O(1), making the whole build O(n) instead of O(n²). Two Go specifics:
//   - map[int]int must be created with make (or a literal); writing to a nil
//     map panics, unlike reading from one, which quietly returns the zero value.
//   - postIdx is captured by the closure and mutated, so build() must not be
//     called concurrently — the shared cursor is the whole mechanism.
func BuildTreeFromInorderPostorder(inorder, postorder []int) *TreeNode {
	if len(inorder) == 0 || len(inorder) != len(postorder) {
		return nil
	}

	indexOf := make(map[int]int, len(inorder))
	for i, v := range inorder {
		indexOf[v] = i
	}

	postIdx := len(postorder) - 1

	// build owns the inorder range [lo, hi]; it consumes postorder backwards.
	var build func(lo, hi int) *TreeNode
	build = func(lo, hi int) *TreeNode {
		if lo > hi {
			return nil
		}
		rootVal := postorder[postIdx]
		postIdx--

		node := &TreeNode{Val: rootVal}
		mid := indexOf[rootVal]

		// RIGHT FIRST — its nodes are the ones nearest the end of postorder.
		node.Right = build(mid+1, hi)
		node.Left = build(lo, mid-1)
		return node
	}

	return build(0, len(inorder)-1)
}

// HasPathSum reports whether some ROOT-TO-LEAF path sums to target (LC112).
// O(n) time, O(h) space. JS: hasPathSum.
//
// THE TWO TRAPS, both worth stating out loud:
//   - The path must end at a LEAF. Stopping at an internal node whose running
//     sum happens to match is wrong.
//   - An empty tree has NO paths, so it is false even for target 0. Returning
//     true there is the most common wrong answer.
//
// Subtracting as you descend (rather than accumulating) keeps the leaf test to
// a single comparison: at a leaf, the remainder must be exactly its value.
func HasPathSum(root *TreeNode, target int) bool {
	if root == nil {
		return false // no path exists at all — not "a path summing to 0"
	}
	if root.Left == nil && root.Right == nil {
		return target == root.Val // leaf: the remainder must land exactly
	}
	remaining := target - root.Val
	return HasPathSum(root.Left, remaining) || HasPathSum(root.Right, remaining)
}

// PathSum collects EVERY root-to-leaf path summing to target (LC113).
// O(n·h) time (each of up to n/2 leaves copies a path of length h),
// O(h) working space. JS: pathSum.
//
// The backtracking shape: append on the way down, pop on the way back up, so
// one shared slice represents the current path instead of allocating a new one
// per node.
//
// GO NOTE — ⚠️ THE APPEND ALIASING BUG THIS PROBLEM IS FAMOUS FOR IN GO.
// You MUST copy the path before storing it:
//
//	out = append(out, slices.Clone(path))   // correct
//	out = append(out, path)                 // BUG: stores a VIEW
//
// A slice is a pointer to a backing array, so storing `path` directly means
// every stored result aliases the same array — later backtracking overwrites
// answers you already "saved", and you finish with N copies of whichever path
// was explored last. JS has no such trap because `[...path]` is idiomatic and
// `path.slice()` is what people reach for anyway; in Go the aliasing version
// compiles, runs, and silently returns wrong data.
func PathSum(root *TreeNode, target int) [][]int {
	out := [][]int{}
	path := []int{}

	var walk func(node *TreeNode, remaining int)
	walk = func(node *TreeNode, remaining int) {
		if node == nil {
			return
		}

		path = append(path, node.Val) // choose
		remaining -= node.Val

		if node.Left == nil && node.Right == nil && remaining == 0 {
			// Clone: storing `path` itself would alias the backing array.
			out = append(out, append([]int(nil), path...))
		} else {
			walk(node.Left, remaining)
			walk(node.Right, remaining)
		}

		path = path[:len(path)-1] // un-choose (backtrack)
	}

	walk(root, target)
	return out
}

// CountNodes counts the nodes of a COMPLETE binary tree faster than O(n)
// (LC222). O((log n)²) time, O(log n) space. JS: countNodes.
//
// WHY IT BEATS THE OBVIOUS COUNT: "1 + left + right" visits every node and
// ignores the completeness guarantee. Instead, walk strictly left and strictly
// right. If those two heights are EQUAL, completeness proves the subtree is
// PERFECT, and a perfect tree's size is the closed form 2^h - 1 — no traversal
// needed. Only when they differ do you recurse, and then on a smaller problem.
//
// GO NOTE — the size is computed as a bit shift, 1<<height - 1, rather than
// math.Pow. math.Pow returns a float64 and would need converting back, which
// invites a rounding error for large heights; shifting is exact integer
// arithmetic. Reaching for a shift where a power of two is meant is the
// idiomatic Go move.
func CountNodes(root *TreeNode) int {
	if root == nil {
		return 0
	}

	leftHeight, rightHeight := 0, 0
	for n := root; n != nil; n = n.Left {
		leftHeight++
	}
	for n := root; n != nil; n = n.Right {
		rightHeight++
	}

	if leftHeight == rightHeight {
		return 1<<leftHeight - 1 // perfect subtree: exact closed form
	}

	return 1 + CountNodes(root.Left) + CountNodes(root.Right)
}

// FindShortestPathInFullBinaryTree returns the number of edges between nodes
// labelled i and j in an implicit 1-indexed full binary tree, where the root
// is 1 and node x's children are 2x and 2x+1. O(log(max(i,j))) time, O(1)
// space. JS: findShortestPathInFullBinaryTree.
//
// NO TREE IS EVER BUILT. That labelling makes "go to my parent" pure
// arithmetic — parent(x) = x/2 — so this reduces to the LCA idea above:
// lift the deeper label until both sit at the same depth, then lift both in
// lockstep until they meet. Every lift is one edge, so the total number of
// lifts IS the answer.
//
// GO NOTE — integer division x/2 truncates toward zero, which for positive
// labels is exactly the floor this problem wants, so no explicit floor is
// needed (contrast JS, where / is float division and Math.floor is required).
// Equivalent and marginally more idiomatic for a halving: x >> 1.
func FindShortestPathInFullBinaryTree(i, j int) int {
	depthOf := func(x int) int {
		d := 0
		for ; x > 1; x >>= 1 {
			d++
		}
		return d
	}

	a, b := i, j
	depthA, depthB := depthOf(a), depthOf(b)
	movesA, movesB := 0, 0

	// Lift the deeper label until the two depths match.
	for depthA > depthB {
		a >>= 1
		depthA--
		movesA++
	}
	for depthB > depthA {
		b >>= 1
		depthB--
		movesB++
	}

	// Now lift both together until they land on the same ancestor (the LCA).
	for a != b {
		a >>= 1
		b >>= 1
		movesA++
		movesB++
	}

	return movesA + movesB
}
