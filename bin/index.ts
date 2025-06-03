#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StorageBucketStack } from '../lib/storage-bucket-stack';
import { getAppConfig } from '../config/app-config';

const app = new cdk.App();
const config = getAppConfig(app);

new StorageBucketStack(app, config.stackName, {
  bucketType: config.bucketType,
  bucketName: config.bucketName,
  description: config.description,
  environment: config.environment,
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});