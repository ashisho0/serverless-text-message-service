module.exports = {
  // AWS SQS Queue URL for text messages
  SQS_QUEUE_URL:
    "https://sqs.us-east-1.amazonaws.com/781059632418/text-message-queue",

  // Rate limit for sending messages (example: 45 messages per second)
  RATE_LIMIT: 45,

  // Maximum retry attempts for failed messages
  MAX_RETRY_ATTEMPTS: 3,

  // Delay between retry attempts in milliseconds (example: 5000 = 5 seconds)
  RETRY_DELAY: 5000,

  // Twilio account credentials
  TWILIO_ACCOUNT_SID: "dummy",
  TWILIO_AUTH_TOKEN: "dummy",
  TWILIO_PHONE_NUMBER: "1234567890",

  // AWS credentials (consider using environment variables for security)
  AWS: {
    region: "us-east-1",
    accessKeyId: "J8N6O3P7T2R5Z4M1L9W0",
    secretAccessKey: "Z1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4",
  },

  // CloudWatch logging configuration
  CLOUD_WATCH: {
    logGroupName: "SendMessageLogs",
    logStreamName: "SendMessageStream",
  },
};
