const AWS = require("aws-sdk");
const SQS = new AWS.SQS();
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const calculateSegments = require("../helpers/calculateSegments.helper");
const { isGSM7Encoding } = require("../helpers/encoding.helper");

const config = require("../env/config");

const schema = Joi.object({
  to: Joi.array()
    .items(
      Joi.string().regex(/^\+?1[ -]?\(?(\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})$/)
    )
    .required()
    .min(1),
  message: Joi.string().required(),
});

exports.handler = async (event) => {
  try {
    const { error, value } = schema.validate(JSON.parse(event.body));

    if (error) {
      console.error("Validation error:", error.details);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid input" }),
      };
    }

    const { to, message } = value;

    const recipients = to;
    const encoding = isGSM7Encoding(message) ? "GSM-7" : "UCS-2";

    const sendMessages = recipients.map(async (to) => {
      const segments = calculateSegments(message, encoding);
      const params = {
        QueueUrl: config.SQS_QUEUE_URL,
        MessageBody: JSON.stringify({ id: uuidv4(), to, message, segments }),
      };
      await SQS.sendMessage(params).promise();
    });

    await Promise.all(sendMessages);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Messages queued successfully" }),
    };
  } catch (error) {
    console.error("Error queuing messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to queue messages" }),
    };
  }
};
