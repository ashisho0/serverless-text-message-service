const AWS = require("aws-sdk");
const SQS = new AWS.SQS();
const logger = require("../helpers/logger.helper");
const { sendSMS } = require("../helpers/sms.helper");

const {
  RATE_LIMIT,
  SQS_QUEUE_URL,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY,
} = require("../env/config");
const TokenBucket = require("../helpers/tokenBucket.helper");

const tokenBucket = new TokenBucket(RATE_LIMIT, RATE_LIMIT);

exports.handler = async (event) => {
  const params = {
    QueueUrl: SQS_QUEUE_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
  };

  const data = await SQS.receiveMessage(params).promise();

  if (data.Messages) {
    for (const message of data.Messages) {
      let retryAttempts = 0;
      let messageSent = false;

      while (!messageSent && retryAttempts < MAX_RETRY_ATTEMPTS) {
        try {
          const segments = JSON.parse(message.Body).segments;

          // Check if enough tokens are available in the bucket before sending the message
          if (await tokenBucket.consumeTokens(segments)) {
            await sendTextMessage(JSON.parse(message.Body));
            logger.info("Message sent successfully", {
              messageId: message.MessageId,
            });
            messageSent = true;
          } else {
            logger.error("Rate limit exceeded, message not sent", {
              messageId: message.MessageId,
            });
            break; // Exit the retry loop if rate limit is exceeded
          }
        } catch (error) {
          logger.error("Failed to send message", {
            messageId: message.MessageId,
            error,
          });
          retryAttempts++;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Delay before retry
        }
      }

      if (!messageSent) {
        logger.error("Failed to send message after maximum retry attempts", {
          messageId: message.MessageId,
        });
      } else {
        await SQS.deleteMessage({
          QueueUrl: SQS_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle,
        }).promise();
      }
    }
  }
};

async function sendTextMessage(body) {
  try {
    const { to, message } = body;
    const result = await sendSMS(to, message);
    console.log("Message sent via Twilio:", result.sid);
  } catch (error) {
    throw error;
  }
}
