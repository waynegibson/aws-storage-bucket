import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageBucket } from './constructs/storage-bucket';
import { BucketPolicy } from './constructs/bucket-policy';
import { 
  StorageBucketConfig, 
  mediaStorageConfig, 
  documentStorageConfig, 
  logStorageConfig,
  getRemovalPolicy
} from '../config/storage-bucket.config';

export interface StorageBucketStackProps extends cdk.StackProps {
  /**
   * Optional bucket name. If not provided, a name will be generated.
   */
  bucketName?: string;
  
  /**
   * Type of storage bucket to create
   * @default 'media'
   */
  bucketType?: 'media' | 'document' | 'log' | 'custom';
  
  /**
   * Custom configuration for the bucket (required if bucketType is 'custom')
   */
  customConfig?: StorageBucketConfig;
  
  /**
   * Environment for deployment. Recommended for production use.
   */
  env?: cdk.Environment;
}

export class StorageBucketStack extends cdk.Stack {
  /**
   * The storage bucket construct
   */
  public readonly storageBucket: StorageBucket;
  
  constructor(scope: Construct, id: string, props?: StorageBucketStackProps) {
    super(scope, id, props);

    // Get the environment from context
    const environment = this.node.tryGetContext('environment');
    
    // Determine which configuration to use based on bucket type
    let config: StorageBucketConfig;
    switch (props?.bucketType || 'media') {
      case 'document':
        config = documentStorageConfig;
        break;
      case 'log':
        config = logStorageConfig;
        break;
      case 'custom':
        if (!props?.customConfig) {
          throw new Error('customConfig is required when bucketType is "custom"');
        }
        config = props.customConfig;
        break;
      case 'media':
      default:
        config = mediaStorageConfig;
        break;
    }
    
    // Set the removal policy based on environment
    config.removalPolicy = getRemovalPolicy(environment);

    // Create the storage bucket with the selected configuration
    this.storageBucket = new StorageBucket(this, 'Storage', {
      config,
      bucketName: props?.bucketName || this.node.tryGetContext('bucketName'),
    });

    // Apply bucket policies for security best practices
    new BucketPolicy(this, 'StorageBucketPolicy', {
      bucket: this.storageBucket.bucket,
    });

    // Output the bucket name and ARN
    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: this.storageBucket.bucket.bucketName,
      description: 'Name of the storage bucket',
      exportName: `${this.stackName}-BucketName`,
    });

    new cdk.CfnOutput(this, 'StorageBucketArn', {
      value: this.storageBucket.bucket.bucketArn,
      description: 'ARN of the storage bucket',
      exportName: `${this.stackName}-BucketArn`,
    });
  }
}
