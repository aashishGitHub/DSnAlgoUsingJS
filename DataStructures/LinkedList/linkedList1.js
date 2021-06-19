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

    //ToDo: It's not working now.Make it working
    this.reverseLinkedList = function(){
        var tempNode = this.head;
        if(tempNode === null){
            console.log("Linked list is empty");
        }else{
            this.lastNode = this.head;  
            var temp = tempNode.next;          
            tempNode.next = null;
            while(temp !== null){
                temp = temp.next;
            }
        }
    }
}

function checkLinkedList(){    
    var list = new LinkedList();
    list.printLinkedList();
    list.addNodeAtLastOfLinkedList(7);    
    list.addNodeAtLastOfLinkedList(9);  
    list.addNodeAtLastOfLinkedList(57);   
    list.addNodeAtLastOfLinkedList(17);    
    list.addNodeAtLastOfLinkedList(4);
    list.printLinkedList();
    console.log(list.lastNode);
}

checkLinkedList();