import { apiReference } from "@scalar/express-api-reference";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Ulinzinga API",
    version: "1.0.0",
    description: "API documentation for Ulinzinga backend services",
    contact: {
      name: "API Support",
      email: "support@ulinzinga.com",
    },
  },
  servers: [
    {
      url: "https://ulinzinga.onrender.com/",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Event: {
        type: "object",
        properties: {
          _id: { type: "string" },
          eventId: { type: "string" },
          slug: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          venue_name: { type: "string" },
          location: { type: "string" },
          organizer: { type: "string" },
          visible: { type: "boolean" },
          isActive: { type: "boolean" },
          isPast: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedEvents: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["success", "error"] },
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Event" },
          },
          pagination: {
            type: "object",
            properties: {
              currentPage: { type: "integer" },
              totalPages: { type: "integer" },
              totalCount: { type: "integer" },
              limit: { type: "integer" },
              hasNextPage: { type: "boolean" },
              hasPrevPage: { type: "boolean" },
              sortBy: { type: "string" },
              sortOrder: { type: "string", enum: ["asc", "desc"] },
            },
          },
        },
      },
      OrganizerEvent: {
        type: "object",
        properties: {
          _id: { type: "string" },
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          venue_name: { type: "string" },
          location: { type: "string" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          isActive: { type: "boolean" },
          isVisible: { type: "boolean" },
          status: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Wallet: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          balance: { type: "number" },
          currency: { type: "string" },
        },
      },
      Goal: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          targetAmount: { type: "number" },
          currentAmount: { type: "number" },
          deadline: { type: "string", format: "date" },
        },
      },
      Connection: {
        type: "object",
        properties: {
          _id: { type: "string" },
          requester: { type: "string" },
          recipient: { type: "string" },
          status: { type: "string", enum: ["pending", "accepted", "rejected"] },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          _id: { type: "string" },
          type: {
            type: "string",
            enum: ["deposit", "withdrawal", "transfer", "spend"],
          },
          amount: { type: "number" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Content: {
        type: "object",
        properties: {
          _id: { type: "string" },
          event: { type: "string" },
          user: { type: "string" },
          medias: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["image", "video"] },
                url: { type: "string" },
                thumbnailUrl: { type: "string" },
                storage: {
                  type: "object",
                  properties: {
                    projectName: { type: "string" },
                    path: { type: "string" },
                  },
                },
              },
            },
          },
          caption: { type: "string" },
          visibilityScope: {
            type: "string",
            enum: ["event", "profile", "vault"],
          },
          privacy: { type: "string", enum: ["public", "private"] },
          approvalStatus: {
            type: "string",
            enum: ["pending", "approved", "rejected"],
          },
          approvedBy: { type: "string" },
          approvedAt: { type: "string", format: "date-time" },
          rejectionReason: { type: "string" },
          analytics: {
            type: "object",
            properties: {
              views: { type: "integer" },
              likes: { type: "integer" },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          profile: {
            type: "object",
            properties: {
              picture: { type: "string", description: "Profile picture URL" },
              bio: { type: "string" },
            },
          },
          interests: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Auth - Merchant",
      description: "Merchant authentication (Vendors & Organizers)",
    },
    { name: "Auth - User", description: "Regular user authentication" },
    { name: "Auth - Google", description: "Google OAuth authentication" },
    { name: "Events", description: "Public event management" },
    { name: "Organizer Events", description: "Organizer event management" },
    // { name: "Users", description: "User management" },
    { name: "User Events", description: "User event interactions" },
    { name: "Users", description: "User management" },
    { name: "Content", description: "Content management" },
    { name: "Wallet", description: "Wallet operations" },
    { name: "Savings Goals", description: "Savings goals management" },
    { name: "Connections", description: "User connections" },
  ],
  paths: {
    // ==================== AUTH ENDPOINTS ====================
    "/api/auth/merchant/login": {
      post: {
        summary: "Merchant login",
        tags: ["Auth - Merchant"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/merchant/register": {
      post: {
        summary: "Register a new merchant",
        tags: ["Auth - Merchant"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Merchant registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/auth/merchant/verify-token": {
      post: {
        summary: "Verify merchant token",
        tags: ["Auth - Merchant"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token"],
                properties: {
                  token: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Token is valid" },
          401: { description: "Invalid token" },
        },
      },
    },
    "/api/auth/merchant/logout": {
      post: {
        summary: "Merchant logout",
        tags: ["Auth - Merchant"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logout successful" },
        },
      },
    },
    "/api/auth/google/login": {
      get: {
        summary: "Initiate Google OAuth login",
        tags: ["Auth - Google"],
        responses: {
          302: { description: "Redirect to Google OAuth" },
        },
      },
    },
    "/api/auth/google/callback": {
      get: {
        summary: "Google OAuth callback",
        tags: ["Auth - Google"],
        parameters: [
          {
            in: "query",
            name: "code",
            schema: { type: "string" },
            description: "Authorization code from Google",
          },
        ],
        responses: {
          200: { description: "Authentication successful" },
          401: { description: "Authentication failed" },
        },
      },
    },
    "/api/auth/user/signup": {
      post: {
        summary: "Register a new user",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/auth/user/signin": {
      post: {
        summary: "User login",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/user/logout": {
      post: {
        summary: "User logout",
        tags: ["Auth - User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logout successful" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get current logged-in user",
        tags: ["Auth - User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user data" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/auth/validateusername/{username}": {
      get: {
        summary: "Check username availability",
        tags: ["Auth - User"],
        parameters: [
          {
            in: "path",
            name: "username",
            required: true,
            schema: { type: "string" },
            description: "Username to validate",
          },
        ],
        responses: {
          200: {
            description: "Username validation result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    message: {
                      type: "string",
                      example: "Username is available",
                    },
                    data: {
                      type: "object",
                      properties: {
                        username: {
                          type: "string",
                          example: "caesar127",
                        },
                        available: {
                          type: "boolean",
                          example: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Username is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "error" },
                    message: {
                      type: "string",
                      example: "Username is required",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to validate username",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "error" },
                    message: {
                      type: "string",
                      example: "Failed to validate username",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ==================== USER AUTH ENDPOINTS ====================
    "/api/user/auth/user/signup": {
      post: {
        summary: "Register a new user",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/user/auth/user/signin": {
      post: {
        summary: "User login",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/user/auth/user/logout": {
      post: {
        summary: "User logout",
        tags: ["Auth - User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logout successful" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/auth/me": {
      get: {
        summary: "Get current logged-in user",
        tags: ["Auth - User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user data" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/auth/user/forgot-password": {
      post: {
        summary: "Request password reset",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset email sent" },
          404: { description: "User not found" },
          500: { description: "Failed to send email" },
        },
      },
    },
    "/api/user/auth/user/reset-password": {
      post: {
        summary: "Reset password with token",
        tags: ["Auth - User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                  token: { type: "string", description: "Reset token from email" },
                  newPassword: { type: "string", minLength: 6, description: "New password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successfully" },
          400: { description: "Invalid or expired token" },
          500: { description: "Failed to reset password" },
        },
      },
    },

    // ==================== USERS ENDPOINTS ====================
    "/api/user/users/picture": {
      post: {
        summary: "Upload user profile picture",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  picture: {
                    type: "string",
                    format: "binary",
                    description: "Profile picture file (max 5MB, images only)",
                  },
                },
                required: ["picture"],
              },
            },
          },
        },
        responses: {
          200: { description: "Profile picture uploaded successfully" },
          400: { description: "No file uploaded or invalid file type" },
          401: { description: "Unauthorized" },
        },
      },
    },
    // "/api/user/users": {
    //   post: {
    //     summary: "Create a new user",
    //     tags: ["Users"],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             required: ["name", "email"],
    //             properties: {
    //               name: { type: "string" },
    //               email: { type: "string", format: "email" },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       201: { description: "User created successfully" },
    //       400: { description: "Validation error" },
    //     },
    //   },
    //   get: {
    //     summary: "Get all users",
    //     tags: ["Users"],
    //     responses: {
    //       200: {
    //         description: "List of users",
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "array",
    //               items: { $ref: "#/components/schemas/User" },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // "/api/user/users/{id}": {
    //   get: {
    //     summary: "Get user by ID",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     responses: {
    //       200: {
    //         description: "User details",
    //         content: {
    //           "application/json": {
    //             schema: { $ref: "#/components/schemas/User" },
    //           },
    //         },
    //       },
    //       404: { description: "User not found" },
    //     },
    //   },
    //   put: {
    //     summary: "Update user",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             properties: {
    //               name: { type: "string" },
    //               email: { type: "string", format: "email" },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       200: { description: "User updated successfully" },
    //       404: { description: "User not found" },
    //     },
    //   },
    //   delete: {
    //     summary: "Delete user",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     responses: {
    //       200: { description: "User deleted successfully" },
    //       404: { description: "User not found" },
    //     },
    //   },
    // },
    // "/api/user/users/profile/{id}": {
    //   post: {
    //     summary: "Get current user profile",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     responses: {
    //       200: {
    //         description: "User profile",
    //         content: {
    //           "application/json": {
    //             schema: { $ref: "#/components/schemas/User" },
    //           },
    //         },
    //       },
    //       404: { description: "User not found" },
    //     },
    //   },
    // },
    // "/api/user/users/{id}/profile": {
    //   put: {
    //     summary: "Update user profile",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             properties: {
    //               name: { type: "string" },
    //               email: { type: "string", format: "email" },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       200: { description: "Profile updated successfully" },
    //       404: { description: "User not found" },
    //     },
    //   },
    // },
    // "/api/user/users/{id}/interests": {
    //   put: {
    //     summary: "Update user interests",
    //     tags: ["Users"],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "User ID",
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             required: ["interests"],
    //             properties: {
    //               interests: {
    //                 type: "array",
    //                 items: { type: "string" },
    //                 minItems: 1,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       200: { description: "Interests updated successfully" },
    //       400: { description: "Validation error" },
    //       404: { description: "User not found" },
    //     },
    //   },
    // },

    // ==================== USER EVENTS ENDPOINTS ====================
    "/api/user/events/recommended": {
      get: {
        summary: "Get recommended events",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 5, maximum: 50, default: 20 },
            description: "Items per page (minimum: 5, maximum: 50)",
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: ["start_date", "createdAt", "title"],
              default: "createdAt",
            },
            description: "Sort field",
          },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of recommended events",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/trending": {
      get: {
        summary: "Get trending events",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 5, maximum: 50, default: 20 },
            description: "Items per page (minimum: 5, maximum: 50)",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of trending events",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/interests": {
      get: {
        summary: "Get events by user interests",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 5, maximum: 50, default: 20 },
            description: "Items per page (minimum: 5, maximum: 50)",
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: ["start_date", "createdAt", "title"],
              default: "createdAt",
            },
            description: "Sort field",
          },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of events matching user interests",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/favorites/events": {
      post: {
        summary: "Add event to favorites",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventId"],
                properties: {
                  eventId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Event added to favorites" },
          400: { description: "Invalid request" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/favorites/events/{eventId}": {
      delete: {
        summary: "Remove event from favorites",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        responses: {
          200: { description: "Event removed from favorites" },
          404: { description: "Event not found in favorites" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/favorites/organizers": {
      post: {
        summary: "Add organizer to favorites",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["organizerId"],
                properties: {
                  organizerId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Organizer added to favorites" },
          400: { description: "Invalid request" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/favorites/organizers/{organizerId}": {
      delete: {
        summary: "Remove organizer from favorites",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "organizerId",
            required: true,
            schema: { type: "string" },
            description: "Organizer ID",
          },
        ],
        responses: {
          200: { description: "Organizer removed from favorites" },
          404: { description: "Organizer not found in favorites" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/tickets/{eventId}": {
      get: {
        summary: "Get user tickets for event",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        responses: {
          200: { description: "User tickets for the event" },
          404: { description: "Event not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/events/purchasedevents": {
      get: {
        summary: "Get events that the user purchased tickets for",
        tags: ["User Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page (minimum: 1, maximum: 50)",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of events user purchased tickets for",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },

    // ==================== EVENTS ENDPOINTS ====================
    "/api/public/events": {
      get: {
        summary: "Get all events",
        tags: ["Events"],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 5, maximum: 50, default: 20 },
            description: "Items per page (minimum: 5, maximum: 50)",
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: [
                "start_date",
                "createdAt",
                "updatedAt",
                "analytics.views",
                "title",
              ],
              default: "start_date",
            },
            description: "Sort field",
          },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
          {
            in: "query",
            name: "visible",
            schema: { type: "boolean" },
            description: "Filter by visibility",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
          {
            in: "query",
            name: "isPast",
            schema: { type: "boolean" },
            description: "Filter by past events",
          },
          {
            in: "query",
            name: "startDate",
            schema: { type: "string", format: "date" },
            description: "Filter events starting from date (ISO 8601)",
          },
          {
            in: "query",
            name: "endDate",
            schema: { type: "string", format: "date" },
            description: "Filter events ending at date (ISO 8601)",
          },
          {
            in: "query",
            name: "onDate",
            schema: { type: "string", format: "date" },
            description: "Filter events happening on specific date (ISO 8601)",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of events",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          400: {
            description: "Invalid query parameters",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/public/events/search": {
      get: {
        summary: "Search events",
        tags: ["Events"],
        parameters: [
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description:
              "Search term to filter events by title, description, venue, or organizer",
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 5, maximum: 50, default: 20 },
            description: "Items per page (minimum: 5, maximum: 50)",
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: [
                "start_date",
                "createdAt",
                "updatedAt",
                "analytics.views",
                "title",
              ],
              default: "start_date",
            },
            description: "Sort field",
          },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
          {
            in: "query",
            name: "visible",
            schema: { type: "boolean" },
            description: "Filter by visibility",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
          {
            in: "query",
            name: "isPast",
            schema: { type: "boolean" },
            description: "Filter by past events",
          },
          {
            in: "query",
            name: "startDate",
            schema: { type: "string", format: "date" },
            description: "Filter events starting from date (ISO 8601)",
          },
          {
            in: "query",
            name: "endDate",
            schema: { type: "string", format: "date" },
            description: "Filter events ending at date (ISO 8601)",
          },
          {
            in: "query",
            name: "onDate",
            schema: { type: "string", format: "date" },
            description: "Filter events happening on specific date (ISO 8601)",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of events matching the search",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedEvents" },
              },
            },
          },
          400: {
            description: "Invalid query parameters",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/public/search": {
      get: {
        summary: "General search across events, content, and organizers",
        tags: ["Events"],
        parameters: [
          {
            in: "query",
            name: "q",
            schema: { type: "string" },
            description: "Search query term",
            required: true,
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
            description: "Maximum number of results per category",
          },
        ],
        responses: {
          200: {
            description: "Search results across different categories",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "Search results retrieved successfully" },
                    data: {
                      type: "object",
                      properties: {
                        events: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Event" },
                          description: "Matching events",
                        },
                        content: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Content" },
                          description: "Matching content items",
                        },
                        organizers: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" },
                          description: "Matching organizers",
                        },
                        connections: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" },
                          description: "Matching connections (if authenticated)",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Query parameter is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Query parameter is required" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/public/events/{id}": {
      get: {
        summary: "Get event by ID",
        tags: ["Events"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        responses: {
          200: {
            description: "Event details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Event" },
              },
            },
          },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/public/events/{eventSlug}/purchase": {
      post: {
        summary: "Initiate ticket purchase",
        tags: ["Events"],
        parameters: [
          {
            in: "path",
            name: "eventSlug",
            required: true,
            schema: { type: "string" },
            description: "Event slug",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ticketType", "quantity"],
                properties: {
                  ticketType: { type: "string" },
                  quantity: { type: "integer", minimum: 1 },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Purchase initiated" },
          400: { description: "Invalid request" },
        },
      },
    },
    // "/api/public/events/sync": {
    //   post: {
    //     summary: "Sync events from external source",
    //     tags: ["Events"],
    //     security: [{ bearerAuth: [] }],
    //     responses: {
    //       200: { description: "Events synced successfully" },
    //     },
    //   },
    // },
    // "/api/public/events/cleanup-orphaned": {
    //   post: {
    //     summary: "Cleanup orphaned events",
    //     tags: ["Events"],
    //     security: [{ bearerAuth: [] }],
    //     responses: {
    //       200: { description: "Orphaned events cleaned up" },
    //     },
    //   },
    // },
    // "/api/public/events/{id}/visibility": {
    //   put: {
    //     summary: "Update event visibility",
    //     tags: ["Events"],
    //     security: [{ bearerAuth: [] }],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "Event ID",
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             required: ["visibility"],
    //             properties: {
    //               visibility: { type: "string", enum: ["public", "private"] },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       200: { description: "Visibility updated" },
    //       404: { description: "Event not found" },
    //     },
    //   },
    // },
    // "/api/public/events/{id}/status": {
    //   put: {
    //     summary: "Update event status",
    //     tags: ["Events"],
    //     security: [{ bearerAuth: [] }],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "id",
    //         required: true,
    //         schema: { type: "string" },
    //         description: "Event ID",
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         "application/json": {
    //           schema: {
    //             type: "object",
    //             required: ["status"],
    //             properties: {
    //               status: {
    //                 type: "string",
    //                 enum: ["draft", "published", "cancelled"],
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       200: { description: "Status updated" },
    //       404: { description: "Event not found" },
    //     },
    //   },
    // },
    // "/api/public/tickets/{email}": {
    //   get: {
    //     summary: "Get user tickets by email",
    //     tags: ["Events"],
    //     security: [{ bearerAuth: [] }],
    //     parameters: [
    //       {
    //         in: "path",
    //         name: "email",
    //         required: true,
    //         schema: { type: "string", format: "email" },
    //         description: "User email",
    //       },
    //     ],
    //     responses: {
    //       200: { description: "User tickets" },
    //       404: { description: "No tickets found" },
    //     },
    //   },
    // },

    // ==================== ORGANIZER EVENTS ENDPOINTS ====================
    "/api/organizer": {
      get: {
        summary: "Get organizer events",
        tags: ["Organizer Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (minimum: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
            description: "Items per page (minimum: 1, maximum: 50)",
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: ["created_at", "start_date", "title"],
              default: "created_at",
            },
            description: "Sort field",
          },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
          {
            in: "query",
            name: "status",
            schema: { type: "string" },
            description: "Filter by event status",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of organizer events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/OrganizerEvent" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        currentPage: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalCount: { type: "integer" },
                        limit: { type: "integer" },
                        hasNextPage: { type: "boolean" },
                        hasPrevPage: { type: "boolean" },
                        sortBy: { type: "string" },
                        sortOrder: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request or missing organizer token",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // ==================== CONTENT ENDPOINTS ====================
    "/api/user/content/upload": {
      post: {
        summary: "Upload gallery item with multiple medias",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description:
                      "Image or video files to upload (up to 10 files)",
                  },
                  caption: {
                    type: "string",
                    description: "Optional caption for the post",
                  },
                  visibilityScope: {
                    type: "string",
                    enum: ["event", "profile", "vault"],
                    description: "Visibility scope of the gallery item",
                  },
                  privacy: {
                    type: "string",
                    enum: ["public", "private"],
                    description: "Privacy setting",
                  },
                  eventId: {
                    type: "string",
                    description:
                      "Event ID (required if visibilityScope is 'event')",
                  },
                },
                required: ["files", "visibilityScope"],
              },
            },
          },
        },
        responses: {
          201: { description: "Gallery item uploaded successfully" },
          400: { description: "Invalid file or missing required fields" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/content/event/{eventId}/access": {
      get: {
        summary: "Check event upload access",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        responses: {
          200: { description: "Access check result" },
          401: { description: "Unauthorized" },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/user/content/event/{eventId}": {
      get: {
        summary: "Fetch event gallery",
        tags: ["Content"],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page",
          },
        ],
        responses: {
          200: {
            description: "Event gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Content" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        currentPage: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalCount: { type: "integer" },
                        limit: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/user/content/user/{userId}": {
      get: {
        summary: "Fetch user gallery",
        tags: ["Content"],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page",
          },
          {
            in: "query",
            name: "scope",
            schema: { type: "string", enum: ["event", "profile", "vault"] },
            description: "Filter by visibility scope",
          },
        ],
        responses: {
          200: {
            description: "User gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Content" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        currentPage: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalCount: { type: "integer" },
                        limit: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
    "/api/user/content/vault": {
      get: {
        summary: "Fetch user vault",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page",
          },
        ],
        responses: {
          200: {
            description: "User vault items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Content" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        currentPage: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalCount: { type: "integer" },
                        limit: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/content/pending/{eventId}": {
      get: {
        summary: "Fetch pending gallery items",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "eventId",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        responses: {
          200: {
            description: "Pending gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Content" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/user/content/approve/{galleryId}": {
      post: {
        summary: "Approve gallery item",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "galleryId",
            required: true,
            schema: { type: "string" },
            description: "Gallery item ID",
          },
        ],
        responses: {
          200: { description: "Gallery item approved successfully" },
          401: { description: "Unauthorized" },
          404: { description: "Gallery item not found" },
        },
      },
    },
    "/api/user/content/reject/{galleryId}": {
      post: {
        summary: "Reject gallery item",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "galleryId",
            required: true,
            schema: { type: "string" },
            description: "Gallery item ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: {
                    type: "string",
                    description: "Reason for rejection",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Gallery item rejected successfully" },
          400: { description: "Rejection reason required" },
          401: { description: "Unauthorized" },
          404: { description: "Gallery item not found" },
        },
      },
    },
    "/api/user/content/{galleryId}": {
      delete: {
        summary: "Delete gallery item",
        tags: ["Content"],
        parameters: [
          {
            in: "path",
            name: "galleryId",
            required: true,
            schema: { type: "string" },
            description: "Gallery item ID",
          },
        ],
        responses: {
          200: { description: "Gallery item deleted successfully" },
          404: { description: "Gallery item not found" },
        },
      },
    },
    "/api/public/content/gallery": {
      get: {
        summary: "Fetch public gallery content",
        tags: ["Content"],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page",
          },
        ],
        responses: {
          200: {
            description: "Public gallery content",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Content" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        currentPage: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalCount: { type: "integer" },
                        limit: { type: "integer" },
                        hasNextPage: { type: "boolean" },
                        hasPrevPage: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Internal server error" },
        },
      },
    },

    // ==================== WALLET ENDPOINTS ====================
    "/api/user/wallet": {
      get: {
        summary: "Get user wallet",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Wallet details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Wallet" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/wallet/summary": {
      get: {
        summary: "Get wallet summary",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Wallet summary with balance and savings" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/wallet/deposit": {
      post: {
        summary: "Add funds to wallet",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", minimum: 1 },
                  paymentMethod: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Deposit initiated" },
          400: { description: "Invalid amount" },
        },
      },
    },
    "/api/user/wallet/spend": {
      post: {
        summary: "Spend funds from wallet",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "description"],
                properties: {
                  amount: { type: "number", minimum: 1 },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Funds spent successfully" },
          400: { description: "Insufficient balance" },
        },
      },
    },
    "/api/user/wallet/transfer": {
      post: {
        summary: "Transfer funds to another user",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "recipientId"],
                properties: {
                  amount: { type: "number", minimum: 1 },
                  recipientId: { type: "string" },
                  note: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Transfer successful" },
          400: { description: "Insufficient balance or invalid recipient" },
        },
      },
    },
    "/api/user/wallet/transactions": {
      get: {
        summary: "Get wallet transactions",
        tags: ["Wallet"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer" },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer" },
            description: "Items per page",
          },
          {
            in: "query",
            name: "type",
            schema: { type: "string" },
            description: "Transaction type filter",
          },
        ],
        responses: {
          200: {
            description: "Transaction history",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    transactions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Transaction" },
                    },
                    total: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/user/wallet/paychangu/callback": {
      post: {
        summary: "PayChangu payment callback",
        tags: ["Wallet"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tx_ref: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Callback processed" },
        },
      },
    },

    // ==================== SAVINGS GOALS ENDPOINTS ====================
    "/api/user/wallet/savings/eligibility": {
      get: {
        summary: "Check savings eligibility",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Eligibility status" },
        },
      },
    },
    "/api/user/wallet/savings/available-events": {
      get: {
        summary: "Get available events for savings",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of available events" },
        },
      },
    },
    "/api/user/wallet/savings/available-organizers": {
      get: {
        summary: "Get available organizers for savings",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of available organizers" },
        },
      },
    },
    "/api/user/wallet/savings/goals": {
      get: {
        summary: "Get all savings goals",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of savings goals",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Goal" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new savings goal",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "targetAmount", "savingType"],
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the savings goal",
                  },
                  description: {
                    type: "string",
                    description: "Description of the goal",
                  },
                  targetAmount: {
                    type: "number",
                    minimum: 1,
                    description: "Target amount to save",
                  },
                  targetDate: {
                    type: "string",
                    format: "date",
                    description: "Target date to reach the goal",
                  },
                  savingType: {
                    type: "string",
                    enum: [
                      "ticket_inclusive",
                      "ticket_exclusive",
                      "event_spending",
                      "complete_event",
                      "organizer",
                    ],
                    description: "Type of savings goal",
                  },
                  event_slug: {
                    type: "string",
                    description: "Event slug (required if savingType is event)",
                  },
                  ticketTypeId: {
                    type: "string",
                    description: "Ticket type ID for event savings",
                  },
                  ticketType: {
                    type: "string",
                    description: "Ticket type name",
                  },
                  ticketQuantity: {
                    type: "integer",
                    minimum: 1,
                    description: "Number of tickets to purchase",
                  },
                  additionalSpending: {
                    type: "number",
                    description: "Additional spending budget for the event",
                  },
                  organizerId: {
                    type: "string",
                    description:
                      "Organizer ID (required if savingType is organizer)",
                  },
                  cutoffDate: {
                    type: "string",
                    format: "date",
                    description: "Cutoff date for savings",
                  },
                  priority: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Priority level of the goal",
                  },
                  reminderDays: {
                    type: "array",
                    items: { type: "integer" },
                    description: "Days before target date to send reminders",
                  },
                  isAutoPurchase: {
                    type: "boolean",
                    description:
                      "Automatically purchase ticket when goal is reached",
                  },
                },
              },
              examples: {
                eventGoal: {
                  summary: "Event savings goal",
                  value: {
                    name: "Concert Ticket Fund",
                    description: "Saving for summer concert",
                    targetAmount: 5000,
                    targetDate: "2024-06-15",
                    savingType: "event",
                    event_slug: "summer-concert-2024",
                    ticketTypeId: "vip-ticket",
                    ticketType: "VIP",
                    ticketQuantity: 2,
                    additionalSpending: 1000,
                    priority: "high",
                    isAutoPurchase: true,
                  },
                },
                organizerGoal: {
                  summary: "Organizer savings goal",
                  value: {
                    name: "Festival Season Fund",
                    description: "Saving for all events by this organizer",
                    targetAmount: 20000,
                    targetDate: "2024-12-31",
                    savingType: "organizer",
                    organizerId: "507f1f77bcf86cd799439011",
                    priority: "medium",
                  },
                },
                generalGoal: {
                  summary: "General savings goal",
                  value: {
                    name: "Entertainment Fund",
                    description: "General entertainment savings",
                    targetAmount: 10000,
                    targetDate: "2024-12-31",
                    savingType: "general",
                    priority: "low",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Goal created successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/user/wallet/savings/goals/{goalId}": {
      put: {
        summary: "Update a savings goal",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  targetAmount: { type: "number" },
                  deadline: { type: "string", format: "date" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Goal updated" },
          404: { description: "Goal not found" },
        },
      },
      delete: {
        summary: "Delete a savings goal",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        responses: {
          200: { description: "Goal deleted" },
          404: { description: "Goal not found" },
        },
      },
    },
    "/api/user/wallet/savings/goals/{goalId}/deposit": {
      post: {
        summary: "Deposit to savings goal",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Deposit successful" },
          400: { description: "Insufficient balance" },
        },
      },
    },
    "/api/user/wallet/savings/goals/{goalId}/withdraw": {
      post: {
        summary: "Withdraw from savings goal",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Withdrawal successful" },
          400: { description: "Insufficient savings" },
        },
      },
    },
    "/api/user/wallet/savings/goals/{goalId}/allocate": {
      post: {
        summary: "Allocate funds to event",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventId", "amount"],
                properties: {
                  eventId: { type: "string" },
                  amount: { type: "number", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Allocation successful" },
          400: { description: "Invalid allocation" },
        },
      },
    },
    "/api/user/wallet/savings/goals/{goalId}/available-allocation": {
      get: {
        summary: "Get available allocation amount",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "goalId",
            required: true,
            schema: { type: "string" },
            description: "Goal ID",
          },
        ],
        responses: {
          200: { description: "Available allocation amount" },
        },
      },
    },
    "/api/user/wallet/savings/organizer/{organizerId}/events": {
      get: {
        summary: "Get events by organizer for savings",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "organizerId",
            required: true,
            schema: { type: "string" },
            description: "Organizer ID",
          },
        ],
        responses: {
          200: { description: "List of organizer events" },
        },
      },
    },

    // ==================== CONNECTIONS ENDPOINTS ====================
    "/api/user/connections": {
      get: {
        summary: "List all connections",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of connections",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Connection" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Send connection request",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["recipientId"],
                properties: {
                  recipientId: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Connection request sent" },
          400: { description: "Invalid request or already connected" },
        },
      },
    },
    "/api/user/connections/{id}": {
      delete: {
        summary: "Remove a connection",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Connection ID",
          },
        ],
        responses: {
          200: { description: "Connection removed" },
          404: { description: "Connection not found" },
        },
      },
    },
    "/api/user/connections/pending": {
      get: {
        summary: "List pending connection requests",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of pending requests" },
        },
      },
    },
    "/api/user/connections/sent": {
      get: {
        summary: "List sent connection requests",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of sent requests" },
        },
      },
    },
    "/api/user/connections/{id}/accept": {
      patch: {
        summary: "Accept connection request",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Connection request ID",
          },
        ],
        responses: {
          200: { description: "Connection accepted" },
          404: { description: "Request not found" },
        },
      },
    },
    "/api/user/connections/{id}/reject": {
      patch: {
        summary: "Reject connection request",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Connection request ID",
          },
        ],
        responses: {
          200: { description: "Connection rejected" },
          404: { description: "Request not found" },
        },
      },
    },
    "/api/user/connections/suggestions": {
      get: {
        summary: "Get suggested connections",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "limit",
            schema: { type: "integer" },
            description: "Number of suggestions",
          },
        ],
        responses: {
          200: { description: "List of suggested connections" },
        },
      },
    },
    "/api/user/connections/suggestions/advanced": {
      get: {
        summary: "Get advanced suggested connections",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "limit",
            schema: { type: "integer" },
            description: "Number of suggestions",
          },
        ],
        responses: {
          200: {
            description:
              "List of advanced suggested connections based on interests",
          },
        },
      },
    },
  },
};

export const setupScalar = (app) => {
  // Serve OpenAPI spec as JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openApiSpec);
  });

  // Serve Scalar API Reference
  app.use(
    "/api-docs",
    apiReference({
      spec: {
        content: openApiSpec,
      },
      theme: "purple",
    })
  );
};

export default openApiSpec;
