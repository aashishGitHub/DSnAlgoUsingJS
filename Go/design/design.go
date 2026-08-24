// Package design covers "implement a data structure" interview questions.
//
// PATTERN         Composition — pick two structures whose weaknesses cancel.
// WHEN TO USE     "design an X with O(1) …", LRU/LFU caches, time-keyed stores.
//
// THE RECURRING MOVE: no single structure gives you everything.
//   - a map gives O(1) lookup but no order
//   - a linked list gives O(1) reordering but no lookup
//   - a sorted slice gives O(log n) search but O(n) insertion
//
// Combine them and state which structure supplies which guarantee. That
// sentence is what the question is actually testing.
package design

import "sort"

// ---------------------------------------------------------------------------
// LRU Cache (LC146)
// ---------------------------------------------------------------------------

// lruNode is a doubly linked list node. Doubly linked, not singly, because
// eviction and promotion must UNLINK a node in O(1) — which requires knowing
// its predecessor without walking the list.
type lruNode struct {
	key, val   int
	prev, next *lruNode
}

// LRUCache gives O(1) Get and Put.
//
// THE COMBINATION:
//   - map[int]*lruNode  — find any entry in O(1)
//   - doubly linked list — maintain recency order in O(1)
//
// Order is front = most recently used, back = next to evict. Two sentinel nodes
// (head/tail) mean no branch ever has to ask "am I at the boundary?", which is
// where hand-rolled linked lists usually break.
type LRUCache struct {
	capacity   int
	items      map[int]*lruNode
	head, tail *lruNode // sentinels, never hold real data
}

func NewLRUCache(capacity int) *LRUCache {
	head, tail := &lruNode{}, &lruNode{}
	head.next, tail.prev = tail, head
	return &LRUCache{
		capacity: capacity,
		items:    make(map[int]*lruNode, capacity),
		head:     head,
		tail:     tail,
	}
}

func (c *LRUCache) unlink(n *lruNode) {
	n.prev.next = n.next
	n.next.prev = n.prev
}

func (c *LRUCache) pushFront(n *lruNode) {
	n.next = c.head.next
	n.prev = c.head
	c.head.next.prev = n
	c.head.next = n
}

// Get returns the value and promotes the entry to most-recently-used, or -1.
//
// THE DETAIL PEOPLE MISS: a READ counts as a use. Forgetting to promote here
// makes the cache least-recently-WRITTEN, which is a different policy.
func (c *LRUCache) Get(key int) int {
	n, ok := c.items[key]
	if !ok {
		return -1
	}
	c.unlink(n)
	c.pushFront(n)
	return n.val
}

// Put inserts or updates, evicting the least recently used entry if full.
func (c *LRUCache) Put(key, val int) {
	if c.capacity <= 0 {
		return
	}
	if n, ok := c.items[key]; ok { // update in place, then promote
		n.val = val
		c.unlink(n)
		c.pushFront(n)
		return
	}
	if len(c.items) == c.capacity {
		lru := c.tail.prev // the node just before the tail sentinel
		c.unlink(lru)
		delete(c.items, lru.key) // this is why the node stores its own key
	}
	n := &lruNode{key: key, val: val}
	c.items[key] = n
	c.pushFront(n)
}

// Len reports how many entries are cached — handy for tests.
func (c *LRUCache) Len() int { return len(c.items) }

// ---------------------------------------------------------------------------
// Time Based Key-Value Store (LC981)
// ---------------------------------------------------------------------------

type stamped struct {
	time int
	val  string
}

// TimeMap stores versioned values and retrieves the newest one at or before a
// given timestamp.
//
// THE OBSERVATION THAT PICKS THE STRUCTURE: timestamps arrive in increasing
// order, so each key's slice is ALREADY sorted — no sorting needed, and the
// lookup is a binary search. Set is O(1), Get is O(log n).
//
// This is the Hash Map and Binary Search patterns composed: the map narrows to
// one key's history, the binary search finds the version inside it.
type TimeMap struct {
	store map[string][]stamped
}

func NewTimeMap() *TimeMap {
	return &TimeMap{store: make(map[string][]stamped)}
}

func (m *TimeMap) Set(key, value string, timestamp int) {
	m.store[key] = append(m.store[key], stamped{time: timestamp, val: value})
}

// Get returns the value with the largest time <= timestamp, or "".
//
// sort.Search is Go's built-in binary search: it returns the smallest index
// where the predicate first becomes true. Asking for the first entry STRICTLY
// AFTER timestamp and stepping back one gives the newest valid version.
func (m *TimeMap) Get(key string, timestamp int) string {
	history := m.store[key]
	i := sort.Search(len(history), func(i int) bool {
		return history[i].time > timestamp
	})
	if i == 0 {
		return "" // every version is newer than the query
	}
	return history[i-1].val
}
