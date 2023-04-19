
class Node {
    constructor(value) {
        this.val = value;
        this.leftChild = null;
        this.rightChild = null;
    }
}


function areBSTEqual(root1, root2) {
    const isEqual = areEqual(root1, root2);
    console.log("AreEqual", isEqual);
}

function areEqual(root1, root2) {
    // If both are null, then also equal 
    if (!root1 && !root2) {
        return true;
    } else if (root1 && root2 && root1.val == root2.val
        && (areEqual(root1.leftChild, root2.leftChild))
        && (areEqual(root1.rightChild, root2.rightChild))) {
        return true;
    } else {
        return false;
    }
}

var root1 = new Node(6)
root1.leftChild = new Node(1);
root1.rightChild = new Node(133);
root1.rightChild.leftChild = new Node(12)


var root2 = new Node(6)
root2.leftChild = new Node(1);
root2.rightChild = new Node(133);
root2.rightChild.leftChild = new Node(13)



areBSTEqual(root1, root2);