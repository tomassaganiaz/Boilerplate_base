const {
  camelCase,
  snakeCase,
  kebabCase,
  pascalCase,
  truncate,
  slugify,
  capitalize,
  isEmpty,
} = require('../../../src/utils/string-helpers');

describe('String Helpers', () => {
  describe('camelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(camelCase('hello_world')).toBe('helloWorld');
    });

    it('should convert kebab-case to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
    });

    it('should return empty string for empty input', () => {
      expect(camelCase('')).toBe('');
      expect(camelCase(null)).toBe('');
    });
  });

  describe('snakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert PascalCase to snake_case', () => {
      expect(snakeCase('HelloWorld')).toBe('hello_world');
    });
  });

  describe('kebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
    });

    it('should convert snake_case to kebab-case', () => {
      expect(kebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('pascalCase', () => {
    it('should convert camelCase to PascalCase', () => {
      expect(pascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('should convert snake_case to PascalCase', () => {
      expect(pascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('truncate', () => {
    it('should truncate string to specified length', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate if string is shorter than length', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 8, '***')).toBe('Hello***');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello@World!')).toBe('helloworld');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase the rest', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });
  });

  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for whitespace only string', () => {
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2])).toBe(false);
    });
  });
});
