import Iris from '.';

describe('index', () => {
  it('provides the Iris class', () => {
    expect(new Iris({})).toBeDefined();
  });
});
