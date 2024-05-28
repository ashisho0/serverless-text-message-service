const GSM_7_CHARS =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\u001BÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_7_EXTENDED_CHARS = "|^€{}[~]\\";

/**
 * Checks if the given text is using only GSM-7 encoding characters.
 * @param {string} text The text to check for GSM-7 encoding compliance.
 * @returns {boolean} True if all characters in the text are GSM-7 compatible, false otherwise.
 */
const isGSM7Encoding = (text) => {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!GSM_7_CHARS.includes(char) && !GSM_7_EXTENDED_CHARS.includes(char)) {
      return false;
    }
  }
  return true;
};

module.exports = { isGSM7Encoding };
