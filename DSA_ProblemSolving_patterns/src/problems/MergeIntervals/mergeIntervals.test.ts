import {
  merge,
  insert,
  intervalIntersection,
  canAttendMeetings,
  minMeetingRooms,
  minPlatformsForTrains,
  minPlatformsUsingIntervals,
  employeeFreeTime,
  removeCoveredIntervals,
  partitionLabels,
  intervalListIntersections,
  findMinArrowShots,
  intervalsOverlap,
  mergeTwoIntervals,
  isIntervalCovered,
  sortIntervalsByStart,
  sortIntervalsByEnd,
} from "./mergeIntervals";

describe("Merge Intervals Pattern", () => {
  describe("Merge Intervals", () => {
    test("should merge overlapping intervals correctly", () => {
      const intervals1 = [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ];
      const expected1 = [
        [1, 6],
        [8, 10],
        [15, 18],
      ];
      expect(merge(intervals1)).toEqual(expected1);

      const intervals2 = [
        [1, 4],
        [4, 5],
      ];
      const expected2 = [[1, 5]];
      expect(merge(intervals2)).toEqual(expected2);

      const intervals3 = [
        [1, 4],
        [0, 4],
      ];
      const expected3 = [[0, 4]];
      expect(merge(intervals3)).toEqual(expected3);
    });

    test("Real-world: Calendar meeting consolidation - merge overlapping meetings", () => {
      // Scenario: User has multiple calendar entries that overlap
      // Times in 24-hour format (9 = 9 AM, 9.5 = 9:30 AM, etc.)
      const meetings = [
        [9, 10],
        [9.5, 11],
        [11.5, 12.5],
        [12, 13],
      ];
      const merged = merge(meetings);
      const expected = [
        [9, 11],
        [11.5, 13],
      ];
      expect(merged).toEqual(expected);
      // Interpretation: User is busy from 9-11 AM and 11:30 AM-1 PM
    });

    test("Real-world: Time tracking for billing - combine overlapping work sessions", () => {
      // Scenario: Developer logs work sessions (in hours, some overlap)
      // 8 = 8 AM, 9.5 = 9:30 AM, 13 = 1 PM, 14.5 = 2:30 PM
      const workSessions = [
        [8, 10],
        [9.5, 12],
        [13, 15],
        [14.5, 16],
      ];
      const merged = merge(workSessions);
      const expected = [
        [8, 12],
        [13, 16],
      ];
      expect(merged).toEqual(expected);
      // Total billable hours: 4 hours (12-8) + 3 hours (16-13) = 7 hours
      // Not 8.5 hours if we counted overlaps separately
    });

    test("Real-world: Network maintenance windows - consolidate downtime periods", () => {
      // Scenario: Different teams schedule overlapping maintenance periods
      // Times in Unix timestamps or minutes from midnight
      const maintenanceWindows = [
        [1000, 2000],
        [1500, 2500],
        [3000, 4000],
      ];
      const merged = merge(maintenanceWindows);
      const expected = [
        [1000, 2500],
        [3000, 4000],
      ];
      expect(merged).toEqual(expected);
      // System knows actual downtime: 1000-2500 and 3000-4000
    });

    test("Real-world: Conference room bookings - merge overlapping reservations", () => {
      // Scenario: Bookings with overlaps due to meetings running over
      // Times in 24-hour format (9 = 9 AM, 9.45 = 9:45 AM, etc.)
      const bookings = [
        [9, 10],
        [9.45, 11],
        [11.5, 12.5],
        [12, 13],
      ];
      const merged = merge(bookings);
      const expected = [
        [9, 11],
        [11.5, 13],
      ];
      expect(merged).toEqual(expected);
      // Room is actually occupied: 9 AM-11 AM, then 11:30 AM-1 PM
    });

    test("Real-world: Employee availability - find busy periods", () => {
      // Scenario: Employee has multiple overlapping busy periods
      const busyPeriods = [
        [8, 9],
        [8.5, 10],
        [14, 15],
        [14.75, 16],
      ];
      const merged = merge(busyPeriods);
      const expected = [
        [8, 10],
        [14, 16],
      ];
      expect(merged).toEqual(expected);
      // Employee is busy: 8-10 AM and 2-4 PM
      // Free time: 10 AM-2 PM and after 4 PM
    });

    test("Real-world: Subscription periods - combine overlapping service periods", () => {
      // Scenario: User renews subscription before it expires (overlaps)
      // Days since start of year
      const subscriptions = [
        [1, 30],
        [25, 60],
        [90, 120],
      ];
      const merged = merge(subscriptions);
      const expected = [
        [1, 60],
        [90, 120],
      ];
      expect(merged).toEqual(expected);
      // User had continuous service: Days 1-60, then 90-120
    });

    test("should handle non-overlapping intervals", () => {
      const intervals = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      expect(merge(intervals)).toEqual(intervals);
    });

    test("should handle empty array", () => {
      expect(merge([])).toEqual([]);
    });

    test("should handle single interval", () => {
      const intervals = [[1, 4]];
      expect(merge(intervals)).toEqual(intervals);
    });
  });

  describe("Insert Interval", () => {
    test("should insert interval correctly", () => {
      const intervals = [
        [1, 3],
        [6, 9],
      ];
      const newInterval = [2, 5];
      const expected = [
        [1, 5],
        [6, 9],
      ];
      expect(insert(intervals, newInterval)).toEqual(expected);

      const intervals2 = [
        [1, 2],
        [3, 5],
        [6, 7],
        [8, 10],
        [12, 16],
      ];
      const newInterval2 = [4, 8];
      const expected2 = [
        [1, 2],
        [3, 10],
        [12, 16],
      ];
      expect(insert(intervals2, newInterval2)).toEqual(expected2);
    });

    test("should handle insertion at beginning", () => {
      const intervals = [
        [3, 5],
        [6, 9],
      ];
      const newInterval = [1, 2];
      const expected = [
        [1, 2],
        [3, 5],
        [6, 9],
      ];
      expect(insert(intervals, newInterval)).toEqual(expected);
    });

    test("should handle insertion at end", () => {
      const intervals = [
        [1, 3],
        [6, 9],
      ];
      const newInterval = [10, 12];
      const expected = [
        [1, 3],
        [6, 9],
        [10, 12],
      ];
      expect(insert(intervals, newInterval)).toEqual(expected);
    });
  });

  describe("Interval Intersection", () => {
    test("should find intersections correctly", () => {
      const firstList = [
        [0, 2],
        [5, 10],
        [13, 23],
        [24, 25],
      ];
      const secondList = [
        [1, 5],
        [8, 12],
        [15, 24],
        [25, 26],
      ];
      const expected = [
        [1, 2],
        [5, 5],
        [8, 10],
        [15, 23],
        [24, 24],
        [25, 25],
      ];
      expect(intervalIntersection(firstList, secondList)).toEqual(expected);
    });

    test("should handle no intersections", () => {
      const firstList = [
        [1, 3],
        [5, 9],
      ];
      const secondList = [
        [4, 5],
        [10, 12],
      ];
      expect(intervalIntersection(firstList, secondList)).toEqual([]);
    });
  });

  describe("Can Attend Meetings", () => {
    test("should detect conflicts correctly", () => {
      const intervals1 = [
        [0, 30],
        [5, 10],
        [15, 20],
      ];
      expect(canAttendMeetings(intervals1)).toBe(false);

      const intervals2 = [
        [7, 10],
        [2, 4],
      ];
      expect(canAttendMeetings(intervals2)).toBe(true);
    });

    test("should handle edge cases", () => {
      expect(canAttendMeetings([])).toBe(true);
      expect(canAttendMeetings([[1, 2]])).toBe(true);
    });
  });

  describe("Minimum Meeting Rooms", () => {
    test("should calculate minimum rooms correctly", () => {
      const intervals1 = [
        [0, 30],
        [5, 10],
        [15, 20],
      ];
      expect(minMeetingRooms(intervals1)).toBe(2);

      const intervals2 = [
        [7, 10],
        [2, 4],
      ];
      expect(minMeetingRooms(intervals2)).toBe(1);

      const intervals3 = [
        [1, 4],
        [2, 3],
        [3, 6],
      ];
      expect(minMeetingRooms(intervals3)).toBe(2);
    });

    test("should handle edge cases", () => {
      expect(minMeetingRooms([])).toBe(0);
      expect(minMeetingRooms([[1, 2]])).toBe(1);
    });
  });

  describe("Minimum Platforms for Trains", () => {
    test("should calculate minimum platforms correctly - example from image", () => {
      // Times converted to minutes: 1:00=60, 1:40=100, 1:50=110, 2:00=120, 2:15=135, 4:00=240
      // Departure: 1:10=70, 3:00=180, 2:20=140, 2:30=150, 3:15=195, 6:00=360
      const arrival = [60, 100, 110, 120, 135, 240];
      const departure = [70, 180, 140, 150, 195, 360];
      expect(minPlatformsForTrains(arrival, departure)).toBe(4);
    });

    test("should calculate minimum platforms correctly - all trains overlap", () => {
      const arrival = [10, 20, 30];
      const departure = [50, 60, 70];
      expect(minPlatformsForTrains(arrival, departure)).toBe(3);
    });

    test("should calculate minimum platforms correctly - no overlaps", () => {
      const arrival = [10, 50, 90];
      const departure = [20, 60, 100];
      expect(minPlatformsForTrains(arrival, departure)).toBe(1);
    });

    test("should calculate minimum platforms correctly - partial overlaps", () => {
      const arrival = [900, 940, 950, 1100, 1500, 1800];
      const departure = [910, 1200, 1120, 1130, 1900, 2000];
      // At 1100, we have trains from 900, 940, 950, 1100 = 4 platforms
      expect(minPlatformsForTrains(arrival, departure)).toBe(4);
    });

    test("should handle same arrival/departure times", () => {
      const arrival = [10, 10, 10];
      const departure = [20, 20, 20];
      expect(minPlatformsForTrains(arrival, departure)).toBe(3);
    });

    test("should handle edge cases", () => {
      expect(minPlatformsForTrains([], [])).toBe(0);
      expect(minPlatformsForTrains([10], [20])).toBe(1);
    });

    test("should match minPlatformsUsingIntervals result", () => {
      const arrival = [60, 100, 110, 120, 135, 240];
      const departure = [70, 180, 140, 150, 195, 360];

      const result1 = minPlatformsForTrains(arrival, departure);
      const result2 = minPlatformsUsingIntervals(arrival, departure);

      expect(result1).toBe(result2);
      expect(result1).toBe(4);
    });
  });

  describe("Employee Free Time", () => {
    test("should find free time correctly", () => {
      const schedule = [
        [
          [1, 3],
          [6, 7],
        ],
        [[2, 4]],
        [
          [2, 5],
          [9, 12],
        ],
      ];
      const result = employeeFreeTime(schedule);
      expect(result.length).toBeGreaterThan(0);
    });

    test("should handle no free time", () => {
      const schedule = [
        [
          [1, 2],
          [3, 4],
        ],
        [
          [2, 3],
          [4, 5],
        ],
      ];
      const result = employeeFreeTime(schedule);
      expect(result).toEqual([]);
    });
  });

  describe("Remove Covered Intervals", () => {
    test("should remove covered intervals correctly", () => {
      const intervals1 = [
        [1, 4],
        [3, 6],
        [2, 8],
      ];
      expect(removeCoveredIntervals(intervals1)).toBe(2);

      const intervals2 = [
        [1, 4],
        [2, 3],
      ];
      expect(removeCoveredIntervals(intervals2)).toBe(1);

      const intervals3 = [
        [0, 10],
        [5, 12],
      ];
      expect(removeCoveredIntervals(intervals3)).toBe(2);
    });

    test("should handle edge cases", () => {
      expect(removeCoveredIntervals([])).toBe(0);
      expect(removeCoveredIntervals([[1, 2]])).toBe(1);
    });
  });

  describe("Partition Labels", () => {
    test("should partition string correctly", () => {
      expect(partitionLabels("ababcbacadefegdehijhklij")).toEqual([9, 7, 8]);
      expect(partitionLabels("eccbbbbdec")).toEqual([10]);
      expect(partitionLabels("caedbdedda")).toEqual([1, 9]);
    });

    test("should handle single character", () => {
      expect(partitionLabels("a")).toEqual([1]);
    });
  });

  describe("Interval List Intersections", () => {
    test("should find all intersections", () => {
      const firstList = [
        [0, 2],
        [5, 10],
        [13, 23],
        [24, 25],
      ];
      const secondList = [
        [1, 5],
        [8, 12],
        [15, 24],
        [25, 26],
      ];
      const expected = [
        [1, 2],
        [5, 5],
        [8, 10],
        [15, 23],
        [24, 24],
        [25, 25],
      ];
      expect(intervalListIntersections(firstList, secondList)).toEqual(
        expected
      );
    });
  });

  describe("Minimum Arrow to Burst Balloons", () => {
    test("should find minimum arrows correctly", () => {
      const points1 = [
        [10, 16],
        [2, 8],
        [1, 6],
        [7, 12],
      ];
      expect(findMinArrowShots(points1)).toBe(2);

      const points2 = [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ];
      expect(findMinArrowShots(points2)).toBe(4);

      const points3 = [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
      ];
      expect(findMinArrowShots(points3)).toBe(2);
    });

    test("should handle edge cases", () => {
      expect(findMinArrowShots([])).toBe(0);
      expect(findMinArrowShots([[1, 2]])).toBe(1);
    });
  });

  describe("Utility Functions", () => {
    test("intervalsOverlap should work correctly", () => {
      expect(intervalsOverlap([1, 3], [2, 4])).toBe(true);
      expect(intervalsOverlap([1, 2], [3, 4])).toBe(false);
      expect(intervalsOverlap([1, 4], [2, 3])).toBe(true);
    });

    test("mergeTwoIntervals should work correctly", () => {
      expect(mergeTwoIntervals([1, 3], [2, 4])).toEqual([1, 4]);
      expect(mergeTwoIntervals([1, 2], [3, 4])).toEqual([1, 4]);
    });

    test("isIntervalCovered should work correctly", () => {
      expect(isIntervalCovered([2, 3], [1, 4])).toBe(true);
      expect(isIntervalCovered([1, 4], [2, 3])).toBe(false);
    });

    test("sortIntervalsByStart should work correctly", () => {
      const intervals = [
        [3, 4],
        [1, 2],
        [5, 6],
      ];
      const sorted = sortIntervalsByStart(intervals);
      expect(sorted).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    test("sortIntervalsByEnd should work correctly", () => {
      const intervals = [
        [1, 4],
        [2, 3],
        [5, 6],
      ];
      const sorted = sortIntervalsByEnd(intervals);
      expect(sorted).toEqual([
        [2, 3],
        [1, 4],
        [5, 6],
      ]);
    });
  });
});
