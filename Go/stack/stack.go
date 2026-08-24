// Package stack covers LIFO problems and the monotonic-stack pattern.
//
// PATTERN         Stack / Monotonic Stack
// WHEN TO USE     Matching pairs, undo/nesting, "evaluate an expression";
//
//	and the monotonic flavour: "next greater/smaller element",
//	"how far until something bigger", "largest rectangle".
//
// WASTE IT KILLS  Re-scanning forward from every element to find its next
//
//	greater/smaller neighbour (the O(n²) double loop).
//
// GO NOTE: there is no stack type — a slice IS the stack.
//
//	push: s = append(s, v)
//	peek: s[len(s)-1]
//	pop:  s = s[:len(s)-1]      // always check len(s) > 0 first
package stack

import "strconv"

// ---------------------------------------------------------------------------
// Plain stacks
// ---------------------------------------------------------------------------

// closeToOpen maps each closer to the opener it demands. Driving the logic from
// a table beats a chain of if/else and generalises to new bracket types.
var closeToOpen = map[byte]byte{')': '(', ']': '[', '}': '{'}

// IsValid checks bracket matching (LC20). O(n) time, O(n) space.
//
// WHY A STACK: the most recently opened bracket must close first — that is the
// definition of LIFO. A counter works for one bracket type but cannot tell
// "([)]" from "([])".
func IsValid(s string) bool {
	stack := make([]byte, 0, len(s))
	for i := 0; i < len(s); i++ {
		c := s[i]
		if open, isCloser := closeToOpen[c]; isCloser {
			if len(stack) == 0 || stack[len(stack)-1] != open {
				return false // nothing to close, or closing the wrong thing
			}
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, c)
		}
	}
	return len(stack) == 0 // leftover openers mean unbalanced
}

// MinStack supports Push/Pop/Top/GetMin all in O(1) (LC155).
//
// THE IDEA: you cannot recompute the min after a pop in O(1), so store the min
// ALONGSIDE each element. Every level remembers "the min of everything at or
// below me", which pops away for free with its element.
type MinStack struct {
	vals []int
	mins []int
}

func NewMinStack() *MinStack { return &MinStack{} }

func (s *MinStack) Push(v int) {
	s.vals = append(s.vals, v)
	if len(s.mins) == 0 || v < s.mins[len(s.mins)-1] {
		s.mins = append(s.mins, v)
	} else {
		s.mins = append(s.mins, s.mins[len(s.mins)-1])
	}
}

func (s *MinStack) Pop() {
	if len(s.vals) == 0 {
		return
	}
	s.vals = s.vals[:len(s.vals)-1]
	s.mins = s.mins[:len(s.mins)-1]
}

func (s *MinStack) Top() int    { return s.vals[len(s.vals)-1] }
func (s *MinStack) GetMin() int { return s.mins[len(s.mins)-1] }
func (s *MinStack) Len() int    { return len(s.vals) }

// EvalRPN evaluates reverse Polish notation (LC150). O(n).
//
// Postfix needs no precedence rules and no parentheses: an operator always
// applies to the two most recent values. Order matters for - and / — the
// SECOND pop is the left operand.
//
// GO NOTE: Go's integer division truncates toward zero (-7/2 == -3), which is
// exactly what LC150 specifies. Languages that floor (Python) need extra care.
func EvalRPN(tokens []string) int {
	stack := make([]int, 0, len(tokens))
	for _, tok := range tokens {
		switch tok {
		case "+", "-", "*", "/":
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]
			var r int
			switch tok {
			case "+":
				r = a + b
			case "-":
				r = a - b
			case "*":
				r = a * b
			case "/":
				r = a / b
			}
			stack = append(stack, r)
		default:
			n, _ := strconv.Atoi(tok)
			stack = append(stack, n)
		}
	}
	if len(stack) == 0 {
		return 0
	}
	return stack[0]
}

// ---------------------------------------------------------------------------
// Monotonic stacks
// ---------------------------------------------------------------------------

// DailyTemperaturesBrute looks forward from every day. O(n²) — the baseline.
func DailyTemperaturesBrute(temps []int) []int {
	out := make([]int, len(temps))
	for i := range temps {
		for j := i + 1; j < len(temps); j++ {
			if temps[j] > temps[i] {
				out[i] = j - i
				break
			}
		}
	}
	return out
}

// DailyTemperatures answers "days until a warmer day" for every day (LC739).
// O(n) time, O(n) space.
//
// NAME THE WASTE: the brute force rescans the same warm stretch again and again.
//
// THE FIX: hold a stack of indices whose temperatures DECREASE. A new warmer
// day resolves every colder day still waiting — each index is pushed once and
// popped once, so the total work is linear despite the nested loop.
//
// This is the template for every "next greater element" question.
func DailyTemperatures(temps []int) []int {
	out := make([]int, len(temps))
	stack := make([]int, 0, len(temps)) // indices, temperatures decreasing
	for i, t := range temps {
		for len(stack) > 0 && temps[stack[len(stack)-1]] < t {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			out[j] = i - j // i is j's answer: the first warmer day
		}
		stack = append(stack, i)
	}
	return out // days left on the stack keep 0 — no warmer day ever came
}

// NextGreaterElements returns, for each index, the next strictly greater value
// to its right, or -1. The same template with values instead of distances.
func NextGreaterElements(nums []int) []int {
	out := make([]int, len(nums))
	for i := range out {
		out[i] = -1
	}
	stack := make([]int, 0, len(nums))
	for i, n := range nums {
		for len(stack) > 0 && nums[stack[len(stack)-1]] < n {
			out[stack[len(stack)-1]] = n
			stack = stack[:len(stack)-1]
		}
		stack = append(stack, i)
	}
	return out
}

// LargestRectangleArea is LC84 — the hardest standard monotonic stack. O(n).
//
// EVERY BAR ASKS: "how far left and right can I extend at my own height?"
// The answer is bounded by the first strictly shorter bar on each side.
//
// Keep a stack of indices with INCREASING heights. When bar i is shorter than
// the top, that top has found its right boundary (i) and its left boundary (the
// new stack top after popping) — so its widest rectangle is fixed, and the
// width is i - left - 1.
//
// The i == len(heights) iteration uses a virtual height of 0 as a sentinel that
// flushes everything still on the stack; without it, an increasing input like
// [1,2,3] would never be settled.
func LargestRectangleArea(heights []int) int {
	best := 0
	stack := make([]int, 0, len(heights)+1) // indices, heights increasing
	for i := 0; i <= len(heights); i++ {
		h := 0 // sentinel on the final pass
		if i < len(heights) {
			h = heights[i]
		}
		for len(stack) > 0 && heights[stack[len(stack)-1]] >= h {
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			left := -1
			if len(stack) > 0 {
				left = stack[len(stack)-1]
			}
			best = max(best, heights[top]*(i-left-1))
		}
		stack = append(stack, i)
	}
	return best
}
