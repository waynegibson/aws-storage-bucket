# @spacecomx/aws-storage-bucket

AWS CDK stack for deploying configurable S3 buckets with intelligent tiering and best practices.

## Features

- Configurable S3 buckets with intelligent tiering for cost optimization
- Multiple bucket type presets (media, document, log)
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
pnpm install
```

## Usage

### Deploy the stack

```bash
# Deploy with default settings (media bucket)
npx cdk deploy

# Deploy with a custom bucket name
npx cdk deploy -c bucketName=my-storage-bucket

# Deploy with a custom stack name
npx cdk deploy -c stackName=MyCustomStack

# Deploy with a custom description
npx cdk deploy -c description="My custom S3 bucket for media storage"

# Deploy a specific bucket type
npx cdk deploy -c bucketType=document
npx cdk deploy -c bucketType=log
npx cdk deploy -c bucketType=media

# Deploy for production environment (uses RETAIN removal policy)
npx cdk deploy -c environment=production

# Combine multiple options
npx cdk deploy / 
 -c bucketType=document /
 -c bucketName=my-docs /
 -c stackName=DocsStack /
 -c description="Document storage bucket"
```

### Configuration Options

- `bucketType`: Type of bucket to create (`media`, `document`, `log`)
- `bucketName`: Optional custom name for the S3 bucket (defaults to `${bucketType}-storage-${environment}-${timestamp}` where `timestamp` is the current date in YYYYMMDD-HHmmss format)
- `stackName`: Custom name for the CloudFormation stack (defaults to `${bucketType}-storage-bucket-${environment}`)
- `description`: Custom description for the CloudFormation stack
- `environment`: Set to 'prod' to use RETAIN removal policy

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

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributors

- [Wayne Gibson](https://github.com/waynegibson)