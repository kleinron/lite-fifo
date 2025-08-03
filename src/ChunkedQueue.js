// noinspection JSUnusedGlobalSymbols

const { LinkedQueue } = require('./LinkedQueue');
const { CyclicQueue } = require('./CyclicQueue');
const { bindMethods } = require('./util');

/**
 * A high-performance queue implementation using linked chunks of cyclic queues.
 * Provides excellent memory efficiency with reasonable throughput.
 *
 * @template T The type of items stored in the queue
 */
class ChunkedQueue {
  /**
   * @param {number} [chunkSize=1024] Size of each internal chunk
   */
  constructor (chunkSize) {
    if (chunkSize === undefined) {
      chunkSize = 1024;
    }
    if (typeof chunkSize !== 'number') {
      throw new Error('chunkSize must a number');
    }
    chunkSize = Math.floor(chunkSize);
    if (chunkSize <= 0) {
      throw new Error(`chunkSize must be positive (current value is ${chunkSize})`);
    }

    /** @private */
    this._queue = new LinkedQueue();
    /** @private */
    this._chunkSize = chunkSize;
    bindMethods.call(this);
  }

  /**
   * Clear the queue.
   * @returns {void}
   */
  clear () {
    this._queue.clear();
  }

  /**
   * Add an item to the queue.
   * @param {T} item The item to add
   * @returns {void}
   */
  enqueue (item) {
    if (this._queue.size() === 0) {
      this._queue.enqueue(new CyclicQueue(this._chunkSize));
    }
    let lastChunk = this._queue.peekLast();
    if (lastChunk.size() === this._chunkSize) {
      lastChunk = new CyclicQueue(this._chunkSize);
      this._queue.enqueue(lastChunk);
    }
    lastChunk.enqueue(item);
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
   * @returns {T} The dequeued item
   * @throws {Error} If the queue is empty
   */
  dequeue () {
    if (this.size() === 0) {
      throw new Error('Cannot dequeue from empty queue');
    }
    const firstChunk = this._queue.peekFirst();
    const result = firstChunk.dequeue();
    if (firstChunk.size() === 0) {
      this._queue.dequeue();
    }
    return result;
  }

  /**
   * Return the current size of the queue.
   * @returns {number}
   */
  size () {
    const size = this._queue.size();
    switch (size) {
      case 0:
        return 0;
      case 1:
        return this._queue.peekLast().size();
      default:
        // run code below
    }
    const newestSize = this._queue.peekLast().size();
    const oldestSize = this._queue.peekFirst().size();
    const innerSize = (size - 2) * this._chunkSize;
    return newestSize + oldestSize + innerSize;
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.
   * @returns {T} The oldest item
   * @throws {Error} if the queue is empty
   */
  peekFirst () {
    if (this.size() === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._queue.peekFirst().peekFirst();
  }

  /**
   * Return the oldest item without removing it from the queue.
   * This is an alias for peekFirst() and the standard queue peek operation.
   * @returns {T} The oldest item
   * @throws {Error} if the queue is empty
   */
  peek () {
    return this.peekFirst();
  }

  /**
   * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
   * @returns {T} The newest item
   * @throws {Error} if the queue is empty
   */
  peekLast () {
    if (this.size() === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._queue.peekLast().peekLast();
  }

  /**
   * Check if the queue is empty.
   * @returns {boolean} True if the queue is empty
   */
  isEmpty () {
    return this.size() === 0;
  }

  /**
   * Iterate over the items in the queue without changing the queue.
   * Iteration order is the insertion order: first inserted item would be returned first.
   * In essence this supports JS iterations of the pattern `for (let x of queue) { ... }.`
   *
   * @example
   * const queue = new ChunkedQueue();
   * queue.enqueue(123);
   * queue.enqueue(45);
   * for (let item of queue) {
   *   console.log(item);
   * }
   * // ==> output would be:
   * // 123
   * // 45
   * // and the queue would remain unchanged
   *
   * @returns {Generator<T, void, unknown>}
   */
  [Symbol.iterator] () {
    const queue = this._queue;
    function * generator () {
      for (const chunk of queue) {
        for (const v of chunk) {
          yield v;
        }
      }
    }

    return generator();
  }

  /**
   * Iterate over the items in the queue.
   * Every iterated item is removed from the queue.
   * Iteration order is the insertion order: first inserted item would be returned first.
   *
   * @example
   * const queue = new ChunkedQueue();
   * queue.enqueue(123);
   * queue.enqueue(45);
   * for (let item of queue.drainingIterator()) {
   *   console.log(item);
   * }
   * console.log(`size = ${queue.size()}`);
   * // ==> output would be:
   * // 123
   * // 45
   * // size = 0
   *
   * @returns {Generator<T, void, unknown>}
   */
  drainingIterator () {
    const queue = this._queue;
    function * generator () {
      for (const chunk of queue.drainingIterator()) {
        for (const v of chunk.drainingIterator()) {
          yield v;
        }
      }
    }

    return generator();
  }

  /**
   * Copy the items of the queue to the given array arr, starting from index startIndex.
   * First item in the array is first item inserted to the queue, and so forth.
   * @param {T[]} arr The target array
   * @param {number} [startIndex=0] Starting index in the array
   * @returns {void}
   */
  copyTo (arr, startIndex) {
    if (startIndex === undefined) {
      startIndex = 0;
    }
    let index = startIndex;
    for (const v of this) {
      arr[index] = v;
      index++;
    }
  }

  /**
   * Create an array with the same size as the queue, populate it with the items in the queue, keeping the iteration order, and return it.
   * @returns {T[]} Array containing all queue items
   */
  toArray () {
    const arr = new Array(this.size());
    this.copyTo(arr, 0);
    return arr;
  }

  /**
   * Return a JSON representation (as a string) of the queue.
   * The queue is represented as an array: first item in the array is the first one inserted to the queue and so forth.
   * @returns {string} JSON string representation
   */
  toJSON () {
    return JSON.stringify(this.toArray());
  }
}

module.exports = { ChunkedQueue };
