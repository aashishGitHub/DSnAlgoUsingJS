package heaptopk

import "container/heap"

// pushMin/pushMax exist so the tests exercise the heap types through the
// container/heap package functions, which is the only correct way to use them.
func pushMin(h *MinIntHeap, v int) { heap.Push(h, v) }
func pushMax(h *MaxIntHeap, v int) { heap.Push(h, v) }
