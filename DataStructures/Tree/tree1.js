var TreeNode = function(data){
    this.data = data;
    this.children = [];

    this.addChildNode = function(data){
        var node = new TreeNode(data);
        this.children.push(node);
    }

    this.removeChildNode = function(data){
        this.children = this.children.filter(function(node){
            return node.data !== data;
        });        
        return this.children;
    }
}

var Tree = function(){
    this.root = null;

    this.breadthFirstTraversal = function(callbackFn){
        var arr = [this.root];          //create an array with root node as single element
        while(arr.length){              //check whether any item is there in array.continue this process till all nodes in tree is processed
            var node = arr.shift();     //remove the item one by one from left of array(beginning of array)
            arr.push(...node.children); //push all the children of removed item to end of array
            callbackFn(node);           //call callback function taking extracted node as input
        }
    }

    /**********************************************************************************************
     * The only difference in BFS to DFS is following                                             *
     * In BFS we push the children of node to the last of array.To push we use push() method.     *
     * In DFS we push the children of node to the first of array.To push we use unshift() method. *
    **********************************************************************************************/
    this.depthFirstTraversal = function(callbackFn){
        var arr = [this.root];
        while(arr.length){
            var node = arr.shift();
            arr.unshift(...node.children);//push the children to the beginning of array.
            callbackFn(node);
        }
    }
}

function checkTreeNode(){
    var node1 = new TreeNode(5);
    node1.addChildNode(15);
    node1.addChildNode(17);
    //node1.removeChildNode(15);
    var tree = new Tree();
    tree.root = node1;
    tree.breadthFirstTraversal(function(node){
        console.log(node.data);
    })
    tree.depthFirstTraversal(function(node){
        console.log(node.data);
    });
}

checkTreeNode();