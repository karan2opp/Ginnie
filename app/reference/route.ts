import { ApiReference } from '@scalar/nextjs-api-reference';

export const GET = ApiReference({
  spec: {
    content: {
      openapi: '3.1.0',
      info: {
        title: 'Ginnie AI API',
        version: '1.0.0',
        description: 'Internal API routes for the Ginnie AI Platform',
      },
      paths: {
        '/api/chat': {
          post: {
            summary: 'Send a message to the AI Assistant',
            description: 'Streams a response back using the OpenAI API.',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      messages: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                            content: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Successful stream' }
            }
          }
        },
        '/api/checkout': {
          post: {
            summary: 'Initiate Razorpay Checkout',
            description: 'Creates a Razorpay order for subscription upgrade.',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      planId: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Returns the Razorpay Order ID',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        orderId: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/webhooks/razorpay': {
          post: {
            summary: 'Razorpay Webhook Listener',
            description: 'Receives payment status updates from Razorpay.',
            responses: {
              '200': { description: 'Webhook acknowledged' }
            }
          }
        }
      }
    }
  },
});
