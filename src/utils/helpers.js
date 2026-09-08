const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const serialize = (obj, keys) => {
  if (!obj || !keys || !Array.isArray(keys)) return obj;
  const result = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

const omit = (obj, keys) => {
  if (!obj || !keys || !Array.isArray(keys)) return obj;
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

const pick = (obj, keys) => {
  if (!obj || !keys || !Array.isArray(keys)) return obj;
  const result = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

const parseIntOrDefault = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const isProduction = () => process.env.NODE_ENV === 'production';

const isDevelopment = () => process.env.NODE_ENV === 'development';

const isTest = () => process.env.NODE_ENV === 'test';

module.exports = {
  asyncHandler,
  serialize,
  omit,
  pick,
  parseIntOrDefault,
  isProduction,
  isDevelopment,
  isTest,
};
