const { LinkedQueue } = require('./LinkedQueue')
const { CyclicQueue } = require('./CyclicQueue')

class ChunkedQueue {
    constructor(chunkSize) {
        if (chunkSize === undefined) {
            chunkSize = 64;
        }
        if (typeof chunkSize !== 'number') {
            throw new Error(`chunkSize must a number`);
        }
        chunkSize = Math.floor(chunkSize);
        if (chunkSize <= 0) {
            throw new Error(`chunkSize must be positive (current value is ${chunkSize})`);
        }
        this._queue = new LinkedQueue();
        this._chunkSize = chunkSize;
    }

    clear() {
        this._queue.clear();
    }

    enqueue(item) {
        if (this._queue.size() === 0) {
            this._queue.enqueue(new CyclicQueue(this._chunkSize));
        }
        let newestChunk = this._queue.peekLast();
        if (newestChunk.size() === this._chunkSize) {
            newestChunk = new CyclicQueue(this._chunkSize);
            this._queue.enqueue(newestChunk);
        }
        newestChunk.enqueue(item);
    }

    dequeue() {
        let oldestChunk = this._queue.peekFirst();
        const result = oldestChunk.dequeue();
        if (oldestChunk.size() === 0) {
            this._queue.dequeue();
        }
        return result;
    }

    size() {
        const size = this._queue.size();
        switch (size) {
            case 0:
                return 0;
            case 1:
                return this._queue.peekLast().size();
            default:
                const newestSize = this._queue.peekLast().size();
                const oldestSize = this._queue.peekFirst().size();
                const innerSize = (size - 2) * this._chunkSize;
                return newestSize + oldestSize + innerSize;
        }
    }

    peekLast() {
        if (this.size() === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._queue.peekLast().peekLast();
    }

    peekFirst() {
        if (this.size() === 0) {
            throw new Error('cannot peek from an empty queue');
        }
        return this._queue.peekFirst().peekFirst();
    }

    [Symbol.iterator]() {
        const queue = this._queue;
        function* generator() {
            for (let chunk of queue) {
                for (let v of chunk) {
                    yield v;
                }
            }
        }

        return generator();
    }

    drainingIterator () {
        const queue = this._queue;
        function* generator() {
            for (let chunk of queue.drainingIterator()) {
                for (let v of chunk.drainingIterator()) {
                    yield v;
                }
            }
        }

        return generator();
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

    toJSON() {
        const arr = new Array(this.size());
        this.copyTo(arr);
        return arr;
    }
}

module.exports = { ChunkedQueue };
