function Node(data){
    this.data = data;
    this.next = null;
}

function LinkedList(){
    this.head = null;
    this.size = 0;
    this.lastNode = null;

    this.addNodeAtLastOfLinkedList = function(data){
        //case 1: There is no data in the LinkedList
        if(this.head === null){            
            this.head = new Node(data);
            ++this.size;
            this.lastNode = this.head;            
        }else {
            //case 2: There is data in the LinkedList.Traverse to the last node of list
            let tempNode = this.head;
            while(tempNode.next !== null){
                tempNode = tempNode.next;
            }
            //temp node contains last node of LinkedList.Attach new node to this last node
            tempNode.next = this.lastNode = new Node(data);
            ++this.size;
        }        
    }

    this.printLinkedList = function(){
        var resultString = "";
        var tempNode = this.head;        
        if(tempNode !== null){            
            resultString = tempNode.data + "->";
            while(tempNode.next !== null){            
                tempNode = tempNode.next;
                resultString += tempNode.next !== null ? tempNode.data + "->" : tempNode.data;
            }
            console.log(resultString);
            console.log(`Size of linked list is: ${this.size}`);
        }else{
            console.log("Linked list is empty");
        }                
    }

    this.clear = function(){
        this.head = null;
    }

    this.removeFirstNode = function(){
        if(this.head === null){
            console.log("List is empty");
            return;
        }
        if(this.size === 1){
            this.head = this.lastNode = this.head.next;
            return;
        }            
        this.head = this.head.next;
        --this.size;
    }

    this.getLastNode = function(){
        console.log(this.lastNode);
        return this.lastNode;
    }

    this.removeLastNode = function(){
        if(this.head === null){
            console.log("Linked lsit is empty");
            return;
        }
        if(this.size === 1){
            this.head = this.lastNode = null;
            --this.size;
        }else{
            var tempNode = this.head;
            while(tempNode.next.next !== null){
                tempNode = tempNode.next;
            }
            this.lastNode = tempNode;
            tempNode.next = null;
            --this.size;
        }
    }

    this.reverseLinkedList = function(){
        if(this.head === null){
            console.log("Linked list is empty");
            return;
        }
        var tempNode = this.head;
        var prevNode = null;
        var nextNode = null;
        while(tempNode){
            //save next before we overwrite tempNode.xext
            nextNode = tempNode.next;
            //reverse pointer
            tempNode.next = prevNode;
            //step forward in the list
            prevNode = tempNode;
            tempNode = nextNode;            
        }
        this.head = prevNode;
    }

    this.getItemAt = function(itemIndex){
        var counter = 0;
        if(this.head === null){
            console.log("Linked list is empty");
            return;
        }
        var tempNode = this.head;
        while(tempNode !== null){            
            if(counter === itemIndex){
                return tempNode.data;
            }
            tempNode = tempNode.next;
            ++counter;
        }
    }

    this.removeItemAt = function(itemIndex){
        var counter = 0;
        if(this.head === null){
            console.log("Linked list is blank");
            return;
        }
        var tempNode = this.head;
        while(tempNode !== null){
            if(counter === itemIndex-1){
                var temp = tempNode.next.next;
                tempNode.next.next = null;
                tempNode.next = temp;
                --this.size;
            }
            tempNode = tempNode.next;
            ++counter;            
        }
    }

    //find mid point of a linked list with out using counter and by traversing the list only once
    this.findMidPoint = function(linkedList){
        //take 2 pointers 'fast' and 'slow'.Make them point first node of list
        let slow = linkedList.head;
        let fast = linkedList.head;
        //check for existance of 2 nodes for fast pointer.If 2 nodes are there, then move slow by 1 node and fast by 2.If not then mid point will be position of slow
        while(fast.next && fast.next.next){
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}

function checkLinkedList(){    
    var list = new LinkedList();    
    list.addNodeAtLastOfLinkedList(7);    
    list.addNodeAtLastOfLinkedList(9);  
    list.addNodeAtLastOfLinkedList(57);   
    list.addNodeAtLastOfLinkedList(17);    
    list.addNodeAtLastOfLinkedList(4);
    // list.printLinkedList();
    // //list.clear();
    // list.removeFirstNode
    // list.printLinkedList();
    // list.removeFirstNode();
    // list.printLinkedList();
    // list.getLastNode();
    // list.removeLastNode();
    // list.printLinkedList();
    // list.getLastNode();
    //list.reverseLinkedList();
    list.printLinkedList();
    //var itemAt2ndIndex = list.getItemAt(1);
    //console.log(itemAt2ndIndex);
    //list.removeItemAt(4);
    //list.printLinkedList();
    list.findMidPoint();
}

checkLinkedList();