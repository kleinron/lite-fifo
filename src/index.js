const { ChunkedQueue } = require('./ChunkedQueue');
const { CyclicQueue } = require('./CyclicQueue');
const { DynamicArrayQueue } = require('./DynamicArrayQueue');
const { DynamicCyclicQueue } = require('./DynamicCyclicQueue');
const { LinkedQueue } = require('./LinkedQueue');

/**
 * @template T
 * @typedef {import('./interfaces').QueueInterface<T>} QueueInterface
 */

/**
 * @template T
 * @typedef {import('./interfaces').BoundedQueueInterface<T>} BoundedQueueInterface
 */

module.exports = {
  ChunkedQueue,
  DynamicArrayQueue,
  DynamicCyclicQueue,
  LinkedQueue,
  CyclicQueue
};
