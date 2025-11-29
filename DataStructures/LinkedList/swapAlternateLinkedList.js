/**
 * LinkedList implementation with various swapping algorithms
 * 
 * This file demonstrates different approaches to swap nodes in a linked list:
 * 1. Swap data values only (simple but doesn't change actual node positions)
 * 2. Swap actual nodes by changing links (more complex but proper swapping)
 * 
 */

/**
 * Node class represents a single node in the linked list
 * Each node contains:
 * - data: the value stored in the node
 * - next: reference/pointer to the next node in the list
 */
class Node_ {
    constructor(data) {
      this.data = data; // Store the value
      this.next = null; // Initially points to nothing (end of list)
    }
}

/**
 * LinkedList class - manages the entire linked list structure
 * Contains the head pointer and all operations for the list
 */
class LinkedList {
  constructor() {
    this.head = null; // Points to the first node in the list (null if empty)
  }

  /**
   * Inserts a new Node at the front of the list (LIFO - Last In First Out)
   * This is like adding to the top of a stack
   *
   * @param {*} new_data - The data/value to store in the new node
   *
   * Time Complexity: O(1) - constant time insertion
   * Space Complexity: O(1) - only creates one new node
   */
  push(new_data) {
    // Step 1 & 2: Create a new node and put the data in it
    var new_node = new Node_(new_data);

    // Step 3: Make the new node point to the current head
    // This connects our new node to the existing list
    new_node.next = this.head;

    // Step 4: Update head to point to our new node
    // Now our new node becomes the first node in the list
    this.head = new_node;
  }

  /**
   * METHOD 1: Pairwise swap using ITERATIVE approach (swapping data only)
   *
   * This method swaps the DATA of adjacent nodes, not the actual nodes themselves.
   * Example: 1->2->3->4->5 becomes 2->1->4->3->5
   *
   * How it works:
   * - Start from head
   * - Take pairs of adjacent nodes (1,2), (3,4), etc.
   * - Swap their data values
   * - Move to next pair
   *
   * Time Complexity: O(n) - visits each node once
   * Space Complexity: O(1) - only uses temporary variables
   */
  pairWiseSwap() {
    var temp = this.head; // Start from the first node

    // Continue until we have at least 2 nodes left to swap
    // We need both temp and temp.next to exist for a valid pair
    while (temp != null && temp.next != null) {
      // Swap the data of current node with its next node
      var k = temp.data; // Store current node's data temporarily
      temp.data = temp.next.data; // Copy next node's data to current
      temp.next.data = k; // Put stored data into next node

      // Move to the next pair (skip 2 nodes)
      // This ensures we don't swap the same pair twice
      temp = temp.next.next;
    }
  }

  /**
   * METHOD 2: Pairwise swap using RECURSIVE approach (swapping data only)
   *
   * This is the recursive version of the above method.
   * Same result, but uses function call stack instead of loops.
   *
   *
   * Time Complexity: O(n) - visits each node once
   * Space Complexity: O(n) - due to recursion call stack
   *
   * @param {Node_} head - The starting node for this recursive call
   */
  pairWiseSwapRecursive(head) {
    // Base case: if we don't have at least 2 nodes, stop recursion
    if (head != null && head.next != null) {
      swap(head.data, head.next.data); // ⚠️ This function doesn't exist

      pairWiseSwapRecursive(head.next.next);
    }
  }

  swap = (data1, data2) => {
    let temp = data1;
    data1 = data2;
    data2 = temp;
  };
  /**
   * METHOD 3: Swap alternate nodes by changing actual node links
   *
   * This method calls _swapNodes to swap actual nodes (not just data).
   * It processes adjacent pairs: (1st,2nd), (3rd,4th), (5th,6th), etc.
   *
   * Example: 1->2->3->4->5->6 becomes 2->1->4->3->6->5
   *
   * Time Complexity: O(n²) - _swapNodes has to search for nodes each time
   * Space Complexity: O(1) - only uses temporary variables
   */
  swapAlternateNodes() {
    let current = this.head;

    // Process pairs of adjacent nodes
    while (current && current.next) {
      // Swap the current node with its next node (by changing links)
      this._swapNodes(current.data, current.next.data);

      // Move to the next pair
      // After swapping, the structure changes, so we skip 2 positions
      current = current.next.next;
    }
  }

