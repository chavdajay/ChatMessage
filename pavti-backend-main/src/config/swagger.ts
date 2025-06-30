import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pavti API",
      version: "1.0.0",
      description: "API documentation for the Pavti application",
    },
    servers: [
      {
        url: "http://localhost:3010", // Update with your server URL
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60c72b2f9b1d8c001f8e4d4b",
            },
            fullName: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            contactNo: {
              type: "string",
              example: "911234567890",
            },
            isApprove: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "approved",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            isTempName: {
              type: "boolean",
              example: false,
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60c72b2f9b1d8c001f8e4d4c",
            },
            userId: {
              type: "string",
              example: "60c72b2f9b1d8c001f8e4d4b",
            },
            messageId: {
              type: "string",
              example:
                "wamid.HBgLOTE5NzI2NzI3NzgwFQIAEhgWM0VCMDlGNEU5MEE1NjJBRDEzQjUA",
            },
            message: {
              type: "string",
              example: "This is a sample message.",
            },
            isSend: {
              type: "boolean",
              example: true,
            },
            isDelivered: {
              type: "boolean",
              example: true,
            },
            isReceived: {
              type: "boolean",
              example: false,
            },
            isSeen: {
              type: "boolean",
              example: false,
            },
            hasAttachment: {
              type: "boolean",
              example: false,
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/api/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
