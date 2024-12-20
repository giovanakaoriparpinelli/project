module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Express REST API',
    version: '1.0.0',
    description: 'A REST API built with Express.js'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ]
};