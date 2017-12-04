const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(true)).toBe(false);
    expect(isRealString(12)).toBe(false);
    expect(isRealString(new Object('abc'))).toBe(false);
    expect(isRealString(undefined)).toBe(false);
  });

  it('should reject strings of only spaces', () => {
    expect(isRealString('    ')).toBe(false);
  });

  it('should allow strings with non-space characters', () => {
    expect(isRealString('a890~!@#$%^&*()__+=')).toBe(true);
  });
});
