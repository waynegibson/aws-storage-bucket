import * as cdk from 'aws-cdk-lib';

/**
 * Configuration interface for storage bucket settings
 */
export interface StorageBucketConfig {
  /**
   * Name of the bucket (optional, will be auto-generated if not provided)
   */
  bucketName?: string;
  
  /**
   * Removal policy for the bucket
   * @default RemovalPolicy.RETAIN for production, RemovalPolicy.DESTROY otherwise
   */
  removalPolicy?: cdk.RemovalPolicy;
  
  /**
   * Enable versioning for the bucket
   * @default true
   */
  versioned?: boolean;
  
  /**
   * Enable server-side encryption
   * @default true
   */
  encrypted?: boolean;
  
  /**
   * Intelligent tiering configuration
   */
  intelligentTiering?: {
    /**
     * Enable intelligent tiering
     * @default true
     */
    enabled: boolean;
    
    /**
     * Days after which objects are moved to archive access tier
     * @default 90
     */
    archiveAccessTierDays: number;
    
    /**
     * Days after which objects are moved to deep archive access tier
     * @default 180
     */
    deepArchiveAccessTierDays: number;
  };
  
  /**
   * Lifecycle rules configuration
   */
  lifecycle?: {
    /**
     * Days after which objects are transitioned to intelligent tiering
     * @default 30
     */
    transitionToIntelligentTieringDays: number;
    
    /**
     * Days after which noncurrent versions expire
     * @default 90
     */
    noncurrentVersionExpirationDays: number;
  };
}

/**
 * Default configuration for media storage bucket
 */
export const mediaStorageConfig: StorageBucketConfig = {
  versioned: true,
  encrypted: true,
  intelligentTiering: {
    enabled: true,
    archiveAccessTierDays: 90,
    deepArchiveAccessTierDays: 180
  },
  lifecycle: {
    transitionToIntelligentTieringDays: 30,
    noncurrentVersionExpirationDays: 90
  }
};

/**
 * Default configuration for document storage bucket
 */
export const documentStorageConfig: StorageBucketConfig = {
  versioned: true,
  encrypted: true,
  intelligentTiering: {
    enabled: true,
    archiveAccessTierDays: 60,
    deepArchiveAccessTierDays: 120
  },
  lifecycle: {
    transitionToIntelligentTieringDays: 15,
    noncurrentVersionExpirationDays: 60
  }
};

/**
 * Default configuration for log storage bucket
 */
export const logStorageConfig: StorageBucketConfig = {
  versioned: false,
  encrypted: true,
  intelligentTiering: {
    enabled: true,
    archiveAccessTierDays: 30,
    deepArchiveAccessTierDays: 90
  },
  lifecycle: {
    transitionToIntelligentTieringDays: 7,
    noncurrentVersionExpirationDays: 30
  }
};

/**
 * Get the appropriate removal policy based on environment
 * @param environment The deployment environment
 * @returns The appropriate removal policy
 */
export function getRemovalPolicy(environment?: string): cdk.RemovalPolicy {
  const isProd = environment?.toLowerCase().includes('prod') ?? false;
  return isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY;
}