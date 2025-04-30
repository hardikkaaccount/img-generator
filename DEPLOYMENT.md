# Deploying Prompt Wars to Vercel

This guide provides step-by-step instructions for deploying the Prompt Wars application to Vercel with MongoDB Atlas integration.

## Prerequisites

- GitHub account (to store your repository)
- Vercel account (for deployment)
- MongoDB Atlas account (for database hosting)
- Hugging Face account (for API access to image generation)

## Step 1: Set Up MongoDB Atlas

1. Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project (if you don't have one already)
3. Create a new cluster:
   - Choose a cloud provider (AWS, Google Cloud, or Azure)
   - Select a region closest to your users
   - Choose the free tier option (M0) for development

4. Set up database security:
   - Create a database user:
     - Go to "Database Access" → "Add New Database User"
     - Select "Password" authentication
     - Create a username and secure password
     - Set user privileges to "Read and Write to Any Database"
     - Click "Add User"

   - Configure network access:
     - Go to "Network Access" → "Add IP Address"
     - For development: Add your current IP or select "Allow Access from Anywhere" (not recommended for production)
     - For production: Select "Allow Access from Anywhere" (since Vercel uses dynamic IPs)
     - Click "Confirm"

5. Get your connection string:
   - Go to "Databases" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with a name like `prompt-wars`

## Step 2: Set Up Hugging Face API

1. Sign up or log in to [Hugging Face](https://huggingface.co/)
2. Go to your profile → Settings → Access Tokens
3. Create a new token with "read" access
4. Copy the token for later use

## Step 3: Prepare Your Project for Deployment

1. Ensure your project is in a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/prompt-wars.git
   git push -u origin main
   ```

2. Make sure your project has the required configuration files:
   - `next.config.mjs` (already exists with proper image configuration)
   - Verify that your MongoDB connection is set up in `app/utils/db.ts`

## Step 4: Deploy to Vercel

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next

5. Set up environment variables:
   - Click on "Environment Variables" and add the following:
     ```
     MONGODB_URI=your_mongodb_connection_string
     HUGGING_FACE_API_KEY=your_hugging_face_api_key
     HUGGING_FACE_API_URL=https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1
     ```
     
6. Click "Deploy"

## Step 5: Verify Your Deployment

1. Once deployment is complete, click on the generated URL to access your application
2. Test user registration and login
3. Test image generation and submission
4. Verify that data is being stored in your MongoDB Atlas database

## Troubleshooting

### Authentication Issues with MongoDB

- Verify that your connection string is correct
- Check that your database user has the correct permissions
- Ensure the password in the connection string is URL-encoded
- Check that network access is properly configured

### Image Generation Issues

- Verify your Hugging Face API key is correct
- Check that the API URL for the Stable Diffusion model is correct
- Review logs for any errors in the API calls

#### Extended Image Generation Troubleshooting

If the application is falling back to the mock image service:

1. **API Quotas**: Hugging Face free tier has limits on the number of requests. Verify you haven't exceeded your quota.

2. **Model Availability**: Ensure the Stable Diffusion model is available. Sometimes models can be temporarily unavailable.

3. **Response Timeout**: The application has a 30-second timeout for API calls. For complex images, this might not be enough.
   - Monitor Vercel logs to see if requests are timing out

4. **Content Filtering**: Hugging Face has content filters that might block certain prompts:
   - Avoid prompts with potentially sensitive or explicit content
   - Review logs to see if content filtering is triggering

5. **Network Issues**: Vercel functions might have connectivity issues with Hugging Face:
   - Check Vercel function logs for network timeouts or connection errors
   - Consider increasing the timeout value in `imageGeneration.ts` if needed

6. **API Format Checks**: Ensure the Hugging Face API isn't sending unexpected responses:
   - Look for changes in the API response format
   - Check if the content type being returned is properly recognized as an image

7. **Memory or CPU Limitations**: Vercel serverless functions have limitations:
   - If processing large images, you might hit memory limits
   - Consider optimizing the image processing logic or upgrading your Vercel plan

### Build Errors

If you encounter build errors related to TypeScript or ESLint:

- The application already has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true` set in `next.config.mjs`
- Check for missing dependencies and install them:
  ```bash
  npm install
  ```

## Updating Your Deployment

After making changes to your application:

1. Commit changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Vercel will automatically detect the changes and redeploy your application

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://username:password@cluster0.mongodb.net/prompt-wars?retryWrites=true&w=majority |
| HUGGING_FACE_API_KEY | API key for Hugging Face | hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| HUGGING_FACE_API_URL | Endpoint URL for the Stable Diffusion model | https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1 | 