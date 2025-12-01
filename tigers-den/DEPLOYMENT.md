# 🚀 Tigers Den - GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step-by-Step Deployment Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository settings:
   - **Repository name**: `tigers-den` (or any name you prefer)
   - **Description**: "Tigers Den Food Ordering App - Web Prototype"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 2. Update package.json with Your GitHub Info

Open `package.json` and update the `homepage` field:

```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME"
```

**Example:**
If your GitHub username is `johndoe` and repo name is `tigers-den`:
```json
"homepage": "https://johndoe.github.io/tigers-den"
```

### 3. Initialize Git and Push to GitHub

Run these commands in the terminal (from the tigers-den directory):

```bash
# Initialize git repository (already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit - Tigers Den app"

# Add your GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Build and Deploy to GitHub Pages

```bash
# Build the web version and deploy
npm run deploy
```

This command will:
1. Build your Expo app for web (creates `web-build` folder)
2. Push the build to a `gh-pages` branch
3. Deploy to GitHub Pages

### 5. Enable GitHub Pages (if not automatic)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

### 6. Access Your Live App

After a few minutes, your app will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
```

## 🔄 Updating Your Deployed App

Whenever you make changes to your app:

```bash
# 1. Save and commit your changes
git add .
git commit -m "Description of your changes"
git push

# 2. Redeploy to GitHub Pages
npm run deploy
```

## 📝 Important Notes

### Features That May Not Work on Web:
- **Face ID / Touch ID** - Not available in browsers
- **Camera / QR Scanner** - Limited browser support
- **Native animations** - May behave differently
- **Push notifications** - Different implementation needed

### Recommended Testing:
- Test the app in multiple browsers (Chrome, Safari, Firefox)
- Test on both desktop and mobile browsers
- Check console for any errors

### Custom Domain (Optional):
If you want to use a custom domain:
1. Create a file named `CNAME` in the `public` folder
2. Add your domain name to it
3. Configure DNS settings with your domain provider

## 🛠️ Troubleshooting

### Issue: "gh-pages" not found
```bash
npm install --save-dev gh-pages
```

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules web-build
npm install
npm run deploy
```

### Issue: Page shows 404
- Wait 5-10 minutes after first deployment
- Check GitHub Pages settings
- Ensure `gh-pages` branch exists
- Verify homepage URL in package.json matches your GitHub Pages URL

### Issue: Assets not loading
- Check that all asset paths are relative
- Verify `assetBundlePatterns` in app.json includes all assets

## 📱 Sharing Your Prototype

Once deployed, you can share your prototype by simply sharing the URL:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
```

Anyone can access it without needing to install anything!

## 🎯 Quick Reference Commands

```bash
# Start development server
npm start

# Build for web locally
npx expo export:web

# Deploy to GitHub Pages
npm run deploy

# View local web build
npx serve web-build
```

## 📧 Support

If you encounter issues:
1. Check the GitHub Pages deployment status in your repo's Actions tab
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Try clearing cache and rebuilding

---

**Happy Deploying! 🎉**
