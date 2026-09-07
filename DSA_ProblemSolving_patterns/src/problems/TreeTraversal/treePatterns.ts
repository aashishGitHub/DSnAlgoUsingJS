/**
 * ============================================================================
 * TREE TRAVERSAL PATTERNS (DFS & BFS on binary trees)
 * ============================================================================
 *
 * PATTERN:
 * Almost every tree problem is one of two traversal skeletons.
 *
 * 1. DFS (recursive). To solve a node, first solve its two subtrees, then
 *    combine their answers into the node's own answer.
 *
 *    Pre-order, in-order and post-order are not three different algorithms.
 *    They are the same walk, differing only in WHEN the node does its own work:
 *      - pre-order   does it BEFORE both recursive calls
 *      - in-order    does it BETWEEN them
 *      - post-order  does it AFTER both
 *
 *    One consequence is worth memorizing on its own: walking a BST in-order
 *    visits its values in sorted order. That is the most-used BST fact in
 *    interviews.
 *
 * 2. BFS (queue). Process the tree one level at a time. This is the skeleton
 *    behind level-order traversal, zigzag order, right-side view, and minimum
 *    depth (which can stop as soon as it reaches the first leaf).
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * The usual mistake in tree problems is not doing too much work per node, since
 * a single traversal is already O(n). It is RE-TRAVERSING the same nodes.
 *
 * The standard example is checking whether a tree is balanced. If each node
 * computes its subtree height separately, the height walk runs again at every
 * node and the whole check degrades to O(n²). Returning height AND the balance
 * verdict together from one post-order pass brings it back to O(n).
 *
 * So the optimization question for trees is: can a single pass carry more
 * information back up, instead of walking the tree again to recover it?
 *
 * RECOGNITION CUES:
 * - "level", "depth", "nearest", "by rows"  → BFS with a queue.
 * - "path", "sum from root", "validate", "lowest common ancestor" → DFS. Pass
 *   state DOWN through arguments, and combine results UP through return values.
 * - The problem says BST → exploit the ordering. In-order gives sorted values,
 *   and comparisons let you discard half the tree like a binary search.
 *
 * Time: O(n) typically — each node visited once.
 * Space: O(h) recursion for DFS (h = height; O(n) worst for a skewed tree),
 *        O(w) queue for BFS (w = max level width).
 * ============================================================================
 */

// Definition for a binary tree node
export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

/**
 * ----------------------------------------------------------------------------
 * 1. MAXIMUM DEPTH OF BINARY TREE (LeetCode 104)
 * ----------------------------------------------------------------------------
 * PROBLEM: return the number of nodes on the longest path from the root down
 * to the farthest leaf.
 *
 * MENTAL MODEL: the depth of a tree is 1 (for the root itself) plus the depth
 * of its TALLER child. A node cannot answer this alone — it needs the answer
 * from both subtrees first. That "children answer before the parent can" is
 * exactly post-order, which is why this is a bottom-up recursion rather than a
 * counter passed downward.
 *
 * REASONING / STEPS:
 *   1. Base case: an empty tree (null) has depth 0 — there is nothing to count.
 *   2. Recurse into the left subtree and, separately, into the right subtree.
 *      Each call answers "how deep is everything below me?"
 *   3. Combine: this node's depth is 1 (itself) plus whichever child came back
 *      deeper. The shallower child is irrelevant — depth only cares about the
 *      LONGEST path, not every path.
 *
 * DRY-RUN on       3
 *                 / \
 *                9   20
 *                   /  \
 *                  15   7
 *   maxDepth(15) = 1, maxDepth(7) = 1        (leaves: no children to add to)
 *   maxDepth(20) = 1 + max(1, 1)  = 2
 *   maxDepth(9)  = 1 + max(0, 0)  = 1        (leaf: both children are null)
 *   maxDepth(3)  = 1 + max(1, 2)  = 3   ✓ (root wins with the 20-side subtree)
 *
 * @example
 * maxDepth(root); // 3
 * maxDepth(null); // 0
 *
 * Time:  O(n) — every node is visited exactly once.
 * Space: O(h) — recursion stack, h = tree height (O(n) worst case on a
 *        skewed/degenerate tree, O(log n) on a balanced one).
 */
export function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
}

/**
 * ----------------------------------------------------------------------------
 * 2. SAME TREE (LeetCode 100)
 * ----------------------------------------------------------------------------
 * PROBLEM: given two binary trees, decide whether they are structurally
 * identical AND every corresponding pair of nodes holds the same value.
 *
 * MENTAL MODEL: two trees match only if their roots match AND both pairs of
 * subtrees match. "Both pairs" is the key word — a single false anywhere
 * poisons the whole answer, so this is an AND across three checks: same root
 * value, same left subtree, same right subtree.
 *
 * REASONING / STEPS:
 *   1. Base case — both null: two empty trees are trivially the same.
 *   2. Base case — exactly one null: shapes already differ, so false without
 *      looking any further.
 *   3. Otherwise compare this node's value, then recurse into left vs left and
 *      right vs right, combining all three with AND.
 *
 * DRY-RUN comparing  1        1
 *                   / \      / \
 *                  2   3    2   3
 *   isSameTree(1,1): values match, then AND of:
 *     isSameTree(2,2) → both null children → true
 *     isSameTree(3,3) → both null children → true
 *   → true ✓
 *
 * @example
 * isSameTree(treeA, treeB); // true if identical shape and values
 *
 * Time:  O(min(m, n)) — recursion stops the moment a mismatch is found.
 * Space: O(min(h1, h2)) — recursion stack.
 */
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) return true;
    if (!p || !q) return false;
    
    return p.val === q.val && 
           isSameTree(p.left, q.left) && 
           isSameTree(p.right, q.right);
}

