import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StorageBucketStack } from '../lib/storage-bucket-stack';
import { mediaStorageConfig, documentStorageConfig, logStorageConfig } from '../config/storage-bucket.config';

describe('StorageBucketStack', () => {
  test('Media Bucket Created with Correct Configuration', () => {
    // GIVEN
    const app = new cdk.App();
    
    // WHEN
    const stack = new StorageBucketStack(app, 'TestMediaBucketStack', {
      bucketType: 'media'
    });
    
    // THEN
    const template = Template.fromStack(stack);
    
    // Verify bucket creation
    template.resourceCountIs('AWS::S3::Bucket', 1);
    
    // Verify bucket properties for media type
    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: {
        Status: 'Enabled'
      },
      IntelligentTieringConfigurations: [
        {
          Id: 'archive-infrequent-access',
          Status: 'Enabled',
          Tierings: [
            {
              AccessTier: 'ARCHIVE_ACCESS',
              Days: mediaStorageConfig.intelligentTiering?.archiveAccessTierDays
            },
            {
              AccessTier: 'DEEP_ARCHIVE_ACCESS',
              Days: mediaStorageConfig.intelligentTiering?.deepArchiveAccessTierDays
            }
          ]
        }
      ]
    });
  });
  
  test('Document Bucket Created with Correct Configuration', () => {
    // GIVEN
    const app = new cdk.App();
    
    // WHEN
    const stack = new StorageBucketStack(app, 'TestDocumentBucketStack', {
      bucketType: 'document'
    });
    
    // THEN
    const template = Template.fromStack(stack);
    
    // Verify bucket properties for document type
    template.hasResourceProperties('AWS::S3::Bucket', {
      IntelligentTieringConfigurations: [
        {
          Tierings: [
            {
              AccessTier: 'ARCHIVE_ACCESS',
              Days: documentStorageConfig.intelligentTiering?.archiveAccessTierDays
            },
            {
              AccessTier: 'DEEP_ARCHIVE_ACCESS',
              Days: documentStorageConfig.intelligentTiering?.deepArchiveAccessTierDays
            }
          ]
        }
      ]
    });
  });
  
  test('Log Bucket Created with Correct Configuration', () => {
    // GIVEN
    const app = new cdk.App();
    
    // WHEN
    const stack = new StorageBucketStack(app, 'TestLogBucketStack', {
      bucketType: 'log'
    });
    
    // THEN
    const template = Template.fromStack(stack);
    
    // Verify bucket properties for log type
    template.hasResourceProperties('AWS::S3::Bucket', {
      IntelligentTieringConfigurations: [
        {
          Tierings: [
            {
              AccessTier: 'ARCHIVE_ACCESS',
              Days: logStorageConfig.intelligentTiering?.archiveAccessTierDays
            },
            {
              AccessTier: 'DEEP_ARCHIVE_ACCESS',
              Days: logStorageConfig.intelligentTiering?.deepArchiveAccessTierDays
            }
          ]
        }
      ]
    });
  });
});