const { bindMethods } = require('./util');

/**
 * @type DynamicArrayQueue
 */
class DynamicArrayQueue {

  /**
   * @returns {DynamicArrayQueue}
   */
  constructor () {
    this._arr = [];
    bindMethods.call(this);
  }

  /**
   * Clear the queue.
   * @returns {void}
   */
  clear () {
    this._arr = [];
  }

  /**
   * Add an item to the queue.
   * @param {any} item
   * @returns {void}
   */
  enqueue (item) {
    this._arr.push(item);
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
   * @returns {any}
   * @throws {Error} Might throw an exception if the queue is empty.
   */
  dequeue () {
    if (this._arr.length === 0) {
      throw new Error('cannot dequeue from an empty queue');
    }

    return this._arr.shift();
  }

  /**
   * Return the current size of the queue.
   * @returns {number}
   */
  size () {
    return this._arr.length;
  }

  /**
   * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
   * @returns {any}
   * @throws {Error} if the queue is empty
   */
  peekLast () {
    const length = this._arr.length;
    if (length === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[length - 1];
  }

  /**
   * Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.
   * @returns {any}
   * @throws {Error} if the queue is empty
   */
  peekFirst () {
    const length = this._arr.length;
    if (length === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[0];
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
   * @returns {Generator<any, void, ?>}
   */
  [Symbol.iterator] () {
    function * generator () {
      for (const v of this._arr) {
        yield v;
      }
    }

    return generator.bind(this).call();
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
        function * generator () {
          while (me.size() > 0) {
            yield me.dequeue();
          }
        }

        return generator.bind(me).call();
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

module.exports = { DynamicArrayQueue };