/**
 * ----------------------------------------------------------------------------
 * 3. INVERT BINARY TREE (LeetCode 226)
 * ----------------------------------------------------------------------------
 * PROBLEM: mirror the tree — every node's left and right children swap places,
 * all the way down.
 *
 * MENTAL MODEL: "invert the whole tree" = "swap this node's two children, then
 * invert each of THOSE subtrees the same way." The swap at the root does
 * nothing by itself unless every level below it is also swapped — which is
 * exactly what the recursion guarantees.
 *
 * REASONING / STEPS:
 *   1. Base case: an empty subtree has nothing to swap — return null.
 *   2. Swap this node's left and right pointers.
 *   3. Recurse into BOTH new children so their own subtrees get inverted too
 *      (the swap must repeat at every depth, not just the top).
 *
 * DRY-RUN on     4                  4
 *               / \      →        / \
 *              2   7              7   2
 *             / \                / \
 *            1   3              6   9
 * 
 *      4
      /   \
     2     7
    / \   / \
   1   3 6   9

 *      4
      /   \
     7     2
    / \   / \
   9   6 3   1
 *   invertTree(4): swap → left=7-subtree, right=2-subtree
 *     invertTree(7-subtree, now on the left): swap its children 9 and 6
 *       too — the recursion reaches every node, not just the top level
 *       → becomes 7(6,9)
 *     invertTree(2-subtree, now on the right): swap 1 and 3 → becomes 2(3,1)
 *   → root 4 now has 7(6,9) on the left and 2(3,1) on the right ✓
 *
 * @example
 * invertTree(root); // returns the same root, mutated in place
 *
 * Time:  O(n) — every node is visited once.
 * Space: O(h) — recursion stack.
 */
export function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    
    // Swap left and right children
    const temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    // Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}

/**
 * ----------------------------------------------------------------------------
 * 4. BINARY TREE LEVEL ORDER TRAVERSAL (LeetCode 102)
 * ----------------------------------------------------------------------------
 * PROBLEM: group node values row by row, top to bottom, left to right within
 * each row.
 *
 * MENTAL MODEL: this is BFS, not DFS — "row by row" is the recognition cue.
 * A queue naturally processes nodes in the order they were discovered, but to
 * report separate ROWS the loop must know where one row ends and the next
 * begins. That boundary is `levelSize = queue.length`, captured BEFORE the
 * inner loop starts adding next-level children into the same queue.
 *
 * REASONING / STEPS:
 *   1. Seed the queue with just the root.
 *   2. At the top of each round, snapshot how many nodes are currently queued
 *      — that count IS the current level, frozen before any children get added.
 *   3. Dequeue exactly that many nodes, recording their values and enqueuing
 *      their children (which belong to the NEXT round, not this one).
 *   4. Repeat until the queue drains.
 *
 * DRY-RUN on      3
 *                / \
 *               9   20
 *                  /  \
 *                 15   7
 *   queue=[3] → levelSize=1 → pop 3, push 9,20     → result=[[3]]
 *   queue=[9,20] → levelSize=2 → pop 9 (no children), pop 20, push 15,7
 *                                                    → result=[[3],[9,20]]
 *   queue=[15,7] → levelSize=2 → pop both, no children
 *                                                    → result=[[3],[9,20],[15,7]]
 *
 * @example
 * levelOrder(root); // [[3], [9, 20], [15, 7]]
 *
 * Time:  O(n) — every node enqueued and dequeued once.
 * Space: O(w) — w = widest level, the max queue size at any point.
 */
