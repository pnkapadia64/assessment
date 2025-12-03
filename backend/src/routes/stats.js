const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

const cache = {
  data: null,
  stats: null,
  mtime: null
};

router.get('/', async (req, res, next) => {
  try {
    const stat = await fs.promises.stat(DATA_PATH);

    if (!cache.mtime || stat.mtimeMs !== cache.mtime) {
      console.log('Recomputing stats cache...');
      const raw = await fs.promises.readFile(DATA_PATH, 'utf8');
      const items = JSON.parse(raw);
      
      cache.data = items;
      cache.stats = {
        total: items.length,
        averagePrice:
          items.reduce((acc, cur) => acc + cur.price, 0) / items.length
      };
      cache.mtime = stat.mtimeMs;
    }

    res.json(cache.stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;