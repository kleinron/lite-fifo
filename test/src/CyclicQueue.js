const { CyclicQueue } = require('../../src/CyclicQueue');
const assert = require('assert');

function randomNumber() {
    return Math.floor(Math.random() * 50);
}

function randomPositiveNumber() {
    return 1 + Math.floor(Math.random() * 50);
}

describe('CyclicQueue', () => {
    // before('global_random_seed', () => {
    //     const now = new Date().toISOString();
    //     console.log(`seed = ${now}`);
    //     seedrandom(now, { global: true });
    //
    // });

    it('can construct', () => {
        new CyclicQueue();
    });

    it('dequeue returns the enqueued value', () => {
        const queue = new CyclicQueue();
        const number = randomNumber();
        queue.enqueue(number);
        assert.strictEqual(queue.dequeue(), number);
    });

    it('multiple dequeues returns the enqueued values', () => {
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
        const numbers = [];
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

    it('raises an exception when trying to enqueue to a full capacity queue', () => {
        const queue = new CyclicQueue(2);
        queue.enqueue(randomNumber());
        queue.enqueue(randomNumber());
        assert.throws(() => queue.enqueue(12345));
    });

    it('raises an exception when trying to dequeue from an empty queue', () => {
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
        const numbers = [];
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
            assert.strictEqual(new CyclicQueue().size(), 0);
            assert.strictEqual(new CyclicQueue(1 + randomNumber()).size(), 0);
        });

        it('after enqueue returns 1', () => {
            const queue = new CyclicQueue();
            queue.enqueue(123);
            assert.strictEqual(queue.size(), 1);
        });

        it('after N enqueues returns N', () => {
            const n = randomPositiveNumber();
            const queue = new CyclicQueue(n);
            for (let i = 0; i < n; i++) {
                queue.enqueue(randomNumber());
            }

            assert.strictEqual(queue.size(), n);
        });

        it('after N enqueues and K dequeues returns N - K', () => {
            const n = randomPositiveNumber();
            const k = Math.floor(Math.random() * n);
            const queue = new CyclicQueue(n);
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
        const numbers = [];
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const queueAsJson = JSON.stringify(queue);
        assert.strictEqual(queueAsJson, JSON.stringify(numbers));
    });

    it('iterates over an empty queue', () => {
        const queue = new CyclicQueue();
        for (let item of queue) {
            assert.fail("should not have any item");
        }
    });

    it('iterates oldest to newest', () => {
        const numbers = [];
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
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

    it('draining iterator oldest to newest', () => {
        const numbers = [];
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
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

    it('iterates oldest to newest after a few dequeues', () => {
        const numbers = [];
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
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

    it('drain iterator oldest to newest after a few dequeues', () => {
        const numbers = [];
        const n = randomPositiveNumber();
        const queue = new CyclicQueue(n);
        for (let i = 0; i < n; i++) {
            numbers[i] = randomNumber();
        }
        numbers.forEach(number => queue.enqueue(number));
        const k = Math.floor(Math.random() * n);
        for (let i = 0; i < k; i++) {
            numbers.shift();
            queue.dequeue();
        }
        const dequeued = [];
        for (let item of queue.drainingIterator()) {
            dequeued.push(item);
        }
        assert.deepStrictEqual(dequeued, numbers);
        assert.strictEqual(queue.size(), 0);
    });
});