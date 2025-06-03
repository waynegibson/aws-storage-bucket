# @spacecomx/aws-storage-bucket

AWS CDK stack for deploying an S3 bucket optimized for storage with intelligent tiering.

## Features

- S3 bucket with intelligent tiering for cost optimization
- Automatic archiving of infrequently accessed objects
- Security best practices (encryption, SSL enforcement, block public access)
- Lifecycle rules for optimized storage costs

## Prerequisites

- Node.js 22 or later
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
# Deploy with default settings
npx cdk deploy

# Deploy with a custom bucket name
npx cdk deploy -c bucketName=my-media-bucket

# Deploy for production environment (uses RETAIN removal policy)
npx cdk deploy -c environment=production
```

### Configuration Options

- `bucketName`: Optional custom name for the S3 bucket
- `environment`: Set to 'production' to use RETAIN removal policy

## Storage Classes

The bucket automatically manages storage classes:

- Objects are transitioned to intelligent tiering after 30 days
- Archive access tier is used after 90 days
- Deep archive access tier is used after 180 days
- Noncurrent versions expire after 90 days

## Security

- Server-side encryption with S3-managed keys
- All public access blocked
- HTTPS required for all requests
- Versioning enabled to protect against accidental deletions

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Contributors

- [Wayne Gibson](https://github.com/waynegibson)
