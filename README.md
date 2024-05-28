# Text Message Marketing Campaign Micro-Service

This project implements a serverless text message marketing campaign micro-service on AWS. It uses AWS services like Lambda, API Gateway, SQS, and Step Functions for orchestration.

## Project Structure

```bash
serverless-text-message-service/
│
├── env/
├── handlers/
├── helpers/
├── node_modules/
├── tests/
├── package.json
└── template.yaml
```

## Setup and Deployment Instructions

### Step 1: Clone repo and setup

```bash
git clone <repository-url>
cd serverless-text-message-service
npm i
```

### Step 2: AWS Setup

1. **AWS Account**: Ensure you have an AWS account set up.
   
2. **IAM Role**: Create an IAM role with permissions for Lambda, SQS, Step Functions, and API Gateway.

### Step 3: Upload the code (zip file) to s3
1. Create a zip file
```bash
zip -r serverless-text-message-service.zip path/to/your/folder
```
2. Create a bucket in s3 named "serverless-text-message-service" and upload the file to s3 bucket.

### Step 4: Importing "template.yaml" into AWS CloudFormation (Automatic stack creation)
1. Navigate to AWS CloudFormation
2. Create a New Stack
3. Specify Template (**template.yaml** from the cloned repo)
4. Stack Name and Parameters
5. Configure Stack Options
5. Review

# OR

### Step 4: Setting Up AWS Services (Create the stack manually)

#### 4.1. SQS Setup

1. **Create SQS Queue**:
   - Go to AWS Management Console.
   - Navigate to SQS service.
   - Create a new queue named `TextMessageQueue`.

#### 4.2. Lambda Functions Setup

1. **Create Lambda Functions**:
   - Open AWS Lambda Console.
   - Create two Lambda functions:
     - `queueMessageFunction`:
       - Handler: `handlers/queueMessage.handler`
       - Runtime: Node.js 14.x
       - Environment Variable: `SQS_QUEUE_URL` pointing to SQS queue URL.
     - `sendMessageFunction`:
       - Handler: `handlers/sendMessage.handler`
       - Runtime: Node.js 14.x
       - Environment Variable: `SQS_QUEUE_URL` pointing to SQS queue URL.

#### 4.3. Step Functions Setup

1. **Create Step Function**:
   - Open AWS Step Functions Console.
   - Create a new state machine named `TextMessageOrchestration`.
   - Use the provided state machine definition JSON or use AWS CloudFormation to define it.

#### 4.4. API Gateway Setup

1. **Create API Gateway**:
   - Open AWS API Gateway Console.
   - Create a new API named `TextMessageAPI`.
   - Define a POST method `/queue-message`:
     - Integration Type: Lambda Function (`queueMessageFunction`).
     - Use AWS Proxy integration to pass the entire request to Lambda.


### Step 5: Testing

1. **Test the API**:
   - Use tools like Postman or cURL to send POST requests to API Gateway endpoint `/queue-message`.
   - Provide JSON payload with `to` (array of phone numbers) and `message` (text message content).
   - Verify messages are queued in SQS and processed by Lambda functions.

### Step 6: Health and monitoring

1. **CloudWatch Metrics:** Enable CloudWatch metrics for your Step Functions state machine. AWS Step Functions automatically publishes metrics to CloudWatch, including execution counts, duration, and errors.

2. **CloudWatch Alarms:** Set up CloudWatch alarms based on these metrics to monitor the health of your state machine executions. For example, you can create alarms to alert you when the state machine encounters a high rate of errors or when executions take longer than expected.

## Notes

1. The tests folder consists of all the test cases that would be applicable for both `sendMessage` and `queueMessage` functions
