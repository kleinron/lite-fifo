/**
 * @fileoverview Interface definitions for queue implementations
 */

/**
 * Common interface for all queue implementations
 * @typedef {Object} QueueInterface
 * @template T The type of items stored in the queue
 * @property {function(T): void} enqueue - Add an item to the queue
 * @property {function(): T} dequeue - Remove and return the oldest item from the queue
 * @property {function(): number} size - Return the current size of the queue
 * @property {function(): void} clear - Clear all items from the queue
 * @property {function(): T} peek - Return the oldest item without removing it
 * @property {function(): boolean} isEmpty - Check if the queue is empty
 * @property {function(): T[]} toArray - Convert queue to array
 * @property {function(): string} toJSON - Serialize queue to JSON
 * @property {function(T[], number=): void} copyTo - Copy queue items to an array
 */

/**
 * Interface for bounded queues that have a maximum capacity
 * @typedef {QueueInterface<T> & {capacity: function(): number}} BoundedQueueInterface
 * @template T The type of items stored in the queue
 */

module.exports = {};
