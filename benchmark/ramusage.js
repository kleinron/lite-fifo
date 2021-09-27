const { LinkedQueue } = require('../src/LinkedQueue');
const { ChunkedQueue } = require('../src/ChunkedQueue');

function main(className, itemCount, chunkSize) {
    let cls;
    switch (className.toLowerCase()) {
        case 'LinkedQueue'.toLowerCase():
            cls = () => new LinkedQueue();
            break;
        case 'ChunkedQueue'.toLowerCase():
            cls = () => new ChunkedQueue(chunkSize);
            break;
        default:
            throw new Error(`no matching class found for class ${className}`);
    }
    const memoryUsage1 = process.memoryUsage();
    const queue = cls();
    for (let i = 0; i < itemCount; i++) {
        queue.enqueue(88776655);
    }
    const memoryUsage2 = process.memoryUsage();
    const diff = Object.entries(memoryUsage2)
        .reduce((agg, [k, v]) => {
            agg[k] = v - memoryUsage1[k];
            return agg;
        }, {});
    console.log(JSON.stringify(diff));
}

const className = process.argv[2];
const itemCount = Number.parseInt(process.argv[3]);
const chunkSize = process.argv.length > 4 ? Number.parseInt(process.argv[4]) : undefined;
main(className, itemCount, chunkSize)