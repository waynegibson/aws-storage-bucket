import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageBucket } from './constructs/storage-bucket';
import { BucketPolicy } from './constructs/bucket-policy';

export interface StorageBucketStackProps extends cdk.StackProps {
  /**
   * Optional bucket name. If not provided, a name will be generated.
   */
  bucketName?: string;
  
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

    // Create the storage bucket with intelligent tiering
    this.storageBucket = new StorageBucket(this, 'StorageBucket', {
      bucketName: props?.bucketName,
      // Use RETAIN for production environments, DESTROY for dev/test
      removalPolicy: this.node.tryGetContext('environment') === 'production' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
    });

    // Apply bucket policies for security best practices
    new BucketPolicy(this, 'StorageBucketPolicy', {
      bucket: this.storageBucket.bucket,
      // Add specific principals if needed
      // readAccessPrincipals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    });

    // Output the bucket name and ARN
    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: this.storageBucket.bucket.bucketName,
      description: 'Name of the storage storage bucket',
      exportName: `${this.stackName}-BucketName`,
    });

    new cdk.CfnOutput(this, 'StorageBucketArn', {
      value: this.storageBucket.bucket.bucketArn,
      description: 'ARN of the storage storage bucket',
      exportName: `${this.stackName}-BucketArn`,
    });
  }
}
