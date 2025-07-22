# Deploying AI Grant Analysis Dashboard to Netlify

## Prerequisites
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed
- [Git](https://git-scm.com/) repository
- OpenAI API key

## Deployment Options

### Option 1: Frontend-Only Deployment (Recommended)

This deploys only the React frontend to Netlify. You'll need to deploy the Flask backend separately (e.g., Heroku, Railway, Render).

#### Steps:
1. **Push to Git repository**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Deploy via Netlify Dashboard**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository
   - Use these build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Set environment variables:
     - `REACT_APP_API_URL`: Your backend API URL
     - `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key

3. **Alternative: Deploy via CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

### Option 2: Full-Stack with Netlify Functions

Deploy both frontend and backend to Netlify using serverless functions.

#### Steps:
1. **Set up environment variables**
   In Netlify dashboard, add:
   - `OPENAI_API_KEY`: Your OpenAI API key

2. **Deploy**
   The `netlify.toml` file is already configured for this option.

## Environment Variables Setup

### In Netlify Dashboard:
1. Go to your site's settings
2. Navigate to "Environment variables"
3. Add the required variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `REACT_APP_API_URL`: (if using separate backend)

### For local development:
Update your `.env` file with:
```env
OPENAI_API_KEY=your_actual_openai_api_key
REACT_APP_API_URL=http://localhost:5001/api  # for local development
```

## Post-Deployment

1. **Test the deployment**
   - Visit your deployed site
   - Try uploading a sample grant application
   - Check that the dashboard loads correctly

2. **Custom domain** (optional)
   - In Netlify dashboard, go to "Domain settings"
   - Add your custom domain

3. **Set up continuous deployment**
   - Any push to your main branch will automatically trigger a new deployment

## Troubleshooting

### Build Issues:
- Ensure `npm run build` works locally
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly

### Function Issues (if using Option 2):
- Check function logs in Netlify dashboard
- Ensure Python dependencies are in `requirements.txt`
- Verify API endpoints match your frontend code

### CORS Issues:
- Make sure your backend allows requests from your Netlify domain
- Update Flask CORS configuration if needed

## Files Created for Deployment:
- `netlify.toml`: Netlify configuration
- `.env.production`: Production environment variables template
- `netlify/functions/api.py`: Serverless function version of backend (Option 2)
- `DEPLOYMENT.md`: This deployment guide

## Support
If you encounter issues, check:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/)
- Your site's deploy logs in Netlify dashboard
