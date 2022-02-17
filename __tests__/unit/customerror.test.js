const { expect } = require('@jest/globals');
const customError = require('../../src/utils/customError');


describe('unit test for customerror', () => {


  it('returns correct code when code is 422', async () => {
    const error = new customError('testOne', 422)
    expect(error.code).toEqual(422)
  });

  it('returns correct code when code is 80000', async () => {
    const error = new customError('testOne', 800000)
    expect(error.code).toEqual(500)
  });

});
