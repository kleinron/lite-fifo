/**
 * A high-performance queue implementation using linked chunks of cyclic queues.
 * Provides excellent memory efficiency with reasonable throughput.
 *
 * @template T The type of items stored in the queue
 */
export class ChunkedQueue<T> {
    /**
     * @param {number} [chunkSize=1024] Size of each internal chunk
     */
    constructor(chunkSize?: number | undefined);
    /** @private */
    private _queue;
    /** @private */
    private _chunkSize;
    /**
     * Clear the queue.
     * @returns {void}
     */
    clear(): void;
    /**
     * Add an item to the queue.
     * @param {T} item The item to add
     * @returns {void}
     */
    enqueue(item: T): void;
    /**
     * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
     * @returns {T} The dequeued item
     * @throws {Error} If the queue is empty
     */
    dequeue(): T;
    /**
     * Return the current size of the queue.
     * @returns {number}
     */
    size(): number;
    /**
     * Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.
     * @returns {T} The oldest item
     * @throws {Error} if the queue is empty
     */
    peekFirst(): T;
    /**
     * Return the oldest item without removing it from the queue.
     * This is an alias for peekFirst() and the standard queue peek operation.
     * @returns {T} The oldest item
     * @throws {Error} if the queue is empty
     */
    peek(): T;
    /**
     * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
     * @returns {T} The newest item
     * @throws {Error} if the queue is empty
     */
    peekLast(): T;
    /**
     * Check if the queue is empty.
     * @returns {boolean} True if the queue is empty
     */
    isEmpty(): boolean;
    /**
     * Iterate over the items in the queue.
     * Every iterated item is removed from the queue.
     * Iteration order is the insertion order: first inserted item would be returned first.
     *
     * @example
     * const queue = new ChunkedQueue();
     * queue.enqueue(123);
     * queue.enqueue(45);
     * for (let item of queue.drainingIterator()) {
     *   console.log(item);
     * }
     * console.log(`size = ${queue.size()}`);
     * // ==> output would be:
     * // 123
     * // 45
     * // size = 0
     *
     * @returns {Generator<T, void, unknown>}
     */
    drainingIterator(): Generator<T, void, unknown>;
    /**
     * Copy the items of the queue to the given array arr, starting from index startIndex.
     * First item in the array is first item inserted to the queue, and so forth.
     * @param {T[]} arr The target array
     * @param {number} [startIndex=0] Starting index in the array
     * @returns {void}
     */
    copyTo(arr: T[], startIndex?: number | undefined): void;
    /**
     * Create an array with the same size as the queue, populate it with the items in the queue, keeping the iteration order, and return it.
     * @returns {T[]} Array containing all queue items
     */
    toArray(): T[];
    /**
     * Return a JSON representation (as a string) of the queue.
     * The queue is represented as an array: first item in the array is the first one inserted to the queue and so forth.
     * @returns {string} JSON string representation
     */
    toJSON(): string;
    /**
     * Iterate over the items in the queue without changing the queue.
     * Iteration order is the insertion order: first inserted item would be returned first.
     * In essence this supports JS iterations of the pattern `for (let x of queue) { ... }.`
     *
     * @example
     * const queue = new ChunkedQueue();
     * queue.enqueue(123);
     * queue.enqueue(45);
     * for (let item of queue) {
     *   console.log(item);
     * }
     * // ==> output would be:
     * // 123
     * // 45
     * // and the queue would remain unchanged
     *
     * @returns {Generator<T, void, unknown>}
     */
    [Symbol.iterator](): Generator<T, void, unknown>;
}
//# sourceMappingURL=ChunkedQueue.d.ts.map