  /**
   * UTILITY METHOD: Swap two nodes by changing their links (not just data)
   *
   * This is the most complex but "proper" way to swap nodes in a linked list.
   * It finds nodes with values x and y, then changes the actual links to swap positions.
   *
   * Example: If we have 1->2->3->4 and call _swapNodes(2,3)
   * Result: 1->3->2->4 (actual nodes 2 and 3 have changed positions)
   *
   * Algorithm Steps:
   * 1. Find node with value x and its previous node
   * 2. Find node with value y and its previous node
   * 3. Update previous nodes to point to swapped nodes
   * 4. Update the swapped nodes' next pointers
   *
   * @param {*} x - Value of first node to swap
   * @param {*} y - Value of second node to swap
   *
   * Time Complexity: O(n) - may need to traverse entire list to find nodes
   * Space Complexity: O(1) - only uses temporary variables
   */
  _swapNodes(x, y) {
    // If both values are same, no swapping needed
    if (x == y) return;

    // STEP 1: Search for node with value x and keep track of its previous node
    var prevX = null,
      currX = this.head;
    while (currX != null && currX.data != x) {
      prevX = currX; // Keep track of previous node
      currX = currX.next; // Move to next node
    }

    // STEP 2: Search for node with value y and keep track of its previous node
    var prevY = null,
      currY = this.head;
    while (currY != null && currY.data != y) {
      prevY = currY; // Keep track of previous node
      currY = currY.next; // Move to next node
    }

    // STEP 3: If either node is not found, we can't swap
    if (currX == null || currY == null) return;

    // STEP 4: Update the previous node of X to point to Y
    if (prevX != null) prevX.next = currY; // prevX now points to currY
    // If X was the head node, make Y the new head
    else this.head = currY;

    // STEP 5: Update the previous node of Y to point to X
    if (prevY != null) prevY.next = currX; // prevY now points to currX
    // If Y was the head node, make X the new head
    else this.head = currX;

    // STEP 6: Swap the next pointers of X and Y nodes
    var temp = currX.next; // Store X's next temporarily
    currX.next = currY.next; // X now points where Y was pointing
    currY.next = temp; // Y now points where X was pointing
  }
}

// ============================================================================
// DEMO/TESTING SECTION
// ============================================================================

/**
 * Create a test linked list and demonstrate the swapping functionality
 *
 * Original list: 1->2->3->4->5->6->7
 * After swapping: 2->1->4->3->6->5->7 (pairs get swapped)
 */

// Create a new LinkedList instance
let linkedList = new LinkedList();

// Method 1: Manually create nodes (not recommended for large lists)
// This creates: 1->2->3->4->5->6->7
linkedList.head = new Node_(1);
linkedList.head.next = new Node_(2);
linkedList.head.next.next = new Node_(3);
linkedList.head.next.next.next = new Node_(4);
linkedList.head.next.next.next.next = new Node_(5);
linkedList.head.next.next.next.next.next = new Node_(6);
linkedList.head.next.next.next.next.next.next = new Node_(7);

// Method 2: Using push() method (recommended approach)
// let linkedList2 = new LinkedList();
// linkedList2.push(7); linkedList2.push(6); linkedList2.push(5);
// linkedList2.push(4); linkedList2.push(3); linkedList2.push(2); linkedList2.push(1);
// Note: push() adds to front, so we push in reverse order to get 1->2->3->4->5->6->7

console.log("=== LinkedList Swapping Demo ===");
console.log("Original list: 1->2->3->4->5->6->7");

// Test the swapping functionality
// Note: swapAlternateNodes() returns undefined, it modifies the list in-place
linkedList.swapAlternateNodes();
console.log(
  "After swapping alternate nodes: The list structure has been modified"
);

// To see the actual result, you would need a display/print method
// Example helper function to display the list:
function printList(head) {
  let result = "";
  let current = head;
  while (current) {
    result += current.data;
    if (current.next) result += "->";
    current = current.next;
  }
  return result;
}

console.log("Result:", printList(linkedList.head));

