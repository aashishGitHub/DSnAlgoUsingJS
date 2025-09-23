# Merge Intervals Pattern

The Merge Intervals pattern deals with overlapping intervals and involves sorting intervals and merging overlaps. This pattern is commonly used for scheduling problems, conflict resolution, and time-based operations where you need to handle overlapping time periods or ranges.

## Pattern Types

### 1. Basic Merge Intervals
- **Merge overlapping intervals** into non-overlapping ones
- **Sort by start time** and merge consecutive overlapping intervals
- **Time Complexity:** O(n log n) - sorting dominates
- **Space Complexity:** O(1) - excluding output array

**Common Problems:**
- Merge Intervals
- Insert Interval
- Remove Covered Intervals
- Interval List Intersections

### 2. Scheduling Problems
- **Meeting room allocation** and conflict detection
- **Resource scheduling** and optimization
- **Time slot management** and availability
- **Time Complexity:** O(n log n) - sorting dominates
- **Space Complexity:** O(n) - for heap or result array

**Common Problems:**
- Meeting Rooms II
- Conflicting Appointments
- Employee Free Time
- Task Scheduler

### 3. Interval Intersection
- **Find intersections** between two sets of intervals
- **Merge overlapping** intervals from different sources
- **Detect conflicts** between schedules
- **Time Complexity:** O(m + n) - where m and n are list lengths
- **Space Complexity:** O(1) - excluding output array

**Common Problems:**
- Interval Intersection
- Merge Two Sorted Intervals
- Employee Free Time
- Calendar Conflicts

## Implementation Templates

### Basic Merge Template
```typescript
function mergeIntervals(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result: number[][] = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = result[result.length - 1];
        
        // If current interval overlaps with last interval
        if (current[0] <= last[1]) {
            // Merge intervals by extending the end time
            last[1] = Math.max(last[1], current[1]);
        } else {
            // No overlap, add current interval
            result.push(current);
        }
    }
    
    return result;
}
```

### Insert Interval Template
```typescript
function insertInterval(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    
    // Add all intervals that end before new interval starts
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Merge all overlapping intervals
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    // Add the merged interval
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}
```

### Interval Intersection Template
```typescript
function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {
    const result: number[][] = [];
    let i = 0, j = 0;
    
    while (i < firstList.length && j < secondList.length) {
        const first = firstList[i];
        const second = secondList[j];
        
        // Find intersection
        const start = Math.max(first[0], second[0]);
        const end = Math.min(first[1], second[1]);
        
        // If there's an intersection
        if (start <= end) {
            result.push([start, end]);
        }
        
        // Move pointer of interval that ends first
        if (first[1] < second[1]) {
            i++;
        } else {
            j++;
        }
    }
    
    return result;
}
```

### Meeting Rooms Template
```typescript
function minMeetingRooms(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Use a min heap to track end times
    const endTimes: number[] = [];
    
    for (const interval of intervals) {
        const [start, end] = interval;
        
        // If earliest ending meeting ends before current meeting starts
        if (endTimes.length > 0 && endTimes[0] <= start) {
            endTimes.shift(); // Remove the earliest ending meeting
        }
        
        // Add current meeting's end time
        endTimes.push(end);
        endTimes.sort((a, b) => a - b); // Keep heap property
    }
    
    return endTimes.length;
}
```

## Key Concepts

### Sorting Strategy
- **Sort by start time** for most merge problems
- **Sort by end time** for greedy problems (like minimum arrows)
- **Custom sorting** for specific requirements
- **Stable sorting** to maintain relative order

### Overlap Detection
- **Two intervals overlap** if: `interval1[0] <= interval2[1] && interval2[0] <= interval1[1]`
- **Interval A covers interval B** if: `A[0] <= B[0] && B[1] <= A[1]`
- **Point in interval** if: `point >= interval[0] && point <= interval[1]`

### Merge Strategy
- **Extend end time** when merging: `Math.max(last[1], current[1])`
- **Extend start time** when merging: `Math.min(last[0], current[0])`
- **Check overlap condition** before merging
- **Handle edge cases** like touching intervals

## When to Use Merge Intervals

✅ **Use when:**
- Problem involves time intervals or ranges
- Need to merge overlapping intervals
- Scheduling and resource allocation problems
- Finding conflicts or intersections
- Optimizing time-based operations
- Handling overlapping data ranges

