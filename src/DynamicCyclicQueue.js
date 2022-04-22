const { bindMethods, swap } = require('./util');
const MAX_ARRAY_SIZE = 4294967295;
const MIN_INITIAL_CAPACITY = 4;

class DynamicCyclicQueue {
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

  clear () {
    this._arr = new Array(this._capacity);
    this._size = 0;
    this._lastIndex = 0;
    this._firstIndex = 0;
  }

  size () {
    return this._size;
  }

  _expand () {
    // todo: better expand policy
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

  enqueue (item) {
    this._expandIfNeeded();

    if (this._size === 0) {
      this._arr[this._firstIndex = this._lastIndex = 0] = item;
    } else {
      this._arr[this._lastIndex = this._increaseMod(this._lastIndex)] = item;
    }
    this._size++;
  }

  _expandIfNeeded () {
    if (this._size === this._arr.length) {
      this._expand();
    }
  }

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

  _fixOverflow (n) {
    return n < this._arr.length ? n : n - this._arr.length;
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
    this._reduceIfNeeded();
    return result;
  }

  _reduceIfNeeded () {
    // todo: better reduce policy
    // check if current size is 1/3 or less of allocated array
    if (((this._size << 1) + this._size) <= this._arr.length) {
      // remove 1/3 of the allocation
      this._normalizeToZeroIndex();
      for (let i = 0; i < this._size; ++i) {
        this._arr.pop();
      }
    }
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

  // noinspection JSUnusedGlobalSymbols
  toJSON () {
    return this.toArray();
  }
}

module.exports = { DynamicCyclicQueue };
