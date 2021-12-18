function Node(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
}

// class LRUCache {
function LRUCache() {
   let head = null;
   let tail = null;
   let size = 0;
   let maxSize = 4;
   let cache = {};


   function put(key, value) {
       let newNode;

       // if the key not present in cache
       if (cache[key] === undefined) {
           newNode = new Node(key, value);
       }

       //if we have an empty list
       if ( size === 0) {
            head = newNode;
            tail = newNode;
            size++;
            cache[key] = newNode;
           return this;
       }

       if ( size ===  maxSize) {
           //remove from cache
           delete  cache[ tail.key]

           //set new tail
            tail =  tail.prev;
            tail.next = null;
            size--;
       }

       //add an item to the head
        head.prev = newNode;
       newNode.next =  head;
        head = newNode;
        size++;

       //add to cache
        cache[key] = newNode;
       return this;

   }

   function get(key) {
       if (! cache[key]) {
           return undefined
       }

       let foundNode =  cache[key];

       if (foundNode ===  head) return foundNode;

       let previous = foundNode.prev;
       let next = foundNode.next;

       if (foundNode ===  tail) {
           previous.next = null;
            tail = previous;
       } else {
           previous.next = next;
           next.prev = previous;
       }

        head.prev = foundNode;
       foundNode.next =  head;
       foundNode.prev = null;
        head = foundNode;

       return foundNode;
   }

   return {
       put: put,
       get: get
   }
}
// }

let cache = new LRUCache();
cache.put(1, 'A');
cache.put(2, 'B');
cache.put(3, 'C');
cache.put(4, 'D');

cache.get(2);
cache.get(1);

cache.put(5, 'E');
cache.put(6, 'F');

cache.get(1);
cache.get(8);