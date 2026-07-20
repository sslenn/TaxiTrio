const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = require('../config/languages');
const { translateText } = require('../utils/translator');

class TranslationService {
  /**
   * Translates the specified fields of a Sequelize model instance to all supported languages.
   * This operates in-place on the instance, wrapping raw strings and filling missing fields.
   * Updates instance.translation_status to 'Completed' or 'Failed'.
   * 
   * @param {Object} instance - The Sequelize model instance (e.g. Route, TransportationPackage).
   * @param {Array<string>} fields - Attributes in the model that are JSONB localizations.
   */
  static async translateFields(instance, fields) {
    if (!instance || !fields || !Array.isArray(fields) || fields.length === 0) {
      return;
    }

    try {
      // 1. Initialize translation status as Pending
      instance.translation_status = 'Pending';

      // 2. Process all translatable fields in parallel
      const fieldPromises = fields.map(async (field) => {
        const rawValue = instance.getDataValue(field);
        
        let englishText = '';
        let existingTranslations = {};

        // Parse what was passed into the field
        if (typeof rawValue === 'string') {
          englishText = rawValue;
        } else if (rawValue && typeof rawValue === 'object') {
          englishText = rawValue[DEFAULT_LANGUAGE] || rawValue[Object.keys(rawValue)[0]] || '';
          existingTranslations = { ...rawValue };
        }

        // If there is no base text to translate, skip
        if (!englishText) return;

        // Initialize translations mapping with English base
        const translations = {
          [DEFAULT_LANGUAGE]: englishText,
          ...existingTranslations
        };

        // Determine which of the 20 target languages are missing or untranslated
        const targetLanguages = SUPPORTED_LANGUAGES.filter(
          (lang) => !translations[lang] || translations[lang] === englishText
        );

        // Fetch translations in parallel for the missing target languages
        const translatePromises = targetLanguages.map(async (lang) => {
          if (lang === DEFAULT_LANGUAGE) return;
          try {
            const translated = await translateText(englishText, lang);
            translations[lang] = translated || englishText;
          } catch (err) {
            console.warn(`[TranslationService] Failed translating "${field}" to "${lang}":`, err.message);
            translations[lang] = englishText; // Fallback to English value
          }
        });

        await Promise.all(translatePromises);
        
        // Write the translation mapping object back to the instance field
        instance.setDataValue(field, translations);
      });

      await Promise.all(fieldPromises);
      instance.translation_status = 'Completed';
    } catch (err) {
      console.error(`[TranslationService] Failed for model instance:`, err);
      
      // Fallback: Ensure fields have at least the English value in a valid JSONB structure
      fields.forEach((field) => {
        const val = instance.getDataValue(field);
        if (typeof val === 'string') {
          instance.setDataValue(field, { [DEFAULT_LANGUAGE]: val });
        }
      });
      
      instance.translation_status = 'Failed';
    }
  }
}

module.exports = TranslationService;
