/**
 * Common interface for all queue implementations.
 *
 * Implementations may expose additional methods (for example `peekFirst`,
 * `peekLast`, iterators). Those extras are not part of this contract.
 */
export interface QueueInterface<T> {
    /** Add an item to the queue. */
    enqueue(item: T): void;
    /** Remove and return the oldest item from the queue. */
    dequeue(): T;
    /** Return the current size of the queue. */
    size(): number;
    /** Clear all items from the queue. */
    clear(): void;
    /** Return the oldest item without removing it. */
    peek(): T;
    /** Check if the queue is empty. */
    isEmpty(): boolean;
    /** Convert queue to array (oldest item first). */
    toArray(): T[];
    /** Serialize queue to JSON (`JSON.stringify(this.toArray())`). */
    toJSON(): string;
    /** Copy queue items to an array, starting at `startIndex` (default 0). */
    copyTo(arr: T[], startIndex?: number): void;
}
/**
 * Interface for bounded queues that have a maximum capacity.
 */
export interface BoundedQueueInterface<T> extends QueueInterface<T> {
    /** Return the maximum number of items the queue can hold. */
    capacity(): number;
}
//# sourceMappingURL=interfaces.d.ts.map