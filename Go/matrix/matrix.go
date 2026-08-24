// Package matrix covers in-place 2D transformations.
//
// PATTERN         Index arithmetic and boundary shrinking
// WHEN TO USE     rotate / spiral / set-zeroes / transpose questions.
// WASTE IT KILLS  Allocating a second matrix when the input can be rewritten.
//
// THE TWO RECURRING IDEAS:
//  1. DECOMPOSE a hard transformation into easy ones (rotation = transpose then
//     reverse). Far more reliable under pressure than deriving one index formula.
//  2. SHRINK BOUNDARIES instead of tracking visited cells (spiral order).
//
// And the classic trap: to achieve O(1) space you often have to store bookkeeping
// INSIDE the matrix — which then requires care not to read your own marks as data.
package matrix

import "slices"

// Rotate turns an n×n matrix 90° clockwise in place (LC48). O(n²) time, O(1) space.
//
// THE DECOMPOSITION: transpose (reflect along the main diagonal), then reverse
// each row. Two simple passes replace one error-prone index formula, and it is
// far easier to justify at a whiteboard.
//
// c starts at r+1 in the transpose loop: swapping the full square would swap
// every pair twice and undo the work.
func Rotate(matrix [][]int) {
	n := len(matrix)
	for r := range n {
		for c := r + 1; c < n; c++ {
			matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
		}
	}
	for r := range n {
		slices.Reverse(matrix[r])
	}
}

// SpiralOrder returns the elements in spiral order (LC54). O(m·n).
//
// FOUR SHRINKING BOUNDARIES replace a visited grid: walk the top row then push
// `top` down, the right column then pull `right` in, and so on.
//
// THE TWO GUARDS MATTER. After the first two walks the remaining block can be
// empty, and without re-checking `top <= bottom` / `left <= right` a single
// leftover row or column gets emitted twice. That is the bug this problem is
// really testing.
func SpiralOrder(matrix [][]int) []int {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return nil
	}
	top, bottom := 0, len(matrix)-1
	left, right := 0, len(matrix[0])-1
	out := make([]int, 0, len(matrix)*len(matrix[0]))

	for top <= bottom && left <= right {
		for c := left; c <= right; c++ { // top row, left to right
			out = append(out, matrix[top][c])
		}
		top++
		for r := top; r <= bottom; r++ { // right column, top to bottom
			out = append(out, matrix[r][right])
		}
		right--
		if top <= bottom { // re-check: the block may now be one row tall
			for c := right; c >= left; c-- { // bottom row, right to left
				out = append(out, matrix[bottom][c])
			}
			bottom--
		}
		if left <= right { // re-check: ...or one column wide
			for r := bottom; r >= top; r-- { // left column, bottom to top
				out = append(out, matrix[r][left])
			}
			left++
		}
	}
	return out
}

// SetZeroes zeroes the full row and column of every zero cell (LC73).
// O(m·n) time, O(1) space.
//
// WHY THIS IS TRICKY: writing a zero immediately would be read as an original
// zero by later iterations, cascading until the whole matrix is zero. So the
// marks must be recorded first and applied second.
//
// THE O(1)-SPACE TRICK: use row 0 and column 0 as the mark storage instead of
// two extra slices. They overlap at [0][0], so their own original state is
// captured in two booleans first, and they are rewritten LAST — after they have
// finished serving as markers.
func SetZeroes(matrix [][]int) {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return
	}
	rows, cols := len(matrix), len(matrix[0])

	firstRowHasZero, firstColHasZero := false, false
	for c := range cols {
		if matrix[0][c] == 0 {
			firstRowHasZero = true
		}
	}
	for r := range rows {
		if matrix[r][0] == 0 {
			firstColHasZero = true
		}
	}

	// Pass 1: record marks in row 0 / column 0, skipping them as data.
	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			if matrix[r][c] == 0 {
				matrix[r][0] = 0
				matrix[0][c] = 0
			}
		}
	}
	// Pass 2: apply the marks to the interior.
	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			if matrix[r][0] == 0 || matrix[0][c] == 0 {
				matrix[r][c] = 0
			}
		}
	}
	// Pass 3: only now may the markers themselves be overwritten.
	if firstRowHasZero {
		for c := range cols {
			matrix[0][c] = 0
		}
	}
	if firstColHasZero {
		for r := range rows {
			matrix[r][0] = 0
		}
	}
}
