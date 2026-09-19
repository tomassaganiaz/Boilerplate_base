const {
  formatDate,
  parseDate,
  addDays,
  isAfter,
  isBefore,
  DATE_FORMATS,
} = require('../../../src/utils/date-helpers');

describe('Date Helpers', () => {
  describe('DATE_FORMATS', () => {
    it('should have correct format constants', () => {
      expect(DATE_FORMATS.ISO).toBe('YYYY-MM-DD');
      expect(DATE_FORMATS.DISPLAY).toBe('DD/MM/YYYY');
      expect(DATE_FORMATS.DATETIME).toBe('YYYY-MM-DD HH:mm:ss');
      expect(DATE_FORMATS.TIMESTAMP).toBe('x');
    });
  });

  describe('formatDate', () => {
    it('should return null for null input', () => {
      expect(formatDate(null)).toBeNull();
    });

    it('should return null for invalid date', () => {
      expect(formatDate('invalid')).toBeNull();
    });

    it('should format date in ISO format by default', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15');
    });

    it('should format date in DISPLAY format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, DATE_FORMATS.DISPLAY);
      expect(result).toBe('15/01/2024');
    });

    it('should format date in DATETIME format', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, DATE_FORMATS.DATETIME);
      expect(result).toBe('2024-01-15 10:30:00');
    });

    it('should format date as timestamp', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, DATE_FORMATS.TIMESTAMP);
      expect(typeof result).toBe('number');
    });
  });

  describe('parseDate', () => {
    it('should return null for null input', () => {
      expect(parseDate(null)).toBeNull();
    });

    it('should parse valid date string', () => {
      const result = parseDate('2024-01-15');
      expect(result instanceof Date).toBe(true);
    });

    it('should return null for invalid date string', () => {
      expect(parseDate('invalid')).toBeNull();
    });
  });

  describe('addDays', () => {
    it('should add days to a date', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should subtract days when given negative number', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('isAfter', () => {
    it('should return true when first date is after second', () => {
      expect(isAfter('2024-01-16', '2024-01-15')).toBe(true);
    });

    it('should return false when first date is before second', () => {
      expect(isAfter('2024-01-14', '2024-01-15')).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('should return true when first date is before second', () => {
      expect(isBefore('2024-01-14', '2024-01-15')).toBe(true);
    });

    it('should return false when first date is after second', () => {
      expect(isBefore('2024-01-16', '2024-01-15')).toBe(false);
    });
  });
});
