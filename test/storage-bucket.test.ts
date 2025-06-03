import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StorageBucketStack } from '../lib/storage-bucket-stack';

describe('StorageBucketStack', () => {
  test('S3 Bucket Created with Intelligent Tiering', () => {
    // GIVEN
    const app = new cdk.App();
    
    // WHEN
    const stack = new StorageBucketStack(app, 'TestStorageBucketStack');
    
    // THEN
    const template = Template.fromStack(stack);
    
    // Verify bucket creation
    template.resourceCountIs('AWS::S3::Bucket', 1);
    
    // Verify bucket properties
    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: {
        Status: 'Enabled'
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      },
      IntelligentTieringConfigurations: [
        {
          Id: 'archive-infrequent-access',
          Status: 'Enabled',
          Tierings: [
            {
              AccessTier: 'ARCHIVE_ACCESS',
              Days: 90
            },
            {
              AccessTier: 'DEEP_ARCHIVE_ACCESS',
              Days: 180
            }
          ]
        }
      ]
    });
    
    // Verify bucket policy
    template.resourceCountIs('AWS::S3::BucketPolicy', 1);
  });
});