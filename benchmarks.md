# Benchmarks

## Hardware
All benchmarks were executed on a [MacBook Pro A2251](https://support.apple.com/en-il/111339)

## Implementations being tested

The following implementations are tested in the benchmarks:

| Project                                                                                                                                            | Class              | Symbol                       |
|----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|------------------------------|
| lite-fifo 0.3.4 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | ChunkedQueue       | ChunkedQueue                 |
| lite-fifo 0.3.4 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | DynamicCyclicQueue | DynamicCyclicQueue           |
| lite-fifo 0.3.4 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | LinkedQueue        | LinkedQueue                  |
| @datastructures-js/queue 4.2.3 ([npm](https://www.npmjs.com/package/@datastructures-js/queue), [code](https://github.com/datastructures-js/queue)) | Queue              | DatastructuresJsQueue        |
| mnemonist 0.39.8 ([npm](https://www.npmjs.com/package/mnemonist), [code](https://github.com/yomguithereal/mnemonist))                              | Queue              | MnemonistQueue               |
| efficient-data-structures 0.1.310 ([npm](https://www.npmjs.com/package/efficient-data-structures), no repo)                                        | Queue              | EfficientDataStructuresQueue |
| dsa.js 2.7.6 ([npm](https://www.npmjs.com/package/dsa.js), [code](https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript))  | Queue              | DsaJsQueue                   |

## Excluded implementations

The following implementations are array based, using its `push` and `shift` methods.

These implementations do not scale, as `shift` has an O(n) time complexity, and are therefore excluded.

| Project                                                                                                                                                              | Class / Function |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| @supercharge/queue-datastructure ([npm](https://www.npmjs.com/package/@supercharge/queue-datastructure), [code](https://github.com/supercharge/queue-datastructure)) | Queue            |                           
| js-data-structs ([npm](https://www.npmjs.com/package/js-data-structs), [code](https://github.com/Aveek-Saha/js-data-structs))                                        | Queue            |                           
| light-queue ([npm](https://www.npmjs.com/package/light-queue), [code](https://github.com/mmujic/light-queue))                                                        | Queue            |                           

## Scenarios

Each benchmark scenario has its own chart to easily visualize what it tests. 

### buffer then gradually decrease

Enqueue a lot of items, then dequeue rate > enqueue rate, so gradually remove the items.

![](/benchmark/images/buffer-then-gradually-decrease.png)

RAM usage

| Implementation name          | RAM usage |
| :--------------------------- | --------: |
| ChunkedQueue                 |  28245214 |
| DynamicCyclicQueue           |  89227384 |
| EfficientDataStructuresQueue | 100237005 |
| DsaJsQueue                   | 106247533 |
| MnemonistQueue               | 118739909 |
| DatastructuresJsQueue        | 124799171 |
| LinkedQueue                  | 143345455 |

Operations per second

| Implementation name          | Ops/sec |
| :--------------------------- | ------: |
| MnemonistQueue               |   54744 |
| DatastructuresJsQueue        |   54383 |
| ChunkedQueue                 |   36275 |
| DynamicCyclicQueue           |   28231 |
| LinkedQueue                  |   21294 |
| EfficientDataStructuresQueue |   17776 |
| DsaJsQueue                   |   17219 |

### zigzag

Enqueue a lot, then dequeue to zero, repeatedly.

![](/benchmark/images/zig-zag.png)

RAM usage

| Implementation name          | RAM usage |
| :--------------------------- | --------: |
| ChunkedQueue                 |  54243480 |
| MnemonistQueue               |  92534230 |
| DatastructuresJsQueue        | 104901206 |
| DynamicCyclicQueue           | 118183078 |
| EfficientDataStructuresQueue | 150362982 |
| DsaJsQueue                   | 222575471 |
| LinkedQueue                  | 245446255 |

Operations per second

| Implementation name          | Ops/sec |
| :--------------------------- | ------: |
| DatastructuresJsQueue        |   61163 |
| MnemonistQueue               |   60783 |
| LinkedQueue                  |   50293 |
| DynamicCyclicQueue           |   39873 |
| ChunkedQueue                 |   39110 |
| EfficientDataStructuresQueue |   22809 |
| DsaJsQueue                   |   20189 |

### enqueue-zigzag-dequeue

Enqueue a lot, then [zigzag](#zigzag) with 1/3 of the size, then dequeue to zero.

![](/benchmark/images/enqueue-zig-zag-dequeue.png)

RAM usage

| Implementation name          | RAM usage |
| :--------------------------- | --------: |
| ChunkedQueue                 |  72945115 |
| DatastructuresJsQueue        |  84031309 |
| DynamicCyclicQueue           |  89289878 |
| MnemonistQueue               |  92892741 |
| LinkedQueue                  | 279368176 |
| EfficientDataStructuresQueue | 381811473 |
| DsaJsQueue                   | 383411005 |

Operations per second

| Implementation name          | Ops/sec |
| :--------------------------- | ------: |
| DynamicCyclicQueue           |   84760 |
| DatastructuresJsQueue        |   68971 |
| MnemonistQueue               |   67296 |
| ChunkedQueue                 |   37734 |
| LinkedQueue                  |   21691 |
| EfficientDataStructuresQueue |   18619 |
| DsaJsQueue                   |   18510 |

### enqueue only

Simply enqueue a lot of items, without any dequeue.

![](/benchmark/images/enqueue-only.png)

RAM usage

| Implementation name          | RAM usage |
| :--------------------------- | --------: |
| ChunkedQueue                 |  81815777 |
| MnemonistQueue               | 223175067 |
| DatastructuresJsQueue        | 223232962 |
| DynamicCyclicQueue           | 292281309 |
| LinkedQueue                  | 359370061 |
| DsaJsQueue                   | 431394786 |
| EfficientDataStructuresQueue | 431398306 |

Operations per second

| Implementation name          | Ops/sec |
| :--------------------------- | ------: |
| DatastructuresJsQueue        |   57158 |
| MnemonistQueue               |   56508 |
| ChunkedQueue                 |   33323 |
| DynamicCyclicQueue           |   30282 |
| LinkedQueue                  |   10025 |
| EfficientDataStructuresQueue |    9751 |
| DsaJsQueue                   |    9691 |

# Analysis
- **In every scenario**, `ChunkedQueue`, introduced in this project, consumes the lowest amount of RAM
- Performance-wise, in most scenarios, the implementations of [@datastructures-js/queue](https://www.npmjs.com/package/@datastructures-js/queue) and [@datastructures-js/queue](https://www.npmjs.com/package/@datastructures-js/queue) have the highest throughput of operations per second
- Surprisingly, `DynamicCyclicQueue`, also introduced in this project, has the highest throughput in the scenario named [enqueue-zigzag-dequeue](#enqueue-zigzag-dequeue)
