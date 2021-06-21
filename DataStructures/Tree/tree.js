/*
1>Create a node class.The constructor accepts an argument that gets assigned to the data property and initialize an empty array for storing children.The
Node class should have methods 'add' and 'remove'.
2>Create a tree class.The tree constructor should initialize a 'root' property to null.
3>Implement traverseBFS and traverseDFS on the tree class.
*/
class Node{
    constructor(data){
        this.data = data;
        this.children = [];
    }

    addChild(data){
        const node = new Node(data);
        this.children.push(node);
    }

    removeChild(data){        
        this.children.splice(this.children.findIndex(item => item.data === data),1);        
    }
}

class Tree {
    constructor(){
        this.root = null;
    }

    traverseBreadthFirst(callbackFunction){
        const arr = [this.root];
        while(arr.length){
            const node = arr.shift();//shift() removes the first item in an array and returns that removed element.It changes the length of array 
            arr.push(...node.children);
            callbackFunction(node);
        }
    }

    traverseDepthFirst(callbackFunction){
        const arr = [this.root];
        while(arr.length){
            const node = arr.shift();
            arr.unshift(...node.children);
            callbackFunction(node);
        }
    }
}

function checkTreeNode(){
    var rootNode = new Node("Root Node");
    rootNode.addChild("Child 01");
    rootNode.addChild("Child 02");
    rootNode.addChild("Child 03");
    rootNode.removeChild("Child 02");
    console.log(rootNode);

    const tree = new Tree();
    tree.root = rootNode;
}

checkTreeNode();

module.exports = { Node, Tree };