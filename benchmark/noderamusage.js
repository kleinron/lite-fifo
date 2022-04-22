class Node {
  constructor (value, next) {
    this.value = value;
    this.next = next;
  }
}

function main (className, itemCount) {
  let cls;
  switch (className.toLowerCase()) {
    case 'array'.toLowerCase():
      cls = (x) => [x, null];
      break;
    case 'object'.toLowerCase():
      cls = (x) => ({ value: x, next: null });
      break;
    case 'class'.toLowerCase():
      cls = (x) => new Node(x, null);
      break;
    default:
      throw new Error(`no matching class found for class ${className}`);
  }

  const memoryUsage1 = process.memoryUsage();
  // noinspection JSMismatchedCollectionQueryUpdate
  const lst = new Array(itemCount);
  for (let i = 0; i < itemCount; i++) {
    lst[i] = cls(88776655);
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
main(className, itemCount);
