# Elastic Product Search

A lightweight Node.js and Elasticsearch-based backend for e-commerce product search. Supports product indexing and fast, relevance-ranked keyword search with caching, fuzzy matching.

## Features

- Product indexing and bulk import
- Fast keyword search with relevance ranking
- Fuzzy matching support
- Redis caching for search results
- Basic authentication for API endpoints
- Error handling and logging

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/sakis475/Elasticsearch-Simple-Product-Search.git
   cd Elasticsearch-Simple-Product-Search
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Copy the example environment file and configure as needed:**

   ```sh
   cp .env.example .env
   ```

   Edit `.env` to set your API key, ports, and Elasticsearch/Redis hosts.

4. **Create logs folder**

   Add a folder to keep the logs of the server

   ```sh
   mkdir logs
   ```

## Running the Stack

1. **Start Elasticsearch, Redis, and Kibana using Docker Compose:**

   ```sh
   docker-compose up -d
   ```

   - Elasticsearch: [http://localhost:9200](http://localhost:9200)
   - Kibana: [http://localhost:5601](http://localhost:5601)
   - Redis: [localhost:6370](localhost:6370)

2. **Start the Node.js server:**

   ```sh
   npm start
   ```

   The API will be available [http://localhost:8000/api/v1](http://localhost:8000/api/v1).

## API Usage

All endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <API_KEY>
```

### Endpoints

- **POST `/api/v1/products`**  
  Bulk index products.  
  Body: Array of product objects.

- **GET `/api/v1/search?q=keyword`**  
  Search products by keyword.

- **POST `/api/v1/setup/add-random-products?numberOfProducts=N`**  
  (Dev only) Add N random products to the index.

- **DELETE `/api/v1/setup/delete-all-data`**  
  (Dev only) Delete all products from the index.

## Development

- **Start in watch mode:**

  ```sh
  npm run dev
  ```

- **Logs:**  
  Application logs are written to `logs/app.log`.

## Architecture

This project follows a Layered Architecture structure, separating responsibilities across distinct layers:

**Presentation layer** → routes/ & controller/

**Business logic layer** → services/

**Infrastructure layer** → lib/, errorHandler/, auth/ and external connections (like Redis and elastic)

`routes/` – Defines API endpoints and maps them to controllers.

`controller/` – Handles incoming requests and responses; delegates logic to services.

`services/` – Contains business logic and data operations.

`auth/` – Middleware for authentication and request validation.

`errorHandler/` – Centralized error handling with custom codes and exceptions.

`lib/` – Utilities like logging, Redis, and helper functions.

`types/` – TypeScript models and interfaces for strong typing.

`app.ts / server.ts` – App configuration and server entry point.

## Assumptions

1. There will be a single index named products.

2. Clients are expected to send product data in a specific predefined format.

3. Search functionality will only support text matches on the product title. Searches in other fields are not supported.

4. Clients will always receive a maximum of 10 results per query.
   In the future, a client-specific configuration may allow customization of default result limits or inclusion of an optional query parameter to modify this behavior.

5. Clients are responsible for handling errors gracefully and must be informed of all possible outcomes (e.g., no results found, bad requests, server error).

## License

MIT
