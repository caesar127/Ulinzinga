# Events API - Quick Reference for Public Endpoints

## Get All Events

**Endpoint:** `GET /api/events`

**Description:** Retrieve paginated list of all events

**Quick Examples:**
```bash
# Basic usage - get first 10 events
GET /api/events

# Search and pagination
GET /api/events?search=music&page=1&limit=5

# Filter upcoming events only
GET /api/events?is_past=false&sortBy=start_date&sortOrder=asc

# Filter by merchant
GET /api/events?merchantName=MusicEvents%20Inc
```

**Key Parameters:**
- `page` - Page number (default: 1)
- `limit` - Events per page (default: 10)
- `search` - Search in title, description, merchant
- `merchantName` - Filter by merchant
- `is_past` - Filter past events (true/false)
- `is_active` - Filter active status (true/false)
- `sortBy` - Sort field (start_date, end_date, title)
- `sortOrder` - asc or desc

**Response Format:**
```json
{
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## Get Single Event

**By ID:** `GET /api/events/id/:id`
**By Slug:** `GET /api/events/slug/:slug`

**Description:** Retrieve a single event

**Quick Examples:**
```bash
# Get by MongoDB ObjectId
GET /api/events/id/64f8a2b5c9d4e1234567890a

# Get by URL-friendly slug
GET /api/events/slug/summer-music-festival-2024
```

**Response Format:**
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

---

## Error Responses

**Not Found (404):**
```json
{
  "error": "Event not found"
}
```

**Server Error (500):**
```json
{
  "error": "Failed to fetch events"
}
```

---

## Base URL
```
http://localhost:8000/api/events
```

## Notes
- All endpoints are public (no authentication required)
- Automatic PayChangu API sync enabled by default
- All dates in ISO 8601 format
- Slugs are URL-friendly and unique