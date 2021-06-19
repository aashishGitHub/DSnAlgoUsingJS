function Checking(amount){
    this.balance = amount;
    this.deposit = function(amount){
        this.balance += amount;
        console.log(`Balance left: ${this.balance}`);
    };
    this.withdraw = function(amount){
        if(this.balance < amount){
            console.log("Insufficient amount")
        }            
        else if(this.balance >= amount){
            this.balance -= amount;
            console.log(`Balance left: ${this.balance}`);
        }
    }
}

var check = new Checking(500);
check.deposit(400);
check.withdraw(600);