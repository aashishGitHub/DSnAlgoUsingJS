import { describe, test, expect } from "vitest";
import {
    TreeNode,
    maxDepth,
    isSameTree,
    invertTree,
    levelOrder,
    zigzagLevelOrder,
    maxPathSum,
    lowestCommonAncestor,
    isValidBST,
    kthSmallest,
    buildTree,
    buildTreeFromInorderPostorder,
    Codec,
    isSubtree,
    hasPathSum,
    pathSum,
    rightSideView,
    countNodes,
    lowestCommonAncestorBST,
    findShortestPathInFullBinaryTree,
    diameterOfBinaryTree,
    isBalanced,
    goodNodes,
    inorderTraversal,
} from './treePatterns';

/**
 * Build a tree from a LeetCode-style level-order array, where null marks a
 * missing child. Mirrors Go's trees.FromLevelOrder so the two test suites can
 * use the same fixtures.
 */
function fromLevelOrder(values: (number | null)[]): TreeNode | null {
    if (values.length === 0 || values[0] === null) return null;

    const root = new TreeNode(values[0] as number);
    const queue: TreeNode[] = [root];
    let i = 1;

    while (queue.length > 0 && i < values.length) {
        const node = queue.shift()!;

        if (i < values.length) {
            const left = values[i++];
            if (left !== null && left !== undefined) {
                node.left = new TreeNode(left);
                queue.push(node.left);
            }
        }
        if (i < values.length) {
            const right = values[i++];
            if (right !== null && right !== undefined) {
                node.right = new TreeNode(right);
                queue.push(node.right);
            }
        }
    }

    return root;
}

/** Find the first node holding `value` (tests need node references for LCA). */
function find(root: TreeNode | null, value: number): TreeNode | null {
    if (!root) return null;
    if (root.val === value) return root;
    return find(root.left, value) ?? find(root.right, value);
}

