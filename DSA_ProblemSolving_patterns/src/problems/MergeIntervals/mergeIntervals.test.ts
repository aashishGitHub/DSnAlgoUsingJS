import { 
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

describe('Merge Intervals Pattern', () => {
    
    describe('Merge Intervals', () => {
        test('should merge overlapping intervals correctly', () => {
            const intervals1 = [[1, 3], [2, 6], [8, 10], [15, 18]];
            const expected1 = [[1, 6], [8, 10], [15, 18]];
            expect(merge(intervals1)).toEqual(expected1);
            
            const intervals2 = [[1, 4], [4, 5]];
            const expected2 = [[1, 5]];
            expect(merge(intervals2)).toEqual(expected2);
            
            const intervals3 = [[1, 4], [0, 4]];
            const expected3 = [[0, 4]];
            expect(merge(intervals3)).toEqual(expected3);
        });
        
        test('should handle non-overlapping intervals', () => {
            const intervals = [[1, 2], [3, 4], [5, 6]];
            expect(merge(intervals)).toEqual(intervals);
        });
        
        test('should handle empty array', () => {
            expect(merge([])).toEqual([]);
        });
        
        test('should handle single interval', () => {
            const intervals = [[1, 4]];
            expect(merge(intervals)).toEqual(intervals);
        });
    });
    
    describe('Insert Interval', () => {
        test('should insert interval correctly', () => {
            const intervals = [[1, 3], [6, 9]];
            const newInterval = [2, 5];
            const expected = [[1, 5], [6, 9]];
            expect(insert(intervals, newInterval)).toEqual(expected);
            
            const intervals2 = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]];
            const newInterval2 = [4, 8];
            const expected2 = [[1, 2], [3, 10], [12, 16]];
            expect(insert(intervals2, newInterval2)).toEqual(expected2);
        });
        
        test('should handle insertion at beginning', () => {
            const intervals = [[3, 5], [6, 9]];
            const newInterval = [1, 2];
            const expected = [[1, 2], [3, 5], [6, 9]];
            expect(insert(intervals, newInterval)).toEqual(expected);
        });
        
        test('should handle insertion at end', () => {
            const intervals = [[1, 3], [6, 9]];
            const newInterval = [10, 12];
            const expected = [[1, 3], [6, 9], [10, 12]];
            expect(insert(intervals, newInterval)).toEqual(expected);
        });
    });
    
    describe('Interval Intersection', () => {
        test('should find intersections correctly', () => {
            const firstList = [[0, 2], [5, 10], [13, 23], [24, 25]];
            const secondList = [[1, 5], [8, 12], [15, 24], [25, 26]];
            const expected = [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]];
            expect(intervalIntersection(firstList, secondList)).toEqual(expected);
        });
        
        test('should handle no intersections', () => {
            const firstList = [[1, 3], [5, 9]];
            const secondList = [[4, 5], [10, 12]];
            expect(intervalIntersection(firstList, secondList)).toEqual([]);
        });
    });
    
    describe('Can Attend Meetings', () => {
        test('should detect conflicts correctly', () => {
            const intervals1 = [[0, 30], [5, 10], [15, 20]];
            expect(canAttendMeetings(intervals1)).toBe(false);
            
            const intervals2 = [[7, 10], [2, 4]];
            expect(canAttendMeetings(intervals2)).toBe(true);
        });
        
        test('should handle edge cases', () => {
            expect(canAttendMeetings([])).toBe(true);
            expect(canAttendMeetings([[1, 2]])).toBe(true);
        });
    });
    
    describe('Minimum Meeting Rooms', () => {
        test('should calculate minimum rooms correctly', () => {
            const intervals1 = [[0, 30], [5, 10], [15, 20]];
            expect(minMeetingRooms(intervals1)).toBe(2);
            
            const intervals2 = [[7, 10], [2, 4]];
            expect(minMeetingRooms(intervals2)).toBe(1);
            
            const intervals3 = [[1, 4], [2, 3], [3, 6]];
            expect(minMeetingRooms(intervals3)).toBe(2);
        });
        
        test('should handle edge cases', () => {
            expect(minMeetingRooms([])).toBe(0);
            expect(minMeetingRooms([[1, 2]])).toBe(1);
        });
    });
    
    describe('Employee Free Time', () => {
        test('should find free time correctly', () => {
            const schedule = [
                [[1, 3], [6, 7]],
                [[2, 4]],
                [[2, 5], [9, 12]]
            ];
            const result = employeeFreeTime(schedule);
            expect(result.length).toBeGreaterThan(0);
        });
        
        test('should handle no free time', () => {
            const schedule = [
                [[1, 2], [3, 4]],
                [[2, 3], [4, 5]]
            ];
            const result = employeeFreeTime(schedule);
            expect(result).toEqual([]);
        });
    });
    
    describe('Remove Covered Intervals', () => {
        test('should remove covered intervals correctly', () => {
            const intervals1 = [[1, 4], [3, 6], [2, 8]];
            expect(removeCoveredIntervals(intervals1)).toBe(2);
            
            const intervals2 = [[1, 4], [2, 3]];
            expect(removeCoveredIntervals(intervals2)).toBe(1);
            
            const intervals3 = [[0, 10], [5, 12]];
            expect(removeCoveredIntervals(intervals3)).toBe(2);
        });
        
        test('should handle edge cases', () => {
            expect(removeCoveredIntervals([])).toBe(0);
            expect(removeCoveredIntervals([[1, 2]])).toBe(1);
        });
    });
    
    describe('Partition Labels', () => {
        test('should partition string correctly', () => {
            expect(partitionLabels('ababcbacadefegdehijhklij')).toEqual([9, 7, 8]);
            expect(partitionLabels('eccbbbbdec')).toEqual([10]);
            expect(partitionLabels('caedbdedda')).toEqual([1, 9]);
        });
        
        test('should handle single character', () => {
            expect(partitionLabels('a')).toEqual([1]);
        });
    });
    
    describe('Interval List Intersections', () => {
        test('should find all intersections', () => {
            const firstList = [[0, 2], [5, 10], [13, 23], [24, 25]];
            const secondList = [[1, 5], [8, 12], [15, 24], [25, 26]];
            const expected = [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]];
            expect(intervalListIntersections(firstList, secondList)).toEqual(expected);
        });
    });
    
    describe('Minimum Arrow to Burst Balloons', () => {
        test('should find minimum arrows correctly', () => {
            const points1 = [[10, 16], [2, 8], [1, 6], [7, 12]];
            expect(findMinArrowShots(points1)).toBe(2);
            
            const points2 = [[1, 2], [3, 4], [5, 6], [7, 8]];
            expect(findMinArrowShots(points2)).toBe(4);
            
            const points3 = [[1, 2], [2, 3], [3, 4], [4, 5]];
            expect(findMinArrowShots(points3)).toBe(2);
        });
        
        test('should handle edge cases', () => {
            expect(findMinArrowShots([])).toBe(0);
            expect(findMinArrowShots([[1, 2]])).toBe(1);
        });
    });
    
    describe('Utility Functions', () => {
        test('intervalsOverlap should work correctly', () => {
            expect(intervalsOverlap([1, 3], [2, 4])).toBe(true);
            expect(intervalsOverlap([1, 2], [3, 4])).toBe(false);
            expect(intervalsOverlap([1, 4], [2, 3])).toBe(true);
        });
        
        test('mergeTwoIntervals should work correctly', () => {
            expect(mergeTwoIntervals([1, 3], [2, 4])).toEqual([1, 4]);
            expect(mergeTwoIntervals([1, 2], [3, 4])).toEqual([1, 4]);
        });
        
        test('isIntervalCovered should work correctly', () => {
            expect(isIntervalCovered([2, 3], [1, 4])).toBe(true);
            expect(isIntervalCovered([1, 4], [2, 3])).toBe(false);
        });
        
        test('sortIntervalsByStart should work correctly', () => {
            const intervals = [[3, 4], [1, 2], [5, 6]];
            const sorted = sortIntervalsByStart(intervals);
            expect(sorted).toEqual([[1, 2], [3, 4], [5, 6]]);
        });
        
        test('sortIntervalsByEnd should work correctly', () => {
            const intervals = [[1, 4], [2, 3], [5, 6]];
            const sorted = sortIntervalsByEnd(intervals);
            expect(sorted).toEqual([[2, 3], [1, 4], [5, 6]]);
        });
    });
});
