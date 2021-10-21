const { LinkedQueue } = require('../../src/LinkedQueue');
const { ChunkedQueue } = require('../../src/ChunkedQueue');
const { CyclicQueue } = require('../../src/CyclicQueue');
const { DynamicArrayQueue } = require('../../src/DynamicArrayQueue');
const assert = require('assert');

function randomNumber(limit) {
    return Math.floor(Math.random() * (limit ? limit : 50));
}

describe('Common API for all implementations', () => {
    const randomChunkSize = 1 + randomNumber();
    const randomCapacity = 1 + randomNumber(10000);
    const queueFactories = [
        { name: 'LinkedQueue', create: () => new LinkedQueue() },
        { name: 'DynamicArrayQueue', create: () => new DynamicArrayQueue() },
        { name: 'ChunkedQueue()', create: () => new ChunkedQueue() },
        { name: 'ChunkedQueue(1)', create: () => new ChunkedQueue(1) },
        { name: 'ChunkedQueue(2)', create: () => new ChunkedQueue(2) },
        { name: 'ChunkedQueue(300)', create: () => new ChunkedQueue(300) },
        { name: `ChunkedQueue(${randomChunkSize})`, create: () => new ChunkedQueue(randomChunkSize) },
        { name: 'CyclicQueue()', create: () => new CyclicQueue() },
        { name: 'CyclicQueue(1)', create: () => new CyclicQueue(1) },
        { name: 'CyclicQueue(2)', create: () => new CyclicQueue(2) },
        { name: 'CyclicQueue(300)', create: () => new CyclicQueue(300) },
        { name: `CyclicQueue(${randomCapacity})`, create: () => new CyclicQueue(randomCapacity) },
    ];

    for (let queueFactory of queueFactories) {
        const name = queueFactory.name;
        describe(name, () => {
            it('can construct', () => {
                queueFactory.create();
            });

            it('dequeue returns the enqueued value', () => {
                const queue = queueFactory.create();
                const number = randomNumber();
                queue.enqueue(number);
                assert.strictEqual(queue.dequeue(), number);
            });

            it('multiple dequeues returns the enqueued values', () => {
                const queue = queueFactory.create();
                const numbers = [];
                const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
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
                const queue = queueFactory.create();
                const numbers = [];
                const n = randomNumber(queue.capacity ? queue.capacity() : undefined);
                for (let i = 0; i < n; i++) {
                    numbers[i] = randomNumber();
                }
                numbers.forEach(queue.enqueue);
                while (queue.size() !== 0) {
                    queue.dequeue();
                }
                assert.throws(queue.dequeue);
            });

            describe('peekFirst', () => {
                it('raises an exception on an empty queue', () => {
                    const queue = queueFactory.create();
                    assert.throws(queue.peekFirst);
                });

                it('returns the first item after a single enqueue action', () => {
                    const queue = queueFactory.create();
                    queue.enqueue(123);
                    assert.strictEqual(queue.peekFirst(), 123);
                });

                it('returns the first item after several enqueue actions', () => {
                    const queue = queueFactory.create();
                    const number = randomNumber(600);
                    queue.enqueue(number);

                    const n = randomNumber(queue.capacity ? queue.capacity() : undefined);
                    for (let i = 0; i < n; i++) {
                        queue.enqueue(randomNumber());
                    }
                    assert.strictEqual(queue.peekFirst(), number);
                });

                it('returns the first item after enqueue-dequeue-enqueue', () => {
                    const queue = queueFactory.create();
                    const number1 = randomNumber(600);
                    queue.enqueue(number1);
                    queue.dequeue();
                    const number2 = randomNumber(600);
                    queue.enqueue(number2);

                    assert.strictEqual(queue.peekFirst(), number2);
                });

            });

            describe('peekLast', () => {
                it('raises an exception on an empty queue', () => {
                    const queue = queueFactory.create();
                    assert.throws(queue.peekLast);
                });

                it('returns the last item after a single enqueue action', () => {
                    const queue = queueFactory.create();
                    queue.enqueue(123);
                    assert.strictEqual(queue.peekLast(), 123);
                });

                it('returns the last item after several enqueue actions', () => {
                    const queue = queueFactory.create();
                    const numbers = [];
                    const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
                    for (let i = 0; i < n; i++) {
                        numbers[i] = randomNumber();
                    }

                    numbers.forEach(num => queue.enqueue(num));

                    assert.strictEqual(queue.peekLast(), numbers[numbers.length - 1]);
                });

                it('returns the last item after enqueue-dequeue-enqueue', () => {
                    const queue = queueFactory.create();
                    const number1 = randomNumber(600);
                    queue.enqueue(number1);
                    queue.dequeue();
                    const number2 = randomNumber(600);
                    queue.enqueue(number2);

                    assert.strictEqual(queue.peekLast(), number2);
                });

            });

            describe('size', () => {
                it('new instance returns 0', () => {
                    assert.strictEqual(queueFactory.create().size(), 0);
                });

                it('after enqueue returns 1', () => {
                    const queue = queueFactory.create();
                    queue.enqueue(123);
                    assert.strictEqual(queue.size(), 1);
                });

                it('after N enqueues returns N', () => {
                    const queue = queueFactory.create();
                    const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
                    for (let i = 0; i < n; i++) {
                        queue.enqueue(randomNumber());
                    }

                    assert.strictEqual(queue.size(), n);
                });

                it('after N enqueues and K dequeues returns N - K', () => {
                    const queue = queueFactory.create();
                    const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));                    const k = Math.floor(Math.random() * n);
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

            describe('clear', () => {
                it('clears a new instance', () => {
                    const queue = queueFactory.create();
                    queue.clear();
                    assert.strictEqual(queue.size(), 0);
                });

                it('clears after enqueue', () => {
                    const queue = queueFactory.create();
                    queue.enqueue(123);
                    queue.clear();
                    assert.strictEqual(queue.size(), 0);
                });
            });

            it('converts to json as an array', () => {
                const queue = queueFactory.create();
                const numbers = [];
                const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
                for (let i = 0; i < n; i++) {
                    numbers[i] = randomNumber();
                }
                numbers.forEach(queue.enqueue);
                const queueAsJson = JSON.stringify(queue);
                assert.strictEqual(queueAsJson, JSON.stringify(numbers));
            });

            it('iterates over an empty queue', () => {
                const queue = queueFactory.create();
                for (let item of queue) {
                    assert.fail("should not have any item");
                }
            });

            it('clears after N enqueues and K dequeues', () => {
                const queue = queueFactory.create();
                const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));                    const k = Math.floor(Math.random() * n);
                for (let i = 0; i < n; i++) {
                    const item = randomNumber();
                    queue.enqueue(item);
                }
                for (let i = 0; i < k; i++) {
                    queue.dequeue();
                }
                queue.clear();
                assert.strictEqual(queue.size(), 0);
            });

            it('iterates oldest to newest', () => {
                const queue = queueFactory.create();
                const numbers = [];
                const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
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
                const queue = queueFactory.create();
                const numbers = [];
                const n = Math.max(1, randomNumber(queue.capacity ? queue.capacity() : undefined));
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

            if (queueFactory.create().capacity) {
                it('raises an exception when trying to enqueue to a full capacity queue', () => {
                    const queue = queueFactory.create();
                    for (let i = 0; i < queue.capacity(); i++) {
                        queue.enqueue(randomNumber());
                    }
                    assert.throws(() => queue.enqueue(12345));
                });
            }
        });
    }
});
