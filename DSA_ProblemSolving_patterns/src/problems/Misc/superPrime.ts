/**
 * ============================================================================
 * SUPER PRIMES (a.k.a. higher-order / prime-index primes)
 * ============================================================================
 * (The original superPrime.js was an EMPTY file — implemented here.)
 *
 * PROBLEM STATEMENT:
 * A "super prime" is a prime that sits at a prime POSITION in the sequence of
 * primes (1-indexed). Primes:  2, 3, 5, 7, 11, 13, 17, ...
 *                    position:  1  2  3  4   5   6   7
 * Positions that are themselves prime (2,3,5,7,...) pick out 3, 5, 11, 17, ...
 * → those are the super primes. Return the first `n` of them.
 *
 *   superPrimes(5) → [3, 5, 11, 17, 31]
 *
 * PATTERN:
 * - **Sieve + index filter.** Two layers of the same primality idea: generate
 *   primes, then keep the ones whose 1-based position is also prime. The
 *   efficient generator is the Sieve of Eratosthenes.
 *
 * COMPLEXITY LADDER:
 *   Step 1  Trial-division primality per candidate   ~O(k·√k) for k candidates
 *   Step 2  Sieve of Eratosthenes ★                  O(L log log L) up to limit L
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * Helper — trial-division primality test (the readable baseline).
 * ----------------------------------------------------------------------------
 * Check divisors only up to √n: a factor larger than √n would force a
 * co-factor smaller than √n, which we'd already have found. Skip evens after 2.
 *
 * Time: O(√n).
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;      // 2 and 3
  if (n % 2 === 0) return false;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: walk integers, test each with trial division.
 * ----------------------------------------------------------------------------
 * Collect primes one by one; whenever a prime lands at a prime POSITION, it's
 * a super prime. Stop when we have n of them.
 *
 * Why it's not ideal at scale: each primality test re-derives divisibility
 * from scratch. A sieve (Step 2) shares that work across all candidates.
 *
 * Time: ~O(k·√k) to reach k primes. Space: O(count of primes seen).
 */
export function superPrimesBruteForce(n: number): number[] {
  const result: number[] = [];
  let position = 0; // 1-based index into the prime sequence
  let candidate = 2;

  while (result.length < n) {
    if (isPrime(candidate)) {
      position++;
      if (isPrime(position)) result.push(candidate); // prime AT a prime index
    }
    candidate++;
  }
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — SIEVE OF ERATOSTHENES, then filter by prime position.
 * ----------------------------------------------------------------------------
 * The sieve generates all primes up to a limit in near-linear time by crossing
 * out multiples. We don't know the limit in advance, so grow it (double) until
 * enough primes exist — then filter to prime positions.
 *
 * DRY-RUN for n=3:
 *   primes:    2(1) 3(2) 5(3) 7(4) 11(5) 13(6) ...
 *   prime pos:      3    5          11
 *   first 3 → [3, 5, 11] ✓
 *
 * Time: O(L log log L) for sieve to limit L. Space: O(L).
 */
export function superPrimes(n: number): number[] {
  if (n <= 0) return [];

  let limit = 100; // grow until we have enough primes
  while (true) {
    const primes = sieve(limit);
    const supers: number[] = [];
    for (let i = 0; i < primes.length; i++) {
      const position = i + 1;           // 1-based
      if (isPrime(position)) supers.push(primes[i]);
      if (supers.length === n) return supers;
    }
    limit *= 2; // not enough primes under `limit` yet — widen the sieve
  }
}

/** Sieve of Eratosthenes: all primes ≤ limit. */
function sieve(limit: number): number[] {
  const isComposite = new Array<boolean>(limit + 1).fill(false);
  const primes: number[] = [];

  for (let num = 2; num <= limit; num++) {
    if (!isComposite[num]) {
      primes.push(num);
      // Cross out multiples starting at num² (smaller multiples already crossed).
      for (let multiple = num * num; multiple <= limit; multiple += num) {
        isComposite[multiple] = true;
      }
    }
  }
  return primes;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Two layers of one idea: primality applied to VALUES and to POSITIONS.
 *    Say that framing — it makes the two-pass structure obvious.
 * 2. Trial division: only test up to √n, skip evens. The √n bound is the
 *    single most-asked primality optimization.
 * 3. Sieve: cross multiples from num² (not 2·num) — smaller multiples were
 *    already crossed by smaller primes; this is the classic micro-optimization.
 * 4. Unknown upper bound → grow-and-retry (double the limit). Alternatively,
 *    the prime-counting approximation nₜₕ prime ≈ n·ln(n) gives a starting limit.
 */
