# Events API Documentation

## Overview
The Events API provides endpoints for managing and retrieving event information. The system integrates with PayChangu API to sync event data and provides comprehensive filtering, searching, and pagination capabilities.

## Base URL
```
http://localhost:8000/api/events
```

## Authentication
All endpoints are currently public (no authentication required).

---

## Public Endpoints

### 1. Get All Events

**Endpoint:** `GET /`

**Description:** Retrieve a paginated list of all events with optional filtering, searching, and sorting.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination | 1 |
| `limit` | integer | Number of events per page | 10 |
| `search` | string | Search term for title, description, or merchant name | - |
| `merchantName` | string | Filter events by merchant name | - |
| `is_active` | boolean | Filter by active status (true/false) | - |
| `is_past` | boolean | Filter past events (true/false) | - |
| `sortBy` | string | Field to sort by (start_date, end_date, title) | start_date |
| `sortOrder` | string | Sort order (asc/desc) | asc |
| `sync` | string | Sync with PayChangu API (true/false) | true |

**Example Request:**
```bash
GET /api/events?page=1&limit=5&search=concert&sortBy=start_date&sortOrder=desc
```

**Success Response (200):**
```json
{
  "events": [
    {
      "_id": "64f8a2b5c9d4e1234567890a",
      "eventId": 12345,
      "title": "Summer Music Festival",
      "slug": "summer-music-festival-2024",
      "description": "An amazing outdoor music festival",
      "banner_url": "https://example.com/banner.jpg",
      "logo_url": "https://example.com/logo.png",
      "color": "#ff6b6b",
      "terms_text": "Terms and conditions apply",
      "start_date": "2024-07-15T00:00:00.000Z",
      "end_date": "2024-07-17T00:00:00.000Z",
      "start_time": "18:00",
      "end_time": "23:00",
      "is_past": false,
      "merchantName": "MusicEvents Inc",
      "venue": {
        "name": "Central Park",
        "address": "123 Park Ave, New York, NY",
        "location": "New York"
      },
      "balance": {
        "currency": "USD",
        "symbol": "$"
      },
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "pages": 5
  }
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch events"
}
```

---

### 2. Get Single Event by ID

**Endpoint:** `GET /id/:id`

**Description:** Retrieve a single event by its MongoDB ObjectId.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the event |

**Example Request:**
```bash
GET /api/events/id/64f8a2b5c9d4e1234567890a
```

**Success Response (200):**
```json
{
  "event": {
    "_id": "64f8a2b5c9d4e1234567890a",
    "eventId": 12345,
    "title": "Summer Music Festival",
    "slug": "summer-music-festival-2024",
    "description": "An amazing outdoor music festival",
    "banner_url": "https://example.com/banner.jpg",
    "logo_url": "https://example.com/logo.png",
    "color": "#ff6b6b",
    "terms_text": "Terms and conditions apply",
    "start_date": "2024-07-15T00:00:00.000Z",
    "end_date": "2024-07-17T00:00:00.000Z",
    "start_time": "18:00",
    "end_time": "23:00",
    "is_past": false,
    "merchantName": "MusicEvents Inc",
    "venue": {
      "name": "Central Park",
      "address": "123 Park Ave, New York, NY",
      "location": "New York"
    },
    "balance": {
      "currency": "USD",
      "symbol": "$"
    },
    "is_active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch event"
}
```

---

### 3. Get Single Event by Slug

**Endpoint:** `GET /slug/:slug`

**Description:** Retrieve a single event by its URL-friendly slug.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | URL-friendly slug of the event |

**Example Request:**
```bash
GET /api/events/slug/summer-music-festival-2024
```

**Success Response (200):**
```json
{
  "event": {
    "_id": "64f8a2b5c9d4e1234567890a",
    "eventId": 12345,
    "title": "Summer Music Festival",
    "slug": "summer-music-festival-2024",
    "description": "An amazing outdoor music festival",
    "banner_url": "https://example.com/banner.jpg",
    "logo_url": "https://example.com/logo.png",
    "color": "#ff6b6b",
    "terms_text": "Terms and conditions apply",
    "start_date": "2024-07-15T00:00:00.000Z",
    "end_date": "2024-07-17T00:00:00.000Z",
    "start_time": "18:00",
    "end_time": "23:00",
    "is_past": false,
    "merchantName": "MusicEvents Inc",
    "venue": {
      "name": "Central Park",
      "address": "123 Park Ave, New York, NY",
      "location": "New York"
    },
    "balance": {
      "currency": "USD",
      "symbol": "$"
    },
    "is_active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch event"
}
```

---

### 4. Get Upcoming Events

**Endpoint:** `GET /upcoming`

