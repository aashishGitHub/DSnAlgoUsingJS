/*Item will be added at one end and can be removed from other end.It can be compared to a line of people purchasing ticket from ticket counter. After purchasing ticket, people will be removed from front and people will get added at back part of queue. Front part is restricted to only removing and back part is restricted to only adding.Process of adding new item to quequ is called enqueuing and process of removing recored from queue is called dequeuing.It follows FIFO principle.

In order to implement a queue we need to restrict shift,push,splice,slice methods provided by native javascript. Only unshift() of Array will be used for adding new record and pop() will be used for removing record.*/

class Queue{
    constructor(){
        this.data = []
    }

    add(item){
        this.data.unshift(item);
    }

    remove(){
        return this.data.pop();
    }
}

function checkQueue(param) {  
    var queue = new Queue();
    console.log("Queue first item insertion");
    queue.add(1);
    console.log(queue);
    console.log("Queue second item insertion");
    queue.add(6);
    console.log(queue);
    console.log("Queue remove 1 item");
    queue.remove();
    console.log(queue);
}

checkQueue();

module.exports = Queue;