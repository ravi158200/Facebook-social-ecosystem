# Facebook Clone - GitHub Deployment Script (Updated)

# 1. Create screenshots directory
New-Item -ItemType Directory -Force -Path "screenshots"

# 2. Add screenshots from the current session if available (Manual step recommended for specific images)
Write-Host "Please ensure latest screenshots are in the \screenshots folder if you want them on GitHub." -ForegroundColor Yellow

# 3. Initialize Git if not already done
if (!(Test-Path ".git")) {
    git init
    git remote add origin https://github.com/ravi158200/Facebook-social-ecosystem.git
}

# 4. Pull latest to avoid conflicts
git pull origin main --rebase

# 5. Add files
git add .

# 6. Commit with detailed message
git commit -m "Enhance: Implemented full Story ecosystem, dynamic Avatars, and fixed Navbar crashes"

# 7. Set main branch
git branch -M main

# 8. Push to GitHub
git push -u origin main

Write-Host "Successfully pushed to GitHub! View it at: https://github.com/ravi158200/Facebook-social-ecosystem" -ForegroundColor Green
