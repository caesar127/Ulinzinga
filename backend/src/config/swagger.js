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
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          location: { type: "string" },
          price: { type: "number" },
          organizer: { type: "string" },
          status: { type: "string", enum: ["draft", "published", "cancelled"] },
          visibility: { type: "string", enum: ["public", "private"] },
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
    { name: "Events", description: "Event management" },
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

    // ==================== EVENTS ENDPOINTS ====================
    "/api/events": {
      get: {
        summary: "Get all events",
        tags: ["Events"],
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
            name: "status",
            schema: { type: "string" },
            description: "Filter by status",
          },
        ],
        responses: {
          200: {
            description: "List of events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Event" },
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/events/{id}": {
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
    "/api/events/{eventSlug}/purchase": {
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
    "/api/events/sync": {
      post: {
        summary: "Sync events from external source",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Events synced successfully" },
        },
      },
    },
    "/api/events/cleanup-orphaned": {
      post: {
        summary: "Cleanup orphaned events",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Orphaned events cleaned up" },
        },
      },
    },
    "/api/events/{id}/visibility": {
      put: {
        summary: "Update event visibility",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["visibility"],
                properties: {
                  visibility: { type: "string", enum: ["public", "private"] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Visibility updated" },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/events/{id}/status": {
      put: {
        summary: "Update event status",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Event ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["draft", "published", "cancelled"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Status updated" },
          404: { description: "Event not found" },
        },
      },
    },
    "/api/events/tickets/by-email/{email}": {
      get: {
        summary: "Get user tickets by email",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "email",
            required: true,
            schema: { type: "string", format: "email" },
            description: "User email",
          },
        ],
        responses: {
          200: { description: "User tickets" },
          404: { description: "No tickets found" },
        },
      },
    },

    // ==================== WALLET ENDPOINTS ====================
    "/api/wallet": {
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
    "/api/wallet/summary": {
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
    "/api/wallet/deposit": {
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
    "/api/wallet/spend": {
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
    "/api/wallet/transfer": {
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
    "/api/wallet/transactions": {
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
    "/api/wallet/paychangu/callback": {
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
    "/api/wallet/savings/eligibility": {
      get: {
        summary: "Check savings eligibility",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Eligibility status" },
        },
      },
    },
    "/api/wallet/savings/available-events": {
      get: {
        summary: "Get available events for savings",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of available events" },
        },
      },
    },
    "/api/wallet/savings/available-organizers": {
      get: {
        summary: "Get available organizers for savings",
        tags: ["Savings Goals"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of available organizers" },
        },
      },
    },
    "/api/wallet/savings/goals": {
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
    "/api/wallet/savings/goals/{goalId}": {
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
    "/api/wallet/savings/goals/{goalId}/deposit": {
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
    "/api/wallet/savings/goals/{goalId}/withdraw": {
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
    "/api/wallet/savings/goals/{goalId}/allocate": {
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
    "/api/wallet/savings/goals/{goalId}/available-allocation": {
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
    "/api/wallet/savings/organizer/{organizerId}/events": {
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
    "/api/connections": {
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
    "/api/connections/{id}": {
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
    "/api/connections/pending": {
      get: {
        summary: "List pending connection requests",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of pending requests" },
        },
      },
    },
    "/api/connections/sent": {
      get: {
        summary: "List sent connection requests",
        tags: ["Connections"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of sent requests" },
        },
      },
    },
    "/api/connections/{id}/accept": {
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
    "/api/connections/{id}/reject": {
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
    "/api/connections/suggestions": {
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
    "/api/connections/suggestions/advanced": {
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
