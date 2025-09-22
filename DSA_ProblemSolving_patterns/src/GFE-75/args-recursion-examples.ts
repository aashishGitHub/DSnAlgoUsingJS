/**
 * PROGRESSIVE EXAMPLES: Using ...args in Recursive Function Calls
 * From Simple Learning Examples to Complex Business Use Cases
 */

// ============================================================================
// LEVEL 1: SIMPLE ACCUMULATOR EXAMPLES
// ============================================================================

console.log("=== LEVEL 1: SIMPLE EXAMPLES ===");

// Example 1: Simple Sum Accumulator
function sum(...args: number[]): number {
  console.log("sum called with:", args);
  
  if (args.length === 0) return 0;
  if (args.length === 1) return args[0];
  
  const [first, ...rest] = args;
  return first + sum(...rest); // Recursive call with remaining args
}

console.log("Sum(1,2,3,4):", sum(1, 2, 3, 4)); // 10

// Example 2: Find Maximum
function findMax(...args: number[]): number {
  console.log("findMax called with:", args);
  
  if (args.length === 0) return -Infinity;
  if (args.length === 1) return args[0];
  
  const [first, ...rest] = args;
  const maxOfRest = findMax(...rest);
  return first > maxOfRest ? first : maxOfRest;
}

console.log("Max(5,2,8,1,9,3):", findMax(5, 2, 8, 1, 9, 3)); // 9

// Example 3: String Concatenator
function concat(...args: string[]): string {
  console.log("concat called with:", args);
  
  if (args.length === 0) return "";
  if (args.length === 1) return args[0];
  
  const [first, ...rest] = args;
  return first + concat(...rest);
}

console.log("Concat('Hello', ' ', 'World', '!'):", concat('Hello', ' ', 'World', '!')); // "Hello World!"

// ============================================================================
// LEVEL 2: INTERMEDIATE EXAMPLES WITH TRANSFORMATIONS
// ============================================================================

console.log("\n=== LEVEL 2: INTERMEDIATE EXAMPLES ===");

// Example 4: Recursive Filter
function recursiveFilter<T>(predicate: (item: T) => boolean, ...args: T[]): T[] {
  console.log("recursiveFilter called with:", args);
  
  if (args.length === 0) return [];
  
  const [first, ...rest] = args;
  const filteredRest = recursiveFilter(predicate, ...rest);
  
  return predicate(first) ? [first, ...filteredRest] : filteredRest;
}

const isEven = (n: number) => n % 2 === 0;
console.log("Filter even numbers from [1,2,3,4,5,6]:", 
  recursiveFilter(isEven, 1, 2, 3, 4, 5, 6)); // [2, 4, 6]

// Example 5: Recursive Map
function recursiveMap<T, U>(transform: (item: T) => U, ...args: T[]): U[] {
  console.log("recursiveMap called with:", args);
  
  if (args.length === 0) return [];
  
  const [first, ...rest] = args;
  return [transform(first), ...recursiveMap(transform, ...rest)];
}

const double = (n: number) => n * 2;
console.log("Double [1,2,3,4]:", recursiveMap(double, 1, 2, 3, 4)); // [2, 4, 6, 8]

// Example 6: Nested Function Builder
function createNestedFunction(...args: string[]) {
  console.log("createNestedFunction called with:", args);
  
  if (args.length === 0) {
    return () => "base case";
  }
  
  const [first, ...rest] = args;
  const innerFunction = createNestedFunction(...rest);
  
  return (value: any) => {
    console.log(`Processing ${first} with value:`, value);
    return innerFunction;
  };
}

const nested = createNestedFunction("step1", "step2", "step3");
console.log("Nested function result:", nested("input1")("input2")("input3")()); 

// ============================================================================
// LEVEL 3: ADVANCED EXAMPLES
// ============================================================================

console.log("\n=== LEVEL 3: ADVANCED EXAMPLES ===");

// Example 7: Recursive Compose Function
function compose<T>(...fns: Array<(arg: T) => T>) {
  console.log("compose called with functions:", fns.map(f => f.name));
  
  if (fns.length === 0) return (x: T) => x;
  if (fns.length === 1) return fns[0];
  
  const [first, ...rest] = fns;
  const composedRest = compose(...rest);
  
  return (x: T) => first(composedRest(x));
}

const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;
const square = (x: number) => x * x;

const composedFn = compose(square, multiplyByTwo, addOne);
console.log("Compose square(multiplyByTwo(addOne(5))):", composedFn(5)); // 144

// Example 8: Recursive Pipe Function
function pipe<T>(...fns: Array<(arg: T) => T>) {
  console.log("pipe called with functions:", fns.map(f => f.name));
  
  if (fns.length === 0) return (x: T) => x;
  if (fns.length === 1) return fns[0];
  
  const [first, ...rest] = fns;
  const pipedRest = pipe(...rest);
  
  return (x: T) => pipedRest(first(x));
}

const pipedFn = pipe(addOne, multiplyByTwo, square);
console.log("Pipe addOne->multiplyByTwo->square(5):", pipedFn(5)); // 144

// ============================================================================
// LEVEL 4: PRACTICAL BUSINESS USE CASES
// ============================================================================

console.log("\n=== LEVEL 4: BUSINESS USE CASES ===");

