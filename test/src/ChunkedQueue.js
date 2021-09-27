const seedrandom = require('seedrandom');
const { ChunkedQueue } = require('../../src/ChunkedQueue');
const assert = require('assert');

function randomNumber() {
    return Math.floor(Math.random() * 50);
}

function randomNumbers(n) {
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = randomNumber();
    }
    return arr;
}

describe('ChunkedQueue', () => {
    before('global_random_seed', () => {
        const now = new Date().toISOString();
        console.log(`seed = ${now}`);
        seedrandom(now, { global: true });

    });

    it('can construct', () => {
        new ChunkedQueue();
    });

    it('dequeue returns the enqueued value', () => {
        const queue = new ChunkedQueue();
        const number = randomNumber();
        queue.enqueue(number);
        assert.strictEqual(queue.dequeue(), number);
    });

    it('multiple dequeues returns the enqueued values', () => {
        const n = 1 + randomNumber();
        const queue = new ChunkedQueue();
        const numbers = randomNumbers(n);
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        while (queue.size() !== 0) {
            dequeued.push(queue.dequeue());
        }
        assert.deepStrictEqual(dequeued, numbers);
    });

    it('raises an exception when trying to dequeue from an empty queue', () => {
        const n = randomNumber();
        const queue = new ChunkedQueue(n);
        const numbers = randomNumbers(n);
        numbers.forEach(number => queue.enqueue(number));
        while (queue.size() !== 0) {
            queue.dequeue();
        }
        assert.throws(queue.dequeue);
    });

    describe('size', () => {
        it('new instance returns 0', () => {
            assert.strictEqual(new ChunkedQueue().size(), 0);
            assert.strictEqual(new ChunkedQueue(1 + randomNumber()).size(), 0);
        });

        it('after enqueue returns 1', () => {
            const queue = new ChunkedQueue();
            queue.enqueue(123);
            assert.strictEqual(queue.size(), 1);
        });

        it('after N enqueues returns N', () => {
            const n = randomNumber();
            const chunkSize = 1 + randomNumber();
            const queue = new ChunkedQueue(chunkSize);
            for (let i = 0; i < n; i++) {
                queue.enqueue(randomNumber());
            }

            assert.strictEqual(queue.size(), n);
        });

        it('after N enqueues and K dequeues returns N - K', () => {
            const n = 1 + randomNumber();
            const k = Math.floor(Math.random() * n);
            const chunkSize = 1 + randomNumber();
            const queue = new ChunkedQueue(chunkSize);
            for (let i = 0; i < n; i++) {
                const item = randomNumber();
                queue.enqueue(item);
            }
            for (let i = 0; i < k; i++) {
                queue.dequeue();
            }

            assert.strictEqual(queue.size(), n - k);
        });
    });

    it('converts to json as an array', () => {
        const n = randomNumber();
        const numbers = randomNumbers(n);
        const chunkSize = 1 + randomNumber();
        const queue = new ChunkedQueue(chunkSize);
        numbers.forEach(number => queue.enqueue(number));
        const queueAsJson = JSON.stringify(queue);
        assert.strictEqual(queueAsJson, JSON.stringify(numbers));
    });

    it('iterates over an empty queue', () => {
        const chunkSize = 1 + randomNumber();
        const queue = new ChunkedQueue(chunkSize);
        for (let item of queue) {
            assert.fail("should not have any item");
        }
    });

    it('iterates oldest to newest', () => {
        const n = randomNumber();
        const numbers = randomNumbers(n);
        const chunkSize = 1 + randomNumber();
        const queue = new ChunkedQueue(chunkSize);
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        for (let item of queue) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
    });

    it('draining iterator oldest to newest', () => {
        const n = randomNumber();
        const numbers = randomNumbers(n);
        const chunkSize = 1 + randomNumber();
        const queue = new ChunkedQueue(chunkSize);
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        for (let item of queue.drainingIterator()) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
        assert.strictEqual(queue.size(), 0);
    });

    it('iterates oldest to newest after a few dequeues', () => {
        const n = 1 + randomNumber();
        const numbers = randomNumbers(n);
        const chunkSize = 1 + randomNumber();
        const queue = new ChunkedQueue(chunkSize);
        numbers.forEach(number => queue.enqueue(number));
        const k = Math.floor(Math.random() * n);
        for (let i = 0; i < k; i++) {
            numbers.shift();
            queue.dequeue();
        }
        const dequeued = [];
        for (let item of queue) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
    });
});