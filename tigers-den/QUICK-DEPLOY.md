# 🚀 Quick Deployment Commands

## First Time Setup

1. **Create GitHub repo** at github.com

2. **Update package.json homepage:**
   ```json
   "homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

## Update & Redeploy

```bash
git add .
git commit -m "Your changes"
git push
npm run deploy
```

## Your Live URL
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
```

Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual GitHub username and repository name!
