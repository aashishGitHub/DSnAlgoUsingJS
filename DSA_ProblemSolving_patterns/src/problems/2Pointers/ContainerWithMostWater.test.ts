import { describe, it, expect } from "vitest";
import { maxArea } from "./ContainerWithMostWater";

describe("Container With Most Water - Two Pointers Pattern", () => {
  describe("Basic functionality", () => {
    it("should return correct area for example case", () => {
      const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
      const result = maxArea(height);
      
      expect(result).toBe(49);
      // Area between index 1 (height 8) and index 8 (height 7)
      // min(8, 7) * (8 - 1) = 7 * 7 = 49
    });

    it("should return correct area for simple case", () => {
      const height = [1, 1];
      const result = maxArea(height);
      
      expect(result).toBe(1);
      // min(1, 1) * (1 - 0) = 1 * 1 = 1
    });

    it("should handle increasing heights", () => {
      const height = [1, 2, 3, 4, 5];
      const result = maxArea(height);
      
      expect(result).toBe(6);
      // Between index 0 (height 1) and index 4 (height 5)
      // min(1, 5) * (4 - 0) = 1 * 4 = 4
      // But better: between index 1 (height 2) and index 4 (height 5)
      // min(2, 5) * (4 - 1) = 2 * 3 = 6
    });

    it("should handle decreasing heights", () => {
      const height = [5, 4, 3, 2, 1];
      const result = maxArea(height);
      
      expect(result).toBe(6);
      // Between index 0 (height 5) and index 3 (height 2)
      // min(5, 2) * (3 - 0) = 2 * 3 = 6
    });

    it("should handle equal heights", () => {
      const height = [3, 3, 3, 3];
      const result = maxArea(height);
      
      expect(result).toBe(9);
      // Between index 0 and index 3
      // min(3, 3) * (3 - 0) = 3 * 3 = 9
    });
  });

  describe("Edge cases", () => {
    it("should return 0 for empty array", () => {
      const height: number[] = [];
      const result = maxArea(height);
      
      expect(result).toBe(0);
    });

    it("should return 0 for single element", () => {
      const height = [5];
      const result = maxArea(height);
      
      expect(result).toBe(0);
    });

    it("should return 0 for null input", () => {
      const result = maxArea(null as any);
      
      expect(result).toBe(0);
    });

    it("should return 0 for undefined input", () => {
      const result = maxArea(undefined as any);
      
      expect(result).toBe(0);
    });

    it("should handle array with zeros", () => {
      const height = [0, 2, 0, 4, 0];
      const result = maxArea(height);
      
      expect(result).toBe(4);
      // Between index 1 (height 2) and index 3 (height 4)
      // min(2, 4) * (3 - 1) = 2 * 2 = 4
    });

    it("should handle all zeros", () => {
      const height = [0, 0, 0, 0];
      const result = maxArea(height);
      
      expect(result).toBe(0);
    });
  });

  describe("Performance cases", () => {
    it("should handle large arrays efficiently", () => {
      const height = Array.from({ length: 1000 }, (_, i) => i % 100);
      
      const start = performance.now();
      const result = maxArea(height);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10); // Should be very fast
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("should find optimal solution for complex case", () => {
      const height = [2, 3, 4, 5, 18, 17, 6];
      const result = maxArea(height);
      
      // Let me calculate all possible areas: [2, 3, 4, 5, 18, 17, 6]
      // Index 0 to 6: min(2, 6) * 6 = 2 * 6 = 12
      // Index 1 to 5: min(3, 17) * 4 = 3 * 4 = 12  
      // Index 2 to 5: min(4, 17) * 3 = 4 * 3 = 12
      // Index 3 to 4: min(5, 18) * 1 = 5 * 1 = 5
      // Index 4 to 5: min(18, 17) * 1 = 17 * 1 = 17
      // The maximum should be 17
      
      expect(result).toBe(17);
    });
  });

  describe("Algorithm correctness", () => {
    it("should always find the optimal solution", () => {
      const testCases = [
        { height: [1, 8, 6, 2, 5, 4, 8, 3, 7], expected: 49 },
        { height: [1, 1], expected: 1 },
        { height: [4, 3, 2, 1, 4], expected: 16 }, // 4 * 4 = 16
        { height: [1, 2, 1], expected: 2 }, // 1 * 2 = 2
      ];

      testCases.forEach(({ height, expected }) => {
        const result = maxArea(height);
        expect(result).toBe(expected);
      });
    });
  });
});
