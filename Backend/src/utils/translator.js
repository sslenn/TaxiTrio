const https = require('https');

/**
 * Translates a text string from English to a target language.
 * Uses Google Translate's public translation endpoint.
 * Has fallback for older Node versions using native 'https' module.
 */
const translateText = (text, targetLang) => {
  return new Promise((resolve) => {
    if (!text || typeof text !== 'string') return resolve('');
    
    // Google Translate public API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    // Use native fetch if available (Node 18+)
    if (typeof fetch === 'function') {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            resolve(data[0][0][0]);
          } else {
            resolve(text);
          }
        })
        .catch(err => {
          console.warn(`Translation to ${targetLang} failed using fetch:`, err.message);
          resolve(text);
        });
      return;
    }

    // Fallback to native HTTPS module for older Node environments
    https.get(url, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(rawData);
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            resolve(data[0][0][0]);
          } else {
            resolve(text);
          }
        } catch (e) {
          console.warn(`Translation parsing error:`, e.message);
          resolve(text);
        }
      });
    }).on('error', (e) => {
      console.warn(`Translation request failed:`, e.message);
      resolve(text);
    });
  });
};

module.exports = { translateText };
