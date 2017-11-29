const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'some from';
    const text = 'some text';

    const message = generateMessage(from, text);

    expect(message).toInclude({ from, text });
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'aasdfewebw';
    const lat = 3;
    const lng = 6;

    const message = generateLocationMessage(from, lat, lng);

    expect(message.url).toEqual(`https://www.google.com/maps?q=${lat},${lng}`);
    expect(message.from).toEqual(from);
    expect(message.createdAt).toBeA('number');
  });
});
