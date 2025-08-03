// noinspection JSUnusedGlobalSymbols

const { bindMethods } = require('./util');
const MAX_ARRAY_SIZE = 4294967295;
const MIN_INITIAL_CAPACITY = 4;

/**
 * A queue implementation using a dynamic circular buffer that can expand when full.
 * Provides O(1) amortized operations with unlimited capacity.
 *
 * @template T The type of items stored in the queue
 */
class DynamicCyclicQueue {
  /**
   * @param {number} [initialCapacity=16] Initial capacity of the underlying array
   */
  constructor (initialCapacity) {
    if (initialCapacity === undefined) {
      initialCapacity = 16;
    }
    if (typeof initialCapacity !== 'number') {
      throw new Error('initialCapacity must a number');
    }

    /** @private */
    this._capacity = Math.floor(initialCapacity);
    if (initialCapacity <= MIN_INITIAL_CAPACITY) {
      throw new Error(`initialCapacity must be greater than ${MIN_INITIAL_CAPACITY} (current value is ${initialCapacity})`);
    }
    bindMethods.call(this);
    this.clear();
  }

  /**
   * Clear the queue.
   * @returns {void}
   */
  clear () {
    /** @private */
    this._arr = new Array(this._capacity);
    /** @private */
    this._size = 0;
    /** @private */
    this._lastIndex = 0;
    /** @private */
    this._firstIndex = 0;
  }

  /**
   * Return the current size of the queue.
   * @returns {number}
   */
  size () {
    return this._size;
  }

  /**
   * @private
   * @returns {void}
   */
  _expand () {
    const newCapacity = Math.min(this._arr.length * 2, MAX_ARRAY_SIZE);
    if (newCapacity === this._arr.length) {
      throw new Error('queue overflow, exceeded maximum array size');
    }
    this._reorderAndExpand(newCapacity);
  }

  /**
   * @private
   * @param {number} newCapacity
   * @returns {void}
   */
  _reorderAndExpand (newCapacity) {
    const newArr = new Array(newCapacity);
    this.copyTo(newArr);
    this._arr = newArr;
    this._firstIndex = 0;
    this._lastIndex = this._size === 0 ? 0 : this._size - 1;
  }

  /**
   * Add an item to the queue.
   * @param {T} item The item to add
   * @returns {void}
   */
  enqueue (item) {
    if (this._size === this._arr.length) {
      this._expand();
    }
    if (this._size === 0) {
      this._arr[this._firstIndex = this._lastIndex = 0] = item;
    } else {
      this._arr[this._lastIndex = this._increaseMod(this._lastIndex)] = item;
    }
    this._size++;
  }

  /**
   * @private
   * @param {number} val
   * @returns {number}
   */
  _increaseMod (val) {
    return val + 1 === this._arr.length ? 0 : val + 1;
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
   * @returns {T} The dequeued item
   * @throws {Error} If the queue is empty
   */
  dequeue () {
    if (this._size === 0) {
      throw new Error('queue underflow');
    }
    const result = this._arr[this._firstIndex];
    this._arr[this._firstIndex] = null;
    this._firstIndex = this._increaseMod(this._firstIndex);
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
    return this._arr[this._lastIndex];
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
    return this._arr[this._firstIndex];
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
   * const queue = new DynamicCyclicQueue();
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
    let firstIndex = this._firstIndex;
    const incMod = this._increaseMod.bind(this);
    const arr = this._arr;
    const size = this.size();
    let i = 0;
    return {
      next: function () {
        if (i === size) {
          return { done: true };
        } else {
          const result = { done: false, value: arr[firstIndex] };
          firstIndex = incMod(firstIndex);
          i++;
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
   * const queue = new DynamicCyclicQueue();
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

module.exports = { DynamicCyclicQueue };