❌ **Don't use when:**
- Problem doesn't involve intervals or ranges
- Need to process elements in specific order
- Problem requires complex data structures
- Working with non-overlapping data

## Common Patterns

### 1. Basic Merge Pattern
```typescript
// Sort and merge overlapping intervals
intervals.sort((a, b) => a[0] - b[0]);
for (const interval of intervals) {
    if (overlaps(last, interval)) {
        merge(last, interval);
    } else {
        addToResult(interval);
    }
}
```

### 2. Insertion Pattern
```typescript
// Insert new interval into sorted list
let i = 0;
// Add intervals before new interval
while (intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++]);
}
// Merge overlapping intervals
while (intervals[i][0] <= newInterval[1]) {
    newInterval = merge(newInterval, intervals[i++]);
}
// Add merged interval and remaining intervals
```

### 3. Intersection Pattern
```typescript
// Find intersections between two interval lists
while (i < list1.length && j < list2.length) {
    const intersection = findIntersection(list1[i], list2[j]);
    if (intersection) result.push(intersection);
    
    if (list1[i][1] < list2[j][1]) i++;
    else j++;
}
```

### 4. Greedy Pattern
```typescript
// Greedy approach for optimization problems
intervals.sort((a, b) => a[1] - b[1]); // Sort by end time
for (const interval of intervals) {
    if (canUseCurrentResource(interval)) {
        useCurrentResource(interval);
    } else {
        allocateNewResource(interval);
    }
}
```

## Common Mistakes

1. **Incorrect sorting order**
   - Sort by start time for merging
   - Sort by end time for greedy problems
   - Consider secondary sort criteria

2. **Wrong overlap condition**
   - Use `<=` for inclusive intervals
   - Check both start and end conditions
   - Handle edge cases like touching intervals

3. **Incorrect merge logic**
   - Extend end time with `Math.max`
   - Extend start time with `Math.min`
   - Don't modify original intervals

4. **Missing edge cases**
   - Empty intervals array
   - Single interval
   - All intervals overlap
   - No intervals overlap

## Performance Tips

1. **Efficient sorting**
   - Use built-in sort for O(n log n) performance
   - Consider counting sort for small ranges
   - Avoid multiple sorts when possible

2. **Space optimization**
   - Merge in-place when possible
   - Use pointers instead of creating new arrays
   - Reuse data structures

3. **Algorithm selection**
   - Use greedy approach for optimization problems
   - Use two pointers for intersection problems
   - Use heap for meeting room problems

## Practice Problems

### Easy
- [ ] Merge Intervals
- [ ] Insert Interval
- [ ] Conflicting Appointments
- [ ] Remove Covered Intervals

### Medium
- [ ] Interval Intersection
- [ ] Meeting Rooms II
- [ ] Employee Free Time
- [ ] Partition Labels

### Hard
- [ ] Minimum Arrow to Burst Balloons
- [ ] Task Scheduler
- [ ] My Calendar III
- [ ] Range Module

## Files in this Directory

- `mergeIntervals.ts` - Main implementation file
- `mergeIntervals.test.ts` - Test cases
- `README.md` - This documentation

## Advanced Topics

### Sweep Line Algorithm
- Process events in chronological order
- Handle start and end events separately
- Maintain active intervals count
- Useful for complex interval problems

### Segment Trees
- Range query and update operations
- Efficient for dynamic interval problems
- Support for range minimum/maximum queries
- Useful for very large datasets

### Coordinate Compression
- Map large coordinate ranges to smaller indices
- Reduce memory usage for sparse data
- Maintain relative ordering
- Useful for very large coordinate spaces

## Mathematical Insights

### Overlap Mathematics
- **Two intervals [a, b] and [c, d] overlap** if: `max(a, c) <= min(b, d)`
- **Overlap length** is: `max(0, min(b, d) - max(a, c))`
- **Union of intervals** is: `[min(a, c), max(b, d)]`
- **Intersection of intervals** is: `[max(a, c), min(b, d)]` (if overlap exists)

### Greedy Algorithm Proof
- **Greedy choice property:** Locally optimal choice leads to globally optimal solution
- **Optimal substructure:** Optimal solution contains optimal solutions to subproblems
- **Exchange argument:** Can replace any solution with greedy solution without making it worse