// Example 9: Middleware Chain (Express.js style)
type Request = { url: string; user?: any; data?: any };
type Response = { status: number; body: any };
type NextFunction = () => void;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;

function createMiddlewareChain(...middlewares: Middleware[]) {
  console.log("createMiddlewareChain called with", middlewares.length, "middlewares");
  
  return function executeChain(req: Request, res: Response, finalHandler: () => void) {
    function runMiddleware(index: number) {
      if (index >= middlewares.length) {
        return finalHandler();
      }
      
      const currentMiddleware = middlewares[index];
      const next = () => runMiddleware(index + 1);
      
      try {
        currentMiddleware(req, res, next);
      } catch (error) {
        console.error("Middleware error:", error);
      }
    }
    
    runMiddleware(0);
  };
}

// Business Middlewares
const authMiddleware: Middleware = (req, res, next) => {
  console.log("🔐 Auth middleware: Checking authentication");
  req.user = { id: 1, name: "John Doe" };
  next();
};

const loggingMiddleware: Middleware = (req, res, next) => {
  console.log("📝 Logging middleware:", req.url);
  next();
};

const validationMiddleware: Middleware = (req, res, next) => {
  console.log("✅ Validation middleware: Validating request");
  next();
};

const chain = createMiddlewareChain(loggingMiddleware, authMiddleware, validationMiddleware);

chain(
  { url: "/api/users" },
  { status: 200, body: {} },
  () => console.log("🎯 Final handler: Processing business logic")
);

// Example 10: Data Transformation Pipeline
interface DataTransform<T> {
  name: string;
  transform: (data: T) => T;
}

function createDataPipeline<T>(...transforms: DataTransform<T>[]) {
  console.log("createDataPipeline with transforms:", transforms.map(t => t.name));
  
  return function processPipeline(data: T): T {
    function applyTransforms(currentData: T, index: number): T {
      if (index >= transforms.length) {
        return currentData;
      }
      
      const { name, transform } = transforms[index];
      console.log(`🔄 Applying transform: ${name}`);
      
      const transformedData = transform(currentData);
      return applyTransforms(transformedData, index + 1);
    }
    
    return applyTransforms(data, 0);
  };
}

// Business Data Transforms
const normalizeEmail: DataTransform<any> = {
  name: "normalizeEmail",
  transform: (data) => ({
    ...data,
    email: data.email?.toLowerCase().trim()
  })
};

const validateAge: DataTransform<any> = {
  name: "validateAge", 
  transform: (data) => ({
    ...data,
    age: Math.max(0, Math.min(120, data.age || 0))
  })
};

const addTimestamp: DataTransform<any> = {
  name: "addTimestamp",
  transform: (data) => ({
    ...data,
    createdAt: new Date().toISOString()
  })
};

const pipeline = createDataPipeline(normalizeEmail, validateAge, addTimestamp);

const userData = {
  email: "  JOHN.DOE@EXAMPLE.COM  ",
  age: 150,
  name: "John Doe"
};

console.log("Original data:", userData);
console.log("Processed data:", pipeline(userData));

// Example 11: Event Handler Chain (Real-world UI scenario)
type Event = { type: string; target: string; data: any };
type EventHandler = (event: Event) => boolean; // return false to stop propagation

function createEventChain(...handlers: EventHandler[]) {
  console.log("createEventChain with", handlers.length, "handlers");
  
  return function handleEvent(event: Event): boolean {
    function executeHandlers(index: number): boolean {
      if (index >= handlers.length) {
        return true; // All handlers processed
      }
      
      const handler = handlers[index];
      console.log(`🎯 Executing handler ${index + 1}`);
      
      const shouldContinue = handler(event);
      
      if (shouldContinue === false) {
        console.log("🛑 Handler stopped propagation");
        return false;
      }
      
      return executeHandlers(index + 1);
    }
    
    return executeHandlers(0);
  };
}

// Business Event Handlers
const securityHandler: EventHandler = (event) => {
  console.log("🔒 Security check for event:", event.type);
  if (event.type === "dangerous_action") {
    console.log("❌ Security violation detected!");
    return false; // Stop propagation
  }
  return true;
};

const analyticsHandler: EventHandler = (event) => {
  console.log("📊 Analytics: Recording event", event.type);
  // Send to analytics service
  return true;
};

const businessLogicHandler: EventHandler = (event) => {
  console.log("💼 Business logic: Processing", event.type);
  // Execute business logic
  return true;
};

const eventChain = createEventChain(securityHandler, analyticsHandler, businessLogicHandler);

console.log("\n--- Processing safe event ---");
eventChain({ type: "user_click", target: "button", data: {} });

console.log("\n--- Processing dangerous event ---");
eventChain({ type: "dangerous_action", target: "admin_panel", data: {} });

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== SUMMARY ===");
console.log(`
Key Patterns with ...args in Recursion:

1. 📚 SIMPLE ACCUMULATION: sum, max, concat
2. 🔄 TRANSFORMATION: map, filter with recursion  
3. 🏗️  FUNCTION BUILDING: compose, pipe
4. 🏢 BUSINESS PATTERNS: middleware chains, data pipelines, event handlers

Each pattern shows how ...args enables:
- Flexible argument handling
- Recursive decomposition  
- Chain of responsibility
- Functional composition
`);

