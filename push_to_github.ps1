# Facebook Clone - GitHub Deployment Script

# 1. Create screenshots directory
New-Item -ItemType Directory -Force -Path "screenshots"

# 2. Copy screenshots from Antigravity Brain (Updated with actual paths)
Copy-Item "C:\Users\ravir\.gemini\antigravity\brain\713a32ab-bd8c-4f3f-b6af-3f9a712e89bf\login_page_1776182529098.png" -Destination "screenshots\login.png"
Copy-Item "C:\Users\ravir\.gemini\antigravity\brain\713a32ab-bd8c-4f3f-b6af-3f9a712e89bf\home_page_1776182426942.png" -Destination "screenshots\home.png"
Copy-Item "C:\Users\ravir\.gemini\antigravity\brain\713a32ab-bd8c-4f3f-b6af-3f9a712e89bf\profile_page_1776182477771.png" -Destination "screenshots\profile.png"
Copy-Item "C:\Users\ravir\.gemini\antigravity\brain\713a32ab-bd8c-4f3f-b6af-3f9a712e89bf\friends_page_1776182498873.png" -Destination "screenshots\friends.png"

# 3. Initialize Git
git init

# 4. Add files
git add .

# 5. Commit
git commit -m "Initial commit: High-fidelity Facebook Social Ecosystem"

# 6. Set main branch
git branch -M main

# 7. Add remote
git remote add origin https://github.com/ravi158200/facebook-social-ecosystem.git

# 8. Push to GitHub (Force push to overwrite initial README/gitignore from browser)
git push -u origin main -f

Write-Host "Successfully pushed to GitHub! View it at: https://github.com/ravi158200/facebook-social-ecosystem" -ForegroundColor Green
