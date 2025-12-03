# Koinos Assessment Solution

### Backend APIs

- **GET /api/items** - List items with pagination and search
  - Query params: `page`, `limit`, `q` (search query)
  - Returns paginated results with metadata (total, pageSize, hasNextPage, etc.)
- **GET /api/items/:id** - Get single item by ID  
- **POST /api/items** - Create new item
- **GET /api/stats** - Get items statistics (total count, average price)

### Frontend UI

- **Items List Page** - Main interface features:
  - **Search functionality** - Real-time search within items
  - **Pagination** - Server-side pagination with infinite scroll
  - **Virtualization** - Uses `react-window` for efficient rendering of large lists
  - **Item details** - Click any item to view full details

### Key Features

**Server-side search** - Search by item name via `q` query parameter
**Pagination** - Configurable page size with full pagination metadata
**Virtualized scrolling** - Smooth performance even with large datasets
**Memory leak prevention** - AbortController cleanup on component unmount
**Non-blocking I/O** - Async file operations using `fs.promises`
**Stats caching** - File watcher-based cache invalidation for performance
