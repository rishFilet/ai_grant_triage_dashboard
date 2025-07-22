# Backend Flask API

This directory contains the Flask backend API for the AI Grant Analysis Dashboard.

## Deployment Options

### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set OPENAI_API_KEY=your_api_key

# Deploy
git subtree push --prefix backend heroku main
```

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Render
- Connect your GitHub repository
- Set root directory to `backend`
- Set build command: `pip install -r requirements.txt`
- Set start command: `python app.py`

## Local Development
```bash
cd backend
pip install -r requirements.txt
export OPENAI_API_KEY=your_api_key
python app.py
```

The API will be available at `http://localhost:5001`
