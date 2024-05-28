/**
 * Calculates the number of SMS segments required for the given message.
 * @param {string} message The message content.
 * @param {string} encoding The encoding type ('GSM-7' or 'UCS-2').
 * @returns {number} The number of segments required.
 */

function calculateSegments(message, encoding) {
  const segmentLength = encoding === "GSM-7" ? 160 : 70;
  return Math.ceil(message.length / segmentLength);
}

module.exports = calculateSegments;
