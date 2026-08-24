// Package graphs covers grid and graph traversal.
//
// PATTERN         DFS / BFS with a visited marker
// WHEN TO USE     islands, regions, flood fill, "can I reach", "how far",
// "how long until everything is infected", cloning a graph.
// WASTE IT KILLS  Re-exploring cells or nodes already accounted for.
//
// DFS OR BFS? THE ONLY QUESTION THAT MATTERS:
//   - Just need to know WHETHER things are connected, or to enumerate a region?
//     DFS. It is shorter and recursion carries the state for you.
//   - Need DISTANCE, "fewest steps", or "how many minutes"? BFS. It visits in
//     order of distance, so the first arrival is the shortest — DFS gives no
//     such guarantee on an unweighted graph.
//
// MULTI-SOURCE BFS is the underused one: seed the queue with EVERY starting
// point before the loop, and all sources expand in lockstep. That turns "how
// long until the whole grid is affected" from n separate searches into one.
//
// GO NOTE — recursion depth: a 1000x1000 grid can nest a million frames deep.
// Go's goroutine stacks grow dynamically (up to 1 GB), so this survives where a
// fixed-stack language would overflow. Still prefer BFS for very large grids.
package graphs

// directions is the four-neighbour offset table. Reaching for a table instead of
// four copy-pasted recursive calls is what keeps these functions short — and it
// generalises to 8 directions by adding the diagonals.
var directions = [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

// ---------------------------------------------------------------------------
// Counting and measuring regions
// ---------------------------------------------------------------------------

// NumIslands counts connected groups of '1' cells (LC200). O(rows·cols).
//
// MUTATES grid: sinking each visited cell to '0' IS the visited set, which
// costs no extra space. If the caller needs the grid intact, say so and use a
// separate visited [][]bool — mention the trade-off rather than silently
// destroying the input.
//
// Every cell is visited at most twice (once by the outer scan, once by a sink),
// so despite the nested loop plus recursion this is linear in the cell count.
func NumIslands(grid [][]byte) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])

	var sink func(r, c int)
	sink = func(r, c int) {
		if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1' {
			return // off the grid, water, or already sunk
		}
		grid[r][c] = '0' // mark BEFORE recursing, or neighbours bounce back
		for _, d := range directions {
			sink(r+d[0], c+d[1])
		}
	}

	count := 0
	for r := range rows {
		for c := range cols {
			if grid[r][c] == '1' {
				count++ // a cell that survived the scan starts a new island
				sink(r, c)
			}
		}
	}
	return count
}

// MaxAreaOfIsland returns the size of the largest island (LC695).
// Same sweep as NumIslands, but the DFS RETURNS a count instead of nothing.
func MaxAreaOfIsland(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])

	var area func(r, c int) int
	area = func(r, c int) int {
		if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != 1 {
			return 0
		}
		grid[r][c] = 0
		size := 1
		for _, d := range directions {
			size += area(r+d[0], c+d[1])
		}
		return size
	}

	best := 0
	for r := range rows {
		for c := range cols {
			if grid[r][c] == 1 {
				best = max(best, area(r, c))
			}
		}
	}
	return best
}

// ---------------------------------------------------------------------------
// Searching INWARD from the border — the reverse-thinking trick
// ---------------------------------------------------------------------------

// PacificAtlantic returns cells that can drain to BOTH oceans (LC417).
//
// THE REFRAME THAT COLLAPSES THE COST: asking "where can this cell flow?" for
// every cell repeats enormous amounts of work. Instead invert the question and
// climb UPHILL from each ocean's border, marking everything that could have
// drained there. Two sweeps, then intersect. O(rows·cols) instead of O((rc)²).
func PacificAtlantic(heights [][]int) [][]int {
	if len(heights) == 0 || len(heights[0]) == 0 {
		return nil
	}
	rows, cols := len(heights), len(heights[0])
	pacific := make([][]bool, rows)
	atlantic := make([][]bool, rows)
	for i := range rows {
		pacific[i] = make([]bool, cols)
		atlantic[i] = make([]bool, cols)
	}

	// climb walks to neighbours that are >= the current height (uphill), which
	// is exactly the reverse of water flowing downhill.
	var climb func(r, c int, seen [][]bool, prev int)
	climb = func(r, c int, seen [][]bool, prev int) {
		if r < 0 || r >= rows || c < 0 || c >= cols || seen[r][c] || heights[r][c] < prev {
			return
		}
		seen[r][c] = true
		for _, d := range directions {
			climb(r+d[0], c+d[1], seen, heights[r][c])
		}
	}

	for c := range cols {
		climb(0, c, pacific, heights[0][c])            // top edge
		climb(rows-1, c, atlantic, heights[rows-1][c]) // bottom edge
	}
	for r := range rows {
		climb(r, 0, pacific, heights[r][0])            // left edge
		climb(r, cols-1, atlantic, heights[r][cols-1]) // right edge
	}

	out := [][]int{}
	for r := range rows {
		for c := range cols {
			if pacific[r][c] && atlantic[r][c] {
				out = append(out, []int{r, c})
			}
		}
	}
	return out
}

