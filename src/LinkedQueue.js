const VALUE = 0;
const NEXT = 1;

class LinkedQueue {
    constructor() {
        this._newest = null;
        this._oldest = null;
        this._size = 0;
    }

    _createNode(value, next) {
        return [value, next];
    }

    enqueue(item) {
        if (this._size === 0) {
            this._newest = this._createNode(item, null);
            this._oldest = this._newest
            this._size = 1
            return;
        }
        const temp = this._createNode(item, null);
        this._newest[NEXT] = temp;
        this._newest = temp;
        this._size++;
    }

    size() {
        return this._size;
    }

    dequeue() {
        if (this._size === 0) {
            throw new Error('cannot dequeue from an empty queue');
        }
        const oldest = this._oldest;
        const result = oldest[VALUE];
        oldest[VALUE] = null;
        this._oldest = oldest[NEXT];
        this._size--;
        return result;
    }

    peekNewest() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._newest[VALUE];
    }

    peekOldest() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._oldest[VALUE];
    }

    [Symbol.iterator]() {
        let itOldest = this._oldest;
        return {
            next: function () {
                if (itOldest === null) {
                    return {done: true};
                } else {
                    const result = {done: false, value: itOldest[VALUE]};
                    itOldest = itOldest[NEXT];
                    return result;
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

    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        const arr = new Array(this.size());
        this.copyTo(arr, 0);
        return arr;
    }
}

module.exports = { LinkedQueue: LinkedQueue }