const { LinkedQueue } = require('../../src/LinkedQueue');
const assert = require('assert');

function randomNumber() {
    return Math.floor(Math.random() * 50);
}

describe('LinkedQueue', () => {
    it('can construct', () => {
        new LinkedQueue();
    });

    it('dequeue returns the enqueued value', () => {
        const queue = new LinkedQueue();
        const number = randomNumber();
        queue.enqueue(number);
        assert.strictEqual(queue.dequeue(), number);
    });

    it('multiple dequeues returns the enqueued values', () => {
        const queue = new LinkedQueue();
        const numbers = [];
        const n = 1 + randomNumber();
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        while (queue.size() !== 0) {
            dequeued.push(queue.dequeue());
        }
        assert.deepStrictEqual(dequeued, numbers);
    });

    it('raises an exception when trying to dequeue from an empty queue', () => {
        const queue = new LinkedQueue();
        const numbers = [];
        const n = randomNumber();
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        while (queue.size() !== 0) {
            queue.dequeue();
        }
        assert.throws(queue.dequeue);
    });

    describe('size', () => {
        it('new instance returns 0', () => {
            assert.strictEqual(new LinkedQueue().size(), 0);
        });

        it('after enqueue returns 1', () => {
            const queue = new LinkedQueue();
            queue.enqueue(123);
            assert.strictEqual(queue.size(), 1);
        });

        it('after N enqueues returns N', () => {
            const n = randomNumber();
            const queue = new LinkedQueue();
            for (let i = 0; i < n; i++) {
                queue.enqueue(randomNumber());
            }

            assert.strictEqual(queue.size(), n);
        });

        it('after N enqueues and K dequeues returns N - K', () => {
            const n = 1 + randomNumber();
            const k = Math.floor(Math.random() * n);
            const queue = new LinkedQueue();
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
        const queue = new LinkedQueue();
        const numbers = [];
        const n = randomNumber();
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const queueAsJson = JSON.stringify(queue);
        assert.strictEqual(queueAsJson, JSON.stringify(numbers));
    });

    it('iterates over an empty queue', () => {
        const queue = new LinkedQueue();
        for (let item of queue) {
            assert.fail("should not have any item");
        }
    });

    it('iterates oldest to newest', () => {
        const queue = new LinkedQueue();
        const numbers = [];
        const n = randomNumber();
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        for (let item of queue) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
    });

    it('draining oldest to newest', () => {
        const queue = new LinkedQueue();
        const numbers = [];
        const n = randomNumber();
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const dequeued = [];
        for (let item of queue.drainingIterator()) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
        assert.strictEqual(queue.size(), 0);
    });
});