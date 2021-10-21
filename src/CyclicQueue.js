class CyclicQueue {
    constructor(capacity) {
        if (capacity === undefined) {
            capacity = 16;
        }
        if (typeof capacity !== 'number') {
            throw new Error(`capacity must a number`);
        }
        this._capacity = Math.floor(capacity);
        if (capacity <= 0) {
            throw new Error(`capacity must be positive (current value is ${capacity})`);
        }
        this.clear();
    }

    clear() {
        this._arr = new Array(this._capacity);
        this._size = 0
        this._newestIndex = 0
        this._oldestIndex = 0
    }

    capacity() {
        return this._arr.length;
    }

    size() {
        return this._size;
    }

    enqueue(item) {
        if (this._size === this._arr.length) {
            throw new Error('queue overflow');
        }
        this._arr[this._newestIndex] = item;
        this._newestIndex = this._increaseMod(this._newestIndex);
        this._size++;
    }

    _increaseMod(val) {
        return val + 1 === this._arr.length ? 0 : val + 1;
    }

    _decreaseMod(val) {
        return val === 0 ? this._arr.length - 1 : val - 1;
    }

    dequeue() {
        if (this._size === 0) {
            throw new Error('queue underflow');
        }
        const result = this._arr[this._oldestIndex];
        this._arr[this._oldestIndex] = null;
        this._oldestIndex = this._increaseMod(this._oldestIndex);
        this._size--;
        return result;
    }

    peekLast() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._arr[this._decreaseMod(this._newestIndex)];
    }

    peekFirst() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._arr[this._oldestIndex];
    }

    [Symbol.iterator]() {
        let oldestIndex = this._oldestIndex;
        const incMod = this._increaseMod.bind(this);
        const arr = this._arr;
        const size = this.size();
        let i = 0;
        return {
            next: function () {
                if (i === size) {
                    return {done: true};
                } else {
                    const result = {done: false, value: arr[oldestIndex]};
                    oldestIndex = incMod(oldestIndex);
                    i++;
                    return result;
                }
            }
        }
    }

    drainingIterator() {
        const me = this;

        return {
            [Symbol.iterator]: function () {
                return {
                    next: function() {
                        if (me.size() === 0) {
                            return {done: true};
                        } else {
                            return {done: false, value: me.dequeue()};
                        }
                    }
                }
            }
        }
    }

    copyTo(arr, startIndex) {
        let index = startIndex;
        for (let v of this) {
            arr[index] = v;
            index++;
        }
    }

    toArray() {
        const arr = new Array(this.size());
        this.copyTo(arr, 0);
        return arr;
    }

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        return this.toArray();
    }
}

module.exports = { CyclicQueue }