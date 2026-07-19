import { useState, useEffect, useRef } from 'react';

const cache = {};

/**
 * Custom hook to dynamically translate a document dictionary.
 * If the locale is one of the hardcoded ones ('en', 'km', 'zh', 'ko'), it bypasses translation.
 * Otherwise, it translates the English base document to the target locale on-the-fly and caches it.
 */
export function useTranslatedDoc(docName, englishDoc, locale) {
  const [translated, setTranslated] = useState(englishDoc);
  const pending = useRef(false);

  useEffect(() => {
    const hardcoded = ['en', 'km', 'zh', 'ko'];
    
    // If the language is hardcoded, we don't need dynamic translation
    if (hardcoded.includes(locale)) {
      setTranslated(englishDoc);
      return;
    }

    const cacheKey = `${docName}:${locale}`;
    if (cache[cacheKey]) {
      setTranslated(cache[cacheKey]);
      return;
    }

    if (pending.current) return;
    pending.current = true;

    // Helper to recursively translate all string values in an object/array
    const translateObject = async (obj) => {
      if (typeof obj === 'string') {
        if (!obj.trim() || !/[a-zA-Z]/.test(obj)) return obj;
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${locale}&dt=t&q=${encodeURIComponent(obj)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data && data[0]) {
            // Reconstruct full text in case it got split by Google Translate
            return data[0].map(item => item[0] || '').join('');
          }
        } catch (err) {
          console.warn(`Doc translation failed for: "${obj.substring(0, 20)}..."`, err);
        }
        return obj;
      }
      
      if (Array.isArray(obj)) {
        // Resolve all items in the array sequentially to avoid overloading Google Translate
        const results = [];
        for (const item of obj) {
          results.push(await translateObject(item));
        }
        return results;
      }
      
      if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = await translateObject(obj[key]);
          }
        }
        return result;
      }
      
      return obj;
    };

    translateObject(englishDoc).then((res) => {
      cache[cacheKey] = res;
      setTranslated(res);
      pending.current = false;
    });
  }, [docName, englishDoc, locale]);

  const hardcoded = ['en', 'km', 'zh', 'ko'];
  if (hardcoded.includes(locale)) {
    return null; // Bypasses hook's state to use direct import
  }

  return translated;
}
