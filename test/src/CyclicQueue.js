const { CyclicQueue } = require('../../src/CyclicQueue');
const assert = require('assert');

describe('CyclicQueue', () => {
    it('fails to construct with zero chunk size', () => {
        assert.throws(() => new CyclicQueue(0));
    });
});