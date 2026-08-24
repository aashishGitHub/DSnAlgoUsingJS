package trees

import (
	"reflect"
	"slices"
	"testing"
)

// flatten turns a level-order result into one slice for terser assertions.
func flatten(levels [][]int) []int {
	out := []int{}
	for _, l := range levels {
		out = append(out, l...)
	}
	return out
}

func TestMaxDepth(t *testing.T) {
	if got := MaxDepth(FromLevelOrder([]int{3, 9, 20, Null, Null, 15, 7})); got != 3 {
		t.Errorf("MaxDepth = %d, want 3", got)
	}
	if got := MaxDepth(FromLevelOrder([]int{1, Null, 2})); got != 2 {
		t.Errorf("MaxDepth = %d, want 2", got)
	}
	if got := MaxDepth(nil); got != 0 {
		t.Errorf("MaxDepth(nil) = %d, want 0", got)
	}
}

func TestInvertTree(t *testing.T) {
	root := InvertTree(FromLevelOrder([]int{4, 2, 7, 1, 3, 6, 9}))
	if got := flatten(LevelOrder(root)); !slices.Equal(got, []int{4, 7, 2, 9, 6, 3, 1}) {
		t.Errorf("InvertTree = %v", got)
	}
	if got := InvertTree(nil); got != nil {
		t.Error("InvertTree(nil) should be nil")
	}
}

func TestIsSameTree(t *testing.T) {
	a := FromLevelOrder([]int{1, 2, 3})
	b := FromLevelOrder([]int{1, 2, 3})
	if !IsSameTree(a, b) {
		t.Error("expected equal trees")
	}
	// Same values, different SHAPE — the case a value-only check would miss.
	if IsSameTree(FromLevelOrder([]int{1, 2}), FromLevelOrder([]int{1, Null, 2})) {
		t.Error("different shapes must not be equal")
	}
	if !IsSameTree(nil, nil) {
		t.Error("nil == nil")
	}
	if IsSameTree(a, nil) {
		t.Error("tree != nil")
	}
}

func TestIsSubtree(t *testing.T) {
	if !IsSubtree(FromLevelOrder([]int{3, 4, 5, 1, 2}), FromLevelOrder([]int{4, 1, 2})) {
		t.Error("expected a subtree match")
	}
	// The candidate matches only PARTIALLY — it has an extra descendant.
	root := FromLevelOrder([]int{3, 4, 5, 1, 2, Null, Null, Null, Null, 0})
	if IsSubtree(root, FromLevelOrder([]int{4, 1, 2})) {
		t.Error("a partial match must not count")
	}
}

func TestDiameterOfBinaryTree(t *testing.T) {
	if got := DiameterOfBinaryTree(FromLevelOrder([]int{1, 2, 3, 4, 5})); got != 3 {
		t.Errorf("Diameter = %d, want 3", got)
	}
	if got := DiameterOfBinaryTree(FromLevelOrder([]int{1, 2})); got != 1 {
		t.Errorf("Diameter = %d, want 1", got)
	}
	if got := DiameterOfBinaryTree(nil); got != 0 {
		t.Errorf("Diameter(nil) = %d", got)
	}
}

func TestIsBalanced(t *testing.T) {
	if !IsBalanced(FromLevelOrder([]int{3, 9, 20, Null, Null, 15, 7})) {
		t.Error("expected balanced")
	}
	if IsBalanced(FromLevelOrder([]int{1, 2, 2, 3, 3, Null, Null, 4, 4})) {
		t.Error("expected unbalanced")
	}
	if !IsBalanced(nil) {
		t.Error("nil is balanced")
	}
}

func TestGoodNodes(t *testing.T) {
	if got := GoodNodes(FromLevelOrder([]int{3, 1, 4, 3, Null, 1, 5})); got != 4 {
		t.Errorf("GoodNodes = %d, want 4", got)
	}
	if got := GoodNodes(FromLevelOrder([]int{3, 3, Null, 4, 2})); got != 3 {
		t.Errorf("GoodNodes = %d, want 3", got)
	}
	if got := GoodNodes(FromLevelOrder([]int{1})); got != 1 {
		t.Errorf("GoodNodes = %d, want 1", got)
	}
}

func TestMaxPathSum(t *testing.T) {
	cases := []struct {
		vals []int
		want int
	}{
		{[]int{1, 2, 3}, 6},
		{[]int{-10, 9, 20, Null, Null, 15, 7}, 42}, // best path skips the root
		{[]int{-3}, -3},                            // all negative: must not return 0
		{[]int{2, -1}, 2},                          // declining the negative arm
	}
	for _, c := range cases {
		if got := MaxPathSum(FromLevelOrder(c.vals)); got != c.want {
			t.Errorf("MaxPathSum(%v) = %d, want %d", c.vals, got, c.want)
		}
	}
}

func TestIsValidBST(t *testing.T) {
	cases := []struct {
		vals []int
		want bool
	}{
		{[]int{2, 1, 3}, true},
		{[]int{5, 1, 4, Null, Null, 3, 6}, false},
		// 3 is a valid child of 4 but violates its ANCESTOR 5 — the case that
		// defeats a parent-only comparison.
		{[]int{5, 4, 6, Null, Null, 3, 7}, false},
		{[]int{1, 1}, false}, // duplicates are not allowed in a strict BST
		{[]int{}, true},
	}
	for _, c := range cases {
		if got := IsValidBST(FromLevelOrder(c.vals)); got != c.want {
			t.Errorf("IsValidBST(%v) = %v, want %v", c.vals, got, c.want)
		}
	}
}

