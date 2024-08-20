// noinspection JSUnresolvedReference

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const configFileName = process.argv.length === 2 ? path.join(__dirname, 'report-config.json') : process.argv[2];
const reportConfig = JSON.parse(fs.readFileSync(configFileName).toString());
const myLog = reportConfig.verbose ? console.log : (_) => {};
myLog(`config file = ${configFileName}`);

const commandObjects = [];
const resultObjects = [];

reportConfig.scenarios.forEach(scenario => {
  reportConfig.classes.forEach((className) => {
    for (let i = 0; i < reportConfig.iterationsPerClass; i++) {
      commandObjects.push({
        scenarioName: scenario.name,
        scenario: scenario,
        className,
        command: `node ${path.join(__dirname, 'ramusage.js')} ${className} ${scenario.operations.join(' ')}`
      });
    }
  });
});

function shuffle (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

if (reportConfig.shuffle) {
  shuffle(commandObjects);
}

for (let i = 0; i < commandObjects.length; i++) {
  const commandObject = commandObjects[i];
  const command = commandObject.command;
  const scenarioName = commandObject.scenarioName;
  myLog(`[${i + 1} of ${commandObjects.length}] scenario "${scenarioName}", about to execute command: ${command}`);
  const resp = shell.exec(command, { silent: true });
  resultObjects.push({
    className: commandObject.className,
    scenarioName: scenarioName,
    scenario: commandObject.scenario,
    result: JSON.parse(resp.stdout)
  });
}

const resultsByScenario = reportConfig.scenarios.reduce((agg, current) => {
  const m = new Map();
  reportConfig.classes.forEach((className) => { m.set(className, []); });
  agg.set(current.name, m);
  return agg;
}, new Map());

resultObjects.forEach(result => {
  const m = resultsByScenario.get(result.scenarioName);
  m.get(result.className).push(result);
});

resultsByScenario.values().forEach(rbcn => {
  rbcn.values().forEach((results) => {
    results.sort((a, b) => a.result.heapUsed - b.result.heapUsed);
  });
});

function sum (arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function avg (arr) {
  return sum(arr) / arr.length;
}

const stats = resultsByScenario.entries().map(([scenarioName, resultsByClassName]) => {
  return {
    scenarioName,
    stats: resultsByClassName.entries().map(([k, v]) => {
      const avgOpsPerSec = Math.trunc(avg(v.map(x => x.result.opsPerSec)));
      return {
        className: k,
        avgOpsPerSec: avgOpsPerSec,
        avgHeapUsed: Math.trunc(avg(v.map(x => x.result.heapUsed))),
        avgHeapUsedLog10: Math.trunc(100 * Math.log10(avg(v.map(x => x.result.heapUsed)))) / 100
      };
    }).toArray()
  };
}).toArray();

console.log('');
console.log('========= REPORT =========');
console.log('');

stats.forEach(scenario => {
  console.log(`### ${scenario.scenarioName}`);
  {
    console.log('');
    const sc = reportConfig.scenarios.find(s => s.name === scenario.scenarioName);
    console.log(sc.description);
    console.log('');
    const imageBareFileName = sc.name.toLowerCase().split(' ').join('-').replace('.', '');
    console.log('![](/benchmark/images/' + imageBareFileName + '.png)');
    console.log('');
    console.log('#### RAM usage');
    console.log('');
    const data = [['Implementation name', 'RAM usage', 'Diff']];
    data.push(...scenario.stats.sort((a, b) => a.avgHeapUsed - b.avgHeapUsed).map(item => [item.className, item.avgHeapUsed]));
    data[1].push('(baseline)');
    const baseline = data[1][1];
    for (let i = 2; i < data.length; i++) {
      data[i].push(`+${Math.floor(100 * (-1 + data[i][1] / baseline))}%`);
    }
    console.log(markdownTable(data, { align: ['l', 'r', 'r'] }));
  }
  {
    console.log('');
    console.log('#### Operations per second');
    console.log('');
    const data = [['Implementation name', 'Ops/sec', 'Diff']];
    data.push(...scenario.stats.sort((a, b) => b.avgOpsPerSec - a.avgOpsPerSec).map(item => [item.className, item.avgOpsPerSec]));
    data[1].push('(baseline)');
    const baseline = data[1][1];
    for (let i = 2; i < data.length; i++) {
      data[i].push(`-${Math.floor(100 * (1 - data[i][1] / baseline))}%`);
    }

    console.log(markdownTable(data, { align: ['l', 'r', 'r'] }));
  }
  console.log('');
});

// The following code was taken from https://github.com/wooorm/markdown-table
// This code is "inlined" for simplicity reasons.
// The license of this code is MIT, so this is a legit action.
function markdownTable (table, options = {}) {
  const align = (options.align || []).concat();
  const stringLength = options.stringLength || defaultStringLength;
  /** @type {Array<number>} Character codes as symbols for alignment per column. */
  const alignments = [];
  /** @type {Array<Array<string>>} Cells per row. */
  const cellMatrix = [];
  /** @type {Array<Array<number>>} Sizes of each cell per row. */
  const sizeMatrix = [];
  /** @type {Array<number>} */
  const longestCellByColumn = [];
  let mostCellsPerRow = 0;
  let rowIndex = -1;

  // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
  // do superfluous work when aligning, so optimize for aligning.
  while (++rowIndex < table.length) {
    /** @type {Array<string>} */
    const row = [];
    /** @type {Array<number>} */
    const sizes = [];
    let columnIndex = -1;

    if (table[rowIndex].length > mostCellsPerRow) {
      mostCellsPerRow = table[rowIndex].length;
    }

    while (++columnIndex < table[rowIndex].length) {
      const cell = serialize(table[rowIndex][columnIndex]);

      if (options.alignDelimiters !== false) {
        const size = stringLength(cell);
        sizes[columnIndex] = size;

        if (
          longestCellByColumn[columnIndex] === undefined ||
            size > longestCellByColumn[columnIndex]
        ) {
          longestCellByColumn[columnIndex] = size;
        }
      }

      row.push(cell);
    }

    cellMatrix[rowIndex] = row;
    sizeMatrix[rowIndex] = sizes;
  }

  // Figure out which alignments to use.
  let columnIndex = -1;

  if (typeof align === 'object' && 'length' in align) {
    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = toAlignment(align[columnIndex]);
    }
  } else {
    // noinspection JSCheckFunctionSignatures
    const code = toAlignment(align);

    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = code;
    }
  }

  // Inject the alignment row.
  columnIndex = -1;
  /** @type {Array<string>} */
  const row = [];
  /** @type {Array<number>} */
  const sizes = [];

  while (++columnIndex < mostCellsPerRow) {
    const code = alignments[columnIndex];
    let before = '';
    let after = '';

    if (code === 99 /* `c` */) {
      before = ':';
      after = ':';
    } else if (code === 108 /* `l` */) {
      before = ':';
    } else if (code === 114 /* `r` */) {
      after = ':';
    }

    // There *must* be at least one hyphen-minus in each alignment cell.
    let size =
        options.alignDelimiters === false
          ? 1
          : Math.max(
            1,
            longestCellByColumn[columnIndex] - before.length - after.length
          );

    const cell = before + '-'.repeat(size) + after;

    if (options.alignDelimiters !== false) {
      size = before.length + size + after.length;

      if (size > longestCellByColumn[columnIndex]) {
        longestCellByColumn[columnIndex] = size;
      }

      sizes[columnIndex] = size;
    }

    row[columnIndex] = cell;
  }

  // Inject the alignment row.
  cellMatrix.splice(1, 0, row);
  sizeMatrix.splice(1, 0, sizes);

  rowIndex = -1;
  /** @type {Array<string>} */
  const lines = [];

  while (++rowIndex < cellMatrix.length) {
    const row = cellMatrix[rowIndex];
    const sizes = sizeMatrix[rowIndex];
    columnIndex = -1;
    /** @type {Array<string>} */
    const line = [];

    while (++columnIndex < mostCellsPerRow) {
      const cell = row[columnIndex] || '';
      let before = '';
      let after = '';

      if (options.alignDelimiters !== false) {
        const size =
            longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
        const code = alignments[columnIndex];

        if (code === 114 /* `r` */) {
          before = ' '.repeat(size);
        } else if (code === 99 /* `c` */) {
          if (size % 2) {
            before = ' '.repeat(size / 2 + 0.5);
            after = ' '.repeat(size / 2 - 0.5);
          } else {
            before = ' '.repeat(size / 2);
            after = before;
          }
        } else {
          after = ' '.repeat(size);
        }
      }

      if (options.delimiterStart !== false && !columnIndex) {
        line.push('|');
      }

      if (
        options.padding !== false &&
          // Don’t add the opening space if we’re not aligning and the cell is
          // empty: there will be a closing space.
          !(options.alignDelimiters === false && cell === '') &&
          (options.delimiterStart !== false || columnIndex)
      ) {
        line.push(' ');
      }

      if (options.alignDelimiters !== false) {
        line.push(before);
      }

      line.push(cell);

      if (options.alignDelimiters !== false) {
        line.push(after);
      }

      if (options.padding !== false) {
        line.push(' ');
      }

      if (
        options.delimiterEnd !== false ||
          columnIndex !== mostCellsPerRow - 1
      ) {
        line.push('|');
      }
    }

    lines.push(
      options.delimiterEnd === false
        ? line.join('').replace(/ +$/, '')
        : line.join('')
    );
  }

  return lines.join('\n');
}

/**
 * @param {string|null|undefined} [value]
 * @returns {string}
 */
function serialize (value) {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * @param {string} value
 * @returns {number}
 */
function defaultStringLength (value) {
  return value.length;
}

/**
 * @param {string|null|undefined} value
 * @returns {number}
 */
function toAlignment (value) {
  const code = typeof value === 'string' ? value.codePointAt(0) : 0;

  return code === 67 /* `C` */ || code === 99 /* `c` */
    ? 99 /* `c` */
    : code === 76 /* `L` */ || code === 108 /* `l` */
      ? 108 /* `l` */
      : code === 82 /* `R` */ || code === 114 /* `r` */
        ? 114 /* `r` */
        : 0;
}
