package graphs

import (
	"reflect"
	"slices"
	"testing"
)

func byteGrid(rows ...string) [][]byte {
	out := make([][]byte, len(rows))
	for i, r := range rows {
		out[i] = []byte(r)
	}
	return out
}

func TestNumIslands(t *testing.T) {
	cases := []struct {
		grid []string
		want int
	}{
		{[]string{"11110", "11010", "11000", "00000"}, 1},
		{[]string{"11000", "11000", "00100", "00011"}, 3},
		{[]string{"000", "000"}, 0},
		{[]string{"1"}, 1},
		// Diagonal touching does NOT connect — only 4-directional adjacency does.
		{[]string{"10", "01"}, 2},
	}
	for _, c := range cases {
		if got := NumIslands(byteGrid(c.grid...)); got != c.want {
			t.Errorf("NumIslands(%v) = %d, want %d", c.grid, got, c.want)
		}
	}
	if got := NumIslands(nil); got != 0 {
		t.Errorf("NumIslands(nil) = %d", got)
	}
}

func TestMaxAreaOfIsland(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{1, 1, 0}, {1, 0, 0}, {0, 0, 1}}, 3},
		{[][]int{{0, 0}, {0, 0}}, 0},
		{[][]int{{1, 1}, {1, 1}}, 4},
		// Every 1 here is one component: the right block joins the left column
		// along row 0 and row 2. Worth tracing by hand — it looks like 3 islands.
		{[][]int{{1, 0, 1, 1, 1}, {1, 0, 1, 0, 1}, {1, 1, 1, 0, 1}}, 11},
		// Genuinely separate blobs of 4 and 2.
		{[][]int{{1, 1, 0, 0}, {1, 1, 0, 0}, {0, 0, 1, 1}}, 4},
	}
	for _, c := range cases {
		if got := MaxAreaOfIsland(c.grid); got != c.want {
			t.Errorf("MaxAreaOfIsland = %d, want %d", got, c.want)
		}
	}
}

func TestPacificAtlantic(t *testing.T) {
	heights := [][]int{
		{1, 2, 2, 3, 5},
		{3, 2, 3, 4, 4},
		{2, 4, 5, 3, 1},
		{6, 7, 1, 4, 5},
		{5, 1, 1, 2, 4},
	}
	want := [][]int{{0, 4}, {1, 3}, {1, 4}, {2, 2}, {3, 0}, {3, 1}, {4, 0}}
	if got := PacificAtlantic(heights); !reflect.DeepEqual(got, want) {
		t.Errorf("PacificAtlantic = %v, want %v", got, want)
	}
	// A single cell touches both oceans by definition.
	if got := PacificAtlantic([][]int{{1}}); !reflect.DeepEqual(got, [][]int{{0, 0}}) {
		t.Errorf("PacificAtlantic single = %v", got)
	}
	if got := PacificAtlantic(nil); got != nil {
		t.Errorf("PacificAtlantic(nil) = %v", got)
	}
}

func TestSolveSurroundedRegions(t *testing.T) {
	board := byteGrid("XXXX", "XOOX", "XXOX", "XOXX")
	SolveSurroundedRegions(board)
	want := byteGrid("XXXX", "XXXX", "XXXX", "XOXX")
	for i := range board {
		if !slices.Equal(board[i], want[i]) {
			t.Errorf("row %d = %q, want %q", i, board[i], want[i])
		}
	}
	// Every 'O' touches the border here, so nothing may be flipped.
	open := byteGrid("OO", "OO")
	SolveSurroundedRegions(open)
	for i := range open {
		if !slices.Equal(open[i], []byte("OO")) {
			t.Errorf("border-connected region was wrongly flipped: %q", open[i])
		}
	}
}

func TestOrangesRotting(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}}, 4},
		{[][]int{{2, 1, 1}, {0, 1, 1}, {1, 0, 1}}, -1}, // walled-off orange
		{[][]int{{0, 2}}, 0},                           // nothing fresh: 0, not -1
		{[][]int{{1}}, -1},                             // fresh but no source
		{[][]int{{2}}, 0},
	}
	for _, c := range cases {
		if got := OrangesRotting(c.grid); got != c.want {
			t.Errorf("OrangesRotting = %d, want %d", got, c.want)
		}
	}
}

func TestWallsAndGates(t *testing.T) {
	rooms := [][]int{
		{Inf, -1, 0, Inf},
		{Inf, Inf, Inf, -1},
		{Inf, -1, Inf, -1},
		{0, -1, Inf, Inf},
	}
	WallsAndGates(rooms)
	want := [][]int{
		{3, -1, 0, 1},
		{2, 2, 1, -1},
		{1, -1, 2, -1},
		{0, -1, 3, 4},
	}
	if !reflect.DeepEqual(rooms, want) {
		t.Errorf("WallsAndGates = %v, want %v", rooms, want)
	}
	// A room with no reachable gate must stay Inf.
	isolated := [][]int{{Inf, -1}, {-1, 0}}
	WallsAndGates(isolated)
	if isolated[0][0] != Inf {
		t.Errorf("unreachable room = %d, want Inf", isolated[0][0])
	}
}

func TestCloneGraph(t *testing.T) {
	// Build 1-2, 1-4, 2-3, 3-4 (a square).
	n1 := &Node{Val: 1}
	n2 := &Node{Val: 2}
	n3 := &Node{Val: 3}
	n4 := &Node{Val: 4}
	n1.Neighbors = []*Node{n2, n4}
	n2.Neighbors = []*Node{n1, n3}
	n3.Neighbors = []*Node{n2, n4}
	n4.Neighbors = []*Node{n1, n3}

	clone := CloneGraph(n1)
	if clone == nil || clone.Val != 1 {
		t.Fatalf("CloneGraph = %v", clone)
	}
	if clone == n1 {
		t.Fatal("clone must be a distinct node, not the original")
	}
	// Walk the clone and verify shape, values, and that no original leaked in.
	seen := map[*Node]bool{}
	originals := map[*Node]bool{n1: true, n2: true, n3: true, n4: true}
	var walk func(*Node)
	walk = func(n *Node) {
		if n == nil || seen[n] {
			return
		}
		seen[n] = true
		if originals[n] {
			t.Errorf("clone references an original node with Val %d", n.Val)
		}
		if len(n.Neighbors) != 2 {
			t.Errorf("node %d has %d neighbours, want 2", n.Val, len(n.Neighbors))
		}
		for _, nb := range n.Neighbors {
			walk(nb)
		}
	}
	walk(clone)
	if len(seen) != 4 {
		t.Errorf("clone has %d nodes, want 4", len(seen))
	}

	if got := CloneGraph(nil); got != nil {
		t.Error("CloneGraph(nil) must be nil")
	}
	// A lone node with a self-loop is the tightest cycle the map must survive.
	solo := &Node{Val: 1}
	solo.Neighbors = []*Node{solo}
	c := CloneGraph(solo)
	if c == solo || c.Neighbors[0] != c {
		t.Error("self-loop was not cloned correctly")
	}
}
