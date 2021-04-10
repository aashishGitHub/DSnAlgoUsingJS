class MyQueue{
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
    var queue = new MyQueue();
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