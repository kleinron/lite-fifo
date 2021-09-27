function main(className, itemCount) {
    let cls;
    switch (className.toLowerCase()) {
        case 'object'.toLowerCase():
            cls = (x) => [x, null];
            break;
        case 'array'.toLowerCase():
            cls = (x) => ({value: x, next: null});
            break;
        default:
            throw new Error(`no matching class found for class ${className}`);
    }

    const memoryUsage1 = process.memoryUsage();
    // noinspection JSMismatchedCollectionQueryUpdate
    const lst = []
    for (let i = 0; i < itemCount; i++) {
        lst.push(cls(88776655));
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
main(className, itemCount)