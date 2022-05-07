/**
 * @type ChunkedQueue
 */
export class ChunkedQueue {
    /**
     * @param {number} [chunkSize]
     * @returns {ChunkedQueue}
     */
    constructor(chunkSize?: number);
    _queue: any;
    _chunkSize: any;
    /**
     * Clear the queue.
     * @returns {void}
     */
    clear(): void;
    /**
     * Add an item to the queue.
     * @param {any} item
     * @returns {void}
     */
    enqueue(item: any): void;
    /**
     * Return the first inserted (or the "oldest") item in the queue, and removes it from the queue.
     * @returns {any}
     */
    dequeue(): any;
    /**
     * Return the current size of the queue.
     * @returns {number}
     */
    size(): number;
    /**
     * Return the last inserted (or the "newest") item in the queue, without removing it from the queue.
     * @returns {any}
     * @throws {Error} if the queue is empty
     */
    peekLast(): any;
    /**
     * Return the first inserted (or the "oldest") item in the queue, without removing it from the queue.
     * @returns {any}
     * @throws {Error} if the queue is empty
     */
    peekFirst(): any;
    /**
     * Iterate over the items in the queue.
     * Every iterated item is removed from the queue.
     * Iteration order is the insertion order: first inserted item would be returned first.
     *
     * @example
     * const queue = new DynamicArrayQueue();
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
     * @returns {Generator<any, void, ?>}
     */
    drainingIterator(): Generator<any, void, unknown>;
    /**
     * Copy the items of the queue to the given array arr, starting from index startIndex.
     * First item in the array is first item inserted to the queue, and so forth.
     * @param {any[]} arr
     * @param {number} [startIndex=0]
     * @returns {void}
     */
    copyTo(arr: any[], startIndex?: number): void;
    /**
     * Create an array with the same size as the queue, populate it with the items in the queue, keeping the iteration order, and return it.
     * @returns {any[]}
     */
    toArray(): any[];
    /**
     * Return a JSON representation (as a string) of the queue.
     * The queue is represented as an array: first item in the array is the first one inserted to the queue and so forth.
     * @returns {string}
     */
    toJSON(): string;
    /**
     * Iterate over the items in the queue without changing the queue.
     * Iteration order is the insertion order: first inserted item would be returned first.
     * In essence this supports JS iterations of the pattern `for (let x of queue) { ... }.`
     *
     * @example
     * const queue = new DynamicArrayQueue();
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
     * @returns {Generator<any, void, ?>}
     */
    [Symbol.iterator](): Generator<any, void, unknown>;
}
//# sourceMappingURL=ChunkedQueue.d.ts.map