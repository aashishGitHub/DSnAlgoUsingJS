# Hash Map/Set Pattern

The Hash Map/Set pattern is one of the most fundamental and powerful techniques in algorithm design. It leverages hash tables to achieve O(1) average-case lookups, enabling efficient solutions to many problems that would otherwise require O(n) or O(n²) time complexity.

## Pattern Types

### 1. Hash Set Pattern
- **Use Set for O(1) membership testing**
- Perfect for duplicate detection, intersection, union operations
- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

**Common Problems:**
- Contains Duplicate
- Two Sum (with Set)
- Valid Anagram
- Group Anagrams
- Intersection of Two Arrays
- Happy Number
- Single Number

### 2. Hash Map Pattern
- **Use Map for O(1) key-value lookups**
- Perfect for frequency counting, indexing, caching
- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

**Common Problems:**
- Two Sum (with Map)
- Top K Frequent Elements
- First Unique Character
- Word Pattern
- Isomorphic Strings
- Subarray Sum Equals K
- Contiguous Array

### 3. Advanced Hash Map Patterns
- **Complex data structures and state tracking**
- Multi-level mappings and caching systems
- **Time Complexity:** O(1) for most operations
- **Space Complexity:** O(n)

**Common Problems:**
- LRU Cache
- Logger Rate Limiter
- Underground System
- Design patterns with state management

## Implementation Templates

### Hash Set Template
```typescript
function hashSetPattern(arr: number[]): boolean {
    const seen = new Set<number>();
    
    for (const element of arr) {
        if (seen.has(element)) {
            // Found duplicate or condition met
            return true;
        }
        seen.add(element);
    }
    
    return false;
}
```

### Hash Map Template
```typescript
function hashMapPattern(arr: number[], target: number): number[] {
    const numMap = new Map<number, number>();
    
    for (let i = 0; i < arr.length; i++) {
        const complement = target - arr[i];
        
        if (numMap.has(complement)) {
            return [numMap.get(complement)!, i];
        }
        
        numMap.set(arr[i], i);
    }
    
    return [];
}
```

### Frequency Counting Template
```typescript
function frequencyCounting(arr: number[]): Map<number, number> {
    const frequency = new Map<number, number>();
    
    for (const element of arr) {
        frequency.set(element, (frequency.get(element) || 0) + 1);
    }
    
    return frequency;
}
```

## Key Concepts

### Hash Table Benefits
- **O(1) average case lookups** vs O(n) linear search
- **Enables O(n) solutions** instead of O(n²) nested loops
- **Perfect for membership testing** and frequency counting
- **Foundation for advanced data structures**

### Common Operations
- **Set operations:** `add()`, `has()`, `delete()`, `clear()`
- **Map operations:** `set()`, `get()`, `has()`, `delete()`, `clear()`
- **Iteration:** `for...of`, `forEach()`, `keys()`, `values()`, `entries()`

### Memory Considerations
- **Space-time tradeoff:** O(n) space for O(1) lookups
- **Hash collision handling:** Most implementations use chaining or open addressing
- **Load factor management:** Automatic resizing when load factor exceeds threshold

## When to Use Hash Map/Set

✅ **Use when:**
- Need O(1) lookups instead of O(n) linear search
- Counting frequencies or occurrences
- Detecting duplicates or unique elements
- Building indexes or caches
- Two-sum type problems
- Pattern matching and anagrams
- State tracking and memoization

❌ **Don't use when:**
- Space is extremely limited
- Need to maintain order (use LinkedHashMap or TreeMap)
- Working with very small datasets where O(n) is acceptable
- Need range queries (use TreeMap instead)

## Common Patterns

### 1. Two Sum Pattern
```typescript
// Find two numbers that sum to target
const numMap = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
        return [numMap.get(complement)!, i];
    }
    numMap.set(nums[i], i);
}
```

### 2. Frequency Counting Pattern
```typescript
// Count frequency of each element
const frequency = new Map<number, number>();
for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
}
```

### 3. Duplicate Detection Pattern
```typescript
// Check for duplicates
const seen = new Set<number>();
for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
}
return false;
```

### 4. Anagram Detection Pattern
```typescript
// Check if two strings are anagrams
const charCount = new Map<string, number>();
for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
}
for (const char of t) {
    if (!charCount.has(char)) return false;
    charCount.set(char, charCount.get(char)! - 1);
    if (charCount.get(char) === 0) charCount.delete(char);
}
return charCount.size === 0;
```

## Common Mistakes

1. **Forgetting to handle duplicates**
   - Always check if key exists before accessing
   - Use `get() || defaultValue` pattern

2. **Incorrect key-value mapping**
   - Map stores key-value pairs, Set stores unique values
   - Choose the right data structure for your needs

3. **Memory leaks in long-running applications**
   - Clear maps/sets when no longer needed
   - Be mindful of object references

4. **Hash collision assumptions**
   - Don't assume perfect hashing
   - Consider worst-case scenarios

## Performance Tips

1. **Pre-allocate when possible**
   - Use `new Map(capacity)` if you know the size
   - Avoid frequent resizing

2. **Use appropriate data structure**
   - Set for membership testing
   - Map for key-value relationships
   - Consider TreeMap for ordered data

3. **Minimize hash computations**
   - Cache hash values when possible
   - Use primitive types as keys when possible

## Practice Problems

### Easy
- [ ] Contains Duplicate
- [ ] Two Sum
- [ ] Valid Anagram
- [ ] First Unique Character
- [ ] Single Number

### Medium
- [ ] Group Anagrams
- [ ] Top K Frequent Elements
- [ ] Subarray Sum Equals K
- [ ] Longest Substring Without Repeating Characters
- [ ] Word Pattern

### Hard
- [ ] LRU Cache
- [ ] Minimum Window Substring
- [ ] Design Underground System
- [ ] Logger Rate Limiter
- [ ] Longest Consecutive Sequence

## Files in this Directory

- `hashSetPatterns.ts` - Hash Set pattern problems
- `hashMapPatterns.ts` - Hash Map pattern problems
- `longestConsecutive.ts` - Advanced Hash Set/Map problems
- `index.ts` - Main export file
- `README.md` - This documentation

## Advanced Topics

### Custom Hash Functions
- Implementing hash functions for custom objects
- Handling hash collisions
- Load factor optimization

### Concurrent Hash Maps
- Thread-safe implementations
- Lock-free data structures
- Performance considerations

### Memory Management
- WeakMap and WeakSet for garbage collection
- Memory profiling and optimization
- Large dataset handling
