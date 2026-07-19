const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = require('../config/languages');

/**
 * Recursively traverses a data object to detect and flatten translation objects.
 * A translation object is a plain object whose keys are a subset of SUPPORTED_LANGUAGES.
 */
const flattenLocalizations = (data, locale = DEFAULT_LANGUAGE) => {
  if (data === null || data === undefined) return data;

  // If it's an array, recursively flatten each element
  if (Array.isArray(data)) {
    return data.map(item => flattenLocalizations(item, locale));
  }

  // If it's a date or other special object, return as-is
  if (data instanceof Date) return data;

  // If it's an object
  if (typeof data === 'object') {
    // If it's a Sequelize model instance, serialize it to JSON first
    if (typeof data.toJSON === 'function') {
      data = data.toJSON();
    }

    const keys = Object.keys(data);
    
    // Check if this object is a translation container (e.g. { en: "...", km: "..." })
    const isTranslationObj = 
      keys.length > 0 && 
      keys.every(key => SUPPORTED_LANGUAGES.includes(key));

    if (isTranslationObj) {
      // Return the value for the requested locale, fall back to English, then fall back to any key, or empty string
      return data[locale] || data[DEFAULT_LANGUAGE] || data[keys[0]] || '';
    }

    // Otherwise, recursively flatten all properties of the object
    const result = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = flattenLocalizations(data[key], locale);
      }
    }
    return result;
  }

  return data;
};

const localeMiddleware = (req, res, next) => {
  // 1. Determine active locale (from header, query param, or fallback to default)
  let lang = req.headers['accept-language'] || req.query.lang || DEFAULT_LANGUAGE;
  
  // Extract main locale code (e.g., "km-KH" -> "km", "en-US" -> "en")
  lang = lang.split(',')[0].split('-')[0].trim().toLowerCase();
  
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    lang = DEFAULT_LANGUAGE; // fallback
  }
  
  req.locale = lang;

  // 2. Intercept and override res.json to automatically flatten database translations
  const originalJson = res.json;
  res.json = function (body) {
    // If request asks for raw format (e.g. ?raw=true) or is an admin route, bypass flattening
    const isRaw = req.query.raw === 'true' || req.path.includes('/admin/');
    
    if (!isRaw && body && body.data) {
      body.data = flattenLocalizations(body.data, req.locale);
    }
    
    return originalJson.call(this, body);
  };

  next();
};

module.exports = localeMiddleware;
