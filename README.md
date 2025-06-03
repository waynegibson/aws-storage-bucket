# @spacecomx/aws-storage-bucket

AWS CDK stack for deploying configurable S3 buckets with intelligent tiering and best practices.

## Features

- Configurable S3 buckets with intelligent tiering for cost optimization
- Multiple bucket type presets (media, document, log)
- Automatic archiving of infrequently accessed objects
- Security best practices (encryption, SSL enforcement, block public access)
- Lifecycle rules for optimized storage costs

## Prerequisites

- Node.js 18 or later
- AWS CLI configured with appropriate credentials
- AWS CDK v2.200.0

## Installation

```bash
# Install dependencies
npm install
```

## Usage

### Deploy the stack

```bash
# Deploy with default settings (media bucket)
npx cdk deploy

# Deploy with a custom bucket name
npx cdk deploy -c bucketName=my-storage-bucket

# Deploy a specific bucket type
npx cdk deploy -c bucketType=document
npx cdk deploy -c bucketType=log
npx cdk deploy -c bucketType=media

# Deploy for production environment (uses RETAIN removal policy)
npx cdk deploy -c environment=production
```

### Configuration Options

- `bucketName`: Optional custom name for the S3 bucket
- `bucketType`: Type of bucket to create (`media`, `document`, `log`)
- `environment`: Set to 'production' to use RETAIN removal policy

## Bucket Types

### Media Storage (Default)
- Optimized for images, videos, and media files
- Archive access tier after 90 days
- Deep archive access tier after 180 days
- Transition to intelligent tiering after 30 days

### Document Storage
- Optimized for documents and files
- Archive access tier after 60 days
- Deep archive access tier after 120 days
- Transition to intelligent tiering after 15 days

### Log Storage
- Optimized for log files
- Archive access tier after 30 days
- Deep archive access tier after 90 days
- Transition to intelligent tiering after 7 days

## Security

- Server-side encryption with S3-managed keys
- All public access blocked
- HTTPS required for all requests
- Versioning enabled (except for log buckets)

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template