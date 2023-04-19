"use strict";
const BinarySearchTree = require('./BST.js');
const Node = require('./Node.js');


// Solution
const list = [];
function findKthMax(rootNode, k) {

    const sortedList = readThroughBST(rootNode);
    if (sortedList.length >= k) {
        return sortedList[k - 1];
    }
    return 0;
}

function readThroughBST(rootNode) {
    if (rootNode) {

        if (rootNode.leftChild !== null) {
            list.push(rootNode.leftChild);
        }
        list.push(rootNode.val);

        return readThroughBST(rootNode.rightChild);

    }
    return list;
}

const bst = new BinarySearchTree();
const input = [0, 1, 2, 5];
const k = 2;
// Expected output 1

input.map(i => bst.insert(i));

const res = findKthMax(bst.root, k);
console.log(res);
