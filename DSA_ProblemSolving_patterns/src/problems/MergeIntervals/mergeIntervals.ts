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
 * 
 * @example
 * // Real-world: Calendar meeting consolidation
 * // User has overlapping meetings that need to be merged
 * merge([[9, 10], [9.5, 11], [11.5, 12.5], [12, 13]])
 * // Returns: [[9, 11], [11.5, 13]]
 * // Shows actual busy time blocks: 9-11 AM and 11:30 AM-1 PM
 * 
 * @example
 * // Real-world: Time tracking for billing
 * // Developer logs work sessions (in hours, some overlap)
 * merge([[8, 10], [9.5, 12], [13, 15], [14.5, 16]])
 * // Returns: [[8, 12], [13, 16]]
 * // Total billable hours: 7 hours (not 8.5)
 * 
 * @example
 * // Real-world: Network maintenance windows
 * // Different teams schedule overlapping maintenance periods
 * merge([[1000, 2000], [1500, 2500], [3000, 4000]])
 * // Returns: [[1000, 2500], [3000, 4000]]
 * // System knows actual downtime periods
 * 
 * @example
 * // Real-world: Resource booking (conference room)
 * // Bookings with overlaps due to delays
 * merge([[9, 10], [9.45, 11], [11.5, 12.5], [12, 13]])
 * // Returns: [[9, 11], [11.5, 13]]
 * // Room occupied: 9 AM-11 AM, then 11:30 AM-1 PM
 */
