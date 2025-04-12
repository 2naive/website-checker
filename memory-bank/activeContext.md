# Active Context

## Current Focus
- Puppeteer deployment issues on Ubuntu 24.04
- System Chromium integration
- PM2 process management
- Auto-update configuration

## Recent Changes
1. Switched to system Chromium
2. Updated PM2 configuration
3. Added auto-update script
4. Fixed Puppeteer sandbox issues

## Next Steps
1. Complete system Chromium setup
2. Configure auto-updates
3. Test deployment process
4. Document setup procedures

## Active Decisions
1. Use system Chromium instead of npm-installed
2. Run as non-root user in production
3. Use PM2 for process management
4. Implement cron-based updates

## Current Considerations
- Security implications of --no-sandbox
- Update frequency optimization
- Resource usage monitoring
- Error handling improvements 