# LRU Cache Implementation

**Data Structure**: HashMap + Doubly Linked List  
**Time Complexity**: O(1) for get and put | **Space Complexity**: O(capacity)

## Files in this folder:

1. **lruCache.js** - Complete LRU Cache implementation
2. **lruFunction.js** - LRU Cache function implementation

## LRU Cache Pattern:

- **Use Case**: Cache with least recently used eviction policy
- **Operations**: 
  - `get(key)`: O(1) - Get value by key
  - `put(key, value)`: O(1) - Insert or update key-value pair
- **Data Structures**:
  - HashMap: For O(1) key lookup
  - Doubly Linked List: For O(1) insertion/deletion

## Common Interview Questions:

- LeetCode 146: LRU Cache
- Design a cache system
- Implement cache with eviction policy

