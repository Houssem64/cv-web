# Setting Up Cloudflare R2 for Image Uploads

This project uses Cloudflare R2 for image storage. Follow these steps to set up your own R2 bucket and configure it for use with this application.

## 1. Create a Cloudflare Account

If you don't already have one, sign up for a Cloudflare account at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).

## 2. Set Up R2

1. Navigate to the R2 section in your Cloudflare dashboard
2. Click "Create bucket" 
3. Name your bucket (e.g., `portfolio-images`)
4. Choose your preferred region
5. Click "Create bucket" to finish

## 3. Generate API Keys

1. In the R2 dashboard, click on "Manage R2 API Tokens"
2. Click "Create API Token"
3. Select the "R2 Admin Read & Write" template
4. Configure the token:
   - Name it (e.g., "Portfolio Images API Token")
   - Select your bucket(s)
   - Set appropriate permissions (read and write access)
5. Click "Create API Token"
6. Copy both the Access Key ID and Secret Access Key

## 4. Create a Public Bucket Access Policy

To make your images publicly accessible:

1. Go to your R2 bucket in the Cloudflare dashboard
2. Click on "Settings" > "Public Access"
3. Enable "Public Access"
4. Note the public URL for your bucket (should look like `https://<subdomain>.r2.dev`)

## 5. Update Environment Variables

Update your `.env.local` file with the following values:

```
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=portfolio-images
CLOUDFLARE_R2_PUBLIC_URL=https://<subdomain>.r2.dev
```

Replace the placeholders with your actual values:
- `<accountid>` - Your Cloudflare account ID (found in the URL of your Cloudflare dashboard)
- `<subdomain>` - The subdomain assigned to your R2 bucket's public access

## 6. CORS Configuration (Optional)

If you encounter CORS issues:

1. Go to your R2 bucket settings
2. Navigate to "Settings" > "CORS"
3. Add a new rule:
   - Origin: `*` (or your specific domain)
   - Allowed Methods: `GET`, `PUT`, `POST`
   - Allowed Headers: `*`
   - Max Age: `86400` (1 day)

## 7. Testing

After configuration, test the image upload functionality by adding a new project. Your images should successfully upload to R2 and be accessible via the public URL. 