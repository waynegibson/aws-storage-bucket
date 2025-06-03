import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface BucketPolicyProps {
  /**
   * The S3 bucket to attach the policy to
   */
  bucket: s3.IBucket;
  
  /**
   * Optional IAM principals that should have read access
   */
  readAccessPrincipals?: iam.IPrincipal[];
  
  /**
   * Optional IAM principals that should have write access
   */
  writeAccessPrincipals?: iam.IPrincipal[];
}

/**
 * Construct for applying best practice security policies to an S3 bucket
 */
export class BucketPolicy extends Construct {
  constructor(scope: Construct, id: string, props: BucketPolicyProps) {
    super(scope, id);

    const { bucket, readAccessPrincipals = [], writeAccessPrincipals = [] } = props;

    // Grant read access to specified principals
    for (const principal of readAccessPrincipals) {
      bucket.grantRead(principal);
    }

    // Grant write access to specified principals
    for (const principal of writeAccessPrincipals) {
      bucket.grantWrite(principal);
    }

    // Add bucket policy statements for additional security
    const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
      bucket: bucket,
    });

    // Deny HTTP requests (enforce HTTPS only)
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        sid: 'DenyHttpRequests',
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:*'],
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
        conditions: {
          Bool: {
            'aws:SecureTransport': 'false',
          },
        },
      })
    );

    // Deny unencrypted object uploads
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        sid: 'DenyUnencryptedObjectUploads',
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
        conditions: {
          StringNotEquals: {
            's3:x-amz-server-side-encryption': 'AES256',
          },
        },
      })
    );
  }
}