// noinspection SpellCheckingInspection

const seedrandom = require("seedrandom");

exports.mochaGlobalSetup = function() {
    const now = process.env['TEST_RANDOM_SEED'] || new Date().toISOString();
    console.log(`seed = ${now}`);
    seedrandom(now, { global: true });
};