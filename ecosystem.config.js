module.exports = {
  apps: [{
    name: 'website-checker',
    script: 'server.js',
    watch: true,
    autorestart: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
}