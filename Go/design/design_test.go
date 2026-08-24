package design

import "testing"

func TestLRUCacheEviction(t *testing.T) {
	c := NewLRUCache(2)
	c.Put(1, 1)
	c.Put(2, 2)
	if got := c.Get(1); got != 1 { // this READ promotes key 1
		t.Errorf("Get(1) = %d, want 1", got)
	}
	c.Put(3, 3) // capacity reached: key 2 is now least recently used
	if got := c.Get(2); got != -1 {
		t.Errorf("Get(2) = %d, want -1 (evicted)", got)
	}
	c.Put(4, 4) // evicts key 1
	if got := c.Get(1); got != -1 {
		t.Errorf("Get(1) = %d, want -1 (evicted)", got)
	}
	if got := c.Get(3); got != 3 {
		t.Errorf("Get(3) = %d, want 3", got)
	}
	if got := c.Get(4); got != 4 {
		t.Errorf("Get(4) = %d, want 4", got)
	}
	if c.Len() != 2 {
		t.Errorf("Len = %d, want 2", c.Len())
	}
}

func TestLRUCacheGetCountsAsUse(t *testing.T) {
	// Without promotion on read, key 1 would be evicted here instead of key 2.
	c := NewLRUCache(2)
	c.Put(1, 1)
	c.Put(2, 2)
	c.Get(1)
	c.Put(3, 3)
	if got := c.Get(1); got != 1 {
		t.Errorf("Get(1) = %d — a read must count as a use", got)
	}
}

func TestLRUCacheUpdateExisting(t *testing.T) {
	c := NewLRUCache(2)
	c.Put(1, 1)
	c.Put(2, 2)
	c.Put(1, 10) // update must not grow the cache or evict anything
	if got := c.Get(1); got != 10 {
		t.Errorf("Get(1) = %d, want 10", got)
	}
	if got := c.Get(2); got != 2 {
		t.Errorf("Get(2) = %d, want 2 — update should not have evicted it", got)
	}
	if c.Len() != 2 {
		t.Errorf("Len = %d, want 2", c.Len())
	}
}

func TestLRUCacheCapacityOne(t *testing.T) {
	c := NewLRUCache(1)
	c.Put(1, 1)
	c.Put(2, 2)
	if got := c.Get(1); got != -1 {
		t.Errorf("Get(1) = %d, want -1", got)
	}
	if got := c.Get(2); got != 2 {
		t.Errorf("Get(2) = %d, want 2", got)
	}
}

func TestLRUCacheZeroCapacity(t *testing.T) {
	// Must not panic by unlinking a sentinel.
	c := NewLRUCache(0)
	c.Put(1, 1)
	if got := c.Get(1); got != -1 {
		t.Errorf("Get(1) = %d, want -1", got)
	}
}

func TestTimeMap(t *testing.T) {
	m := NewTimeMap()
	m.Set("foo", "bar", 1)

	if got := m.Get("foo", 1); got != "bar" {
		t.Errorf("Get(foo,1) = %q, want bar", got)
	}
	if got := m.Get("foo", 3); got != "bar" { // newest version at or before 3
		t.Errorf("Get(foo,3) = %q, want bar", got)
	}
	m.Set("foo", "bar2", 4)
	if got := m.Get("foo", 4); got != "bar2" {
		t.Errorf("Get(foo,4) = %q, want bar2", got)
	}
	if got := m.Get("foo", 5); got != "bar2" {
		t.Errorf("Get(foo,5) = %q, want bar2", got)
	}
	if got := m.Get("foo", 3); got != "bar" { // an older query still sees the old value
		t.Errorf("Get(foo,3) = %q, want bar", got)
	}
	if got := m.Get("foo", 0); got != "" { // before every version
		t.Errorf("Get(foo,0) = %q, want empty", got)
	}
	if got := m.Get("missing", 1); got != "" {
		t.Errorf("Get(missing,1) = %q, want empty", got)
	}
}
