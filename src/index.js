const { ChunkedQueue } = require('./ChunkedQueue');
const { CyclicQueue } = require('./CyclicQueue');
const { DynamicArrayQueue } = require('./DynamicArrayQueue');
const { DynamicCyclicQueue } = require('./DynamicCyclicQueue');
const { LinkedQueue } = require('./LinkedQueue');

module.exports = {
  ChunkedQueue,
  DynamicArrayQueue,
  DynamicCyclicQueue,
  LinkedQueue,
  CyclicQueue
};