export function levelOrder(root: TreeNode | null): number[][] {
    if (!root) return [];
    
    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel: number[] = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

/**
 * ----------------------------------------------------------------------------
 * 5. BINARY TREE ZIGZAG LEVEL ORDER TRAVERSAL (LeetCode 103)
 * ----------------------------------------------------------------------------
 * PROBLEM: same as level order (#4), but alternate direction each row —
 * left-to-right, then right-to-left, then left-to-right again.
 *
 * MENTAL MODEL: this is `levelOrder` PLUS one flag. The BFS discovery order
 * never changes — children are always enqueued left-then-right. Only the way
 * a row is WRITTEN into the output alternates: `push` appends to the end
 * (left-to-right), `unshift` inserts at the front (right-to-left), which
 * reverses that row's presentation without touching how the queue itself works.
 *
 * REASONING / STEPS:
 *   1. Run the exact same level-by-level BFS as `levelOrder`.
 *   2. Track a `leftToRight` boolean, flipping it after every completed row.
 *   3. When placing a value into the current row's array, `push` if the flag
 *      is true, `unshift` if false — the queue order is untouched either way.
 *
 * DRY-RUN on      3
 *                / \
 *               9   20
 *                  /  \
 *                 15   7
 *   row 0 (L→R): push 3               → [3]
 *   row 1 (R→L): unshift 9, unshift 20 → 20 first, then 9 pushed to front → [20, 9]
 *   row 2 (L→R): push 15, push 7      → [15, 7]
 *   → [[3], [20, 9], [15, 7]]
 *
 * @example
 * zigzagLevelOrder(root); // [[3], [20, 9], [15, 7]]
 *
 * Time:  O(n). Space: O(w) — w = widest level.
 */
export function zigzagLevelOrder(root: TreeNode | null): number[][] {
    if (!root) return [];
    
    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel: number[] = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}

/**
 * ----------------------------------------------------------------------------
 * 6. BINARY TREE MAXIMUM PATH SUM (LeetCode 124)
 * ----------------------------------------------------------------------------
 * PROBLEM: find the maximum sum along ANY path — a path can start and end at
 * any two nodes, and does not need to pass through the root.
 *
 * MENTAL MODEL: two DIFFERENT questions get tangled here, which is exactly why
 * this problem trips people up. Track both, separately, per node:
 *   - the best path THROUGH this node, allowed to bend (use both children) —
 *     this is a CANDIDATE ANSWER, recorded into a global `maxSum`, but it
 *     can never be handed to a parent, because a path cannot fork twice.
 *   - the best path a PARENT could extend upward through this node — a
 *     straight line, so it may use at most ONE child. This is the return value.
 *   A negative subtree contribution is worse than not using that side at all,
 *   so any negative gain is clamped to 0 before it is used.
 *
 * REASONING / STEPS:
 *   1. Base case: null contributes 0 (nothing to add).
 *   2. Recurse into both children, and clamp each gain to 0 — a negative
 *      branch should simply be skipped, not subtracted from the total.
 *   3. The "bend here" candidate is node.val + leftGain + rightGain; compare
 *      it against the running maxSum (this is where the real answer is found).
 *   4. Return node.val + the BETTER single side only — a parent can only
 *      extend a straight line, not a fork.
 *
 * DRY-RUN on   -10
 *              /  \
 *             9    20
 *                 /  \
 *                15   7
 *   maxGain(9)  = 9 (leaf, both sides clamp to 0)
 *   maxGain(15) = 15, maxGain(7) = 7 (leaves)
 *   maxGain(20): bend = 20+15+7 = 42 → maxSum becomes 42; returns 20+max(15,7)=35
 *   maxGain(-10): bend = -10+9+35 = 34 → maxSum stays 42 (34 < 42)
 *   → 42  (the path 15 → 20 → 7, never touching the root)
 *
 * @example
 * maxPathSum(root); // 42
 *
 * Time:  O(n) — one post-order pass.
 * Space: O(h) — recursion stack.
 */
export function maxPathSum(root: TreeNode | null): number {
    let maxSum = -Infinity;
    
    function maxGain(node: TreeNode | null): number {
        if (!node) return 0;
        
        const leftGain = Math.max(maxGain(node.left), 0);
        const rightGain = Math.max(maxGain(node.right), 0);
        
        const currentMaxPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentMaxPath);
        
        return node.val + Math.max(leftGain, rightGain);
    }
    
    maxGain(root);
    return maxSum;
}

/**
 * ----------------------------------------------------------------------------
 * 7. LOWEST COMMON ANCESTOR OF A BINARY TREE (LeetCode 236)
 * ----------------------------------------------------------------------------
 * PROBLEM: given two nodes p and q in a (not necessarily BST) binary tree,
 * find their lowest common ancestor — the deepest node that has both as
 * descendants (a node counts as its own descendant).
 *
 * MENTAL MODEL: without BST ordering there is no shortcut to which side to
 * search, so both subtrees must be searched. Ask each subtree "did you find
 * p, q, or neither?" A node where BOTH sides report a find is exactly the
 * point where p and q's paths from the root diverge — the definition of LCA.
 * If only one side reports a find, that side's answer is passed straight up,
 * since the true LCA must be further up the tree, on that same side.
 *
 * REASONING / STEPS:
 *   1. Base case: null, or this node IS p or q — return this node immediately.
 *      (Finding p or q counts as "found," and a node can be its own ancestor.)
 *   2. Search left and right subtrees independently.
 *   3. Both sides found something → THIS node is the split point → return it.
 *   4. Only one side found something → that is the answer so far → pass it up.
 *
 * DRY-RUN on the tree [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1:
 *   lowestCommonAncestor(3): search left(5-subtree) and right(1-subtree)
 *     left search hits 5 immediately (5 === p) → returns 5
 *     right search hits 1 immediately (1 === q) → returns 1
 *   both sides non-null → 3 is the LCA  ✓
 *
 * @example
 * lowestCommonAncestor(root, p, q); // the shared ancestor node
 *
 * Time:  O(n) — worst case visits every node once.
 * Space: O(h) — recursion stack.
 */
export function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || root === p || root === q) return root;
    
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    
    if (left && right) return root;
    return left || right;
}

/**
 * ----------------------------------------------------------------------------
 * 8. VALIDATE BINARY SEARCH TREE (LeetCode 98)
 * ----------------------------------------------------------------------------
 * PROBLEM: confirm every node's value is strictly greater than ALL values in
 * its left subtree and strictly less than ALL values in its right subtree.
 *
 * ⚠️ THE TRAP: checking only `node.left.val < node.val < node.right.val` (the
 * immediate children) is NOT enough — a node two levels down can violate the
 * ordering with an ANCESTOR far above it, not just its direct parent.
 *
 * MENTAL MODEL: carry a valid RANGE (min, max) down through the recursion.
 * Every node must fall strictly inside the range it inherits, and it then
 * NARROWS that range for its children — its own value becomes the new
 * ceiling for the left subtree, and the new floor for the right subtree. This
 * is how a violation with a distant ancestor gets caught.
 *
 * REASONING / STEPS:
 *   1. Base case: null satisfies any range — nothing to violate.
 *   2. Reject immediately if this node's value falls outside (min, max).
 *   3. Recurse left with the SAME min but ceiling tightened to this node's
 *      value; recurse right with the SAME max but floor tightened to it.
 *
 * DRY-RUN on    5
 *              / \
 *             1   4
 *                / \
 *               3   6
 *   validate(5, -∞, +∞): 5 is in range ✓
 *     validate(1, -∞, 5): 1 is in range ✓ (leaf)
 *     validate(4, 5, +∞): 4 < 5 → OUT OF RANGE → false
 *   → false  (4 is less than its ancestor 5, even though 4 > its parent... wait,
 *     4 is the direct child but violates the inherited floor of 5 — exactly
 *     the ancestor violation a naive parent-only check would miss)
 *
 * @example
 * isValidBST(root); // false for the tree above
 *
 * Time:  O(n). Space: O(h) — recursion stack.
 */
