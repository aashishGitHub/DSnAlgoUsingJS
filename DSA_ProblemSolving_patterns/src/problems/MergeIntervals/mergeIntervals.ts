/**
 * Merge Intervals Pattern
 * 
 * This pattern deals with overlapping intervals and involves sorting intervals
 * and merging overlaps. It's commonly used for scheduling problems, conflict
 * resolution, and time-based operations.
 * 
 * Key Points:
 * - Deals with overlapping intervals
 * - Involves sorting intervals and merging overlaps
 * - Common for scheduling and conflict resolution
 * 
 * Time Complexity: O(n log n) - sorting dominates
 * Space Complexity: O(1) or O(n) - depending on implementation
 */

// ============================================================================
// INTERVAL DEFINITION
// ============================================================================

export interface Interval {
    start: number;
    end: number;
}

// ============================================================================
// 1. MERGE INTERVALS
// ============================================================================

/**
 * Merge overlapping intervals
 * 
 * Given an array of intervals where intervals[i] = [starti, endi],
 * merge all overlapping intervals and return an array of non-overlapping
 * intervals that cover all the intervals in the input.
 * 
 * @param intervals - Array of intervals
 * @returns Array of merged intervals
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(1) - excluding output array
 */
export function merge(intervals: number[][]): number[][] {
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

// ============================================================================
// 2. INSERT INTERVAL
// ============================================================================

/**
 * Insert a new interval into a sorted list of non-overlapping intervals
 * 
 * @param intervals - Sorted array of non-overlapping intervals
 * @param newInterval - New interval to insert
 * @returns Array of intervals after insertion
 * 
 * Time: O(n) - single pass through intervals
 * Space: O(1) - excluding output array
 */
export function insert(intervals: number[][], newInterval: number[]): number[][] {
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

// ============================================================================
// 3. INTERVAL INTERSECTION
// ============================================================================

/**
 * Find the intersection of two lists of intervals
 * 
 * @param firstList - First list of intervals
 * @param secondList - Second list of intervals
 * @returns Array of intersection intervals
 * 
 * Time: O(m + n) - where m and n are lengths of the lists
 * Space: O(1) - excluding output array
 */
export function intervalIntersection(
    firstList: number[][], 
    secondList: number[][]
): number[][] {
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

// ============================================================================
// 4. CONFLICTING APPOINTMENTS
// ============================================================================

/**
 * Check if a person can attend all appointments
 * 
 * @param intervals - Array of appointment intervals
 * @returns True if no conflicts, false otherwise
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(1)
 */
export function canAttendMeetings(intervals: number[][]): boolean {
    if (intervals.length <= 1) return true;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Check for overlaps
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) {
            return false; // Conflict found
        }
    }
    
    return true;
}

// ============================================================================
// 5. MINIMUM MEETING ROOMS
// ============================================================================

/**
 * Find the minimum number of meeting rooms required
 * 
 * @param intervals - Array of meeting intervals
 * @returns Minimum number of rooms needed
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(n) - for the heap
 */
export function minMeetingRooms(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Use a min heap to track end times
    const endTimes: number[] = [];
    
    for (const interval of intervals) {
        const [start, end] = interval;
        
        // If earliest ending meeting ends before current meeting starts
        if (endTimes.length > 0 && endTimes[0] <= start) {
            // Remove the earliest ending meeting
            endTimes.shift();
        }
        
        // Add current meeting's end time
        endTimes.push(end);
        endTimes.sort((a, b) => a - b); // Keep heap property
    }
    
    return endTimes.length;
}

// ============================================================================
// 6. EMPLOYEE FREE TIME
// ============================================================================

/**
 * Find free time intervals for all employees
 * 
 * @param schedule - Array of employee schedules
 * @returns Array of free time intervals
 * 
 * Time: O(n log n) - where n is total number of intervals
 * Space: O(n) - for merged intervals
 */
export function employeeFreeTime(schedule: number[][][]): number[][] {
    // Flatten all intervals
    const allIntervals: number[][] = [];
    for (const employee of schedule) {
        allIntervals.push(...employee);
    }
    
    // Sort by start time
    allIntervals.sort((a, b) => a[0] - b[0]);
    
    // Merge overlapping intervals
    const merged = merge(allIntervals);
    
    // Find gaps between merged intervals
    const freeTime: number[][] = [];
    for (let i = 1; i < merged.length; i++) {
        const gapStart = merged[i - 1][1];
        const gapEnd = merged[i][0];
        
        if (gapStart < gapEnd) {
            freeTime.push([gapStart, gapEnd]);
        }
    }
    
    return freeTime;
}

// ============================================================================
// 7. REMOVE COVERED INTERVALS
// ============================================================================

/**
 * Remove intervals that are covered by another interval
 * 
 * An interval [a, b) is covered by another interval [c, d) if c <= a and b <= d.
 * 
 * @param intervals - Array of intervals
 * @returns Number of intervals after removing covered ones
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(1)
 */
export function removeCoveredIntervals(intervals: number[][]): number {
    if (intervals.length <= 1) return intervals.length;
    
    // Sort by start time, then by end time (descending)
    intervals.sort((a, b) => {
        if (a[0] !== b[0]) {
            return a[0] - b[0];
        }
        return b[1] - a[1]; // Descending end time
    });
    
    let count = 1;
    let prevEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        
        // If current interval is not covered
        if (end > prevEnd) {
            count++;
            prevEnd = end;
        }
    }
    
    return count;
}

