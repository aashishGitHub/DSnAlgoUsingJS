/**
 * Tree Traversal Pattern Problems
 * 
 * Pattern: Use DFS/BFS to traverse trees and solve tree-related problems
 * Time Complexity: O(n) typically
 * Space Complexity: O(h) where h is height of tree
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
 * 1. Maximum Depth of Binary Tree (LeetCode 104)
 * Given the root of a binary tree, return its maximum depth.
 */
export function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
}

/**
 * 2. Same Tree (LeetCode 100)
 * Given the roots of two binary trees p and q, write a function to check if they are the same or not.
 */
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) return true;
    if (!p || !q) return false;
    
    return p.val === q.val && 
           isSameTree(p.left, q.left) && 
           isSameTree(p.right, q.right);
}

/**
 * 3. Invert Binary Tree (LeetCode 226)
 * Given the root of a binary tree, invert the tree, and return its root.
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
 * 4. Binary Tree Level Order Traversal (LeetCode 102)
 * Given the root of a binary tree, return the level order traversal of its nodes' values.
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
 * 5. Binary Tree Zigzag Level Order Traversal (LeetCode 103)
 * Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.
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
 * 6. Binary Tree Maximum Path Sum (LeetCode 124)
 * A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.
 * Return the maximum path sum of any non-empty path.
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
 * 7. Lowest Common Ancestor of a Binary Tree (LeetCode 236)
 * Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.
 */
export function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || root === p || root === q) return root;
    
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    
    if (left && right) return root;
    return left || right;
}

/**
 * 8. Validate Binary Search Tree (LeetCode 98)
 * Given the root of a binary tree, determine if it is a valid binary search tree.
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
 * 9. Kth Smallest Element in a BST (LeetCode 230)
 * Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.
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
 * 10. Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)
 * Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.
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
 * 11. Construct Binary Tree from Inorder and Postorder Traversal (LeetCode 106)
 * Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.
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
 * 12. Serialize and Deserialize Binary Tree (LeetCode 297)
 * Design an algorithm to serialize and deserialize a binary tree.
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
 * 13. Subtree of Another Tree (LeetCode 572)
 * Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.
 */
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    if (!subRoot) return true;
    if (!root) return false;
    
    if (isSameTree(root, subRoot)) return true;
    
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

/**
 * 14. Path Sum (LeetCode 112)
 * Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.
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
 * 15. Path Sum II (LeetCode 113)
 * Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum.
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
 * 16. Binary Tree Right Side View (LeetCode 199)
 * Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.
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
 * 17. Count Complete Tree Nodes (LeetCode 222)
 * Given the root of a complete binary tree, return the number of the nodes in the tree.
 */
export function countNodes(root: TreeNode | null): number {
    if (!root) return 0;
    
    let leftHeight = 0;
    let rightHeight = 0;
    
    let left = root;
    while (left) {
        leftHeight++;
        left = left.left;
    }
    
    let right = root;
    while (right) {
        rightHeight++;
        right = right.right;
    }
    
    if (leftHeight === rightHeight) {
        return Math.pow(2, leftHeight) - 1;
    }
    
    return 1 + countNodes(root.left) + countNodes(root.right);
}