func TestInorderTraversal(t *testing.T) {
	if got := InorderTraversal(FromLevelOrder([]int{1, Null, 2, 3})); !slices.Equal(got, []int{1, 3, 2}) {
		t.Errorf("InorderTraversal = %v, want [1 3 2]", got)
	}
	if got := InorderTraversal(FromLevelOrder([]int{2, 1, 3})); !slices.Equal(got, []int{1, 2, 3}) {
		t.Errorf("InorderTraversal = %v", got)
	}
	if got := InorderTraversal(nil); len(got) != 0 {
		t.Errorf("InorderTraversal(nil) = %v", got)
	}
}

func TestKthSmallest(t *testing.T) {
	if got := KthSmallest(FromLevelOrder([]int{3, 1, 4, Null, 2}), 1); got != 1 {
		t.Errorf("KthSmallest = %d, want 1", got)
	}
	if got := KthSmallest(FromLevelOrder([]int{5, 3, 6, 2, 4, Null, Null, 1}), 3); got != 3 {
		t.Errorf("KthSmallest = %d, want 3", got)
	}
	// k beyond the node count must not panic.
	if got := KthSmallest(FromLevelOrder([]int{1}), 5); got != -1 {
		t.Errorf("KthSmallest out of range = %d, want -1", got)
	}
}

func TestLowestCommonAncestorBST(t *testing.T) {
	root := FromLevelOrder([]int{6, 2, 8, 0, 4, 7, 9, Null, Null, 3, 5})
	if got := LowestCommonAncestorBST(root, 2, 8); got == nil || got.Val != 6 {
		t.Errorf("LCA(2,8) = %v, want 6", got)
	}
	// When one node is an ancestor of the other, it is its own LCA.
	if got := LowestCommonAncestorBST(root, 2, 4); got == nil || got.Val != 2 {
		t.Errorf("LCA(2,4) = %v, want 2", got)
	}
	if got := LowestCommonAncestorBST(root, 3, 5); got == nil || got.Val != 4 {
		t.Errorf("LCA(3,5) = %v, want 4", got)
	}
}

func TestLevelOrder(t *testing.T) {
	got := LevelOrder(FromLevelOrder([]int{3, 9, 20, Null, Null, 15, 7}))
	want := [][]int{{3}, {9, 20}, {15, 7}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("LevelOrder = %v, want %v", got, want)
	}
	if got := LevelOrder(nil); len(got) != 0 {
		t.Errorf("LevelOrder(nil) = %v", got)
	}
}

func TestRightSideView(t *testing.T) {
	got := RightSideView(FromLevelOrder([]int{1, 2, 3, Null, 5, Null, 4}))
	if !slices.Equal(got, []int{1, 3, 4}) {
		t.Errorf("RightSideView = %v, want [1 3 4]", got)
	}
	// A level whose only node is a LEFT child still contributes it.
	got = RightSideView(FromLevelOrder([]int{1, 2}))
	if !slices.Equal(got, []int{1, 2}) {
		t.Errorf("RightSideView = %v, want [1 2]", got)
	}
}

func TestZigzagLevelOrder(t *testing.T) {
	got := ZigzagLevelOrder(FromLevelOrder([]int{3, 9, 20, Null, Null, 15, 7}))
	want := [][]int{{3}, {20, 9}, {15, 7}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("ZigzagLevelOrder = %v, want %v", got, want)
	}
}

func TestBuildTree(t *testing.T) {
	root := BuildTree([]int{3, 9, 20, 15, 7}, []int{9, 3, 15, 20, 7})
	want := [][]int{{3}, {9, 20}, {15, 7}}
	if got := LevelOrder(root); !reflect.DeepEqual(got, want) {
		t.Errorf("BuildTree = %v, want %v", got, want)
	}
	if got := LevelOrder(BuildTree([]int{-1}, []int{-1})); !reflect.DeepEqual(got, [][]int{{-1}}) {
		t.Errorf("BuildTree single = %v", got)
	}
	// A left-leaning chain: preorder and inorder are exact reverses.
	root = BuildTree([]int{3, 2, 1}, []int{1, 2, 3})
	if got := flatten(LevelOrder(root)); !slices.Equal(got, []int{3, 2, 1}) {
		t.Errorf("BuildTree chain = %v", got)
	}
}

func TestSerializeRoundTrip(t *testing.T) {
	inputs := [][]int{
		{1, 2, 3, Null, Null, 4, 5},
		{1},
		{},
		{1, Null, 2, Null, 3}, // right-leaning chain
		{-5, -10, 7},
	}
	for _, vals := range inputs {
		original := FromLevelOrder(vals)
		encoded := Serialize(original)
		decoded := Deserialize(encoded)
		if !IsSameTree(original, decoded) {
			t.Errorf("round trip changed the tree for %v (encoded %q)", vals, encoded)
		}
		// Re-encoding must be byte-identical, which pins down the format.
		if again := Serialize(decoded); again != encoded {
			t.Errorf("re-serialise mismatch: %q vs %q", again, encoded)
		}
	}
}
