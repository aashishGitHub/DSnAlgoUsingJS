// source https://www.educative.io/m/serialize-deserialize-binary-tree
// 208,207,253,202,227,260,206,211,246,263,206,235,260,231,
// 208,207,253,202,227,260,206,211,246,263,206,235,260,231,

// Runtime Complexity
// Linear, O(n).

// Memory Complexity
// Logarithmic, O(logn).

// Recursive solution has O(h) memory complexity as it will consume memory on the stack up to the height of the binary tree h. It will be O(logn) for a balanced tree and in the worst case can be O(n).

let MARKER = Number.MAX_VALUE;
let serialize = function(node, stream) {
  if (!node) {
    stream.push(MARKER);
    return;
  }
  stream.push(node.data);
  serialize(node.left, stream);
  serialize(node.right, stream);
};

let deserialize = function(stream) {
  try {
    let data = stream.shift();
    if (data === MARKER) {
      return null;
    }

    let node = new BinaryTreeNode(data);
    node.left = deserialize(stream);
    node.right = deserialize(stream);
    return node;
  } catch (err) {
    return null;
  }
};

let root = create_random_BST(15);
display_level_order(root);
let p = [];
serialize(root, p);
let root_deserialized = deserialize(p);
display_level_order(root_deserialized);