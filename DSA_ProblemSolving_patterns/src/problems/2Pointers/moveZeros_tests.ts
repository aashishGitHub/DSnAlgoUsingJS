/**
 * HAPPY PATH TESTS FOR MOVE ZEROS PATTERN
 * 
 * Individual test cases for the move zeros pattern and its variations.
 * Only happy path scenarios are included.
 */

import {
  moveNegativesToEnd,
  moveEvensToFront,
  moveZerosMinSwaps,
  moveZerosNoSwaps,
  moveSpacesToEnd,
  moveVowelsToFront,
} from "./moveZeros_solutions";

// ========== TEST UTILITIES ==========

function assertEqual<T>(actual: T[], expected: T[], testName: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  const passed = actualStr === expectedStr;

  const status = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} - ${testName}`);

  if (!passed) {
    console.log(`  Expected: [${expected.join(", ")}]`);
    console.log(`  Got: [${actual.join(", ")}]`);
  }
}

// ========== MOVE ZEROS TESTS ==========

function testMoveZerosNoSwaps_Basic(): void {
  const input = [0, 1, 0, 3, 12];
  const expected = [1, 3, 12, 0, 0];
  moveZerosNoSwaps(input);
  assertEqual(input, expected, "Move Zeros (No Swaps) - Basic case");
}

function testMoveZerosNoSwaps_Mixed(): void {
  const input = [0, 1, 0, 2, 0, 3, 0];
  const expected = [1, 2, 3, 0, 0, 0, 0];
  moveZerosNoSwaps(input);
  assertEqual(input, expected, "Move Zeros (No Swaps) - Alternating zeros");
}

function testMoveZerosNoSwaps_WithNegatives(): void {
  const input = [-1, 0, -2, 0, 3];
  const expected = [-1, -2, 3, 0, 0];
  moveZerosNoSwaps(input);
  assertEqual(input, expected, "Move Zeros (No Swaps) - With negatives");
}

function testMoveZerosMinSwaps_Basic(): void {
  const input = [0, 1, 0, 3, 12];
  const expected = [1, 3, 12, 0, 0];
  moveZerosMinSwaps(input);
  assertEqual(input, expected, "Move Zeros (Min Swaps) - Basic case");
}

function testMoveZerosMinSwaps_Mixed(): void {
  const input = [0, 1, 0, 2, 0, 3, 0];
  const expected = [1, 2, 3, 0, 0, 0, 0];
  moveZerosMinSwaps(input);
  assertEqual(input, expected, "Move Zeros (Min Swaps) - Alternating zeros");
}

// ========== MOVE NEGATIVES TESTS ==========

function testMoveNegativesToEnd_Basic(): void {
  const input = [1, -2, 3, -4, 5];
  const expected = [1, 3, 5, -2, -4];
  moveNegativesToEnd(input);
  assertEqual(
    input,
    expected,
    "Move Negatives to End - Mixed positive and negative"
  );
}

function testMoveNegativesToEnd_WithZero(): void {
  const input = [0, -1, 2, -3];
  const expected = [0, 2, -1, -3];
  moveNegativesToEnd(input);
  assertEqual(input, expected, "Move Negatives to End - With zero");
}

// ========== MOVE EVENS TESTS ==========

function testMoveEvensToFront_Basic(): void {
  const input = [1, 2, 3, 4, 5, 6];
  const expected = [2, 4, 6, 1, 3, 5];
  moveEvensToFront(input);
  assertEqual(input, expected, "Move Evens to Front - Mixed even and odd");
}

function testMoveEvensToFront_WithZero(): void {
  const input = [0, 1, 2];
  const expected = [0, 2, 1];
  moveEvensToFront(input);
  assertEqual(input, expected, "Move Evens to Front - With zero");
}

// ========== STRING TESTS ==========

function testMoveSpacesToEnd_Basic(): void {
  const input = ["a", " ", "b", " ", "c"];
  const expected = ["a", "b", "c", " ", " "];
  moveSpacesToEnd(input);
  assertEqual(
    input,
    expected,
    "Move Spaces to End - Mixed characters and spaces"
  );
}

function testMoveVowelsToFront_Basic(): void {
  const input = ["h", "e", "l", "l", "o"];
  const expected = ["e", "o", "h", "l", "l"];
  moveVowelsToFront(input);
  assertEqual(
    input,
    expected,
    "Move Vowels to Front - Mixed vowels and consonants"
  );
}

function testMoveVowelsToFront_MixedCase(): void {
  const input = ["A", "b", "E", "c"];
  const expected = ["A", "E", "b", "c"];
  moveVowelsToFront(input);
  assertEqual(input, expected, "Move Vowels to Front - Mixed case");
}

// ========== MAIN TEST RUNNER ==========

export function runAllTests(): void {
  console.log("🧪 MOVE ZEROS PATTERN - HAPPY PATH TESTS");
  console.log("=".repeat(50));

  // Move Zeros Tests
  testMoveZerosNoSwaps_Basic();
  testMoveZerosNoSwaps_Mixed();
  testMoveZerosNoSwaps_WithNegatives();
  testMoveZerosMinSwaps_Basic();
  testMoveZerosMinSwaps_Mixed();

  // Move Negatives Tests
  testMoveNegativesToEnd_Basic();
  testMoveNegativesToEnd_WithZero();

  // Move Evens Tests
  testMoveEvensToFront_Basic();
  testMoveEvensToFront_WithZero();

  // String Tests
  testMoveSpacesToEnd_Basic();
  testMoveVowelsToFront_Basic();
  testMoveVowelsToFront_MixedCase();

  console.log("\n🎉 All tests completed!");
}
