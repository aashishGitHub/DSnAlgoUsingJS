class Stack{
    constructor(){
        this.data = [];
    }

    push(item){
        this.data.push(item);
    }

    pop(){
        return this.data.pop();
    }

    peek(){
        return this.data[this.data.length - 1];
    }
}

function checkStack(){
    var stack = new Stack();
    stack.push(1);
    stack.push({name:'Jitendra'});
    stack.push(true);
    console.log("Stack after push");
    console.log(stack);
    console.log("Stack after 1 item pop");
    stack.pop();
    console.log(stack);
    console.log("Stack peek");
    console.log(stack.peek());
}

checkStack();

