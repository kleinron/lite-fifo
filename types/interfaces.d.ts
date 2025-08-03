/**
 * Common interface for all queue implementations
 */
export type QueueInterface = any;
/**
 * Interface for bounded queues that have a maximum capacity
 */
export type BoundedQueueInterface<T> = QueueInterface<T> & {
    capacity: () => number;
};
//# sourceMappingURL=interfaces.d.ts.map