**Description:** Retrieve a list of upcoming events (events that haven't started yet).

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | integer | Maximum number of events to return | 10 |

**Example Request:**
```bash
GET /api/events/upcoming?limit=5
```

**Success Response (200):**
```json
{
  "events": [
    {
      "_id": "64f8a2b5c9d4e1234567890a",
      "eventId": 12345,
      "title": "Summer Music Festival",
      "slug": "summer-music-festival-2024",
      "description": "An amazing outdoor music festival",
      "banner_url": "https://example.com/banner.jpg",
      "logo_url": "https://example.com/logo.png",
      "color": "#ff6b6b",
      "terms_text": "Terms and conditions apply",
      "start_date": "2024-07-15T00:00:00.000Z",
      "end_date": "2024-07-17T00:00:00.000Z",
      "start_time": "18:00",
      "end_time": "23:00",
      "is_past": false,
      "merchantName": "MusicEvents Inc",
      "venue": {
        "name": "Central Park",
        "address": "123 Park Ave, New York, NY",
        "location": "New York"
      },
      "balance": {
        "currency": "USD",
        "symbol": "$"
      },
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch upcoming events"
}
```

---

### 5. Get Past Events

**Endpoint:** `GET /past`

**Description:** Retrieve a list of past events (events that have ended).

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | integer | Maximum number of events to return | 10 |

**Example Request:**
```bash
GET /api/events/past?limit=5
```

**Success Response (200):**
```json
{
  "events": [
    {
      "_id": "64f8a2b5c9d4e1234567890a",
      "eventId": 12344,
      "title": "Winter Concert 2024",
      "slug": "winter-concert-2024",
      "description": "A memorable winter concert",
      "banner_url": "https://example.com/winter-banner.jpg",
      "logo_url": "https://example.com/winter-logo.png",
      "color": "#4ecdc4",
      "terms_text": "Terms and conditions apply",
      "start_date": "2024-01-15T00:00:00.000Z",
      "end_date": "2024-01-15T00:00:00.000Z",
      "start_time": "19:00",
      "end_time": "22:00",
      "is_past": true,
      "merchantName": "MusicEvents Inc",
      "venue": {
        "name": "City Hall",
        "address": "456 Main St, New York, NY",
        "location": "New York"
      },
      "balance": {
        "currency": "USD",
        "symbol": "$"
      },
      "is_active": true,
      "createdAt": "2024-01-01T10:30:00.000Z",
      "updatedAt": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch past events"
}
```

---

### 6. Get Events by Merchant

**Endpoint:** `GET /merchant/:merchantName`

**Description:** Retrieve events filtered by a specific merchant name.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `merchantName` | string | Name of the merchant |

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination | 1 |
| `limit` | integer | Number of events per page | 10 |

**Example Request:**
```bash
GET /api/events/merchant/MusicEvents%20Inc?page=1&limit=10
```

**Success Response (200):**
```json
{
  "events": [
    {
      "_id": "64f8a2b5c9d4e1234567890a",
      "eventId": 12345,
      "title": "Summer Music Festival",
      "slug": "summer-music-festival-2024",
      "description": "An amazing outdoor music festival",
      "banner_url": "https://example.com/banner.jpg",
      "logo_url": "https://example.com/logo.png",
      "color": "#ff6b6b",
      "terms_text": "Terms and conditions apply",
      "start_date": "2024-07-15T00:00:00.000Z",
      "end_date": "2024-07-17T00:00:00.000Z",
      "start_time": "18:00",
      "end_time": "23:00",
      "is_past": false,
      "merchantName": "MusicEvents Inc",
      "venue": {
        "name": "Central Park",
        "address": "123 Park Ave, New York, NY",
        "location": "New York"
      },
      "balance": {
        "currency": "USD",
        "symbol": "$"
      },
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch merchant events"
}
```

---

## Data Models

### Event Object
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ObjectId |
| `eventId` | number | Unique event ID from PayChangu |
| `title` | string | Event title (required) |
| `slug` | string | URL-friendly event identifier (required, unique) |
| `description` | string | Event description |
| `banner_url` | string | URL to event banner image |
| `logo_url` | string | URL to event logo image |
| `color` | string | Primary color for the event (hex format) |
| `terms_text` string | Terms and conditions text |
| `start_date` | Date | Event start date and time (required) |
| `end_date` | Date | Event end date and time (required) |
| `start_time` | string | Event start time (HH:MM format) |
| `end_time` | string | Event end time (HH:MM format) |
| `is_past` | boolean | Whether the event has ended |
| `merchantName` | string | Name of the merchant organizing the event |
| `venue.name` | string | Venue name |
| `venue.address` | string | Venue address |
| `venue.location` | string | Venue location/city |
| `balance.currency` | string | Currency code (e.g., USD, EUR) |
| `balance.symbol` | string | Currency symbol (e.g., $, €) |
| `is_active` | boolean | Whether the event is active |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

---

## Integration with PayChangu API

The Events API automatically syncs with PayChangu's event data when:
- `sync=true` parameter is included in the request (default: true)
- The endpoint is called for the first time or periodically

### PayChangu Sync Process
1. Retrieves events from PayChangu API
2. Upserts (inserts or updates) events in the local database
3. Maintains data consistency between systems

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters or missing required fields |
| 404 | Not Found - Event(s) not found |
| 500 | Internal Server Error - Server-side error occurred |

---

## Rate Limiting
Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## Examples

### Complete Workflow Examples

**1. Get all active upcoming events sorted by start date:**
```bash
GET /api/events?is_active=true&is_past=false&sortBy=start_date&sortOrder=asc
```

**2. Search for specific events with pagination:**
```bash
GET /api/events?search=music&page=2&limit=5
```

**3. Get events by a specific merchant:**
```bash
GET /api/events/merchant/MusicEvents%20Inc
```

**4. Get a single event by slug:**
```bash
GET /api/events/slug/summer-music-festival-2024
```

---

## Notes

- All dates are in ISO 8601 format (UTC)
- The API automatically syncs with PayChangu unless `sync=false` is specified
- Event slugs are URL-friendly and unique
- The system automatically marks events as `is_past` based on the end date
- All endpoints return JSON responses
- Pagination is implemented for list endpoints
- Search functionality matches against title, description, and merchant name