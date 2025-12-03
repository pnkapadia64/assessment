# Koinos Assessment Solution

## Overview
This solution addresses all the objectives from the README as follows:

## Backend Implementation

### APIs

- **GET /api/items** - List items with pagination and search
  - Query params: `page`, `limit`, `q` (search query)
  - Returns paginated results with metadata (total, pageSize, hasNextPage, etc.)
- **GET /api/items/:id** - Get single item by ID
  - Returns 404 error if item not found
- **POST /api/items** - Create new item
  - Validates required fields: `name`, `category`, `price`
  - Returns 400 error for invalid data
- **GET /api/stats** - Get items statistics (total count, average price)
  - Cached with file modification time tracking

### Backend objectives

1. **Refactor blocking I/O**  
- Replaced all synchronous file operations with `fs.promises` (async/await)

2. **Performance**  
- Implemented mtime-based caching: Cache stores computed stats and file modification time. Cache recomputes when file's data changes which makes `mtimeMs` change.

3. **Testing**
- **items.test.js**: test cases cover:
  - Happy paths (pagination, search, item creation)
  - Error cases (invalid payloads, missing fields, non-existent items)
  - Edge cases (custom page sizes, empty payloads)
- **stats.test.js**: test cases covering:
  - Response structure and value validation

---

## Frontend (React)

### Frontend objectives

1. **Memory Leak**  
  - Implemented `AbortController` to cancel in-flight requests on unmount
  - Debounced search

2. **Pagination & Search**  
- Configurable page size via `limit` parameter
- Infinite scroll for seamless loading of additional pages
- Debounced search to reduce API calls during typing

3. **Performance**  
- Used `react-window` with `react-window-infinite-loader` for virtualization

4. **UI/UX Polish**  
- Responsive design
- Loading indicators during initial fetch and search
- Displays stats on the header
- Proper error logging in console

---

## Future Enhancements

1. **Backend**
   - Add database and/or API support instead of JSON file for the list of items
   - API for filtering of items

2. **Frontend**
   - Add proper TypeScript for type safety
   - Implement tests
   - Add skeleton loaders or icons instead of "Loading..." text
   - Implement optimistic UI updates
   - Add option to create an item from UI
   - Display of errors and error boundaries
   - Improved UI/UX
