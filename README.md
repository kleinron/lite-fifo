[![NPM version](https://img.shields.io/npm/v/lite-fifo.svg?style=flat)](https://npmjs.org/package/lite-fifo)
[![CI](https://github.com/kleinron/lite-fifo/actions/workflows/main.yaml/badge.svg)](https://github.com/kleinron/lite-fifo/actions/workflows/main.yaml)
[![GitHub license](https://img.shields.io/github/license/kleinron/lite-fifo)](https://github.com/kleinron/lite-fifo/blob/main/LICENSE)

# lite-fifo

When you're short on RAM but still want a decent FIFO implementation...

## Lightweight and efficient Queue implementations
This package aims to provide zero-dependency implementations of a queue, focusing on:
* memory footprint (RAM)
* throughput (ops/sec)  

The production code is dependency free. The only dependencies are for testing.

## Benchmarks
After running several scenarios and comparing to several known implementations, 
it's clear that this project's flagship `ChunkedQueue` has the lowest RAM usage, with a reasonable throughput (ops/sec). See [benchmarks.md](benchmarks.md) file for a deeper view and analysis. 

## Installation
```bash
npm install lite-fifo
```

## Usage
```javascript
const { ChunkedQueue } = require('lite-fifo');

const queue = new ChunkedQueue();
queue.enqueue(123);
queue.enqueue(45);
queue.enqueue(67);

console.log(queue.toJSON());
// => [ 123, 45, 67 ]

const temp = queue.dequeue(); // holds 123
console.log(queue.toJSON());
// => [ 45, 67 ]
```

# API
## Classes
* LinkedQueue
* CyclicQueue (bounded)
* DynamicCyclicQueue (unbounded)
* ChunkedQueue
* DynamicArrayQueue

All of these classes support the following methods
## Methods
### `enqueue (item)`  
Add an item to the queue.  
Bounded implementations might throw an exception if the capacity is exceeded.

### `dequeue ()`
Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.  
Zero sized queue would throw an exception.

### `clear ()`
Clear the queue.

### `size ()`
Return the current size of the queue.

### `peekFirst ()`
Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.  
Zero sized queue would throw an exception.

### `peekLast ()`
Return the last inserted (or the "newest") item in the queue, without removing it from the queue.  
Zero sized queue would throw an exception.

### `[Symbol.iterator] ()`
Iterate over the items in the queue without changing the queue.  
Iteration order is the insertion order: first inserted item would be returned first.  
In essence this supports JS iterations of the pattern `for (let x of queue) { ... }`.  
Example:  
```javascript
const queue = new ChunkedQueue();
queue.enqueue(123);
queue.enqueue(45);
for (let item of queue) {
  console.log(item);
}
// ==> output would be:
// 123
// 45
// and the queue would remain unchanged
```

### `drainingIterator ()`
Iterate over the items in the queue.  
Every iterated item is removed from the queue.  
Iteration order is the insertion order: first inserted item would be returned first.  
Example:
```javascript
const queue = new ChunkedQueue();
queue.enqueue(123);
queue.enqueue(45);
for (let item of queue.drainingIterator()) {
  console.log(item);
}
console.log(`size = ${queue.size()}`);
// ==> output would be:
// 123
// 45
// size = 0
```

### `copyTo (arr, startIndex)`
`startIndex` is optional, and defaults to 0 if not given.  
Copy the items of the queue to the given array `arr`, starting from index `startIndex`.  
First item in the array is first item inserted to the queue, and so forth.  
No return value.

### `toArray ()`
Create an array with the same size as the queue, populate it with the items in the queue, keeping the iteration order, and return it.

### `toJSON ()`
Return a JSON representation (as a string) of the queue.  
The queue is represented as an array: first item in the array is the first one inserted to the queue and so forth.

## Common implementations and mistakes
### Array + push + shift
A very common implementation of a queue looks like this:
```javascript
class DynamicArrayQueue { /* DON'T USE THIS CODE, IT DOESN'T SCALE */
    constructor() {
        this._arr = [];
    }
    enqueue(item) {
        this._arr.push(item);
    }
    dequeue() {
        return this._arr.shift();
    }
}
```
The time complexity of the `dequeue` operation is O(n). At small scale - we wouldn't notice.  
On a high scale, say 300000 items, this implementation would have only 5 (five!) ops per second. Complexity matters..  
At the bottom line, this implementation is a mistake.

### Linked List
A linked list implementation for a queue behaves very well in terms of time complexity: O(1).  
On the memory side, the provided implementation, `LinkedQueue`, introduces an optimization: instead of relying on a doubly-linked-list, it relies on a singly-linked-list.  
However, even with this optimization, the memory footprint of `LinkedQueue` is the highest (see the benchmark table below).  

## Better implementations
### Linked List of Ring Buffers
A ring buffer, or a cyclic queue, is a *bounded* data structure that relies on an array. It's very fast, but bounded.  
We can, however, introduce a new data structure named `ChunkedQueue`, in which we create a `LinkedQueue` with each item in it to be a cyclic queue.  

### DynamicCyclicQueue
Same as a cyclic queue, but can exceed the initial length of the underlying array.  
How? when it's full, the next `enqueue` operation would trigger a re-order of the underlying array, and then would expand it with `push` operations.
This process is *O(1) amortized*, and therefore this is a generic queue, and can be used in any scenario.

# The Benchmark
For a full deep dive of the scenarios, measurement and comparison with implementations (also external to this project),
please read [benchmarks.md](benchmarks.md) file.

## Methodology
The scenario being checked is the following:  
set P = 100000  
enqueue 30P items  
dequeue 5P  
do 6 times:  
&nbsp;&nbsp;enqueue 1P  
&nbsp;&nbsp;dequeue 5P  

Apply this scenario T times (set T=30) for every relevant class (see table below), measure RAM used and ops/sec.  
Take the average (mean) of the results.

Note: we took a very large value for P, otherwise complexity related issues won't come up.

## Results
| Class Name         | Ops/Sec | RAM used (MB) | 
|:-------------------|--------:|--------------:|
| DynamicArrayQueue  |   **5** |             8 |
| ChunkedQueue       |   36200 |        **28** |
| DynamicCyclicQueue |   28200 |            89 |
| LinkedQueue        |   21300 |           143 |

## Analysis
1. The naive implementation, `DynamicArrayQueue`, is so slow that it can't be considered as an option
2. The fastest implementation is `ChunkedQueue`, and has the lowest RAM usage
3. The common `LinkedQueue` implementation is not the fastest one, even with *O(1)* time complexity, and it's the most wasteful in terms of RAM usage

## Suggestions
* Use the provided `ChunkedQueue` for a generic solution

## License
MIT &copy; Ron Klein