export function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number, max: number): boolean {
        if (!node) return true;
        
        if (node.val <= min || node.val >= max) return false;
        
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}

/**
 * ----------------------------------------------------------------------------
 * 9. KTH SMALLEST ELEMENT IN A BST (LeetCode 230)
 * ----------------------------------------------------------------------------
 * PROBLEM: return the kth smallest value in a BST (1-indexed).
 *
 * MENTAL MODEL: this is the single most-used BST fact from the file header —
 * an IN-ORDER traversal of a BST visits values in SORTED order. So "kth
 * smallest" is just "the kth value produced by an in-order walk." An
 * iterative walk using an explicit stack lets the walk STOP the instant the
 * kth value is reached, instead of building the entire sorted list first.
 *
 * REASONING / STEPS:
 *   1. Push every left-child along the current path onto the stack — this
 *      dives to the smallest not-yet-visited value.
 *   2. Pop one node: that pop IS the next value in sorted order. Count it.
 *   3. If the count reaches k, return that node's value immediately — no
 *      need to keep walking.
 *   4. Otherwise move to that node's right child and repeat step 1 from there
 *      (in-order = left, node, right).
 *
 * DRY-RUN on BST    3            k = 1
 *                  / \
 *                 1   4
 *                  \
 *                   2
 *   push 3, push 1 (leftmost)          stack=[3,1]
 *   pop 1 → count=1 → count===k=1 → return 1  ✓ (no need to visit 2, 3, or 4)
 *
 * @example
 * kthSmallest(root, 1); // 1
 *
 * Time:  O(h + k) — descend once (h), then visit k nodes; O(n) worst case.
 * Space: O(h) — the explicit stack.
 */
export function kthSmallest(root: TreeNode | null, k: number): number {
    const stack: TreeNode[] = [];
    let current = root;
    let count = 0;
    
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        current = stack.pop()!;
        count++;
        
        if (count === k) {
            return current.val;
        }
        
        current = current.right;
    }
    
    return -1;
}

/**
 * ----------------------------------------------------------------------------
 * 10. CONSTRUCT BINARY TREE FROM PREORDER AND INORDER TRAVERSAL (LeetCode 105)
 * ----------------------------------------------------------------------------
 * PROBLEM: given a tree's preorder and inorder traversal arrays, rebuild the
 * original tree.
 *
 * MENTAL MODEL: the two traversal orders answer two DIFFERENT questions, and
 * combining their answers is the whole trick.
 *   - PREORDER visits root FIRST → `preorder[0]` is always the current root.
 *   - INORDER visits left-subtree, then root, then right-subtree → once you
 *     know the root's VALUE, its position in the inorder array is the SPLIT
 *     POINT: everything to its left is the left subtree, everything to its
 *     right is the right subtree.
 * Preorder tells you WHO the root is; inorder tells you WHERE the split is.
 *
 * REASONING / STEPS:
 *   1. Base case: an empty slice means no node to build here.
 *   2. `preorder[0]` is this subtree's root value — create the node.
 *   3. Find that value's index in `inorder` — everything before it belongs to
 *      the left subtree, everything after belongs to the right.
 *   4. Slice `preorder` to match: the next `rootIndex` preorder entries (after
 *      the root itself) describe the left subtree; the remainder describes
 *      the right. Recurse on both slice pairs.
 *
 * DRY-RUN on preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]:
 *   root = preorder[0] = 3; inorder.indexOf(3) = 1
 *     left inorder  = [9]        left preorder  = [9]        → leaf 9
 *     right inorder = [15,20,7]  right preorder = [20,15,7]
 *       root = 20; inorder.indexOf(20) = 1 within [15,20,7]
 *         left inorder=[15] preorder=[15] → leaf 15
 *         right inorder=[7] preorder=[7]  → leaf 7
 *   → tree:     3
 *              / \
 *             9   20
 *                /  \
 *               15   7   ✓ matches the tree used throughout this file
 *
 * @example
 * buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]); // the tree above
 *
 * Time:  O(n²) worst case — `indexOf` and `.slice()` are each O(n), done once
 *        per node. (A value→index Map turns this into O(n).)
 * Space: O(n) — the map (if used) plus recursion stack.
 */
export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    if (preorder.length === 0 || inorder.length === 0) return null;
    
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);
    
    const rootIndex = inorder.indexOf(rootVal);
    
    root.left = buildTree(
        preorder.slice(1, rootIndex + 1),
        inorder.slice(0, rootIndex)
    );
    
    root.right = buildTree(
        preorder.slice(rootIndex + 1),
        inorder.slice(rootIndex + 1)
    );
    
    return root;
}

