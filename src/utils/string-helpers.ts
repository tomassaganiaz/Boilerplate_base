export const camelCase = (str: string): string => {
  if (!str) return '';
  return str.replace(/[-_\s]+(.)?/g, (_: string, c?: string) => (c ? c.toUpperCase() : ''));
};

export const snakeCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
};

export const kebabCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const pascalCase = (str: string): string => {
  if (!str) return '';
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

export const truncate = (str: string, length = 50, suffix = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

export const slugify = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
};
