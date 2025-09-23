/**
 * Fast & Slow Pointers (Hare-Tortoise) Pattern
 * 
 * This pattern uses two pointers that traverse at different speeds to solve
 * problems involving cycle detection, finding middle elements, and detecting
 * patterns in sequences.
 * 
 * Key Points:
 * - Two pointers traverse at different speeds
 * - Useful for cycle detection and middle finding
 * - Common in linked list and array problems
 * 
 * Time Complexity: O(n) - linear traversal
 * Space Complexity: O(1) - constant extra space
 */

// ============================================================================
// LINKED LIST NODE DEFINITION
// ============================================================================

export class ListNode {
    val: number;
    next: ListNode | null;
    
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

// ============================================================================
// 1. MIDDLE OF THE LINKED LIST
// ============================================================================

/**
 * Find the middle node of a linked list
 * 
 * If there are two middle nodes, return the second middle node.
 * 
 * @param head - Head of the linked list
 * @returns Middle node of the linked list
 * 
 * Time: O(n) - single pass through the list
 * Space: O(1) - constant extra space
 */
export function middleNode(head: ListNode | null): ListNode | null {
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

// ============================================================================
// 2. LINKED LIST CYCLE DETECTION
// ============================================================================

/**
 * Detect if a linked list has a cycle
 * 
 * @param head - Head of the linked list
 * @returns True if cycle exists, false otherwise
 * 
 * Time: O(n) - linear time
 * Space: O(1) - constant extra space
 */
export function hasCycle(head: ListNode | null): boolean {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    // Move fast pointer 2 steps and slow pointer 1 step
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        
        // If they meet, there's a cycle
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}

// ============================================================================
// 3. LINKED LIST CYCLE II (FIND START OF CYCLE)
// ============================================================================

/**
 * Find the node where the cycle begins
 * 
 * @param head - Head of the linked list
 * @returns Node where cycle starts, null if no cycle
 * 
 * Time: O(n) - linear time
 * Space: O(1) - constant extra space
 */
export function detectCycle(head: ListNode | null): ListNode | null {
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

// ============================================================================
// 4. HAPPY NUMBER
// ============================================================================

/**
 * Determine if a number is happy
 * 
 * A happy number is defined by the following process:
 * 1. Starting with any positive integer
 * 2. Replace the number by the sum of the squares of its digits
 * 3. Repeat until the number equals 1 or loops endlessly
 * 4. If it equals 1, it's happy
 * 
 * @param n - Number to check
 * @returns True if happy, false otherwise
 * 
 * Time: O(log n) - number of digits
 * Space: O(1) - constant extra space
 */
export function isHappy(n: number): boolean {
    function getNext(n: number): number {
        let sum = 0;
        while (n > 0) {
            const digit = n % 10;
            sum += digit * digit;
            n = Math.floor(n / 10);
        }
        return sum;
    }
    
    let slow = n;
    let fast = getNext(n);
    
    // Use Floyd's cycle detection
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast === 1;
}

// ============================================================================
// 5. CYCLE IN A CIRCULAR ARRAY
// ============================================================================

/**
 * Detect if there's a cycle in a circular array
 * 
 * A cycle exists if we can start from any index and return to the same index
 * by following the array values as directions.
 * 
 * @param nums - Array of integers representing directions
 * @returns True if cycle exists, false otherwise
 * 
 * Time: O(n) - visit each element at most twice
 * Space: O(1) - constant extra space
 */
export function circularArrayLoop(nums: number[]): boolean {
    const n = nums.length;
    if (n <= 1) return false;
    
    function getNextIndex(i: number): number {
        return ((i + nums[i]) % n + n) % n;
    }
    
    for (let i = 0; i < n; i++) {
        if (nums[i] === 0) continue; // Already visited
        
        let slow = i;
        let fast = i;
        const direction = nums[i] > 0;
        
        // Check if cycle exists
        do {
            slow = getNextIndex(slow);
            fast = getNextIndex(fast);
            if (fast !== getNextIndex(fast)) break; // Single element cycle
            fast = getNextIndex(fast);
        } while (slow !== fast && 
                 nums[slow] !== 0 && 
                 nums[fast] !== 0 &&
                 (nums[slow] > 0) === direction &&
                 (nums[fast] > 0) === direction);
        
        // If we found a valid cycle
        if (slow === fast && slow !== getNextIndex(slow)) {
            return true;
        }
        
        // Mark all visited elements
        slow = i;
        while (nums[slow] !== 0 && (nums[slow] > 0) === direction) {
            const next = getNextIndex(slow);
            nums[slow] = 0;
            slow = next;
        }
    }
    
    return false;
}

// ============================================================================
// 6. REORDER LINKED LIST
// ============================================================================

/**
 * Reorder a linked list in the pattern: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...
 * 
 * @param head - Head of the linked list
 * 
 * Time: O(n) - linear time
 * Space: O(1) - constant extra space
 */
export function reorderList(head: ListNode | null): void {
    if (!head || !head.next) return;
    
    // Step 1: Find the middle of the list
    let slow = head;
    let fast = head;
    
    while (fast.next && fast.next.next) {
        slow = slow!.next;
        fast = fast.next.next;
    }
    
    // Step 2: Reverse the second half
    let secondHalf = reverseList(slow!.next);
    slow!.next = null;
    
    // Step 3: Merge the two halves
    let first = head;
    let second = secondHalf;
    
    while (second) {
        const temp1 = first!.next;
        const temp2 = second.next;
        
        first!.next = second;
        second.next = temp1;
        
        first = temp1;
        second = temp2;
    }
}

// ============================================================================
// 7. PALINDROME LINKED LIST
// ============================================================================

/**
 * Check if a linked list is a palindrome
 * 
 * @param head - Head of the linked list
 * @returns True if palindrome, false otherwise
 * 
 * Time: O(n) - linear time
 * Space: O(1) - constant extra space
 */
export function isPalindrome(head: ListNode | null): boolean {
    if (!head || !head.next) return true;
    
    // Step 1: Find the middle
    let slow = head;
    let fast = head;
    
    while (fast.next && fast.next.next) {
        slow = slow!.next;
        fast = fast.next.next;
    }
    
    // Step 2: Reverse the second half
    let secondHalf = reverseList(slow!.next);
    slow!.next = null;
    
    // Step 3: Compare both halves
    let first = head;
    let second = secondHalf;
    
    while (second) {
        if (first!.val !== second.val) {
            return false;
        }
        first = first!.next;
        second = second.next;
    }
    
    return true;
}

// ============================================================================
// 8. REMOVE NTH NODE FROM END
// ============================================================================

/**
 * Remove the nth node from the end of the list
 * 
 * @param head - Head of the linked list
 * @param n - Position from the end (1-indexed)
 * @returns New head of the list
 * 
 * Time: O(n) - single pass
 * Space: O(1) - constant extra space
 */
export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    if (!head) return null;
    
    // Create dummy node to handle edge cases
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let slow = dummy;
    let fast = dummy;
    
    // Move fast pointer n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        fast = fast!.next;
    }
    
    // Move both pointers until fast reaches the end
    while (fast) {
        slow = slow!.next;
        fast = fast.next;
    }
    
    // Remove the nth node
    slow!.next = slow!.next!.next;
    
    return dummy.next;
}

// ============================================================================
// 9. FIND DUPLICATE NUMBER
// ============================================================================

/**
 * Find the duplicate number in an array using Floyd's cycle detection
 * 
 * Given an array of integers where each integer is between 1 and n (inclusive),
 * prove that at least one duplicate number must exist.
 * 
 * @param nums - Array of integers
 * @returns The duplicate number
 * 
 * Time: O(n) - linear time
 * Space: O(1) - constant extra space
 */
export function findDuplicate(nums: number[]): number {
    // Phase 1: Find intersection point in the cycle
    let slow = nums[0];
    let fast = nums[0];
    
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Phase 2: Find the entrance to the cycle
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Reverse a linked list
 */
export function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}

/**
 * Create a linked list from an array
 */
export function createLinkedList(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;
    
    const head = new ListNode(arr[0]);
    let current = head;
    
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    
    return head;
}

/**
 * Convert linked list to array
 */
export function linkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    
    return result;
}

/**
 * Create a cycle in a linked list for testing
 */
export function createCycle(head: ListNode | null, pos: number): ListNode | null {
    if (pos < 0) return head;
    
    let current = head;
    let cycleNode: ListNode | null = null;
    let index = 0;
    
    // Find the last node and the node at position pos
    while (current && current.next) {
        if (index === pos) {
            cycleNode = current;
        }
        current = current.next;
        index++;
    }
    
    // Create the cycle
    if (current && cycleNode) {
        current.next = cycleNode;
    }
    
    return head;
}
