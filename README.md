# User & Teams API

A NestJS REST API for managing users and teams, featuring:
- User and team CRUD operations
- Team membership management
- Captain assignment
- Pagination and sorting for list endpoints
- Global API key authentication (with @Public decorator support)
- Swagger API documentation

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the app
```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

### API Documentation
Swagger UI is available at: [http://localhost:3000/api](http://localhost:3000/api)

## Authentication
All routes are protected by an API key (`x-api-key: dummy-key`) header by default. To make a route public, use the `@Public()` decorator.

## Features
- **Users**: Create, read, update, delete users
- **Teams**: Create, read, update, delete teams
- **Team Members**: Add/remove users to/from teams
- **Captain**: Assign a captain to a team
- **Pagination & Sorting**: Use `page`, `limit`, `sortBy`, `sortOrder` query params on list endpoints

## Example Requests

**Get paginated users:**
```
GET /users?page=1&limit=5&sortBy=name&sortOrder=asc
Headers: x-api-key: dummy-key
```

**Add a user to a team:**
```
POST /teams/1/members/2
Headers: x-api-key: dummy-key
```

## Testing
```bash
npm run test
npm run test:e2e
```

---
Built with [NestJS](https://nestjs.com/)
