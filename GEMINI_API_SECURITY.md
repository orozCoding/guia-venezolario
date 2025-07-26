# Securing Your Gemini API Key

This guide explains how to restrict your Gemini API key to specific domains in Google Cloud Console to prevent unauthorized usage.

## Why Restrict Your API Key?

Since this app uses client-side API calls with `VITE_GEMINI_API_KEY`, the API key is visible in the browser. Restricting it to specific domains prevents abuse if someone finds your key.

## Step-by-Step Instructions

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create one if needed)

### 2. Navigate to API Keys

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"**
3. Find your Gemini API key in the list
4. Click on the key name to edit it

### 3. Restrict to HTTP Referrers

1. In the **"Application restrictions"** section:
   - Select **"HTTP referrers (web sites)"**
   
2. Click **"Add an item"** and add these domains:
   ```
   https://venezolario.netlify.app/*
   https://your-custom-domain.com/*
   ```

3. Replace `your-custom-domain.com` with your actual custom domain if you have one
4. **IMPORTANT**: Do NOT include localhost URLs in production API keys for security reasons
5. For development, create a separate API key with localhost restrictions, or use a staging environment

### 4. API Restrictions (Optional but Recommended)

1. In the **"API restrictions"** section:
   - Select **"Restrict key"**
   - Choose **"Generative Language API"**
   - This ensures the key can only be used for Gemini API calls

### 5. Save Changes

1. Click **"Save"** at the bottom
2. Wait a few minutes for changes to propagate

## Testing Your Restrictions

1. **Test your app** - Should work normally from allowed domains
2. **Test from unauthorized domain** - Should receive 403 Forbidden errors
3. **Check browser console** - Look for any API errors

## Additional Security Measures

### Set Usage Quotas

1. Go to **"APIs & Services"** → **"Quotas"**
2. Find **"Generative Language API"**
3. Set reasonable daily/monthly limits
4. Enable quota alerts

### Monitor Usage

1. Go to **"Monitoring"** in the left sidebar
2. Create dashboards to track:
   - API request count
   - Error rates
   - Response times

### Environment Variables

Make sure your environment variables are set correctly:

```bash
# In Netlify dashboard under "Environment variables"
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

## Troubleshooting

### Common Issues

- **403 Forbidden**: Domain not in allowlist or restrictions too strict
- **API key not working**: Check if restrictions are properly configured
- **Development issues**: Use a separate API key for localhost development

### Testing Commands

```bash
# Test locally
npm run dev

# Test build
npm run build
npm run preview
```

## Security Best Practices

1. ✅ **Always restrict API keys** to specific domains
2. ✅ **Set usage quotas** to prevent unexpected charges  
3. ✅ **Monitor API usage** regularly
4. ✅ **Rotate keys** periodically
5. ✅ **Never commit API keys** to public repositories
6. ✅ **Use environment variables** for all secrets
7. ✅ **Use separate API keys** for development (localhost) and production
8. ✅ **Never include localhost** in production API key restrictions

## Support

If you encounter issues:
1. Check [Google Cloud Console documentation](https://cloud.google.com/docs/authentication/api-keys)
2. Verify your domain restrictions match your deployment URLs
3. Check browser developer tools for specific error messages