export function merge(intervals: number[][]): number[][] {
  // Edge case: No merging needed if 0 or 1 interval
  // Example: Single meeting [9, 10] or empty calendar []
  if (intervals.length <= 1) return intervals;

  // Step 1: Sort by start time (like organizing meetings chronologically)
  // Example: [[9.5, 11], [9, 10], [12, 13]] → [[9, 10], [9.5, 11], [12, 13]]
  // Why? We need to process meetings in order to detect overlaps
  intervals.sort((a, b) => a[0] - b[0]);

  // Step 2: Start with the first meeting as our first merged busy period
  // Example: First meeting [9, 10] becomes our first busy block
  const mergedBusyPeriods: number[][] = [intervals[0]];

  // Step 3: Check each subsequent meeting against the last merged period
  // Example: Compare [9.5, 11] with [9, 10] to see if they overlap
  for (let i = 1; i < intervals.length; i++) {
    const currentMeeting = intervals[i]; // e.g., [9.5, 11]
    const lastBusyPeriod = mergedBusyPeriods[mergedBusyPeriods.length - 1]; // e.g., [9, 10]

    const currentStart = currentMeeting[0]; // e.g., 9.5 (9:30 AM)
    const lastEnd = lastBusyPeriod[1]; // e.g., 10 (10:00 AM)

    // Check if current meeting overlaps with the last busy period
    // Overlap happens when: current meeting starts before/at the last period ends
    // Example: [9.5, 11] overlaps [9, 10] because 9.5 <= 10
    if (currentStart <= lastEnd) {
      // MERGE: Extend the busy period to include both meetings
      // Take the later end time to cover both meetings
      // Example: [9, 10] + [9.5, 11] → [9, 11] (busy from 9 AM to 11 AM)
      const currentEnd = currentMeeting[1]; // e.g., 11
      lastBusyPeriod[1] = Math.max(lastEnd, currentEnd);
    } else {
      // NO OVERLAP: Start a new busy period
      // Example: [9, 11] and [12, 13] don't overlap → two separate busy blocks
      mergedBusyPeriods.push(currentMeeting);
    }
  }

  // Return the consolidated busy periods
  // Example: [[9, 10], [9.5, 11], [12, 13]] → [[9, 11], [12, 13]]
  return mergedBusyPeriods;
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
// 5. MINIMUM MEETING ROOMS / MINIMUM PLATFORMS FOR TRAINS
// ============================================================================

/**
 * Find the minimum number of meeting rooms required
 * 
 * APPROACH 1: Using Min Heap (Priority Queue)
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

/**
 * Find the minimum number of platforms needed for trains
 * 
 * APPROACH 2: Greedy Two-Pointer (More Efficient)
 * 
 * This is the classic "Minimum Platforms" problem:
 * Given arrival and departure times of trains, find the minimum number
 * of platforms needed so that no train waits.
 * 
 * KEY INSIGHT: We need to find the maximum number of trains present
 * at the station at any given time. This is equivalent to finding the
 * maximum overlap of intervals.
 * 
 * GREEDY APPROACH:
 * 1. Sort both arrival and departure arrays separately
 * 2. Use two pointers to traverse both arrays
 * 3. When a train arrives (arrival[i] < departure[j]), increment platform count
 * 4. When a train departs (arrival[i] >= departure[j]), decrement platform count
 * 5. Track the maximum platforms needed at any point
 * 
 * @param arrival - Array of arrival times
 * @param departure - Array of departure times
 * @returns Minimum number of platforms needed
 * 
 * Time: O(n log n) - sorting dominates
 * Space: O(1) - only using a few variables
 * 
 * Example:
 * arrival = [1:00, 1:40, 1:50, 2:00, 2:15, 4:00]
 * departure = [1:10, 3:00, 2:20, 2:30, 3:15, 6:00]
 * 
 * Converted to minutes for easier comparison:
 * arrival = [60, 100, 110, 120, 135, 240]
 * departure = [70, 180, 140, 150, 195, 360]
 * 
 * Sorted:
 * arrival = [60, 100, 110, 120, 135, 240]
 * departure = [70, 140, 150, 180, 195, 360]
 * 
 * Timeline:
 * 60: Train 1 arrives → platforms = 1, max = 1
 * 70: Train 1 departs → platforms = 0, max = 1
 * 100: Train 2 arrives → platforms = 1, max = 1
 * 110: Train 3 arrives → platforms = 2, max = 2
 * 120: Train 4 arrives → platforms = 3, max = 3
 * 135: Train 5 arrives → platforms = 4, max = 4
 * 140: Train 3 departs → platforms = 3, max = 4
 * 150: Train 4 departs → platforms = 2, max = 4
 * 180: Train 2 departs → platforms = 1, max = 4
 * 195: Train 5 departs → platforms = 0, max = 4
 * 240: Train 6 arrives → platforms = 1, max = 4
 * 360: Train 6 departs → platforms = 0, max = 4
 * 
 * Answer: 4 platforms
 */
export function minPlatformsForTrains(
    arrival: number[], 
    departure: number[]
): number {
    if (arrival.length === 0) return 0;
    if (arrival.length !== departure.length) {
        throw new Error('Arrival and departure arrays must have the same length');
    }
    
    const n = arrival.length;
    
    // Sort both arrays separately
    // This is the key: we need to process events in chronological order
    const sortedArrival = [...arrival].sort((a, b) => a - b);
    const sortedDeparture = [...departure].sort((a, b) => a - b);
    
    // Two pointers: i for arrival, j for departure
    let i = 0; // pointer for arrival array
    let j = 0; // pointer for departure array
    
    let platformsNeeded = 0; // current number of platforms in use
    let maxPlatforms = 0;    // maximum platforms needed at any time
    
    // Process all events (arrivals and departures)
    while (i < n && j < n) {
        // If arrival happens before departure, a train arrives
        if (sortedArrival[i] < sortedDeparture[j]) {
            platformsNeeded++; // need one more platform
            i++; // move to next arrival
            
            // Update maximum if needed
            if (platformsNeeded > maxPlatforms) {
                maxPlatforms = platformsNeeded;
            }
        } else {
            // Departure happens (arrival >= departure)
            // A train leaves, so we free up a platform
            platformsNeeded--; // free one platform
            j++; // move to next departure
        }
    }
    
    // Note: After the loop, if i < n, there are more arrivals
    // but we've already found the maximum, so we don't need to process them
    
    return maxPlatforms;
}

/**
 * Alternative: Minimum Platforms using intervals (same as minMeetingRooms)
 * 
 * This converts the arrival/departure arrays into intervals and uses
 * the same logic as minMeetingRooms.
 * 
 * @param arrival - Array of arrival times
 * @param departure - Array of departure times
 * @returns Minimum number of platforms needed
 */
export function minPlatformsUsingIntervals(
    arrival: number[], 
    departure: number[]
): number {
    if (arrival.length === 0) return 0;
    
    // Convert to intervals
    const intervals: number[][] = [];
    for (let i = 0; i < arrival.length; i++) {
        intervals.push([arrival[i], departure[i]]);
    }
    
    // Use the same logic as minMeetingRooms
    return minMeetingRooms(intervals);
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
