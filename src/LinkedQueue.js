// noinspection JSUnusedGlobalSymbols

const { bindMethods } = require('./util');

/**
 * A queue implementation using a singly-linked list.
 * Provides O(1) operations for all queue methods with unlimited capacity.
 *
 * @template T The type of items stored in the queue
 */
class LinkedQueue {
  /**
   * Create a new LinkedQueue instance.
   */
  constructor () {
    bindMethods.call(this);
    this.clear();
  }

  /**
   * Clear the queue.
   * @returns {void}
   */
  clear () {
    /** @private */
    this._newest = null;
    /** @private */
    this._oldest = null;
    /** @private */
    this._size = 0;
  }

  /**
   * Add an item to the queue.
   * @param {T} item The item to add
   * @returns {void}
   */
  enqueue (item) {
    if (this._size === 0) {
      this._newest = { value: item, next: null };
      this._oldest = this._newest;
    } else {
      const temp = { value: item, next: null };
      this._newest.next = temp;
      this._newest = temp;
    }
    this._size++;
  }

  /**
   * Return the current size of the queue.
   * @returns {number}
   */
  size () {
    return this._size;
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
   * @returns {T} The dequeued item
   * @throws {Error} If the queue is empty
   */
  dequeue () {
    if (this._size === 0) {
      throw new Error('cannot dequeue from an empty queue');
    }
    const result = this._oldest.value;
    this._oldest = this._oldest.next;
    this._size--;
    return result;
  }

  /**
   * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
   * @returns {T} The newest item
   * @throws {Error} if the queue is empty
   */
  peekLast () {
    if (this._size === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._newest.value;
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.
   * @returns {T} The oldest item
   * @throws {Error} if the queue is empty
   */
  peekFirst () {
    if (this._size === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._oldest.value;
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
   * Check if the queue is empty.
   * @returns {boolean} True if the queue is empty
   */
  isEmpty () {
    return this._size === 0;
  }

  /**
   * Iterate over the items in the queue without changing the queue.
   * Iteration order is the insertion order: first inserted item would be returned first.
   * In essence this supports JS iterations of the pattern `for (let x of queue) { ... }.`
   *
   * @example
   * const queue = new LinkedQueue();
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
    let cursor = this._oldest;
    return {
      next: function () {
        if (cursor === null) {
          return { done: true };
        } else {
          const result = { done: false, value: cursor.value };
          cursor = cursor.next;
          return result;
        }
      }
    };
  }

  /**
   * Iterate over the items in the queue.
   * Every iterated item is removed from the queue.
   * Iteration order is the insertion order: first inserted item would be returned first.
   *
   * @example
   * const queue = new LinkedQueue();
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
    const me = this;

    return {
      [Symbol.iterator]: function () {
        return {
          next: function () {
            if (me.size() === 0) {
              return { done: true };
            } else {
              return { done: false, value: me.dequeue() };
            }
          }
        };
      }
    };
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

module.exports = { LinkedQueue };
