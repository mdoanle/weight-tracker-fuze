require('dotenv/config');
const path = require('path');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));
app.use(express.json());

app.get('/api/entriesTest', (req, res, next) => {
  const sql = `
  select *
  from "entriesTest"
  order by "date" DESC
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/entriesTest', (req, res, next) => {
  const { weight, date } = req.body;
  if (!weight || !date) {
    throw new ClientError(400, 'weight and date are required fields');
  } else if (isNaN(weight)) {
    throw new ClientError(400, 'Weight must be a number!');
  }
  const sql = `
    insert into "entriesTest" ("weight", "date")
    values ($1, $2)
    returning *
  `;
  const params = [weight, date];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
