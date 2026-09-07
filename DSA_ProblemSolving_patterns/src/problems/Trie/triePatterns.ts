/**
 * ============================================================================
 * TRIE / PREFIX TREE (LeetCode 208, 211, 212)
 * ============================================================================
 *
 * PATTERN:
 * - A trie stores a SET OF STRINGS as a tree where each edge is one character,
 *   so a path from the root spells a prefix. Every word sharing a prefix shares
 *   the same nodes — "car", "card" and "care" cost 5 nodes between them, not 12.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * - Storing words in an array and answering "does any word start with 'app'?"
 *   means scanning every word: O(N · L). A hash set fixes exact lookup but NOT
 *   prefix lookup — hashing destroys the prefix relationship, because "app" and
 *   "apple" hash to unrelated buckets. The trie keeps prefixes structurally
 *   adjacent, so every query costs O(L) — the length of the query alone,
 *   INDEPENDENT of how many words are stored.
 *
 * RECOGNITION CUES:
 * - "starts with / prefix / autocomplete"        → trie
 * - "search words with a wildcard"               → trie + DFS branching (LC211)
 * - "find MANY words in one grid/text"           → trie + backtracking (LC212)
 * - "longest common prefix of a word set"        → trie, walk while 1 child
 *
 * THE KEY DESIGN DECISION — `isEnd`:
 * A node cannot tell you whether it terminates a word from its shape alone.
 * Inserting "apple" creates a node for "app" as a by-product; without an
 * explicit `isEnd` flag, `search("app")` would wrongly return true. `isEnd` is
 * exactly the difference between `search` and `startsWith`, and forgetting it
 * is the single most common trie bug.
 *
 * REAL-WORLD ANALOGIES:
 * - Editor/IDE autocomplete and shell tab-completion.
 * - Phone contact search as you type.
 * - IP routing tables (longest-prefix match) and URL router matching.
 * - Spell-checkers and profanity filters over a fixed dictionary.
 *
 * COMPLEXITY SUMMARY (L = word length, N = number of words, A = alphabet size):
 *   Trie.insert / search / startsWith    Time O(L)         Space O(N · L) total
 *   WordDictionary.search (wildcards)    Time O(A^d · L)   d = number of dots
 *   findWords (Word Search II)           Time O(R·C·4^L)   Space O(N · L)
 * ============================================================================
 */

/**
 * A single trie node.
 *
 * `children` is a Map rather than a fixed 26-slot array so the structure works
 * for any alphabet (unicode, digits, symbols) and wastes no space on sparse
 * branches. The array version is marginally faster for lowercase-only input and
 * is worth MENTIONING in an interview as the alternative.
 */
export class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean; // does a complete word terminate HERE?

  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

/**
 * ----------------------------------------------------------------------------
 * IMPLEMENT TRIE (LeetCode 208) ★ THE BASE STRUCTURE
 * ----------------------------------------------------------------------------
 * Three operations, one shared traversal helper. Once `walk` exists, `search`
 * and `startsWith` differ by exactly one line — that observation is the answer
 * interviewers are listening for.
 *
 * DRY-RUN — insert "app", then "apple", then query:
 *   insert("app"):    root → a → p → p            mark isEnd on the last p
 *   insert("apple"):  reuses a → p → p, then adds l → e, isEnd on e
 *
 *        root
 *          └── a
 *              └── p
 *                  └── p (isEnd ✓ "app")
 *                      └── l
 *                          └── e (isEnd ✓ "apple")
 *
 *   search("app")      → walks to the second p, isEnd is true  → true
 *   search("appl")     → walks to l, isEnd is FALSE            → false
 *       (that node exists only because "apple" passes through it)
 *   startsWith("appl") → walks to l, node exists               → true
 *   search("apricot")  → after "ap", no child "r"              → false
 *
 * @example
 * // Real-world: an autocomplete index for a search box.
 * const trie = new Trie();
 * trie.insert("apple");
 * trie.search("apple");     // true
 * trie.search("app");       // false — a prefix, but never inserted as a word
 * trie.startsWith("app");   // true
 * trie.insert("app");
 * trie.search("app");       // true — now it is a word in its own right
 *
 * Time:  O(L) per operation — L = length of the word/prefix, NOT the dictionary size.
 * Space: O(N · L) worst case; far less in practice because prefixes are shared.
 */
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /** Add a word, creating only the nodes that do not exist yet. */
  insert(word: string): void {
    let node = this.root;

    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }

    node.isEnd = true; // without this, prefixes would look like whole words
  }

  /**
   * Walk the path spelled by `prefix`. Returns the node it lands on, or null if
   * the path breaks. Shared by `search` and `startsWith` — the ONLY difference
   * between those two is whether the landing node's `isEnd` is required.
   */
  private walk(prefix: string): TrieNode | null {
    let node = this.root;

    for (const ch of prefix) {
      const next = node.children.get(ch);
      if (next === undefined) return null; // path breaks — nothing matches
      node = next;
    }

    return node;
  }

  /** Is `word` a COMPLETE word that was inserted? */
  search(word: string): boolean {
    const node = this.walk(word);
    return node !== null && node.isEnd; // isEnd is the whole difference
  }

  /** Does ANY inserted word begin with `prefix`? */
  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null; // reaching the node is enough
  }
}