/**
 * ----------------------------------------------------------------------------
 * 11. CONSTRUCT BINARY TREE FROM INORDER AND POSTORDER TRAVERSAL (LeetCode 106)
 * ----------------------------------------------------------------------------
 * PROBLEM: the mirror image of #10 — rebuild the tree from its inorder and
 * postorder traversals instead of preorder and inorder.
 *
 * MENTAL MODEL: same split-point idea as #10, with one thing flipped.
 * POSTORDER visits LEFT, RIGHT, then ROOT LAST — so the root is now at the
 * END of the array (`postorder[postorder.length - 1]`), not the start. Inorder
 * still gives the split point once the root's value is known.
 *
 * REASONING / STEPS:
 *   1. Base case: an empty slice means no node here.
 *   2. The LAST element of `postorder` is this subtree's root — create the node.
 *   3. Find that value's index in `inorder` — same split as before: left of it
 *      is the left subtree, right of it is the right subtree.
 *   4. Slice `postorder` to match: since the root is now at the END, the
 *      RIGHT subtree's postorder entries are the ones immediately before it,
 *      and the LEFT subtree's entries come first. Recurse on both.
 *
 * DRY-RUN on inorder=[9,3,15,20,7], postorder=[9,15,7,20,3]:
 *   root = postorder[last] = 3; inorder.indexOf(3) = 1
 *     left inorder  = [9]        left postorder  = [9]          → leaf 9
 *     right inorder = [15,20,7]  right postorder = [15,7,20]
 *       root = 20 (last of [15,7,20]); inorder.indexOf(20) = 1 within [15,20,7]
 *         left inorder=[15] postorder=[15]  → leaf 15
 *         right inorder=[7] postorder=[7]   → leaf 7
 *   → same tree as #10:   3 / (9, 20(15,7))
 *
 * @example
 * buildTreeFromInorderPostorder([9,3,15,20,7], [9,15,7,20,3]); // same tree as #10
 *
 * Time:  O(n²) worst case (indexOf + slice per node). Space: O(n).
 */
export function buildTreeFromInorderPostorder(inorder: number[], postorder: number[]): TreeNode | null {
    if (inorder.length === 0 || postorder.length === 0) return null;
    
    const rootVal = postorder[postorder.length - 1];
    const root = new TreeNode(rootVal);
    
    const rootIndex = inorder.indexOf(rootVal);
    
    root.left = buildTreeFromInorderPostorder(
        inorder.slice(0, rootIndex),
        postorder.slice(0, rootIndex)
    );
    
    root.right = buildTreeFromInorderPostorder(
        inorder.slice(rootIndex + 1),
        postorder.slice(rootIndex, postorder.length - 1)
    );
    
    return root;
}

/**
 * ----------------------------------------------------------------------------
 * 12. SERIALIZE AND DESERIALIZE BINARY TREE (LeetCode 297)
 * ----------------------------------------------------------------------------
 * PROBLEM: convert a tree to a string, and convert that string back into an
 * identical tree — including its exact shape (which nodes are missing).
 *
 * MENTAL MODEL: reconstructing a tree from ONE traversal alone is normally
 * ambiguous (#10/#11 needed TWO traversals to remove the ambiguity). The trick
 * here is to make a SINGLE preorder traversal self-sufficient by explicitly
 * recording every missing child as the literal string "null". With those
 * markers present, there is only one tree the string could describe, and
 * rebuilding becomes a straight preorder walk: read a value, make a node, then
 * immediately ask for its left child and its right child.
 *
 * REASONING / STEPS (serialize):
 *   1. Preorder walk: visit this node's value FIRST, then recurse left, then
 *      recurse right.
 *   2. Where a child is missing, write "null" instead of skipping it — that
 *      placeholder is what makes the shape recoverable later.
 *
 * REASONING / STEPS (deserialize):
 *   1. Split the string back into tokens and read them with a shared index
 *      that advances as nodes are consumed — recursive calls all read from
 *      the SAME position in the token stream, in the order they were written.
 *   2. A "null" token means "no node here" — advance the index and return null.
 *   3. Otherwise create a node from the token, then recursively build its left
 *      child, then its right child, before returning it. Building left before
 *      right MATTERS: it consumes tokens in the same order serialize wrote them.
 *
 * DRY-RUN on    1
 *              / \
 *             2   3
 *                / \
 *               4   5
 *   serialize: "1,2,null,null,3,4,null,null,5,null,null"
 *   deserialize: read "1" → node 1
 *     left:  read "2" → node 2 → left "null", right "null" → node 2 is a leaf
 *     right: read "3" → node 3
 *       left:  read "4" → leaf 4
 *       right: read "5" → leaf 5
 *   → reconstructs the original tree exactly ✓
 *
 * @example
 * const codec = new Codec();
 * const data = codec.serialize(root);          // "1,2,null,null,3,4,null,null,5,null,null"
 * const restored = codec.deserialize(data);     // structurally identical to root
 *
 * Time:  O(n) for both serialize and deserialize.
 * Space: O(n) — the token array/string, plus O(h) recursion stack.
 */
export class Codec {
    serialize(root: TreeNode | null): string {
        const result: string[] = [];
        
        function preorder(node: TreeNode | null): void {
            if (!node) {
                result.push('null');
                return;
            }
            
            result.push(node.val.toString());
            preorder(node.left);
            preorder(node.right);
        }
        
        preorder(root);
        return result.join(',');
    }
    
    deserialize(data: string): TreeNode | null {
        const values = data.split(',');
        let index = 0;
        
        function build(): TreeNode | null {
            if (index >= values.length || values[index] === 'null') {
                index++;
                return null;
            }
            
            const node = new TreeNode(parseInt(values[index]));
            index++;
            
            node.left = build();
            node.right = build();
            
            return node;
        }
        
        return build();
    }
}

