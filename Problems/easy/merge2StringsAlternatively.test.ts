import { mergeAlternately } from './merge2StringsAlternatively';

describe('mergeAlternately', () => {
  it('should merge two strings alternately', () => {
    expect(mergeAlternately('abc', 'def')).toBe('adbecf');
  });

  it('should handle strings of different lengths', () => {
    expect(mergeAlternately('abc', 'de')).toBe('adbec');
    expect(mergeAlternately('ab', 'def')).toBe('adbef');
  });

  it('should handle empty strings', () => {
    expect(mergeAlternately('', 'def')).toBe('def');
    expect(mergeAlternately('abc', '')).toBe('abc');
    expect(mergeAlternately('', '')).toBe('');
  });
});