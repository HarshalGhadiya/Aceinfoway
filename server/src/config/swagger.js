import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce Analytics API',
      version: '1.0.0',
      description: 'API documentation for Ecommerce Analytics server.'
    },
    servers: [
      { url: '/api', description: 'Base API path' }
    ],
  },
  // You can add JSDoc annotations later in route files
  apis: ['src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);


