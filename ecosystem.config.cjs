module.exports = {
  apps: [{
    name: 'website-checker',
    script: 'server.js',
    watch: true,
    autorestart: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      PUPPETEER_ARGS: '--no-sandbox,--disable-setuid-sandbox'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80,
      PUPPETEER_ARGS: '--no-sandbox,--disable-setuid-sandbox'
    }
  }]
} 