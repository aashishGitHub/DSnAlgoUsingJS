/**
 *  
 */
class Node_ {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        //   this.swapAndTraverse;
    }
    /* Inserts a new Node at front of the list. */
    push(new_data) {
        /*
         * 1 & 2: Allocate the Node & Put in the data
         */
        var new_node = new Node_(new_data);

        /* 3. Make next of new Node as head */
        new_node.next = this.head;

        /* 4. Move the head to point to new Node */
        this.head = new_node;
    }

    // Iteratively traverse 2 nodes at a time and swap data of 2 nodes
    pairWiseSwap() {
        var temp = this.head;

        /* Traverse only till there are
        atleast 2 nodes left */
        while (temp != null && temp.next != null) {
            /* Swap the data */
            var k = temp.data;
            temp.data = temp.next.data;
            temp.next.data = k;
            temp = temp.next.next;
        }
    }

    // Recursively traverse 2 nodes at a time and swap data of 2 nodes
    pairWiseSwapRecursive(head) {
        /* There must be at-least two nodes in the list */
        if (head != null && head.next != null) {

            /* Swap the node's data with data of next node */
            swap(head.data, head.next.data);

            /* Call pairWiseSwap() for rest of the list */
            pairWiseSwap(head.next.next);
        }
    }


    
    swapAlternateNodes() {
        let current = this.head;
        
        while(current && current.next) {

            this._swapNodes(current.data, current.next.data);
            current = current.next.next;
        }
    }

    /*
        Function to swap Nodes with value x and y in
        linked list by changing links
        */
    _swapNodes(x, y) {
        if (x == y)
            return;

        var prevX = null, currX = this.head;
        while (currX != null && currX.data != x) {
            prevX = currX;
            currX = currX.next;
        }

        var prevY = null, currY = this.head;
        while (currY != null && currY.data != y) {
            prevY = currY;
            currY = currY.next;
        }


        if (currX == null || currY == null)
            return;


        if (prevX != null)
            prevX.next = currY;
        else // make y the new head
            this.head = currY;

        if (prevY != null)
            prevY.next = currX;
        else // make x the new head
            this.head = currX;

        var temp = currX.next;
        currX.next = currY.next;
        currY.next = temp;
    }
}

let linkedList = new LinkedList();

linkedList.head = new Node_(1);
linkedList.head.next = new Node_(2);
linkedList.head.next.next = new Node_(3);
linkedList.head.next.next.next = new Node_(4);
linkedList.head.next.next.next.next = new Node_(5);
linkedList.head.next.next.next.next.next = new Node_(6);
linkedList.head.next.next.next.next.next.next = new Node_(7);


let nodeNew = linkedList.swapAlternateNodes();
console.log(nodeNew);

