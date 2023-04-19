class Node {
    constructor(value) {
        this.val = value;
        this.leftChild = null;
        this.rightChild = null;
    }
}


class BinarySearchTree {
    constructor(rootValue) {
        this.root = new Node(rootValue);
    }

    insert(currentNode, newValue) {
        if (currentNode === null) {
            currentNode = new Node(newValue);
        } else if (newValue < currentNode.val) {
            currentNode.leftChild = this.insert(currentNode.leftChild, newValue);
        } else {
            currentNode.rightChild = this.insert(currentNode.rightChild, newValue);
        }
        return currentNode;
    }

    insertBST(newValue) {
        if (this.root == null) {
            this.root = new Node(newValue);
            return;
        }
        this.insert(this.root, newValue);
    }

    preOrderPrint(currentNode) {
        if (currentNode !== null) {
            console.log(currentNode.val);
            this.preOrderPrint(currentNode.leftChild);
            this.preOrderPrint(currentNode.rightChild);
        }

    }

    inOrderPrint(currentNode) {
        if (currentNode !== null) {
            this.inOrderPrint(currentNode.leftChild);
            console.log(currentNode.val);
            this.inOrderPrint(currentNode.rightChild);
        }

    }
    postOrderPrint(currentNode) {
        if (currentNode !== null) {
            this.postOrderPrint(currentNode.leftChild);
            this.postOrderPrint(currentNode.rightChild);
            console.log(currentNode.val);
        }

    }
    search(currentNode, value) {

        if (currentNode !== null) {
            if (value == currentNode.val) {

                return currentNode;
            } else if (value < currentNode.val) {
                return this.search(currentNode.leftChild, value)
            } else {
                return this.search(currentNode.rightChild, value)
            }
        } else {
            return null;
        }

    }

    searchBST(value) {
        return this.search(this.root, value);
    }
    delete(currentNode, value) {
        if (currentNode == null) {
            return false;
        }

        var parentNode;
        while (currentNode && (currentNode.val != value)) {

            parentNode = currentNode;
            if (value < currentNode.val) {

                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;

            }

        }

        if (currentNode === null) {
            return false;
        } else if (currentNode.leftChild == null && currentNode.rightChild == null) {
            if (currentNode.val == this.root.val) {
                this.root = null;
                return true;
            }
            else if (currentNode.val < parentNode.val) {
                parentNode.leftChild = null;
                return true;
            } else {
                parentNode.rightChild = null;
                return true;
            }
        } else if (currentNode.rightChild == null) {
            if (currentNode.val == this.root.val) {
                this.root = currentNode.leftChild;
                return true;
            }
            else if (currentNode.leftChild.val < parentNode.val) {
                parentNode.leftChild = currentNode.leftChild;
                return true;
            } else {
                parentNode.rightChild = currentNode.leftChild;
                return true;
            }

        } else if (currentNode.leftChild == null) {
            if (currentNode.val == this.root.val) {
                this.root = currentNode.rightChild;
                return true;
            }
            else if (currentNode.rightChild.val < parentNode.val) {
                parentNode.leftChild = currentNode.rightChild;
                return true;
            } else {
                parentNode.rightChild = currentNode.rightChild;
                return true;
            }
        } else {
            var minRight = currentNode.rightChild;
            while (minRight.leftChild !== null) {
                minRight = minRight.leftChild;
            }
            var temp = minRight.val;
            this.delete(this.root, minRight.val);
            currentNode.val = temp;
            return true;
        }
    }
}




/*
bst = {
    6 -> 4, 9
    4 -> 2, 5
    9 -> 8, 12
    12 -> 10, 14
}
where parent -> leftChild, rightChild

k = 3
Sample Output
10
*/

// SOLUTION 1 This solution is in O(n) where n  is the number of nodes in the tree!

function findKthMax(rootNode, k) {
    var tree = []
    tree = inOrderTraverse(rootNode, tree);
    console.log(tree);
    if (((tree.length) - k) >= 0 && k > 0) {
        return tree[tree.length - k]
    }
    return null;
}
//Helper recursive function to traverse the tree inorder
function inOrderTraverse(rootNode, tree) {
    if (rootNode !== null) {
        tree = inOrderTraverse(rootNode.leftChild, tree)
        tree.push(rootNode.val)
        tree = inOrderTraverse(rootNode.rightChild, tree)
    }

    return tree;
}


// SOLUTION 2

var counter;

function findKthMax(rootNode, k) {
    counter = 0;
    return reverseInOrder(rootNode, k).val;
}

function reverseInOrder(rootNode, k) {
    if (rootNode) {
        var rightChild = reverseInOrder(rootNode.rightChild, k)

        if (rightChild) {
            if (counter == k) {
                return rightChild;
            }
        } else {
            counter++;
            if (k == counter) {
                return rootNode;
            }
            return reverseInOrder(rootNode.leftChild, k)
        }
    }
}

var BST = new BinarySearchTree(6)
BST.insertBST(1)
BST.insertBST(133)
BST.insertBST(12)
console.log(findKthMax(BST.root, 3));


// Time Complexity 
// The worst -case complexity of this solution is the same as the previous solution, i.e., 
// �
// (
// �
// )
// O(n)
//     .But for the best -case scenario, when k = 1 and the root node has no right child, then the complexity of this solution is 
// �
// (
//     1
// )
// O(1)
//     .On the other hand, the best -case scenario for the previous solution had a time complexity of 
// �
// (
// �
// )
// O(n)
//     .Therefore, this solution is more efficient than the previous solution.