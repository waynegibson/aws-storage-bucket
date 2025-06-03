#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StorageBucketStack } from '../lib/storage-bucket-stack';

const app = new cdk.App();

// Get configuration from context or use defaults
const environment = app.node.tryGetContext('environment') || 'dev';
const bucketType = app.node.tryGetContext('bucketType') || 'media';
const stackName = app.node.tryGetContext('stackName') || `${bucketType}-storage-bucket-${environment}`;

// Generate a timestamp-based suffix for uniqueness (format: YYYYMMDD-HHmmss)
const timestamp = new Date().toISOString()
  .replace(/[-:]/g, '')
  .replace(/\..+/, '')
  .replace('T', '-');

// Use provided bucket name or generate one with timestamp for uniqueness
const bucketName = app.node.tryGetContext('bucketName') || 
  `${bucketType}-storage-${environment}-${timestamp}`;

const description = app.node.tryGetContext('description') || 
  `This stack includes S3 bucket for ${bucketType} storage with intelligent tiering`;

new StorageBucketStack(app, stackName, {
  bucketType: bucketType as 'media' | 'document' | 'log' | 'custom',
  bucketName: bucketName,
  description: description,
  environment: environment,
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});