import { Client } from 'minio';

// Using MinIO Play - Free public MinIO instance
// No credit card required, completely free
const minioClient = new Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

const BUCKET_NAME = 'communityhub-profiles';

export const initializeMinIO = async () => {
  try {
    // Check if bucket exists
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    
    if (!exists) {
      // Create bucket if it doesn't exist
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✓ MinIO bucket "${BUCKET_NAME}" created`);
      
      // Set public read policy for the bucket
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
          }
        ]
      };
      
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`✓ MinIO bucket policy set to public read`);
    } else {
      console.log(`✓ MinIO bucket "${BUCKET_NAME}" already exists`);
    }
  } catch (error) {
    console.error('✗ MinIO initialization error:', error.message);
    throw error;
  }
};

export const uploadProfilePic = async (fileBuffer, userId, mimetype) => {
  try {
    const fileName = `${userId}-${Date.now()}`;
    const objectName = `profile-pics/${fileName}`;

    // Upload file to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': mimetype }
    );

    // Generate public URL
    const url = `https://play.min.io/${BUCKET_NAME}/${objectName}`;

    return url;
  } catch (error) {
    console.error('✗ Upload error:', error.message);
    throw error;
  }
};

export const deleteProfilePic = async (objectName) => {
  try {
    // objectName is the full path like "profile-pics/userId-timestamp"
    await minioClient.removeObject(BUCKET_NAME, objectName);
    console.log(`✓ Profile picture deleted: ${objectName}`);
  } catch (error) {
    console.error('✗ Delete error:', error.message);
    throw error;
  }
};

export default minioClient;
