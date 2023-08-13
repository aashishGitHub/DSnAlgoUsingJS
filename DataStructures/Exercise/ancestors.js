
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

    // Assuming nodes are unique in values
}
var found = false;
var result = [];

// inefficient solution
var findAncestors = (rootN, val) => {
    if (rootN) {
        if (rootN.val == val) {
            found = true;
            return rootN; // We do not need this value as we only need its parents
            // That is why just by returning boolean can suffice. See the solution below
        } else {

            if (rootN.val < val) {
                var right = findAncestors(rootN.rightChild, val);
                if (right || found) {
                    console.log("One of ancestor is ", rootN.val);
                    result.push(rootN.val);
                }
            }
            if (rootN.val > val) {
                var left = findAncestors(rootN.leftChild, val);
                if (left || found) {
                    console.log("One of ancestor is ", rootN.val);
                    result.push(rootN.val);
                }
            }
        }
    }
}

var BST = new BinarySearchTree(6)
BST.insertBST(1)
BST.insertBST(133)
BST.insertBST(12)
findAncestors(BST.root, 12);
console.log(result);


// optimized solution 
var findAncestors2 = (rootN, val) => {
    if (rootN) {
        if (rootN.val == val) {
           
            return true;
        } else {

            var rightOrLeft = (findAncestors2(rootN.rightChild, val) || findAncestors2(rootN.leftChild, val));
            if (rightOrLeft) {
                console.log("One of ancestor is ", rootN.val);
                result.push(rootN.val); // As the desired value is found, we are returning the parents/ root of this case and all above cases
            }
        }
    } else return false;
}