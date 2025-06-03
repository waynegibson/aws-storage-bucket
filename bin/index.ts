#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StorageBucketStack } from '../lib/storage-bucket-stack';

const app = new cdk.App();
new StorageBucketStack(app, 'StorageBucketStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});