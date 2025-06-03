#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StorageBucketStack } from '../lib/storage-bucket-stack';

const app = new cdk.App();

// Get bucket type from context or use default
const bucketType = app.node.tryGetContext('bucketType') || 'media';

new StorageBucketStack(app, 'StorageBucketStack', {
  bucketType: bucketType as 'media' | 'document' | 'log' | 'custom',
  bucketName: app.node.tryGetContext('bucketName'),
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});