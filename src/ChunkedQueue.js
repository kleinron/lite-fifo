const { LinkedQueue } = require('./LinkedQueue');
const { CyclicQueue } = require('./CyclicQueue');
const { bindMethods } = require('./util');

class ChunkedQueue {
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
    this._queue = new LinkedQueue();
    this._chunkSize = chunkSize;
    bindMethods.call(this);
  }

  clear () {
    this._queue.clear();
  }

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

  dequeue () {
    const firstChunk = this._queue.peekFirst();
    const result = firstChunk.dequeue();
    if (firstChunk.size() === 0) {
      this._queue.dequeue();
    }
    return result;
  }

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

  peekLast () {
    if (this.size() === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._queue.peekLast().peekLast();
  }

  peekFirst () {
    if (this.size() === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._queue.peekFirst().peekFirst();
  }

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

  toArray () {
    const arr = new Array(this.size());
    this.copyTo(arr, 0);
    return arr;
  }

  toJSON () {
    const arr = new Array(this.size());
    this.copyTo(arr);
    return arr;
  }
}

module.exports = { ChunkedQueue };
