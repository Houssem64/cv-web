// Script to verify R2 bucket public access
// Run with: node -r dotenv/config src/scripts/create-public-url.js

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const path = require('path');

// Cloudflare R2 Configuration
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

// Configure the S3 client with Cloudflare R2 credentials
const s3Client = new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    console.log('Checking R2 configuration...');
    console.log(`Endpoint: ${CLOUDFLARE_R2_ENDPOINT}`);
    console.log(`Bucket: ${CLOUDFLARE_R2_BUCKET_NAME}`);
    console.log(`Public URL: ${CLOUDFLARE_R2_PUBLIC_URL}`);
    
    // Create a test file
    const testFile = 'test-file.txt';
    const testContent = 'This is a test file to verify R2 public access';
    
    console.log(`\nUploading test file to R2 bucket...`);
    
    // Upload the test file
    const putCommand = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: testFile,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    await s3Client.send(putCommand);
    
    // Generate the URL
    const publicUrl = `${CLOUDFLARE_R2_PUBLIC_URL}/${testFile}`;
    
    console.log(`\nTest file uploaded successfully`);
    console.log(`Public URL: ${publicUrl}`);
    
    console.log(`\nTo verify public access, open the following URL in your browser:`);
    console.log(publicUrl);
    console.log('\nIf you can access the file, public access is configured correctly.');
    console.log('If you get a 401 Unauthorized error, you need to configure public access for your bucket.');
    
    console.log(`\nInstructions to configure public access:
1. Go to your Cloudflare dashboard
2. Navigate to R2 > ${CLOUDFLARE_R2_BUCKET_NAME} bucket
3. Go to Settings > Public Access
4. Enable "Public Access"
5. Copy the Public URL and update your .env file:
   CLOUDFLARE_R2_PUBLIC_URL=<the public URL shown>
   
Note: The public URL should look like https://pub-*.r2.dev or similar
`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 