/**
 * ----------------------------------------------------------------------------
 * DESIGN ADD AND SEARCH WORDS (LeetCode 211) — a trie that handles '.'
 * ----------------------------------------------------------------------------
 * Same structure as `Trie`, but `search` may contain '.' matching ANY single
 * character.
 *
 * WHY THE ITERATIVE WALK NO LONGER WORKS: with a concrete character there is
 * exactly one child to follow, so a loop suffices. A '.' means EVERY child is a
 * candidate, and the walk becomes a branching search — the single '.' turns a
 * path into a tree, which is what forces recursion (or an explicit stack).
 *
 * THE PRUNING THAT MAKES IT FAST: recursion returns as soon as any branch
 * succeeds, so most branches die within a character or two rather than running
 * to full depth.
 *
 * DRY-RUN — after adding "bad", "dad", "mad":
 *   search("pad")  → root has no 'p' child                       → false
 *   search("bad")  → concrete walk b → a → d, isEnd ✓            → true
 *   search(".ad")  → '.' at index 0 → try EVERY root child:
 *                      b → "ad" matches ✓ → return true immediately
 *                      (d and m are never explored — that is the pruning)
 *   search("b..")  → b, then '.' → a, then '.' → d, isEnd ✓      → true
 *
 * @example
 * // Real-world: dictionary lookup where some characters are smudged/unknown.
 * const dict = new WordDictionary();
 * dict.addWord("bad");
 * dict.addWord("dad");
 * dict.search("pad");  // false
 * dict.search("bad");  // true
 * dict.search(".ad");  // true
 * dict.search("b..");  // true
 *
 * Time:  addWord O(L). search O(L) with no dots; O(A^d · L) worst case, where d
 *        is the number of dots and A the branching factor.
 * Space: O(N · L) for the trie, O(L) recursion depth.
 */
export class WordDictionary {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    return this.searchFrom(word, 0, this.root);
  }

  /**
   * Match `word` from `index` onward, starting at `node`.
   * Concrete char → follow one child. Dot → branch across all children.
   */
  private searchFrom(word: string, index: number, node: TrieNode): boolean {
    // Consumed the whole pattern: this is a hit only if a word ends here.
    if (index === word.length) return node.isEnd;

    const ch = word[index];

    if (ch === ".") {
      // Wildcard: ANY child could work. Return on the first success.
      for (const child of node.children.values()) {
        if (this.searchFrom(word, index + 1, child)) return true;
      }
      return false; // every branch failed
    }

    const next = node.children.get(ch);
    if (next === undefined) return false; // concrete char with no such edge
    return this.searchFrom(word, index + 1, next);
  }
}

