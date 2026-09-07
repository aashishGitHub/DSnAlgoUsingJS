# Go DSA — pattern-organised, tested reference

The Go counterpart to the TypeScript work in
[DSA_ProblemSolving_patterns/](DSA_ProblemSolving_patterns/). Same patterns, same
brute-force → optimised method, implemented and verified in Go.

## Start here

**[GO_INTERVIEW_QA.md](Go/GO_INTERVIEW_QA.md)** — the single revision document.
Q&A per pattern, arranged as a ladder from linear scans to dynamic programming,
with a recognition table, a Blind 75 coverage map, a two-week schedule, and a
Go-specific gotcha list. Everything else in this folder is the code it cites.

## Layout

One package per pattern. Package doc comments carry the pattern summary
(`go doc dsa/heaptopk`).

| Tier | Packages |
|---|---|
| 1 — linear scans | `hashmap` `prefixsum` `twopointers` `slidingwindow` |
| 2 — exploit order | `binarysearch` `stack` `linkedlist` `intervals` `cyclicsort` |
| 3 — structures | `heaptopk` `trees` `trie` `design` |
| 4 — graphs | `graphs` `toposort` `unionfind` `shortestpath` |
| 5 — choice under constraint | `backtracking` `dp` `greedy` `mathbits` `matrix` |

## Verify

```bash
cd Go
go test ./...              # 22 packages
go vet ./... && gofmt -l . # both silent
```

**Current state:** 22 packages, 193 solution functions, 205 test functions, all
passing; `go vet` and `gofmt` clean.

## JS ↔ Go parity

The two trees are being brought to the same problem set, pattern by pattern.
The teaching narrative (recipe questions, visualisations, the brute-force →
memoise → tabulate → roll ladder) lives on the **JS** side; the Go side carries
only what Go does differently, marked `GO NOTE` in the doc comment.

| Pattern | Parity | Notes |
|---|---|---|
| `dp` | ✅ complete | 31 problems both sides. LC5 lives in JS under `Strings/longestPalindromicSubstring.ts` rather than being duplicated into the DP file. |
| `trees` | ✅ complete | 22 problems both sides. JS's `Codec` class maps to Go's `Serialize`/`Deserialize`. |
| all others | ⏳ pending | See the gap table in [../DSA_ProblemSolving_patterns/PROBLEM_INDEX.md](../DSA_ProblemSolving_patterns/PROBLEM_INDEX.md) |

## Conventions

- Every file: pattern header → brute force (where instructive) → optimal
  solution → the *why* in comments.
- Where a brute force exists (`TwoSumBrute`, `TrapBrute`,
  `DailyTemperaturesBrute`, `MaxSumSubarrayKBrute`, `FindKthLargestSort`), the
  tests assert it agrees with the optimised version on the same inputs. That
  oracle caught two real bugs while this was written.
- Tests are table-driven and lead with edge cases: empty, single element, all
  duplicates, all negatives, k > n.
- Functions that mutate their input say so in the doc comment; functions that
  must not are covered by a test asserting the input is unchanged.
