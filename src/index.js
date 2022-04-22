const { ChunkedQueue } = require('./ChunkedQueue');
const { CyclicQueue } = require('./CyclicQueue');
const { DynamicArrayQueue } = require('./DynamicArrayQueue');
const { DynamicCyclicQueue } = require('./DynamicCyclicQueue');
const { LinkedQueue } = require('./LinkedQueue');

module.exports = {
  ChunkedQueue: ChunkedQueue,
  DynamicArrayQueue: DynamicArrayQueue,
  DynamicCyclicQueue: DynamicCyclicQueue,
  LinkedQueue: LinkedQueue,
  CyclicQueue: CyclicQueue
};
