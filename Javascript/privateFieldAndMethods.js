class Person{
    //Private field
    #id
    #name

    //private methods
    #setData(id, name){
        this.#id = id;
        this.#name = name;
    }

    //Getters
    get id(){ return this.#id; }
    get name(){ return this.#name; }

    constructor(id,name){
        this.#setData(id,name);
    }
}

const person = new Person(1,"Jitendra Sabat");
console.log(person.id);
person.id = 7;
console.log(person.id);
person.#id = 10;