/**
 * ----------------------------------------------------------------------------
 * 13. SUBTREE OF ANOTHER TREE (LeetCode 572)
 * ----------------------------------------------------------------------------
 * PROBLEM: does `subRoot`, as a whole tree, appear ANYWHERE inside `root` as
 * an exact subtree — not just as a scattered set of matching values?
 *
 * MENTAL MODEL: this reuses `isSameTree` (#2) as a building block, which is
 * why it belongs right after it in this file. "Is subRoot a subtree of root?"
 * decomposes into "does root itself, compared whole, equal subRoot? OR does
 * subRoot appear somewhere inside root's left subtree? OR inside its right?" —
 * an OR across trying every node in `root` as a potential match point.
 *
 * REASONING / STEPS:
 *   1. Base case: an empty `subRoot` matches trivially — an empty tree is a
 *      subtree of anything.
 *   2. Base case: `root` runs out before `subRoot` does — no match is possible
 *      down this branch.
 *   3. Try `isSameTree(root, subRoot)` at THIS node — a full structural match
 *      starting exactly here.
 *   4. If that fails, recurse the same question into root.left and root.right
 *      — subRoot might match starting somewhere deeper.
 *
 * DRY-RUN — root=[3,4,5,1,2], subRoot=[4,1,2]:
 *   isSubtree(3, subRoot): isSameTree(3, 4)? values differ → false
 *     try isSubtree(4-subtree, subRoot): isSameTree(4,4)? values match, then
 *       isSameTree(1,1) ✓ and isSameTree(2,2) ✓ → true
 *   → true ✓ (subRoot matches starting at node 4)
 *
 * @example
 * isSubtree(root, subRoot); // true
 *
 * Time:  O(m · n) worst case — isSameTree (O(n)) tried at up to every node of
 *        root (O(m)).
 * Space: O(h) — recursion stack.
 */
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    if (!subRoot) return true;
    if (!root) return false;
    
    if (isSameTree(root, subRoot)) return true;
    
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

/**
 * ----------------------------------------------------------------------------
 * 14. PATH SUM (LeetCode 112)
 * ----------------------------------------------------------------------------
 * PROBLEM: does any ROOT-TO-LEAF path sum exactly to `targetSum`? (Must end at
 * a leaf — stopping partway through does not count.)
 *
 * MENTAL MODEL: instead of accumulating a running sum on the way DOWN and
 * comparing it to targetSum only at a leaf, SUBTRACT each node's value from
 * the target as the recursion descends. By the time a leaf is reached, the
 * question "did the path sum to targetSum?" becomes the simpler "does this
 * leaf's own value exactly cancel out what's left?" — i.e. remaining === leaf.val.
 *
 * REASONING / STEPS:
 *   1. Base case: null means this path doesn't exist — false.
 *   2. Base case: a LEAF (no children) — check whether its value exactly
 *      equals whatever sum remains to be matched.
 *   3. Otherwise recurse into either child, passing down `targetSum - node.val`
 *      — each level "spends" its own value out of the target before handing
 *      the rest down.
 *   4. OR the two recursive results — only ONE path needs to work.
 *
 * DRY-RUN on    5              targetSum = 8
 *              / \
 *             4   8
 *            /
 *           11
 *   hasPathSum(5, 8): not a leaf → recurse with target 8-5=3
 *     hasPathSum(4, 3): not a leaf → recurse with target 3-4=-1
 *       hasPathSum(11, -1): LEAF → -1 === 11? no → false
 *     hasPathSum(8, 0) [right child of 5]: LEAF → 0 === 8? no → false
 *   → false (no root-to-leaf path here sums to 8)
 *
 * @example
 * hasPathSum(root, 22); // true if some root-to-leaf path sums to 22
 *
 * Time:  O(n) worst case. Space: O(h) — recursion stack.
 */
export function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (!root) return false;
    
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }
    
    return hasPathSum(root.left, targetSum - root.val) || 
           hasPathSum(root.right, targetSum - root.val);
}

/**
 * ----------------------------------------------------------------------------
 * 15. PATH SUM II (LeetCode 113)
 * ----------------------------------------------------------------------------
 * PROBLEM: same question as #14, but return EVERY qualifying root-to-leaf
 * path (the actual sequence of values), not just whether one exists.
 *
 * MENTAL MODEL: `hasPathSum` could stop at the first success. Here every leaf
 * must still be checked, and the ACTUAL PATH must be remembered along the
 * way. A single mutable array (`currentPath`) tracks "the path from the root
 * to wherever the recursion currently is" — pushed to on the way down,
 * popped on the way back up. A copy is saved into the results only at a
 * matching leaf; without the copy, later mutations of `currentPath` would
 * corrupt any path already stored.
 *
 * REASONING / STEPS:
 *   1. Add this node's value to `currentPath` — it is part of every path that
 *      continues through here.
 *   2. If this is a leaf AND the remaining sum matches its value exactly,
 *      record a COPY (`[...currentPath]`) of the path so far.
 *   3. Otherwise recurse into both children with the reduced remaining sum.
 *   4. BACKTRACK: pop this node off `currentPath` before returning — this
 *      path segment does not belong to sibling branches explored next.
 *
 * DRY-RUN on       5               targetSum = 22
 *                 / \
 *                4   8
 *               /
 *              11
 *             /  \
 *            7    2
 *   path=[5] → path=[5,4] → path=[5,4,11] → path=[5,4,11,7]: leaf, remaining
 *     22-5-4-11=2, 2≠7 → no match → pop 7 → path=[5,4,11]
 *   path=[5,4,11,2]: leaf, remaining 2, 2===2 → MATCH → save [5,4,11,2]
 *   pop back to [5] → path=[5,8]: leaf, remaining 22-5-8=9, 9≠8 → no match
 *   → [[5, 4, 11, 2]]
 *
 * @example
 * pathSum(root, 22); // [[5, 4, 11, 2]]
 *
 * Time:  O(n²) worst case — O(n) nodes, each possibly copying an O(n)-long
 *        path at a matching leaf.
 * Space: O(h) recursion + O(h) for `currentPath`, plus the output.
 */
