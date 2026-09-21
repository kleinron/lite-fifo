import {
  BoundedQueueInterface,
  ChunkedQueue,
  CyclicQueue,
  DynamicArrayQueue,
  DynamicCyclicQueue,
  LinkedQueue,
  QueueInterface
} from 'lite-fifo';

const chunked = new ChunkedQueue<number>();
chunked.enqueue(1);
chunked.enqueue(2);
const dequeued: number = chunked.dequeue();
const peeked: number = chunked.peek();
const size: number = chunked.size();
const json: string = chunked.toJSON();
const asArray: number[] = chunked.toArray();
const empty: boolean = chunked.isEmpty();
chunked.copyTo(asArray);
chunked.clear();

void dequeued;
void peeked;
void size;
void json;
void empty;

function takeQueue (queue: QueueInterface<string>): void {
  queue.enqueue('a');
  const first: string = queue.peek();
  const values: string[] = queue.toArray();
  void first;
  void values;
}

takeQueue(new ChunkedQueue<string>());
takeQueue(new LinkedQueue<string>());
takeQueue(new DynamicArrayQueue<string>());
takeQueue(new DynamicCyclicQueue<string>());
takeQueue(new CyclicQueue<string>(8));

function takeBounded (queue: BoundedQueueInterface<number>): number {
  queue.enqueue(1);
  return queue.capacity();
}

const cyclic = new CyclicQueue<number>(8);
const capacity: number = takeBounded(cyclic);
void capacity;

for (const item of chunked) {
  const n: number = item;
  void n;
}

for (const item of chunked.drainingIterator()) {
  const n: number = item;
  void n;
}

// @ts-expect-error unbounded queues are not BoundedQueueInterface
const notBounded: BoundedQueueInterface<number> = new ChunkedQueue<number>();
void notBounded;
