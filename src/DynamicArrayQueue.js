class DynamicArrayQueue {
    constructor() {
        this._arr = [];
    }

    size() {
        return this._arr.length;
    }

    enqueue(item) {
        this._arr.push(item);
    }

    dequeue() {
        return this._arr.shift();
    }

    peekNewest() {
        const length = this._arr.length;
        if (length === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._arr[length-1];
    }

    peekOldest() {
        const length = this._arr.length;
        if (length === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._arr[0];
    }

    [Symbol.iterator]() {
        function* generator() {
            for (let v of this._arr) {
                yield v;
            }
        }

        return generator();
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

module.exports = { DynamicArrayQueue }