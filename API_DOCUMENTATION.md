# Duc-Backend API Documentation

## Overview
This API provides comprehensive management for a restaurant/business application with user authentication, business management, categories, items, and events.

**Base URL:** `http://localhost:3000`  
**Swagger UI:** `http://localhost:3000/api`

## Authentication
The API uses JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## API Endpoints

### 🔐 Authentication (`/auth`)

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Admin"
  }
}
```

#### GET `/auth/profile` 🔒
Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Admin"
}
```

---

### 👥 Users (`/users`)

#### POST `/users`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "Admin",
  "phone": "+1234567890",
  "status": "Active"
}
```

#### GET `/users`
Get all users.

#### GET `/users/{id}`
Get user by ID.

#### PATCH `/users/{id}`
Update user information.

#### DELETE `/users/{id}`
Delete user account.

---

### 🏢 Business Management (`/business`) 🔒

#### POST `/business`
Create business profile.

**Request Body:**
```json
{
  "name": "My Restaurant",
  "logoUrl": "https://example.com/logo.png",
  "faviconUrl": "https://example.com/favicon.ico",
  "email": "contact@restaurant.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "description": "Best restaurant in town",
  "slogan": "Taste the difference",
  "hours": "Mon-Fri: 9AM-10PM",
  "urlFacebook": "https://facebook.com/myrestaurant",
  "urlInstagram": "https://instagram.com/myrestaurant",
  "urlLinkedin": "https://linkedin.com/company/myrestaurant",
  "uberEatsUrl": "https://ubereats.com/restaurant",
  "googleMapsUrl": "https://maps.google.com/location"
}
```

#### GET `/business`
Get all businesses.

#### GET `/business/{id}`
Get business by ID.

#### PATCH `/business/{id}`
Update business information.

#### DELETE `/business/{id}`
Delete business.

---

### 📂 Categories (`/categories`)

#### POST `/categories`
Create a new category.

**Request Body:**
```json
{
  "name": "Appetizers",
  "description": "Delicious starters to begin your meal",
  "imageUrl": "https://example.com/appetizers.jpg",
  "parentId": "550e8400-e29b-41d4-a716-446655440000",
  "displayOrder": 1
}
```

#### GET `/categories`
Get all categories with hierarchical structure.

#### GET `/categories/{id}`
Get category by ID.

#### PATCH `/categories/{id}`
Update category information.

#### DELETE `/categories/{id}`
Delete category.

---

### 🍽️ Items (`/items`)

#### POST `/items`
Create a new item with variants, images, and options.

**Request Body:**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato sauce, mozzarella, and basil",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "Available",
  "variants": [
    {
      "variantName": "Large",
      "price": 12.99,
      "sku": "PIZZA-001-L"
    },
    {
      "variantName": "Medium",
      "price": 9.99,
      "sku": "PIZZA-001-M"
    }
  ],
  "images": [
    {
      "imageUrl": "https://example.com/pizza-main.jpg",
      "isDefault": true
    },
    {
      "imageUrl": "https://example.com/pizza-side.jpg",
      "isDefault": false
    }
  ],
  "options": [
    {
      "optionName": "Extra Cheese",
      "optionType": "addon"
    },
    {
      "optionName": "Gluten Free",
      "optionType": "modifier"
    }
  ]
}
```

#### GET `/items`
Get all items with variants, images, and options.

#### GET `/items/{id}`
Get item by ID with all related data.

#### PATCH `/items/{id}`
Update item and related data.

#### DELETE `/items/{id}`
Delete item and all related data.

---

### 🎉 Events (`/events`)

#### POST `/events`
Create a new event.

**Request Body:**
```json
{
  "name": "Summer Festival",
  "description": "Join us for a wonderful summer celebration",
  "imageUrl": "https://example.com/event.jpg",
  "startDate": "2024-06-01T10:00:00Z",
  "endDate": "2024-06-01T18:00:00Z",
  "status": "Active"
}
```

#### GET `/events`
Get all events with status and dates.

#### GET `/events/{id}`
Get event by ID.

#### PATCH `/events/{id}`
Update event information.

#### DELETE `/events/{id}`
Delete event.

---

## Database Schema

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| name | string | User full name |
| email | string | Unique email address |
| phone | string | Phone number (optional) |
| password | string | Encrypted password |
| role | string | User role (Admin, Manager, Staff) |
| status | string | Account status (Active, Inactive, Suspended) |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### Business Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| name | string | Business name |
| logoUrl | string | Logo image URL |
| faviconUrl | string | Favicon URL |
| email | string | Business email |
| phone | string | Business phone |
| address | text | Business address |
| description | text | Business description |
| currency | string | Default currency (EUR) |
| slogan | string | Business slogan |
| hours | text | Operating hours |
| urlFacebook | string | Facebook page URL |
| urlInstagram | string | Instagram profile URL |
| urlLinkedin | string | LinkedIn profile URL |
| uberEatsUrl | string | Uber Eats restaurant URL |
| googleMapsUrl | string | Google Maps location URL |

### Categories Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| name | string | Category name |
| description | text | Category description |
| displayOrder | number | Sort order |
| imageUrl | string | Category image URL |
| parentId | uuid | Parent category ID (for hierarchy) |

### Items Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| name | string | Item name |
| description | text | Item description |
| status | string | Item status (Available, Unavailable, Discontinued) |
| categoryId | uuid | Foreign key to categories |

### Item Variants Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| variantName | string | Variant name (Size, Type, etc.) |
| price | decimal | Variant price |
| sku | string | Stock keeping unit |
| itemId | uuid | Foreign key to items |

### Item Images Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| imageUrl | string | Image URL |
| isDefault | boolean | Is default image |
| itemId | uuid | Foreign key to items |

### Item Options Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| optionName | string | Option name |
| optionType | string | Option type (addon, modifier, choice) |
| itemId | uuid | Foreign key to items |

### Events Table
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (UUID) |
| name | string | Event name |
| description | text | Event description |
| imageUrl | string | Event image URL |
| startDate | datetime | Event start date |
| endDate | datetime | Event end date |
| status | string | Event status (À venir, En cours, Terminé) |

---

## Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists or constraint violation |

---

## Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## Getting Started

1. **Start the server:** `npm run start:dev`
2. **Access Swagger UI:** Navigate to `http://localhost:3000/api`
3. **Authenticate:** Use the `/auth/login` endpoint to get a JWT token
4. **Test endpoints:** Use the "Authorize" button in Swagger UI to add your token
5. **Explore:** All endpoints are documented and testable through the Swagger interface

---

## Notes

- All protected endpoints require JWT authentication
- Business endpoints require authentication
- Categories, Items, Events, and Users are publicly accessible for reading
- Timestamps are automatically managed by the system
- All entities support soft relationships and cascading operations where appropriate