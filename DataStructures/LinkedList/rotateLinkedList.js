class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    push(val) {

        let newNode = new Node(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.tail.next = newNode;
            this.tail = newNode; // This seems to be incorrect, and not required as it will cause LL to loop in a circular loop
        }
        this.length++;
        return this;
    }

    /**
     * 
     * SLL - Rotate Exercise 
Implement the following on the SinglyLinkedList class 
rotate 
This function should rotate all the nodes in the list by some number passed in. For instance, if 
your list looks like 1 -> 2 -> 3 -> 4 -> 5 and you rotate by 2, the list should be modified to 3 -> 4 
-> 5 -> 1 -> 2. The number passed in to rotate can be any integer. 
Time Comolexitv: O(N). where N is the lenath of the list.
     * @param {*} val 
     * @returns 
     */

    rotate(val) {
        if (val === 0) { return this; }
        if (val >= this.length) {
            let rotateBy = val % this.length;
            return this.rotate(rotateBy);
        } else if (val < 0) {
            let rotateBy = this.length + (val % this.length);
            return this.rotate(rotateBy);
        }

        for (let i = 0; i < val; i++) {

            this.tail.next = this.head; // this is required so that the last element if it is not already connected in the linkedList as a loop
            // It will now be connected

            this.tail = this.head;
            this.head = this.head.next;
        }
        this.tail.next = null; // again assigning the tail's next to null so that we can know  when the Likedlist ends
        return this;
    }
}

var linkedList = new SinglyLinkedList();
linkedList.push(5);
linkedList.push(10);
linkedList.push(15);
linkedList.push(20);
linkedList.push(25);

linkedList.rotate(1);

