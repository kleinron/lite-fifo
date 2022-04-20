# lite-fifo

## Lightweight and efficient Queue implementations
This package aims to provide zero-dependencies implementations of a queue, focusing on:
* memory footprint (RAM)
* efficiency (ops/sec)  

The production code is dependency free. The only dependencies are for testing.

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
**It's not a generic queue**, as it has a weakness, which is out of the scope of this page, so use with caution.

### DynamicCyclicQueue
Same as a cyclic queue, but can exceed the initial length of the underlying array.  
How? when it's full, the next `enqueue` operation would trigger a re-order of the underlying array, and then would expand it with `push` operations.
This process is *O(1) amortized*, and therefore this is a generic queue, and can be used in any scenario.

# The Benchmark
## Methodology
The scenario being checked is the following:  
set P = 100000  
enqueue 30P items  
dequeue 5P  
do 6 times:  
&nbsp;&nbsp;enqueue 1P  
&nbsp;&nbsp;dequeue 5P  

Apply this scenario T times (set T=20) for every relevant class (see table below), measure RAM used and ops/sec.  
Remove best and worst results (in terms of ops/sec), and take the average (mean) from the rest of the results.

Note: we took a very large value for P, otherwise complexity related issues won't come up.


| Class Name         |   Ops/Sec | RAM used (MB) | 
|:-------------------|----------:|--------------:|
| DynamicArrayQueue  |     **5** |             8 |
| ChunkedQueue       |     16378 |            84 |
| ChunkedQueue(1024) |     28307 |        **28** |
| DynamicCyclicQueue | **44864** |           102 |
| LinkedQueue        |     25815 |           143 |

## Analysis
1. The naive implementation, `DynamicArrayQueue`, is so slow that it can't be considered as an option
2. The fastest implementation is `DynamicCyclicQueue`, and has an average RAM usage
3. The fine-tuned implementation of `ChunkedQueue`, with chunk size of 1024, has the lowest RAM usage, with the second-fastest measure of ops/sec
4. The common `LinkedQueue` implementation is not the fastest one, even with *O(1)* time complexity, and it's the most wasteful in terms of RAM usage

## Conclusion
Sometimes it's ok to roll your own solution, as long as it's backed with data and measurements.