// SolveSurroundedRegions flips every 'O' region NOT touching the border to 'X'
// (LC130). Mutates the board.
//
// SAME INVERSION: identifying surrounded regions directly means proving a
// negative. Instead mark the regions reachable from the border as safe ('T'),
// then everything still 'O' is by definition enclosed. Two passes, no bookkeeping.
func SolveSurroundedRegions(board [][]byte) {
	if len(board) == 0 || len(board[0]) == 0 {
		return
	}
	rows, cols := len(board), len(board[0])

	var markSafe func(r, c int)
	markSafe = func(r, c int) {
		if r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != 'O' {
			return
		}
		board[r][c] = 'T' // temporary "reachable from the border" marker
		for _, d := range directions {
			markSafe(r+d[0], c+d[1])
		}
	}

	for r := range rows {
		markSafe(r, 0)
		markSafe(r, cols-1)
	}
	for c := range cols {
		markSafe(0, c)
		markSafe(rows-1, c)
	}
	for r := range rows {
		for c := range cols {
			switch board[r][c] {
			case 'O':
				board[r][c] = 'X' // never reached => enclosed
			case 'T':
				board[r][c] = 'O' // restore the safe ones
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Multi-source BFS: "how long until everything is covered"
// ---------------------------------------------------------------------------

// OrangesRotting returns the minutes until no fresh orange remains, or -1 if
// some orange can never rot (LC994). O(rows·cols).
//
// WHY MULTI-SOURCE: every already-rotten orange starts spreading at minute 0
// simultaneously. Seeding the queue with all of them makes one BFS compute the
// true parallel spread; looping a separate BFS per source would be both slower
// and wrong about the timing.
//
// The `fresh` counter is what distinguishes "finished" from "unreachable" — a
// walled-off orange leaves the count above zero.
func OrangesRotting(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])
	queue := [][2]int{}
	fresh := 0
	for r := range rows {
		for c := range cols {
			switch grid[r][c] {
			case 1:
				fresh++
			case 2:
				queue = append(queue, [2]int{r, c}) // every source, up front
			}
		}
	}
	if fresh == 0 {
		return 0 // nothing to rot: not -1
	}

	minutes := 0
	for len(queue) > 0 && fresh > 0 {
		size := len(queue) // freeze this minute's wavefront
		for range size {
			cell := queue[0]
			queue = queue[1:]
			for _, d := range directions {
				r, c := cell[0]+d[0], cell[1]+d[1]
				if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != 1 {
					continue
				}
				grid[r][c] = 2
				fresh--
				queue = append(queue, [2]int{r, c})
			}
		}
		minutes++ // one level of BFS == one minute
	}
	if fresh > 0 {
		return -1 // unreachable oranges remain
	}
	return minutes
}

// WallsAndGates fills each empty room with its distance to the nearest gate
// (LC286 / "Islands and Treasure"). Mutates rooms.
//
// Encoding: -1 is a wall, 0 is a gate, and Inf marks an unreached room.
// Multi-source BFS from every gate at once gives each room its nearest distance
// on first arrival — that is the property that makes BFS correct here.
const Inf = 1 << 30

func WallsAndGates(rooms [][]int) {
	if len(rooms) == 0 || len(rooms[0]) == 0 {
		return
	}
	rows, cols := len(rooms), len(rooms[0])
	queue := [][2]int{}
	for r := range rows {
		for c := range cols {
			if rooms[r][c] == 0 {
				queue = append(queue, [2]int{r, c})
			}
		}
	}
	dist := 0
	for len(queue) > 0 {
		size := len(queue)
		dist++
		for range size {
			cell := queue[0]
			queue = queue[1:]
			for _, d := range directions {
				r, c := cell[0]+d[0], cell[1]+d[1]
				// Only Inf rooms are unvisited; walls and closer rooms are skipped.
				if r < 0 || r >= rows || c < 0 || c >= cols || rooms[r][c] != Inf {
					continue
				}
				rooms[r][c] = dist
				queue = append(queue, [2]int{r, c})
			}
		}
	}
}

// ---------------------------------------------------------------------------
// General graphs
// ---------------------------------------------------------------------------

// Node is an adjacency-list graph node (LC133).
type Node struct {
	Val       int
	Neighbors []*Node
}

// CloneGraph deep-copies a connected undirected graph (LC133). O(V+E).
//
// THE ONE LINE THAT MATTERS: register the clone in the map BEFORE recursing into
// neighbours. A graph has cycles, so a neighbour will point back at this node;
// if it is not registered yet the recursion loops forever. The map serves as
// both the visited set and the original -> clone lookup.
func CloneGraph(node *Node) *Node {
	clones := map[*Node]*Node{}
	var dfs func(*Node) *Node
	dfs = func(n *Node) *Node {
		if n == nil {
			return nil
		}
		if c, ok := clones[n]; ok {
			return c // already cloned: return the same instance, do not re-copy
		}
		clone := &Node{Val: n.Val}
		clones[n] = clone // register FIRST, then recurse
		for _, nb := range n.Neighbors {
			clone.Neighbors = append(clone.Neighbors, dfs(nb))
		}
		return clone
	}
	return dfs(node)
}
