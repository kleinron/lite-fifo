const {bindMethods} = require("./util");

class LinkedQueue {
    constructor() {
        bindMethods.call(this);
        this.clear();
    }

    clear() {
        this._newest = null;
        this._oldest = null;
        this._size = 0;
    }

    enqueue(item) {
        if (this._size === 0) {
            this._newest = {value: item, next: null};
            this._oldest = this._newest;
        } else {
            const temp = {value: item, next: null};
            this._newest.next = temp;
            this._newest = temp;
        }
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
        const result = oldest.value;
        this._oldest = oldest.next;
        oldest.value = oldest.next = null;
        this._size--;
        return result;
    }

    peekLast() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._newest.value;
    }

    peekFirst() {
        if (this._size === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._oldest.value;
    }

    [Symbol.iterator]() {
        let itOldest = this._oldest;
        return {
            next: function () {
                if (itOldest === null) {
                    return {done: true};
                } else {
                    const result = {done: false, value: itOldest.value};
                    itOldest = itOldest.next;
                    return result;
                }
            }
        }
    }

    copyTo(arr, startIndex) {
        if (startIndex === undefined) {
            startIndex = 0;
        }
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
        return this.toArray();
    }
}

module.exports = { LinkedQueue: LinkedQueue }
