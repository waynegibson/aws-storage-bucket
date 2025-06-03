import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';

export interface StorageBucketProps {
  /**
   * The name of the bucket. If not specified, a name will be generated.
   */
  bucketName?: string;
  
  /**
   * Optional removal policy. Default is RETAIN for production safety.
   */
  removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Construct for an S3 bucket optimized for storage storage with intelligent tiering
 */
export class StorageBucket extends Construct {
  /**
   * The underlying S3 bucket
   */
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: StorageBucketProps = {}) {
    super(scope, id);

    // Use RETAIN as default removal policy for production safety
    const removalPolicy = props.removalPolicy || cdk.RemovalPolicy.RETAIN;

    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: props.bucketName,
      removalPolicy: removalPolicy,
      autoDeleteObjects: removalPolicy === cdk.RemovalPolicy.DESTROY,
      
      // Best practices for security
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      
      // Enable intelligent tiering for cost optimization
      intelligentTieringConfigurations: [
        {
          name: 'archive-infrequent-access',
          archiveAccessTierTime: cdk.Duration.days(90),
          deepArchiveAccessTierTime: cdk.Duration.days(180),
        }
      ],
      
      // Enable lifecycle rules for optimizing storage costs
      lifecycleRules: [
        {
          // Transition objects to intelligent tiering after 30 days
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(30),
            }
          ],
          // Expire noncurrent versions after 90 days
          noncurrentVersionExpiration: cdk.Duration.days(90),
        }
      ],
    });
  }
}