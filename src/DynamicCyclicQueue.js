const { bindMethods, swap } = require('./util');
const MAX_ARRAY_SIZE = 4294967295;
const MIN_INITIAL_CAPACITY = 4;

/**
 * @type DynamicCyclicQueue
 */
class DynamicCyclicQueue {

  /**
   * @param {number} [initialCapacity]
   * @returns {DynamicCyclicQueue}
   */
  constructor (initialCapacity) {
    if (initialCapacity === undefined) {
      initialCapacity = 16;
    }
    if (typeof initialCapacity !== 'number') {
      throw new Error('initialCapacity must a number');
    }
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
    this._arr = new Array(this._capacity);
    this._size = 0;
    this._lastIndex = 0;
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
   * @returns {void}
   */
  _expand () {
    // increase by 1.5
    const newSize = Math.min(MAX_ARRAY_SIZE, this._size + (this._size >> 1));
    if (newSize === this._size) {
      throw new Error('reached max capacity');
    }
    this._normalizeToZeroIndex();
    for (let i = 0; i < (newSize - this._size); ++i) {
      this._arr.push(null);
    }
  }

  /**
   * Add an item to the queue.
   * @param {any} item
   * @returns {void}
   */
  enqueue (item) {
    this._expandIfNeeded();

    if (this._size === 0) {
      this._arr[this._firstIndex = this._lastIndex = 0] = item;
    } else {
      this._arr[this._lastIndex = this._increaseMod(this._lastIndex)] = item;
    }
    this._size++;
  }

  /**
   * @returns {void}
   */
  _expandIfNeeded () {
    if (this._size === this._arr.length) {
      this._expand();
    }
  }

  /**
   * @returns {void}
   */
  _normalizeToZeroIndex () {
    if (this._firstIndex === 0) {
      return;
    }
    for (let i = 0; i < this._size; ++i) {
      swap(this._arr, i, this._fixOverflow(this._firstIndex + i));
    }
    this._firstIndex = 0;
    if (this._size === 0) {
      this._lastIndex = 0;
    } else {
      this._lastIndex = this._increaseMod(this._size - 1);
    }
  }

  /**
   * @param {number} n
   * @returns {number}
   */
  _fixOverflow (n) {
    return n < this._arr.length ? n : n - this._arr.length;
  }

  /**
   * @param {number} val
   * @returns {number}
   */
  _increaseMod (val) {
    return val + 1 === this._arr.length ? 0 : val + 1;
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
   * @returns {any}
   * @throws {Error} Might throw an exception if the queue is empty.
   */
  dequeue () {
    if (this._size === 0) {
      throw new Error('queue underflow');
    }
    const result = this._arr[this._firstIndex];
    this._arr[this._firstIndex] = null;
    this._firstIndex = this._increaseMod(this._firstIndex);
    this._size--;
    this._reduceIfNeeded();
    return result;
  }

  /**
   * @returns {void}
   */
  _reduceIfNeeded () {
    // check if current size is 1/3 or less of allocated array
    if (((this._size << 1) + this._size) <= this._arr.length) {
      // remove 1/3 of the allocation
      this._normalizeToZeroIndex();
      for (let i = 0; i < this._size; ++i) {
        this._arr.pop();
      }
    }
  }

  /**
   * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
   * @returns {any}
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
   * @returns {any}
   * @throws {Error} if the queue is empty
   */
  peekFirst () {
    if (this._size === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[this._firstIndex];
  }

  /**
   * Iterate over the items in the queue without changing the queue.
   * Iteration order is the insertion order: first inserted item would be returned first.
   * In essence this supports JS iterations of the pattern `for (let x of queue) { ... }.`
   *
   * @example
   * const queue = new DynamicArrayQueue();
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
   * @returns {{next: function(): ({done: boolean, value?: any})}}
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
   * const queue = new DynamicArrayQueue();
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
   * @returns {{[Symbol.iterator]: (function(): {next: function(): ({done: boolean, value?: any})})}}
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
   * @param {any[]} arr
   * @param {number} [startIndex=0]
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
   * @returns {any[]}
   */
  toArray () {
    const arr = new Array(this.size());
    this.copyTo(arr, 0);
    return arr;
  }

  /**
   * Return a JSON representation (as a string) of the queue.
   * The queue is represented as an array: first item in the array is the first one inserted to the queue and so forth.
   * @returns {string}
   */
  toJSON () {
    return JSON.stringify(this.toArray());
  }
}

module.exports = { DynamicCyclicQueue };
