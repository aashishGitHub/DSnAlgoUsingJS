
class Node {
    constructor(value) {
        this.value = value;

        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        var newNode = new Node(value);
        if (this.root === null) {
            this.root = newNode;
            return this;
        }
        var current = this.root;
        while (true) {
            if (value === current.value) return undefined;
            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    find(value) {
        if (!this.root) {
            return;
        }

        let current = this.root;
        while (current) {
            if (current.value < value) {
                // move right
                current = current.right;

            } else if (current.value > value) {
                // move left
                return current = current.left;
            } else {
                return current;
            }
        }
    }


    find2(value) {
        if (this.root === null) return false;
        var current = this.root,
            found = false;
        while (current && !found) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                found = true;
            }
        }
        if (!found) return undefined;
        return current;
    }
    contains(value) {
        if (this.root === null) return false;
        var current = this.root,
            found = false;
        while (current && !found) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                return true;
            }
        }
        return false;
    }

    // BFS traversal    
    BFS() {
        var node = this.root,
            data = [],
            queue = [];
        queue.push(node);

        while (queue.length) {
            node = queue.shift();
            data.push(node.value);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return data;
    }


    DFSPreOrder() {
        var data = [];

        function traverse(node) {
            data.push(node.value);
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
        }
        traverse(this.root);
        return data;
    }
    DFSPostOrder() {
        var data = [];
        function traverse(node) {
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
            data.push(node.value);
        }
        traverse(this.root);
        return data;
    }
    // This will arrange the value in ascending order
    DFSInOrder() {
        var data = [];
        function traverse(node) {
            if (node.left) traverse(node.left);
            data.push(node.value);
            if (node.right) traverse(node.right);
        }
        traverse(this.root);
        return data;
    }
}

var tree = new BinarySearchTree();

tree.root = new Node(10);
// tree.root.right = new Node(15);
// tree.root.left = new Node(7);
// tree.root.left.right = new Node(9);

tree.insert(15);
tree.insert(7);
tree.insert(9);
tree.insert(17);
tree.insert(3);
tree.insert(13);

tree.find(7);

//  BFS output ->  [10, 7, 15, 3, 9, 13, 17]
// ﻿
// DFS DFSPreOrder  10,7,3,9,15,13,17
// DFSPostOrder     3,9,7,13,17,15,10
// DFSInOrder       3,7,9,10,13,15,17 <-- Ascending order
/*
                10 
                
                
        7                       15

              
    3       9              13               17    
*/



const insert = (node, root) => {
    if (!root) {
        root = node;
        return;
    }

    if (node.value <= root.value) {
        if (!root.left) {
            root.left = node;
        } else {
            insert(node, root.left);
        }
    } else if (node.value > root.value) {
        if (!root.right) {
            root.right = node;
        } else {
            insert(node, root.right);
        }
    }
}


