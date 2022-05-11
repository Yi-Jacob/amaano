require('dotenv/config');
const express = require('express');
const app = express();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');
const expressJson = express.json();
const path = require('path');

app.use(expressJson);
app.use(staticMiddleware);
app.use(errorMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/bookmarks', (req, res) => {
  const sql = `
    select *
      from "bookmarks"
  `;
  db.query(sql)
    .then(result => {
      const bookmarks = result.rows;
      res.status(200).json(bookmarks);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.post('/api/bookmarks', (req, res, next) => {
  const { userId, walletAddress, data, bookmarkedAt } = req.body;
  const sql = `
  insert into "bookmarks" ("userId", "walletAddress", "data", "bookmarkedAt")
  values ($1, $2, $3, $4)
  returning *
  `;
  const bookmark = [userId, walletAddress, data, bookmarkedAt];
  if ((!walletAddress) || (!data)) {
    res.status(400).json({
      error: 'Please include both fields'
    });
    return;
  }
  db.query(sql, bookmark)
    .then(result => {
      const newBookmark = result.rows[0];
      res.status(201).json(newBookmark);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.delete('/api/bookmarks/:bookmarkId', (req, res) => {
  const bookmarkId = Number(req.params.bookmarkId);
  const sql = `
  delete from "bookmarks"
  where "bookmarkId" = ${bookmarkId}
  returning *
  `;
  db.query(sql)
    .then(result => {
      const deletedBookmark = result.rows[0];
      if (!deletedBookmark) {
        res.status(404).json({ error: `BookmarkId ${bookmarkId} does not exist in bookmarks table!` });
      } else {
        res.status(204).json(deletedBookmark);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occured.' });
    });
});

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
