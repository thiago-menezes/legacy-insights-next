import { formatProperName } from './formatProperName';

describe('formatProperName', () => {
  it('should format a name with multiple words', () => {
    expect(formatProperName('thiago menezes de silva')).toBe(
      'Thiago Menezes de Silva',
    );
  });

  it('should handle single names', () => {
    expect(formatProperName('thiago')).toBe('Thiago');
  });

  it('should handle already capitalized names', () => {
    expect(formatProperName('Thiago Silva')).toBe('Thiago Silva');
  });

  it('should handle names with mixed case', () => {
    expect(formatProperName('tHiAgO sIlVa')).toBe('Thiago Silva');
  });

  it('should handle names with connectives', () => {
    expect(formatProperName('da alessandro')).toBe('Da Alessandro');
  });
});
