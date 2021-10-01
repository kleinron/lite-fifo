// noinspection SpellCheckingInspection

const seedrandom = require("seedrandom");

exports.mochaGlobalSetup = function() {
    const now = new Date().toISOString();
    console.log(`seed = ${now}`);
    seedrandom(now, { global: true });
};