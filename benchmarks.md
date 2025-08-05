# Benchmarks

## Analysis (TL;DR)
- **In every scenario**, `ChunkedQueue`, introduced in this project, consumes the lowest amount of RAM
- Performance-wise, in most scenarios, the implementations of [@datastructures-js/queue](https://www.npmjs.com/package/@datastructures-js/queue) and [Mnemonist](https://github.com/yomguithereal/mnemonist) have the highest throughput of operations per second
- Surprisingly, `DynamicCyclicQueue`, also introduced in this project, has the highest throughput in the scenario named [enqueue-zigzag-dequeue](#enqueue-zigzag-dequeue)

## Hardware
All benchmarks were executed on a [MacBook Pro A2251](https://support.apple.com/en-il/111339)

## Implementations being tested

The following implementations are tested in the benchmarks:

| Project                                                                                                                                            | Class              | Symbol                       |
|----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|------------------------------|
| lite-fifo 1.0.1 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | ChunkedQueue       | ChunkedQueue                 |
| lite-fifo 1.0.1 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | DynamicCyclicQueue | DynamicCyclicQueue           |
| lite-fifo 1.0.1 ([npm](https://www.npmjs.com/package/lite-fifo), [code](https://github.com/kleinron/lite-fifo))                                    | LinkedQueue        | LinkedQueue                  |
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

#### RAM usage

| Implementation name          | RAM usage |       Diff |
| :--------------------------- | --------: | ---------: |
| ChunkedQueue                 |  28379764 | (baseline) |
| DatastructuresJsQueue        |  77274972 |      +172% |
| DynamicCyclicQueue           |  89208348 |      +214% |
| EfficientDataStructuresQueue | 111981042 |      +294% |
| MnemonistQueue               | 136571954 |      +381% |
| DsaJsQueue                   | 142313270 |      +401% |
| LinkedQueue                  | 143340408 |      +405% |

#### Operations per second

| Implementation name          | Ops/sec |       Diff |
| :--------------------------- | ------: | ---------: |
| MnemonistQueue               |   55494 | (baseline) |
| DatastructuresJsQueue        |   52292 |        -5% |
| ChunkedQueue                 |   35461 |       -36% |
| DynamicCyclicQueue           |   27125 |       -51% |
| LinkedQueue                  |   21202 |       -61% |
| DsaJsQueue                   |   16975 |       -69% |
| EfficientDataStructuresQueue |   16812 |       -69% |

### zigzag

Enqueue a lot, then dequeue to zero, repeatedly.

![](/benchmark/images/zigzag.png)

#### RAM usage

| Implementation name          | RAM usage |       Diff |
| :--------------------------- | --------: | ---------: |
| ChunkedQueue                 |  55647214 | (baseline) |
| DatastructuresJsQueue        |  79077452 |       +42% |
| DynamicCyclicQueue           | 118208608 |      +112% |
| DsaJsQueue                   | 143181248 |      +157% |
| EfficientDataStructuresQueue | 143378496 |      +157% |
| MnemonistQueue               | 158173512 |      +184% |
| LinkedQueue                  | 209267172 |      +276% |

#### Operations per second

| Implementation name          | Ops/sec |       Diff |
| :--------------------------- | ------: | ---------: |
| DatastructuresJsQueue        |   60388 | (baseline) |
| MnemonistQueue               |   58702 |        -2% |
| LinkedQueue                  |   47190 |       -21% |
| ChunkedQueue                 |   38555 |       -36% |
| DynamicCyclicQueue           |   37621 |       -37% |
| EfficientDataStructuresQueue |   22436 |       -62% |
| DsaJsQueue                   |   18806 |       -68% |

### enqueue-zigzag-dequeue

Enqueue a lot, then [zigzag](#zigzag) with 1/3 of the size, then dequeue to zero.

![](/benchmark/images/enqueue-zigzag-dequeue.png)

#### RAM usage

| Implementation name          | RAM usage |       Diff |
| :--------------------------- | --------: | ---------: |
| ChunkedQueue                 |  72885086 | (baseline) |
| MnemonistQueue               |  79495220 |        +9% |
| DynamicCyclicQueue           |  89370588 |       +22% |
| DatastructuresJsQueue        |  96505770 |       +32% |
| LinkedQueue                  | 279495582 |      +283% |
| DsaJsQueue                   | 371494706 |      +409% |
| EfficientDataStructuresQueue | 383364174 |      +425% |

#### Operations per second

| Implementation name          | Ops/sec |       Diff |
| :--------------------------- | ------: | ---------: |
| DynamicCyclicQueue           |   81741 | (baseline) |
| DatastructuresJsQueue        |   65765 |       -19% |
| MnemonistQueue               |   65699 |       -19% |
| ChunkedQueue                 |   37037 |       -54% |
| LinkedQueue                  |   20902 |       -74% |
| EfficientDataStructuresQueue |   17933 |       -78% |
| DsaJsQueue                   |   17772 |       -78% |

### enqueue only

Simply enqueue a lot of items, without any dequeue.

![](/benchmark/images/enqueue-only.png)

#### RAM usage

| Implementation name          | RAM usage |       Diff |
| :--------------------------- | --------: | ---------: |
| ChunkedQueue                 |  81687646 | (baseline) |
| DatastructuresJsQueue        | 222984634 |      +172% |
| MnemonistQueue               | 223269990 |      +173% |
| DynamicCyclicQueue           | 334902982 |      +309% |
| LinkedQueue                  | 359490772 |      +340% |
| DsaJsQueue                   | 431317892 |      +428% |
| EfficientDataStructuresQueue | 431489178 |      +428% |

#### Operations per second

| Implementation name          | Ops/sec |       Diff |
| :--------------------------- | ------: | ---------: |
| DatastructuresJsQueue        |   56891 | (baseline) |
| MnemonistQueue               |   53518 |        -5% |
| ChunkedQueue                 |   32288 |       -43% |
| DynamicCyclicQueue           |   29873 |       -47% |
| LinkedQueue                  |    9683 |       -82% |
| EfficientDataStructuresQueue |    9452 |       -83% |
| DsaJsQueue                   |    9334 |       -83% |

## Analysis (Repeated)
- **In every scenario**, `ChunkedQueue`, introduced in this project, consumes the lowest amount of RAM
- Performance-wise, in most scenarios, the implementations of [@datastructures-js/queue](https://www.npmjs.com/package/@datastructures-js/queue) and [Mnemonist](https://github.com/yomguithereal/mnemonist) have the highest throughput of operations per second
- Surprisingly, `DynamicCyclicQueue`, also introduced in this project, has the highest throughput in the scenario named [enqueue-zigzag-dequeue](#enqueue-zigzag-dequeue)
