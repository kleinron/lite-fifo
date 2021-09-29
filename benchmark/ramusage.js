const { LinkedQueue } = require('../src/LinkedQueue');
const { ChunkedQueue } = require('../src/ChunkedQueue');

function main(className, chunkSize, counts) {
    let cls;
    let enqueue;
    let dequeue;
    switch (className.toLowerCase()) {
        case 'LinkedQueue'.toLowerCase():
            cls = () => new LinkedQueue();
            enqueue = (q, v) => q.enqueue(v);
            dequeue = (q) => q.dequeue();
            break;
        case 'ChunkedQueue'.toLowerCase():
            cls = () => new ChunkedQueue(chunkSize);
            enqueue = (q, v) => q.enqueue(v);
            dequeue = (q) => q.dequeue();
            break;
        case 'array'.toLowerCase():
            cls = () => [];
            enqueue = (a, v) => a.push(v);
            dequeue = (a) => a.shift();
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
                enqueue(queue, 88776655);
            }
        } else {
            for (let i = 0; i < count; i++) {
                dequeue(queue);
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
    diff['time'] = stop - start;
    diff['ops/sec'] = counts.reduce((agg, v) => { return agg + v; }, 0) / diff['time'];
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
main(className, chunkSize, counts)