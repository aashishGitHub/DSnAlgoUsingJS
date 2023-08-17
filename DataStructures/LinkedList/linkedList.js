class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.start = null;
  }
  push(node) {
    if (this.start === null) {
      this.start = node;
    } else {
      var lastNode = this.getLastNode().lastNode;
      lastNode.next = node;
    }
    return this;
  }

  pop() {
    if (this.start === null) {
      return "No elements present in list";
    }
    else {
      var prevNode = this.getLastNode().prevNode;
      prevNode.next = null;
    }
  }

  getLastNode() {
    if (this.start === null) {
      return null;
    } else {
      var tempNode = this.start;
      var prevNode = null;
      console.log(tempNode);
      while (tempNode.next !== null) {
        prevNode = tempNode;
        tempNode = tempNode.next;
      }
      //console.log(tempNode);
      return {
        prevNode: prevNode,
        lastNode: tempNode
      }
    }
  }
}

function checkLinkedList() {
  var list = new LinkedList();
  list.push(new Node("First node"));
  list.push(new Node("Second node"));
  list.push(new Node("Third node"));
  list.push(new Node("Fourth node"));
  list.push(new Node("Fifth node"));
  list.push(new Node("Sixth node"));
  list.pop();
  list.pop();
  console.dir(list);
}

checkLinkedList();