#!/bin/bash

# Exit on error
set -e

echo "🔍 Checking for updates..."

# Change to app directory
cd ~/website-checker

# Check for updates
git fetch origin

# Compare local and remote
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ Already up to date"
else
    echo "📥 Updates available, pulling changes..."
    git pull origin master
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🔄 Restarting application..."
    pm2 restart site-checker
    
    echo "✅ Update completed!"
fi 