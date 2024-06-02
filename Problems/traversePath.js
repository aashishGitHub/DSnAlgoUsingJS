const obj = { // handler0
    foo: {
      bar: {
        baz: "Hello World!" // handler1 
      }
    },
    foobar: [{key: 'Hello World!'}]
  }
  
  function get(obj, path) {
      if(path.includes('.')) {
         // foobar            0
          const [pathStart, ...rest] = path.split('.');
          const result1 = get(obj, pathStart);
                             //0 
          return get(result1, rest.join('.'));
      }
      
      if(path in obj) {
       return obj[path];
      } else {
       return 'undefined';
      }
  }
  
  //console.log(get(obj, 'foo.bar.baz')) // => "Hello World!"
  
  console.log(get(obj, 'foobar.0.key')) // => "Hello World!"
  
  