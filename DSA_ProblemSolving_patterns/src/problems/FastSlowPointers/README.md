# Fast & Slow Pointers (Hare-Tortoise) Pattern

The Fast & Slow Pointers pattern uses two pointers that traverse at different speeds to solve problems involving cycle detection, finding middle elements, and detecting patterns in sequences. This pattern is particularly useful for linked list problems and array problems where you need to detect cycles or find specific positions.

## Pattern Types

### 1. Cycle Detection
- **Detect cycles** in linked lists or arrays
- **Find cycle start** position
- **Detect infinite loops** in sequences
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

**Common Problems:**
- Linked List Cycle
- Linked List Cycle II
- Happy Number
- Circular Array Loop
- Find Duplicate Number

### 2. Middle Finding
- **Find middle element** of a sequence
- **Partition sequences** into two halves
- **Balance operations** on data structures
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

**Common Problems:**
- Middle of the Linked List
- Reorder Linked List
- Palindrome Linked List
- Merge Two Sorted Lists

### 3. Position Finding
- **Find nth element** from end
- **Find specific positions** in sequences
- **Partition around pivot** elements
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

**Common Problems:**
- Remove Nth Node From End
- Find the Duplicate Number
- Partition List
- Sort List

## Implementation Templates

### Basic Fast & Slow Pointers Template
```typescript
function fastSlowPointers(head: ListNode | null): boolean {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    // Move fast pointer 2 steps and slow pointer 1 step
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        
        // Check for condition (cycle, middle, etc.)
        if (/* condition */) {
            return true;
        }
    }
    
    return false;
}
```

### Cycle Detection Template
```typescript
function detectCycle(head: ListNode | null): ListNode | null {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    
    // Phase 1: Detect if cycle exists
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            break; // Cycle detected
        }
    }
    
    // No cycle found
    if (!fast || !fast.next) return null;
    
    // Phase 2: Find the start of cycle
    slow = head;
    while (slow !== fast) {
        slow = slow!.next;
        fast = fast!.next;
    }
    
    return slow;
}
```

### Middle Finding Template
```typescript
function findMiddle(head: ListNode | null): ListNode | null {
    if (!head || !head.next) return head;
    
    let slow = head;
    let fast = head;
    
    // Move fast pointer 2 steps and slow pointer 1 step
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

## Key Concepts

### Floyd's Cycle Detection Algorithm
- **Two phases:** Detection and finding start
- **Mathematical proof:** When slow and fast meet, the distance from head to cycle start equals the distance from meeting point to cycle start
- **Why it works:** Fast pointer moves twice as fast, so it will eventually catch up to slow pointer if there's a cycle

### Pointer Movement Patterns
- **Slow pointer:** Moves 1 step at a time
- **Fast pointer:** Moves 2 steps at a time
- **Different speeds:** Can be adjusted based on problem requirements
- **Starting positions:** Usually both start from head, but can vary

### Cycle Detection Mathematics
- **Phase 1:** Find meeting point (if cycle exists)
- **Phase 2:** Find cycle start by moving one pointer to head
- **Distance relationship:** Distance from head to cycle start = Distance from meeting point to cycle start

## When to Use Fast & Slow Pointers

✅ **Use when:**
- Problem involves linked lists or arrays
- Need to detect cycles or infinite loops
- Finding middle elements or specific positions
- Palindrome detection in linked lists
- Partitioning sequences
- Detecting patterns in sequences

❌ **Don't use when:**
- Problem doesn't involve sequential data structures
- Need to process elements in a specific order
- Problem requires complex data structures
- Working with trees or graphs (use DFS/BFS instead)

## Common Patterns

### 1. Cycle Detection Pattern
```typescript
// Detect if cycle exists
let slow = head;
let fast = head;

while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
        return true; // Cycle found
    }
}
return false;
```

### 2. Middle Finding Pattern
```typescript
// Find middle element
let slow = head;
let fast = head;

while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
}

return slow; // This is the middle
```

### 3. Nth from End Pattern
```typescript
// Find nth element from end
let slow = head;
let fast = head;

// Move fast pointer n steps ahead
for (let i = 0; i < n; i++) {
    fast = fast.next;
}

// Move both pointers until fast reaches end
while (fast.next) {
    slow = slow.next;
    fast = fast.next;
}

return slow.next; // This is the nth from end
```

### 4. Palindrome Detection Pattern
```typescript
// Check if linked list is palindrome
// Step 1: Find middle
let slow = head;
let fast = head;
while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
}

// Step 2: Reverse second half
let secondHalf = reverseList(slow.next);
slow.next = null;

// Step 3: Compare both halves
let first = head;
let second = secondHalf;
while (second) {
    if (first.val !== second.val) return false;
    first = first.next;
    second = second.next;
}
return true;
```

## Common Mistakes

1. **Incorrect pointer movement**
   - Always move slow by 1 step, fast by 2 steps
   - Check for null pointers before moving

2. **Wrong cycle detection logic**
   - Use `slow === fast` for cycle detection
   - Don't forget to check if fast pointer is null

3. **Incorrect middle finding**
   - For even length lists, slow points to second middle
   - Handle single node lists separately

4. **Memory issues with large lists**
   - Fast & slow pointers use O(1) space
   - Avoid creating new data structures

## Performance Tips

1. **Single pass solutions**
   - Most problems can be solved in O(n) time
   - Avoid multiple traversals when possible

2. **Constant space complexity**
   - Use only two pointers
   - Avoid creating additional data structures

3. **Handle edge cases**
   - Empty lists
   - Single node lists
   - Two node lists

## Practice Problems

### Easy
- [ ] Middle of the Linked List
- [ ] Remove Nth Node From End
- [ ] Palindrome Linked List
- [ ] Happy Number

### Medium
- [ ] Linked List Cycle
- [ ] Linked List Cycle II
- [ ] Reorder Linked List
- [ ] Find the Duplicate Number

### Hard
- [ ] Circular Array Loop
- [ ] Sort List
- [ ] Partition List
- [ ] Reverse Nodes in k-Group

## Files in this Directory

- `fastSlowPointers.ts` - Main implementation file
- `fastSlowPointers.test.ts` - Test cases
- `README.md` - This documentation

## Advanced Topics

### Custom Pointer Speeds
- Using different speeds for specific problems
- Mathematical analysis of pointer movement
- Optimizing for specific use cases

### Memory-Efficient Implementations
- Avoiding recursion for deep lists
- Minimizing space usage
- Handling very large datasets

### Cycle Detection Variations
- Detecting cycles in different data structures
- Finding cycle length
- Detecting multiple cycles

## Mathematical Insights

### Why Floyd's Algorithm Works
1. **Phase 1:** When slow and fast meet, slow has moved distance `d`, fast has moved distance `2d`
2. **Cycle length:** If cycle length is `c`, then `2d - d = d` is a multiple of `c`
3. **Phase 2:** Distance from head to cycle start equals distance from meeting point to cycle start

### Time Complexity Analysis
- **Cycle detection:** O(n) - at most n steps before meeting
- **Finding cycle start:** O(n) - at most n steps to find start
- **Total:** O(n) - linear time complexity

### Space Complexity
- **Constant space:** Only two pointers used
- **No recursion:** Iterative approach
- **No additional data structures:** Pure pointer manipulation
