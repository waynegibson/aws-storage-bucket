import * as cdk from 'aws-cdk-lib';

export interface AppConfig {
  environment: string;
  bucketType: 'media' | 'document' | 'log' | 'custom';
  stackName: string;
  bucketName: string;
  description: string;
}

export function getAppConfig(app: cdk.App): AppConfig {
  // Get environment and standardize production environments
  const rawEnvironment = app.node.tryGetContext('environment') || 'dev';
  const environment = rawEnvironment.toLowerCase().includes('prod') ? 'prod' : rawEnvironment;
  
  // Get bucket type
  const bucketType = app.node.tryGetContext('bucketType') || 'media';
  
  // Generate stack name
  const stackName = app.node.tryGetContext('stackName') || 
    `${bucketType}-storage-bucket-${environment}`;
  
  // Generate timestamp for unique bucket names
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .replace('T', '-');
  
  // Generate bucket name
  const bucketName = app.node.tryGetContext('bucketName') || 
    `${bucketType}-storage-${environment}-${timestamp}`;
  
  // Generate description
  const description = app.node.tryGetContext('description') || 
    `This stack includes S3 bucket for ${bucketType} storage with intelligent tiering`;
  
  return {
    environment,
    bucketType: bucketType as 'media' | 'document' | 'log' | 'custom',
    stackName,
    bucketName,
    description
  };
}