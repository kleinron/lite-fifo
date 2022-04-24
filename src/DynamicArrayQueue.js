const { bindMethods } = require('./util');

class DynamicArrayQueue {
  constructor () {
    this._arr = [];
    bindMethods.call(this);
  }

  clear () {
    this._arr = [];
  }

  enqueue (item) {
    this._arr.push(item);
  }

  dequeue () {
    if (this._arr.length === 0) {
      throw new Error('cannot dequeue from an empty queue');
    }

    return this._arr.shift();
  }

  size () {
    return this._arr.length;
  }

  peekLast () {
    const length = this._arr.length;
    if (length === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[length - 1];
  }

  peekFirst () {
    const length = this._arr.length;
    if (length === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[0];
  }

  [Symbol.iterator] () {
    function * generator () {
      for (const v of this._arr) {
        yield v;
      }
    }

    return generator.bind(this).call();
  }

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
    return JSON.stringify(this.toArray());
  }
}

module.exports = { DynamicArrayQueue };
