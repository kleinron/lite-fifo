const { ChunkedQueue } = require('../../src/ChunkedQueue');
const assert = require('assert');

describe('ChunkedQueue', () => {
    it('fails to construct with zero chunk size', () => {
        assert.throws(() => new ChunkedQueue(0));
    });
});