import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configure the S3 client with Cloudflare R2 credentials
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';

// Generate a unique file name to avoid overwriting existing files
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${fileExtension}`;
}

// Upload a file to Cloudflare R2
export async function uploadFileToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the URL to the uploaded file
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw new Error('Failed to upload file to storage');
  }
}

// Generate a presigned URL for downloading a file
export async function getPresignedUrl(fileName: string): Promise<string> {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// Delete a file from Cloudflare R2
export async function deleteFileFromR2(fileName: string): Promise<void> {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    throw new Error('Failed to delete file from storage');
  }
}

// Extract the file name from the full URL
export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
} 