const request = require('supertest');
const express = require('express');
const statsRouter = require('../routes/stats');

const app = express();
app.use(express.json());
app.use('/api/stats', statsRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ 
    message: err.message,
    error: err 
  });
});

describe('Stats API', () => {
  it('should fetch stats with total and averagePrice', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('averagePrice');
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.averagePrice).toBe('number');
  });

  it('should return valid total count', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('should return valid average price', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.averagePrice).toBeGreaterThan(0);
    expect(Number.isFinite(res.body.averagePrice)).toBe(true);
  });
});
