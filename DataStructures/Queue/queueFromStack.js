var Stack = require('../Stack/stack');

class QueueFromStack{
    constructor(){
        this.first = new Stack();
        this.second = new Stack();
    }

    add(item){
        this.first.push(item);
    }

    remove(){
        while(this.first.peek()){
            this.second.push(this.first.pop());
        }
        const record = this.second.pop();

        while(this.second.peek()){
            this.first.push(this.second.pop());
        }

        return record;
    }

    peek(){
        while(this.first.peek()){
            this.second.push(this.first.pop());
        }
        const record = this.second.peek();

        while(this.second.peek()){
            this.first.push(this.second.pop());
        }

        return record;
    }
}

function checkQueueFromStack(){
    var qfrmstack = new QueueFromStack();
    qfrmstack.add(1)
    qfrmstack.add({name:'jitendra'});
    qfrmstack.add("Hello");
    console.log(qfrmstack);
    console.log("Peek method");
    console.log(qfrmstack.peek());
    qfrmstack.remove();
    console.log("After 1 item remove");
    console.log(qfrmstack);
}

checkQueueFromStack();