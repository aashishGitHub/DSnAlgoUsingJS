/*
A Binary tree is not ncessary a BST.

      1
    /   \
   2     3
  / \     \
 4   5     6    
Output : 1 2 4

Input :
      1
    /   \
   2       3
    \   
     4  
      \
        5
         \
          6
Output :1 2 4 5 6

Input :
      1
    /   \
   2       3
    \       \   
     4       6 
              \
               7
                \
                 8
Output :1 2 4 7 8

*/

// Javascript program to print left view
// of binary tree

// Class containing left and right
// child of current node and key value
class Node
{
	constructor(item)
	{
		this.data = item;
		this.left = null;
		this.right = null;
	}
}

// Class to print the left view
var root ;
var max_level = 0;

// Recursive function to print left view
function leftViewUtil(node, level)
{
	// Base Case
	if (node == null)
	{
		return;
	}
	
	// If this is the first node of its level
	if (max_level < level)
	{
		document.write(" " + node.data);
		max_level = level;
	}
	
	// Recur for left and right subtrees
	leftViewUtil(node.left, level + 1);
	leftViewUtil(node.right, level + 1);
}

// A wrapper over leftViewUtil()
function leftView()
{
	leftViewUtil(root, 1);
}

// Driver code

// Testing for example nodes
// Creating a binary tree and
// entering the nodes
root = new Node(12);
root.left = new Node(10);
root.right = new Node(30);
root.right.left = new Node(25);
root.right.right = new Node(40);

leftView();

// Time Complexity: The function does a simple traversal of the tree, so the complexity is O(n). 
// Auxiliary Space: O(n), due to the stack space during recursive call.  



// ---------------------------------------------
// Using Queue, based on level order traversal
// Logic is to add the first element from the queue to the result at each level, 
// and for the rest elements just clear the queue and add the left/right again to the queue

// ---------------------------------------------

const leftViewBSF = (rootNode) => {

    let queue = [];
    let result = [];

    queue.push(rootNode);

    while(queue.length) {
        let n = queue.length;

        for(let i=1; i<= n; i++) {
            let item = queue.shift();
            if(i==1){
                result.push(item.data);
            }
            if(item.left) { queue.push(item.left)}
            if(item.right) { queue.push(item.right)}
        }
    }
    return result;
}

let root = new Node(10);
root.left = new Node(2);
root.right = new Node(3);
root.left.left = new Node(7);
root.left.right = new Node(8);
root.right.right = new Node(15);
root.right.left = new Node(12);
root.right.right.left = new Node(14);


let res = leftViewBSF(root);
console.log(res);
// Output [10, 2, 7, 14]

let resRight = rightViewBSF(root);
console.log(resRight);
// Output [10, 3, 15, 14]



// 
const rightViewBSF = (rootNode) => {

    let queue = [];
    let result = [];

    queue.push(rootNode);

    while(queue.length) {
        let n = queue.length;

        for(let i=1; i<= n; i++) {
            let item = queue.shift();
            if(i==n){
                result.push(item.data);
            }
            if(item.left) { queue.push(item.left)}
            if(item.right) { queue.push(item.right)}
        }
    }
    return result;
}

/**
                10 

    2                           3


7       8               12                  15
    

                                         14

output: [10, 2, 7, 14]

 */
