function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    crc ^= (code << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  let hex = crc.toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

function parseEMVCo(qrString) {
  const tags = new Map();
  let index = 0;
  while (index < qrString.length) {
    if (index + 4 > qrString.length) {
      break;
    }
    const tag = qrString.slice(index, index + 2);
    const lengthStr = qrString.slice(index + 2, index + 4);
    const length = parseInt(lengthStr, 10);
    if (isNaN(length)) {
      break;
    }
    const value = qrString.slice(index + 4, index + 4 + length);
    tags.set(tag, { length, value });
    index += 4 + length;
  }
  return tags;
}

function rebuildEMVCo(tagsMap) {
  let result = '';
  const sortedTags = Array.from(tagsMap.keys()).sort();
  for (const tag of sortedTags) {
    if (tag === '63') continue;
    const { length, value } = tagsMap.get(tag);
    const lenStr = String(length).padStart(2, '0');
    result += tag + lenStr + value;
  }
  result += '6304';
  return result;
}

/**
 * Injects transaction amount and currency into a static EMVCo QR code string.
 * Calculates a new CRC16-CCITT checksum for the resulting dynamic string.
 *
 * @param {string} staticQR - The static base QR code string (must start with 000201)
 * @param {number|string} amount - The amount to embed
 * @param {string} currency - 'USD' or 'KHR'
 * @returns {string} The fully compiled dynamic QR code string
 */
function generateDynamicQR(staticQR, amount, currency = 'USD') {
  if (!staticQR || !staticQR.startsWith('000201')) {
    return staticQR;
  }

  try {
    const tags = parseEMVCo(staticQR);

    // Update Point of Initiation Method to 12 (Dynamic QR)
    tags.set('01', { length: 2, value: '12' });

    // Set Currency
    const isRiel = String(currency).toUpperCase() === 'KHR';
    const currencyVal = isRiel ? '116' : '840';
    tags.set('53', { length: currencyVal.length, value: currencyVal });

    // Set Amount
    const amountStr = isRiel
      ? Math.round(parseFloat(amount)).toString()
      : parseFloat(amount).toFixed(2);
    tags.set('54', { length: amountStr.length, value: amountStr });

    // Rebuild and calculate CRC
    const baseString = rebuildEMVCo(tags);
    const checksum = crc16(baseString);

    return baseString + checksum;
  } catch (error) {
    console.error('Failed to generate dynamic QR from static QR:', error);
    return staticQR;
  }
}

module.exports = {
  crc16,
  parseEMVCo,
  rebuildEMVCo,
  generateDynamicQR
};
