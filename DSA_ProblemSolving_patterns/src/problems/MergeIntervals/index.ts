/**
 * Merge Intervals Pattern - Main Export
 * 
 * This module exports all merge intervals pattern implementations.
 * Perfect for scheduling problems, conflict resolution, and time-based operations.
 */

export * from './mergeIntervals';

// Re-export specific functions for convenience
export {
    merge,
    insert,
    intervalIntersection,
    canAttendMeetings,
    minMeetingRooms,
    employeeFreeTime,
    removeCoveredIntervals,
    partitionLabels,
    intervalListIntersections,
    findMinArrowShots,
    intervalsOverlap,
    mergeTwoIntervals,
    isIntervalCovered,
    sortIntervalsByStart,
    sortIntervalsByEnd
} from './mergeIntervals';
