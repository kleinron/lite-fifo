const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const configFileName = process.argv.length === 2 ? path.join(__dirname, 'report-config.json') : process.argv[2];
const reportConfig = JSON.parse(fs.readFileSync(configFileName).toString());
const myLog = reportConfig.debug ? console.log : (_) => {};
myLog(`config file = ${configFileName}`);

const commandObjects = [];
const resultObjects = reportConfig.classes.reduce((agg, className) => {
  agg[className] = [];
  return agg;
}, {});

reportConfig.classes.forEach((className) => {
  for (let i = 0; i < reportConfig.iterationsPerClass; i++) {
    commandObjects.push({
      className,
      command: `node ${path.join(__dirname, 'ramusage.js')} ${className} ${reportConfig.operations.join(' ')}`
    });
  }
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

commandObjects.forEach(commandObject => {
  const command = commandObject.command;
  myLog(`about to execute command: ${command}`);
  const resp = shell.exec(command, { silent: true });
  resultObjects[commandObject.className].push(JSON.parse(resp.stdout));
});

Object.values(resultObjects).forEach((results) => {
  results.sort((a, b) => a.heapUsed - b.heapUsed);
});

if (reportConfig.removeMinMax) {
  Object.values(resultObjects).forEach((results) => {
    results.shift();
    results.pop();
  });
}

function sum (arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function avg (arr) {
  return sum(arr) / arr.length;
}

const stats = Object.entries(resultObjects).map(([k, v]) => {
  return {
    className: k,
    avgOpsPerSec: Math.trunc(avg(v.map(x => x.opsPerSec))),
    avgHeapUsed: Math.trunc(avg(v.map(x => x.heapUsed))),
    avgHeapUsedLog10: Math.trunc(100 * Math.log10(avg(v.map(x => x.heapUsed)))) / 100
  };
});

myLog(JSON.stringify(resultObjects, null, ' '));
console.log(JSON.stringify(stats, null, ' '));
