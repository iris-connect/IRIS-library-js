import { greet } from '.';

describe('index', () => {
  describe('greet', () => {
    it('should return greeting with name specified', () => {
      const testName = 'testName';
      const greetingPhrase = greet(testName);

      expect(greetingPhrase).toEqual(`Hello ${testName}!`);
    });
  });
});