export function pathSum(root: TreeNode | null, targetSum: number): number[][] {
    const result: number[][] = [];
    
    function dfs(node: TreeNode | null, currentPath: number[], remainingSum: number): void {
        if (!node) return;
        
        currentPath.push(node.val);
        
        if (!node.left && !node.right && remainingSum === node.val) {
            result.push([...currentPath]);
        } else {
            dfs(node.left, currentPath, remainingSum - node.val);
            dfs(node.right, currentPath, remainingSum - node.val);
        }
        
        currentPath.pop();
    }
    
    dfs(root, [], targetSum);
    return result;
}

/**
 * ----------------------------------------------------------------------------
 * 16. BINARY TREE RIGHT SIDE VIEW (LeetCode 199)
 * ----------------------------------------------------------------------------
 * PROBLEM: standing to the right of the tree, list the values visible at each
 * level — the LAST node reached in each row, when scanned left to right.
 *
 * MENTAL MODEL: this is `levelOrder` (#4) again, but only ONE value per row is
 * kept — whichever node is processed LAST in that row's inner loop. Since
 * children are always enqueued left-before-right, the last node popped in a
 * row is guaranteed to be the RIGHTMOST node of that row, exactly the one an
 * observer standing to the right would see.
 *
 * REASONING / STEPS:
 *   1. Same level-by-level BFS as `levelOrder`, snapshotting `levelSize` first.
 *   2. Inside the row's loop, check the loop index: `i === levelSize - 1`
 *      marks the LAST node visited in this row.
 *   3. Only that node's value gets recorded — every other node in the row
 *      still gets its children enqueued, but is otherwise ignored.
 *
 * DRY-RUN on      1
 *                / \
 *               2   3
 *                \   \
 *                 5   4
 *   row 0: [1] → last is 1                        → result=[1]
 *   row 1: [2,3] → last is 3                       → result=[1,3]
 *   row 2: [5,4] (2's right child, 3's right child) → last is 4
 *                                                    → result=[1,3,4]
 *   Note node 5 is hidden behind 4 from the right — never selected.
 *
 * @example
 * rightSideView(root); // [1, 3, 4]
 *
 * Time:  O(n). Space: O(w) — w = widest level.
 */
export function rightSideView(root: TreeNode | null): number[] {
    if (!root) return [];
    
    const result: number[] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}

/**
 * ----------------------------------------------------------------------------
 * 17. COUNT COMPLETE TREE NODES (LeetCode 222)
 * ----------------------------------------------------------------------------
 * PROBLEM: count the nodes in a COMPLETE binary tree (every level full except
 * possibly the last, which fills strictly left-to-right) faster than O(n).
 *
 * MENTAL MODEL: a plain "1 + count(left) + count(right)" visits every node —
 * O(n), ignoring the completeness guarantee entirely. The shortcut: measure
 * how far left you can go, and separately how far right you can go, by
 * following ONLY left pointers and ONLY right pointers respectively. If those
 * two heights are EQUAL, completeness GUARANTEES the tree is a perfect tree,
 * and a perfect tree's node count is the closed-form 2^height - 1 — no
 * traversal needed. Only when the heights differ (irregularity is confined to
 * the last level, by the completeness guarantee) does real recursion happen,
 * and it happens on a strictly smaller problem each time.
 *
 * REASONING / STEPS:
 *   1. Base case: null has 0 nodes.
 *   2. Walk strictly left from this node, counting steps → `leftHeight`.
 *   3. Walk strictly right from this node, counting steps → `rightHeight`.
 *   4. Equal heights → this subtree is PERFECT → return 2^leftHeight - 1
 *      directly, no recursion into children needed.
 *   5. Unequal heights → fall back to counting 1 + left subtree + right
 *      subtree recursively — but each recursive call is on a subtree that
 *      itself gets the fast path if IT happens to be perfect.
 *
 * DRY-RUN on the complete tree    1
 *                                / \
 *                               2   3
 *                              / \  /
 *                             4  5 6
 *   countNodes(1): leftHeight (1→2→4) = 2, rightHeight (1→3) = 1 → UNEQUAL
 *     → 1 + countNodes(2-subtree) + countNodes(3-subtree)
 *   countNodes(2): leftHeight counts NODES walked (2, then 4) = 2;
 *     rightHeight (2, then 5) = 2 → EQUAL, perfect → 2^2 - 1 = 3 (nodes 2,4,5 ✓)
 *   countNodes(3): leftHeight (3→6)=2, rightHeight (3)=1 → UNEQUAL
 *     → 1 + countNodes(6) + countNodes(null) = 1 + 1 + 0 = 2
 *   → 1 + 3 + 2 = 6  ✓ (the tree has exactly 6 nodes)
 *
 * @example
 * countNodes(root); // 6
 *
 * Time:  O((log n)²) — O(log n) recursive levels, each doing an O(log n)
 *        height walk; strictly better than the O(n) naive count.
 * Space: O(log n) — recursion stack.
 */
export function countNodes(root: TreeNode | null): number {
    if (!root) return 0;
    
    let leftHeight = 0;
    let rightHeight = 0;
    
    let left: TreeNode | null = root;
    while (left) {
        leftHeight++;
        left = left.left;
    }

    let right: TreeNode | null = root;
    while (right) {
        rightHeight++;
        right = right.right;
    }
    
    if (leftHeight === rightHeight) {
        return Math.pow(2, leftHeight) - 1;
    }
    
    return 1 + countNodes(root.left) + countNodes(root.right);
}