/**
 * ----------------------------------------------------------------------------
 * WORD SEARCH II (LeetCode 212) ★ THE CAPSTONE — trie + grid backtracking
 * ----------------------------------------------------------------------------
 * PROBLEM: given a board of letters and a list of words, return every word that
 * can be spelled by walking 4-directionally through adjacent cells without
 * reusing a cell within one word.
 *
 * ============================================================================
 * WHY THE OBVIOUS APPROACH IS TOO SLOW — and what the trie actually buys
 * ============================================================================
 * The naive solution runs Word Search (LC79) once per word: O(W · R · C · 4^L).
 * With 3·10⁴ words that is hopeless, and it is WASTEFUL in a specific way —
 * searching "oath", then "oats", then "oaths" re-walks the shared "oat" prefix
 * three separate times.
 *
 * The trie removes exactly that waste: walk the grid ONCE, carrying a trie
 * pointer alongside the position. All words are searched SIMULTANEOUSLY, and
 * the moment the current path spells a prefix no word has, the trie has no
 * child and the whole branch is abandoned. The trie is not just storage here —
 * it is the pruning oracle, and that is the insight the problem tests.
 *
 * DRY-RUN — board [["o","a","a","n"],["e","t","a","e"],
 *                  ["i","h","k","r"],["i","f","l","v"]], words ["oath","pea","eat","rain"]
 *   Trie holds: o-a-t-h, p-e-a, e-a-t, r-a-i-n
 *   start (0,0)='o' → trie has 'o' → (0,1)='a' ✓ → (1,1)='t' ✓ → (2,1)='h' ✓
 *                     isEnd → collect "oath"
 *   start (0,1)='a' → trie root has no 'a' child → ABANDON instantly.
 *                     ↑ this rejection is the trie earning its place
 *   start (1,3)='e' → 'e' exists → (2,3)='r'? trie 'e' has only 'a' → abandon
 *   → ["oath"] (plus "eat" if the letters connect; order not guaranteed)
 *
 * TWO OPTIMIZATIONS WORTH NAMING OUT LOUD:
 *   1. Store the whole word on the terminal node (`word`), so a hit needs no
 *      string building during the walk.
 *   2. After collecting a word, null out that node's `word` so duplicates are
 *      impossible — no result Set needed.
 *
 * @example
 * // Real-world: find every dictionary word hidden in a Boggle board.
 * findWords(
 *   [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
 *   ["oath", "pea", "eat", "rain"]
 * ); // ["oath", "eat"]  (order not guaranteed)
 *
 * Time:  O(R · C · 4^L) worst case, but the trie prunes almost all of it.
 * Space: O(N · L) for the trie plus O(L) recursion.
 */
export function findWords(board: string[][], words: string[]): string[] {
  if (board.length === 0 || board[0].length === 0 || words.length === 0) {
    return [];
  }

  // A node that terminates a word carries the word itself — no rebuilding.
  interface SearchNode {
    children: Map<string, SearchNode>;
    word: string | null;
  }
  const makeNode = (): SearchNode => ({ children: new Map(), word: null });

  // Build the trie from the word list.
  const root = makeNode();
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch)!;
    }
    node.word = word;
  }

  const rows = board.length;
  const cols = board[0].length;
  const found: string[] = [];

  function explore(row: number, col: number, node: SearchNode): void {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    const ch = board[row][col];
    if (ch === "#") return; // already on the current path

    const next = node.children.get(ch);
    if (next === undefined) return; // no word has this prefix — prune the branch

    if (next.word !== null) {
      found.push(next.word);
      next.word = null; // collect once; avoids duplicates without a Set
    }

    // Mark visited by mutating the board, then restore on the way out —
    // the classic O(1)-space alternative to a separate visited grid.
    board[row][col] = "#";
    explore(row + 1, col, next);
    explore(row - 1, col, next);
    explore(row, col + 1, next);
    explore(row, col - 1, next);
    board[row][col] = ch; // UN-CHOOSE: restore for other paths
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      explore(row, col, root);
    }
  }

  return found;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: any mention of PREFIX — autocomplete, "starts with",
 *    longest-common-prefix, routing. A hash set gives O(1) exact lookup but
 *    cannot answer prefix questions at all; that contrast is the "why a trie".
 * 2. `isEnd` is the whole difference between `search` and `startsWith`.
 *    Inserting "apple" creates an "app" node as a side effect, so without the
 *    flag `search("app")` wrongly returns true. State this before coding.
 * 3. Complexity talking point: operations are O(L) in the QUERY length and
 *    independent of how many words are stored — that independence is the
 *    selling point over scanning a list.
 * 4. Map vs 26-slot array for children: Map handles any alphabet and sparse
 *    branches; the array is faster and simpler for lowercase-only input. Say
 *    which you picked and why.
 * 5. A wildcard turns the iterative walk into a branching DFS (LC211) — one
 *    '.' means every child is a candidate, so recursion becomes necessary.
 * 6. LC212 is the pattern's punchline: the trie is a PRUNING ORACLE, not
 *    storage. Walk the grid once with all words at play, and abandon a branch
 *    the moment no word shares the current prefix. Also: store the word on the
 *    terminal node, and null it after collecting to dedupe for free.
 * 7. Follow-ups you may get: return all words with a prefix (walk to the node,
 *    then DFS below it), longest common prefix (descend while exactly one
 *    child and not isEnd), and space-compression via a radix/Patricia trie
 *    (collapse single-child chains into one edge).
 */