describe('Tree Traversal Pattern Problems', () => {

    describe('fromLevelOrder (test helper)', () => {
        test('builds the shape the other tests rely on', () => {
            const root = fromLevelOrder([3, 9, 20, null, null, 15, 7]);
            expect(root?.val).toBe(3);
            expect(root?.left?.val).toBe(9);
            expect(root?.right?.val).toBe(20);
            expect(root?.left?.left).toBeNull();
            expect(root?.right?.left?.val).toBe(15);
            expect(root?.right?.right?.val).toBe(7);
        });

        test('empty and null-root inputs give an empty tree', () => {
            expect(fromLevelOrder([])).toBeNull();
            expect(fromLevelOrder([null])).toBeNull();
        });
    });

    // =========================================================================
    // Depth / structure
    // =========================================================================

    describe('maxDepth (LC104)', () => {
        test('counts nodes on the longest root-to-leaf path', () => {
            expect(maxDepth(fromLevelOrder([3, 9, 20, null, null, 15, 7]))).toBe(3);
            expect(maxDepth(fromLevelOrder([1, null, 2]))).toBe(2);
            expect(maxDepth(fromLevelOrder([1]))).toBe(1);
        });

        test('an empty tree has depth 0', () => {
            expect(maxDepth(null)).toBe(0);
        });
    });

    describe('isSameTree (LC100)', () => {
        test('identical shape and values', () => {
            expect(isSameTree(fromLevelOrder([1, 2, 3]), fromLevelOrder([1, 2, 3]))).toBe(true);
        });

        test('same values, different shape is NOT the same tree', () => {
            expect(isSameTree(fromLevelOrder([1, 2]), fromLevelOrder([1, null, 2]))).toBe(false);
        });

        test('same shape, different values', () => {
            expect(isSameTree(fromLevelOrder([1, 2, 1]), fromLevelOrder([1, 1, 2]))).toBe(false);
        });

        test('two empty trees are the same', () => {
            expect(isSameTree(null, null)).toBe(true);
            expect(isSameTree(fromLevelOrder([1]), null)).toBe(false);
        });
    });

    describe('invertTree (LC226)', () => {
        test('mirrors the tree left-to-right', () => {
            const inverted = invertTree(fromLevelOrder([4, 2, 7, 1, 3, 6, 9]));
            expect(levelOrder(inverted)).toEqual([[4], [7, 2], [9, 6, 3, 1]]);
        });

        test('handles an empty tree', () => {
            expect(invertTree(null)).toBeNull();
        });
    });

    describe('diameterOfBinaryTree (LC543)', () => {
        test('counts EDGES on the longest path between any two nodes', () => {
            expect(diameterOfBinaryTree(fromLevelOrder([1, 2, 3, 4, 5]))).toBe(3);
            expect(diameterOfBinaryTree(fromLevelOrder([1, 2]))).toBe(1);
        });

        test('the longest path need not pass through the root', () => {
            //        1
            //       /
            //      2
            //     / \
            //    4   5
            //   /     \
            //  6       7
            // longest: 6-4-2-5-7 = 4 edges, and it skips the root entirely
            const root = fromLevelOrder([1, 2, null, 4, 5, null, null, 6, null, null, 7]);
            expect(diameterOfBinaryTree(root)).toBe(4);
        });

        test('single node has diameter 0, empty tree 0', () => {
            expect(diameterOfBinaryTree(fromLevelOrder([1]))).toBe(0);
            expect(diameterOfBinaryTree(null)).toBe(0);
        });
    });

    describe('isBalanced (LC110)', () => {
        test('balanced trees', () => {
            expect(isBalanced(fromLevelOrder([3, 9, 20, null, null, 15, 7]))).toBe(true);
            expect(isBalanced(fromLevelOrder([1, 2, 3]))).toBe(true);
        });

        test('detects an imbalance deeper than the root', () => {
            expect(isBalanced(fromLevelOrder([1, 2, 2, 3, 3, null, null, 4, 4]))).toBe(false);
        });

        test('a degenerate chain is unbalanced', () => {
            expect(isBalanced(fromLevelOrder([1, 2, null, 3]))).toBe(false);
        });

        test('empty and single-node trees are balanced', () => {
            expect(isBalanced(null)).toBe(true);
            expect(isBalanced(fromLevelOrder([1]))).toBe(true);
        });
    });

    describe('countNodes (LC222)', () => {
        test('counts nodes in a complete tree', () => {
            expect(countNodes(fromLevelOrder([1, 2, 3, 4, 5, 6]))).toBe(6);
            expect(countNodes(fromLevelOrder([1]))).toBe(1);
        });

        test('a perfect tree uses the closed-form shortcut', () => {
            expect(countNodes(fromLevelOrder([1, 2, 3, 4, 5, 6, 7]))).toBe(7);
        });

        test('handles an empty tree', () => {
            expect(countNodes(null)).toBe(0);
        });
    });

    describe('goodNodes (LC1448)', () => {
        test('counts nodes with no strictly greater ancestor', () => {
            expect(goodNodes(fromLevelOrder([3, 1, 4, 3, null, 1, 5]))).toBe(4);
            expect(goodNodes(fromLevelOrder([3, 3, null, 4, 2]))).toBe(3);
        });

        test('the root is always good', () => {
            expect(goodNodes(fromLevelOrder([1]))).toBe(1);
        });

        test('a node EQUAL to the running max still counts (>= not >)', () => {
            // 2 -> 2: the child equals its ancestor, so it is still good.
            expect(goodNodes(fromLevelOrder([2, 2]))).toBe(2);
        });

        test('a descending chain has exactly one good node', () => {
            expect(goodNodes(fromLevelOrder([5, 4, null, 3, null, 2]))).toBe(1);
        });

        test('handles an empty tree', () => {
            expect(goodNodes(null)).toBe(0);
        });
    });

    // =========================================================================
    // Traversals
    // =========================================================================

    describe('inorderTraversal (LC94)', () => {
        test('emits left, node, right', () => {
            expect(inorderTraversal(fromLevelOrder([1, null, 2, 3]))).toEqual([1, 3, 2]);
            expect(inorderTraversal(fromLevelOrder([1]))).toEqual([1]);
        });

        test('on a BST it emits SORTED order — the key BST fact', () => {
            expect(inorderTraversal(fromLevelOrder([5, 3, 8, 2, 4, 7, 9])))
                .toEqual([2, 3, 4, 5, 7, 8, 9]);
        });

        test('handles an empty tree', () => {
            expect(inorderTraversal(null)).toEqual([]);
        });
    });

    describe('levelOrder (LC102)', () => {
        test('groups values by depth', () => {
            expect(levelOrder(fromLevelOrder([3, 9, 20, null, null, 15, 7])))
                .toEqual([[3], [9, 20], [15, 7]]);
        });

        test('handles an empty tree', () => {
            expect(levelOrder(null)).toEqual([]);
        });
    });

    describe('zigzagLevelOrder (LC103)', () => {
        test('alternates direction each level', () => {
            expect(zigzagLevelOrder(fromLevelOrder([3, 9, 20, null, null, 15, 7])))
                .toEqual([[3], [20, 9], [15, 7]]);
        });

        test('handles an empty tree', () => {
            expect(zigzagLevelOrder(null)).toEqual([]);
        });
    });

    describe('rightSideView (LC199)', () => {
        test('takes the last node of each level', () => {
            expect(rightSideView(fromLevelOrder([1, 2, 3, null, 5, null, 4]))).toEqual([1, 3, 4]);
        });

        test('a left-only chain still shows one node per level', () => {
            expect(rightSideView(fromLevelOrder([1, 2, null, 3]))).toEqual([1, 2, 3]);
        });

        test('handles an empty tree', () => {
            expect(rightSideView(null)).toEqual([]);
        });
    });

    // =========================================================================
    // Paths and sums
    // =========================================================================

    describe('maxPathSum (LC124)', () => {
        test('finds the best bent path', () => {
            expect(maxPathSum(fromLevelOrder([1, 2, 3]))).toBe(6);
            expect(maxPathSum(fromLevelOrder([-10, 9, 20, null, null, 15, 7]))).toBe(42);
        });

        test('all-negative trees pick the least-bad single node', () => {
            expect(maxPathSum(fromLevelOrder([-3]))).toBe(-3);
        });
    });

    describe('hasPathSum (LC112)', () => {
        test('true when some root-to-leaf path hits the target', () => {
            const root = fromLevelOrder([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
            expect(hasPathSum(root, 22)).toBe(true);
        });

        test('false when no path matches', () => {
            expect(hasPathSum(fromLevelOrder([1, 2, 3]), 5)).toBe(false);
        });

        test('the path must end at a LEAF, not stop partway', () => {
            // 1 -> 2, sum 1 alone is not a root-to-leaf path
            expect(hasPathSum(fromLevelOrder([1, 2]), 1)).toBe(false);
        });

        test('an empty tree has no paths, even for target 0', () => {
            expect(hasPathSum(null, 0)).toBe(false);
        });
    });

    describe('pathSum (LC113)', () => {
        test('collects every matching root-to-leaf path', () => {
            const root = fromLevelOrder([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]);
            const paths = pathSum(root, 22);
            expect(paths).toHaveLength(2);
            expect(paths).toEqual(expect.arrayContaining([[5, 4, 11, 2], [5, 8, 4, 5]]));
        });

        test('returns an empty list when nothing matches', () => {
            expect(pathSum(fromLevelOrder([1, 2, 3]), 5)).toEqual([]);
            expect(pathSum(null, 0)).toEqual([]);
        });
    });

    // =========================================================================
    // BST-specific
    // =========================================================================

    describe('isValidBST (LC98)', () => {
        test('accepts a valid BST', () => {
            expect(isValidBST(fromLevelOrder([2, 1, 3]))).toBe(true);
            expect(isValidBST(fromLevelOrder([5, 3, 8, 2, 4, 7, 9]))).toBe(true);
        });

        test('rejects a node that is valid locally but not globally', () => {
            // 3 sits in the right subtree of 5 but is smaller than 5 — the
            // classic case a naive parent-only check gets wrong.
            expect(isValidBST(fromLevelOrder([5, 1, 4, null, null, 3, 6]))).toBe(false);
        });

        test('single node and empty tree are valid', () => {
            expect(isValidBST(fromLevelOrder([1]))).toBe(true);
            expect(isValidBST(null)).toBe(true);
        });
    });

    describe('kthSmallest (LC230)', () => {
        test('returns the kth smallest via in-order position', () => {
            expect(kthSmallest(fromLevelOrder([3, 1, 4, null, 2]), 1)).toBe(1);
            expect(kthSmallest(fromLevelOrder([5, 3, 6, 2, 4, null, null, 1]), 3)).toBe(3);
        });

        test('k = number of nodes gives the maximum', () => {
            expect(kthSmallest(fromLevelOrder([2, 1, 3]), 3)).toBe(3);
        });
    });

    describe('lowestCommonAncestorBST (LC235)', () => {
        test('finds where the two targets diverge', () => {
            const root = fromLevelOrder([6, 2, 8, 0, 4, 7, 9]);
            const lca = lowestCommonAncestorBST(root, find(root, 2), find(root, 8));
            expect(lca?.val).toBe(6);
        });

        test('a node can be its own descendant\'s ancestor', () => {
            const root = fromLevelOrder([6, 2, 8, 0, 4, 7, 9]);
            const lca = lowestCommonAncestorBST(root, find(root, 2), find(root, 4));
            expect(lca?.val).toBe(2);
        });

        test('null inputs return null', () => {
            expect(lowestCommonAncestorBST(null, null, null)).toBeNull();
        });
    });

    describe('lowestCommonAncestor (LC236, general binary tree)', () => {
        test('finds the deepest node with both targets below it', () => {
            const root = fromLevelOrder([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
            expect(lowestCommonAncestor(root, find(root, 5), find(root, 1))?.val).toBe(3);
        });

        test('handles one target being an ancestor of the other', () => {
            const root = fromLevelOrder([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
            expect(lowestCommonAncestor(root, find(root, 5), find(root, 4))?.val).toBe(5);
        });
    });

    // =========================================================================
    // Construction / serialization
    // =========================================================================

    describe('buildTree (LC105, preorder + inorder)', () => {
        test('reconstructs the original tree', () => {
            const root = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
            expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
        });

        test('handles a single node and empty input', () => {
            expect(buildTree([1], [1])?.val).toBe(1);
            expect(buildTree([], [])).toBeNull();
        });
    });

    describe('buildTreeFromInorderPostorder (LC106)', () => {
        test('reconstructs the original tree', () => {
            const root = buildTreeFromInorderPostorder([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
            expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
        });

        test('agrees with buildTree on the same tree', () => {
            const fromPre = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
            const fromPost = buildTreeFromInorderPostorder([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
            expect(isSameTree(fromPre, fromPost)).toBe(true);
        });

        test('handles empty input', () => {
            expect(buildTreeFromInorderPostorder([], [])).toBeNull();
        });
    });

    describe('Codec (LC297 serialize/deserialize)', () => {
        test('round-trips a tree back to an identical one', () => {
            const codec = new Codec();
            const original = fromLevelOrder([1, 2, 3, null, null, 4, 5]);
            const restored = codec.deserialize(codec.serialize(original));
            expect(isSameTree(original, restored)).toBe(true);
        });

        test('round-trips an empty tree', () => {
            const codec = new Codec();
            expect(codec.deserialize(codec.serialize(null))).toBeNull();
        });

        test('round-trips negative values', () => {
            const codec = new Codec();
            const original = fromLevelOrder([-1, -2, -3]);
            expect(isSameTree(original, codec.deserialize(codec.serialize(original)))).toBe(true);
        });
    });

    describe('isSubtree (LC572)', () => {
        test('finds a matching subtree', () => {
            expect(isSubtree(fromLevelOrder([3, 4, 5, 1, 2]), fromLevelOrder([4, 1, 2]))).toBe(true);
        });

        test('requires a full match, not just the values', () => {
            expect(isSubtree(
                fromLevelOrder([3, 4, 5, 1, 2, null, null, null, null, 0]),
                fromLevelOrder([4, 1, 2]),
            )).toBe(false);
        });

        test('an empty subtree is contained in anything', () => {
            expect(isSubtree(fromLevelOrder([1]), null)).toBe(true);
        });
    });

    // =========================================================================
    // Implicit / index-labelled trees
    // =========================================================================

    describe('findShortestPathInFullBinaryTree', () => {
        test('adjacent nodes are one edge apart', () => {
            expect(findShortestPathInFullBinaryTree(1, 2)).toBe(1);
            expect(findShortestPathInFullBinaryTree(2, 4)).toBe(1);
        });

        test('routes through the lowest common ancestor', () => {
            expect(findShortestPathInFullBinaryTree(5, 3)).toBe(3);  // 5-2-1-3
            expect(findShortestPathInFullBinaryTree(4, 5)).toBe(2);  // siblings
            expect(findShortestPathInFullBinaryTree(8, 15)).toBe(6); // via the root
        });

        test('a node is zero edges from itself', () => {
            expect(findShortestPathInFullBinaryTree(1, 1)).toBe(0);
            expect(findShortestPathInFullBinaryTree(7, 7)).toBe(0);
        });

        test('argument order does not matter', () => {
            expect(findShortestPathInFullBinaryTree(3, 5))
                .toBe(findShortestPathInFullBinaryTree(5, 3));
        });
    });
});