/**
 * ----------------------------------------------------------------------------
 * LOWEST COMMON ANCESTOR OF A **BST** (LeetCode 235)
 * ----------------------------------------------------------------------------
 * The BST-specific counterpart to `lowestCommonAncestor` (LC236) above. Same
 * question, but the search-tree ordering turns it from a full traversal into a
 * single walk down one path.
 *
 * THE INSIGHT: in a BST the values themselves say which way to go.
 *   - both targets SMALLER than the node → the split must be in the left subtree
 *   - both targets LARGER  than the node → it must be in the right subtree
 *   - otherwise they straddle this node (or one IS this node) → this is the LCA
 * The first node where the two targets stop agreeing on direction is exactly
 * the point where their paths diverge, which is the definition of the LCA.
 *
 * WHY IT BEATS THE GENERIC VERSION: LC236 must explore both subtrees because a
 * plain binary tree gives no clue where a value lives — O(n) time, O(h) stack.
 * Here each comparison discards an entire subtree, so it is O(h) time and can
 * be written iteratively in O(1) space. Being asked LC235 right after LC236 is
 * a test of whether you notice the extra structure and exploit it.
 *
 * DRY-RUN on the BST [6,2,8,0,4,7,9], p = 2, q = 8:
 *   node 6: 2 < 6 but 8 > 6 → they straddle → 6 is the LCA  ✓
 * And for p = 2, q = 4:
 *   node 6: both < 6 → go left
 *   node 2: 2 is the node itself → straddle case → 2 is the LCA  ✓
 *   (a node can be its own descendant's ancestor — the usual gotcha)
 *
 * @example
 * // Real-world: the narrowest category containing two items in a sorted taxonomy.
 * lowestCommonAncestorBST(root, node2, node8); // node 6
 * lowestCommonAncestorBST(root, node2, node4); // node 2
 *
 * Time:  O(h) — h = height; O(log n) balanced, O(n) degenerate.
 * Space: O(1) — iterative, no recursion stack.
 */
export function lowestCommonAncestorBST(
    root: TreeNode | null,
    p: TreeNode | null,
    q: TreeNode | null
): TreeNode | null {
    if (root === null || p === null || q === null) {
        return null;
    }

    let node: TreeNode | null = root;

    while (node !== null) {
        if (p.val < node.val && q.val < node.val) {
            node = node.left;      // both targets are smaller — discard the right
        } else if (p.val > node.val && q.val > node.val) {
            node = node.right;     // both are larger — discard the left
        } else {
            return node;           // they diverge here (or one IS here)
        }
    }

    return null;
}

/**
 * ----------------------------------------------------------------------------
 * SHORTEST PATH IN A 1-INDEXED FULL BINARY TREE (by node label, no tree built)
 * ----------------------------------------------------------------------------
 * Nodes are never materialized. The tree is implicit in the labeling: root = 1,
 * and for any node labeled x, its left child is 2x and its right child is
 * 2x + 1. Given two labels i and j, return the number of edges on the path
 * between them.
 *
 * THE INSIGHT: that labeling makes "go to parent" pure arithmetic —
 * parent(x) = floor(x / 2) — so walking toward the root never needs the
 * actual tree, just repeated integer halving. That collapses the problem
 * to the same shape as LC236 / LC235 above: find the LCA, then
 * path length = (i's distance up to the LCA) + (j's distance up to the LCA).
 *
 * REASONING / STEPS:
 *   1. depth(x) = how many times x must be halved to reach 1 (root is
 *      depth 0). Halving is exactly "move to parent" in this labeling.
 *   2. Walk whichever of i, j is deeper up toward the root, one parent step
 *      at a time, until both labels sit at the same depth. Count these moves.
 *   3. From there, walk BOTH up in lockstep — one parent step each — until
 *      the two labels become equal. That shared label is the LCA. Every
 *      lockstep move adds one edge to EACH side's path.
 *   4. Total edges = every move taken by i's pointer + every move taken by
 *      j's pointer. No separate "path length" formula needed — the move
 *      counts already track it.
 *
 * DRY-RUN for i = 5, j = 3 on the tree:
 *              1
 *            /   \
 *           2     3
 *          / \
 *         4   5
 *   depth(5) = 2 (5→2→1), depth(3) = 1 (3→1) → 5 is deeper by 1.
 *   Step 2: move 5 up once → 5 becomes 2 (movesA = 1). Now both at depth 1.
 *   Step 3: 2 ≠ 3 → move both up → a = 1, b = 1, movesA = 2, movesB = 1.
 *     Now a === b (both 1) → stop.
 *   Total = movesA(2) + movesB(1) = 3 → path 5-2-1-3 has 3 edges. ✓
 *
 * @example
 * findShortestPathInFullBinaryTree(1, 2); // 1  (direct parent-child)
 * findShortestPathInFullBinaryTree(2, 4); // 1  (direct parent-child)
 * findShortestPathInFullBinaryTree(5, 3); // 3  (route through the root)
 *
 * Time:  O(log(max(i, j))) — each label loses roughly one bit per halving.
 * Space: O(1) — no tree, no recursion, just a few integer variables.
 */
export function findShortestPathInFullBinaryTree(i: number, j: number): number {
    const depthOf = (x: number): number => {
        let d = 0;
        while (x > 1) {
            x = Math.floor(x / 2);
            d++;
        }
        return d;
    };

    let a = i;
    let b = j;
    let depthA = depthOf(a);
    let depthB = depthOf(b);
    let movesA = 0;
    let movesB = 0;

    while (depthA > depthB) {
        a = Math.floor(a / 2);
        depthA--;
        movesA++;
    }
    while (depthB > depthA) {
        b = Math.floor(b / 2);
        depthB--;
        movesB++;
    }

    while (a !== b) {
        a = Math.floor(a / 2);
        b = Math.floor(b / 2);
        movesA++;
        movesB++;
    }

    return movesA + movesB;
}
