const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ 
    message: err.message,
    error: err 
  });
});

describe('Items API', () => {
  it('should fetch all items with pagination', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('pageSize');
    expect(res.body.pagination).toHaveProperty('total');
  });

  it('should fetch items with custom page size', async () => {
    const res = await request(app).get('/api/items?limit=5');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.pagination.pageSize).toBe(5);
  });

  it('should fetch specific page', async () => {
    const res = await request(app).get('/api/items?page=2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.pagination.page).toBe(2);
  });

  it('should give error for non-existing item', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Item not found');
  });
  
  it('should create a new item', async () => {
    const newItem = { name: 'Test Item', price: 10.99, category: 'Test' };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newItem.name);
  });

  it('should search items by query with pagination', async () => {
    const res = await request(app).get('/api/items?q=laptop');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    res.body.data.forEach(item => {
      expect(item.name.toLowerCase()).toContain('laptop');
    });
  });

  it('should return pagination metadata correctly', async () => {
    const res = await request(app).get('/api/items?limit=3&page=1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.pagination.pageSize).toBe(3);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination).toHaveProperty('totalPages');
    expect(res.body.pagination).toHaveProperty('hasNextPage');
    expect(res.body.pagination).toHaveProperty('hasPreviousPage');
  });
});