// ============================================================================
// 8. PARTITION LABELS
// ============================================================================

/**
 * Partition a string into as many parts as possible so that each letter
 * appears in at most one part.
 * 
 * @param s - Input string
 * @returns Array of partition sizes
 * 
 * Time: O(n) - single pass through string
 * Space: O(1) - constant extra space
 */
export function partitionLabels(s: string): number[] {
    // Find last occurrence of each character
    const lastOccurrence: { [key: string]: number } = {};
    for (let i = 0; i < s.length; i++) {
        lastOccurrence[s[i]] = i;
    }
    
    const result: number[] = [];
    let start = 0;
    let end = 0;
    
    for (let i = 0; i < s.length; i++) {
        // Extend the partition to include the last occurrence of current character
        end = Math.max(end, lastOccurrence[s[i]]);
        
        // If we've reached the end of current partition
        if (i === end) {
            result.push(end - start + 1);
            start = i + 1;
        }
    }
    
    return result;
}

// ============================================================================
// 9. INTERVAL LIST INTERSECTIONS
// ============================================================================

/**
 * Find all intersections between two lists of intervals
 * 
 * @param firstList - First list of intervals
 * @param secondList - Second list of intervals
 * @returns Array of all intersection intervals
 * 
 * Time: O(m + n) - where m and n are lengths of the lists
 * Space: O(1) - excluding output array
 */
export function intervalListIntersections(
    firstList: number[][], 
    secondList: number[][]
): number[][] {
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

// ============================================================================
// 10. MINIMUM ARROW TO BURST BALLOONS
// ============================================================================

/**
 * Find minimum number of arrows to burst all balloons
 * 
 * @param points - Array of balloon intervals
 * @returns Minimum number of arrows needed
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(1)
 */
export function findMinArrowShots(points: number[][]): number {
    if (points.length === 0) return 0;
    
    // Sort by end position
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let end = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
        // If current balloon starts after previous arrow position
        if (points[i][0] > end) {
            arrows++;
            end = points[i][1];
        }
    }
    
    return arrows;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if two intervals overlap
 */
export function intervalsOverlap(interval1: number[], interval2: number[]): boolean {
    return interval1[0] <= interval2[1] && interval2[0] <= interval1[1];
}

/**
 * Merge two overlapping intervals
 */
export function mergeTwoIntervals(interval1: number[], interval2: number[]): number[] {
    return [
        Math.min(interval1[0], interval2[0]),
        Math.max(interval1[1], interval2[1])
    ];
}

/**
 * Check if an interval is covered by another
 */
export function isIntervalCovered(covered: number[], covering: number[]): boolean {
    return covering[0] <= covered[0] && covered[1] <= covering[1];
}

/**
 * Sort intervals by start time
 */
export function sortIntervalsByStart(intervals: number[][]): number[][] {
    return intervals.sort((a, b) => a[0] - b[0]);
}

/**
 * Sort intervals by end time
 */
export function sortIntervalsByEnd(intervals: number[][]): number[][] {
    return intervals.sort((a, b) => a[1] - b[1]);
}
