# Technical Context

## Technologies
- Node.js 18+
- Express.js
- Puppeteer
- PM2
- Ubuntu 24.04
- Lighthouse

## Development Setup
1. Node.js installation
2. npm dependencies
3. Development server
4. Testing environment

## Production Setup
1. Ubuntu 24.04
2. Node.js 18+
3. PM2 process manager
4. Required system libraries

## Dependencies
```json
{
  "dependencies": {
    "puppeteer": "^22.15.0",
    "lighthouse": "^11.7.1"
  },
  "devDependencies": {
    "pm2": "^5.3.1"
  }
}
```

## System Requirements
- Ubuntu 24.04
- Node.js 18+
- System libraries for Puppeteer
- PM2 for process management

## Environment Variables
```bash
# For Puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

## Deployment
1. System setup
2. Dependencies installation
3. Application deployment
4. Process management
5. Auto-update configuration 