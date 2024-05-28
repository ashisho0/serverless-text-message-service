// twilioHelper.js
const twilio = require("twilio");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = require("../env/config");
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Sends an SMS message using Twilio.
 * @param {string} to The recipient's phone number.
 * @param {string} body The text message body.
 * @returns {Promise<object>} A Promise that resolves to the Twilio message object if successful.
 * @throws {Error} Throws an error if sending the SMS fails.
 */

async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to,
    });
    return message;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendSMS,
};
