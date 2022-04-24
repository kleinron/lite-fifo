const { bindMethods } = require('./util');

class CyclicQueue {
  constructor (capacity) {
    if (capacity === undefined) {
      capacity = 16;
    }
    if (typeof capacity !== 'number') {
      throw new Error('capacity must a number');
    }
    this._capacity = Math.floor(capacity);
    if (capacity <= 0) {
      throw new Error(`capacity must be positive (current value is ${capacity})`);
    }
    bindMethods.call(this);
    this.clear();
  }

  clear () {
    this._arr = new Array(this._capacity);
    this._size = 0;
    this._lastIndex = 0;
    this._firstIndex = 0;
  }

  capacity () {
    return this._arr.length;
  }

  size () {
    return this._size;
  }

  enqueue (item) {
    if (this._size === this._arr.length) {
      throw new Error('queue overflow');
    }
    if (this._size === 0) {
      this._arr[this._firstIndex = this._lastIndex = 0] = item;
    } else {
      this._arr[this._lastIndex = this._increaseMod(this._lastIndex)] = item;
    }
    this._size++;
  }

  _increaseMod (val) {
    return val + 1 === this._arr.length ? 0 : val + 1;
  }

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

  peekLast () {
    if (this._size === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[this._lastIndex];
  }

  peekFirst () {
    if (this._size === 0) {
      throw new Error('cannot peek from an empty queue');
    }
    return this._arr[this._firstIndex];
  }

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

module.exports = { CyclicQueue };
