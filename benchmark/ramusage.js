const { LinkedQueue } = require('../src/LinkedQueue');
const { ChunkedQueue } = require('../src/ChunkedQueue');
const { CyclicQueue } = require('../src/CyclicQueue');
const { DynamicArrayQueue } = require('../src/DynamicArrayQueue');
const { DynamicCyclicQueue } = require('../src/DynamicCyclicQueue');
const MnemonistQueue = require('mnemonist/queue');
const { Queue: DsaJsQueue } = require('dsa.js');
const { Queue: EfficientDataStructuresQueue } = require('efficient-data-structures');
const { Queue: DatastructuresJsQueue } = require('@datastructures-js/queue');

function main (className, chunkSize, counts) {
  let cls;
  switch (className.toLowerCase()) {
    case 'DatastructuresJsQueue'.toLowerCase():
      cls = () => new DatastructuresJsQueue();
      break;
    case 'MnemonistQueue'.toLowerCase():
      cls = () => new MnemonistQueue();
      break;
    case 'EfficientDataStructuresQueue'.toLowerCase():
      cls = () => new EfficientDataStructuresQueue();
      break;
    case 'DsaJsQueue'.toLowerCase():
      cls = () => new DsaJsQueue();
      break;
    case 'LinkedQueue'.toLowerCase():
      cls = () => new LinkedQueue();
      break;
    case 'ChunkedQueue'.toLowerCase():
      cls = () => new ChunkedQueue(chunkSize);
      break;
    case 'CyclicQueue'.toLowerCase():
      cls = () => new CyclicQueue(chunkSize);
      break;
    case 'DynamicArrayQueue'.toLowerCase():
      cls = () => new DynamicArrayQueue();
      break;
    case 'DynamicCyclicQueue'.toLowerCase():
      cls = () => new DynamicCyclicQueue(chunkSize);
      break;
    default:
      throw new Error(`no matching class found for class ${className}`);
  }
  const memoryUsage1 = process.memoryUsage();
  const queue = cls();
  const start = +new Date();
  let opIndex = 1;
  for (let i = 0; i < counts.length; i++) {
    const count = counts[i];
    opIndex = 1 - opIndex;
    if (opIndex === 0) { // enqueue
      for (let i = 0; i < count; i++) {
        queue.enqueue(88776655);
      }
    } else {
      for (let i = 0; i < count; i++) {
        queue.dequeue();
      }
    }
  }
  const stop = +new Date();
  const memoryUsage2 = process.memoryUsage();
  const diff = Object.entries(memoryUsage2)
    .reduce((agg, [k, v]) => {
      agg[k] = v - memoryUsage1[k];
      return agg;
    }, {});
  diff.time = stop - start;
  diff.opsPerSec = counts.reduce((agg, v) => { return agg + v; }, 0) / diff.time;
  console.log(JSON.stringify(diff));
}

let className = process.argv[2];
let chunkSize;
if (className.includes('-')) {
  const tokens = className.split('-');
  className = tokens[0];
  chunkSize = Number.parseInt(tokens[1]);
}
const counts = process.argv.slice(3).map(x => Number.parseInt(x));
main(className, chunkSize, counts);
