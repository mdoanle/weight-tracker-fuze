require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');

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

app.get('/api/entries', (req, res, next) => {
  let sql;
  if (req.query.order === 'date') {
    sql = `
      select *
      from "entries"
      order by "date" ASC
  `;
  } else {
    sql = `
      select *
      from "entries"
      order by "date" DESC
  `;
  }

  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/entries', uploadsMiddleware, (req, res, next) => {
  const { weight, date } = req.body;
  if (!weight || !date) {
    throw new ClientError(400, 'weight and date are required fields');
  } else if (isNaN(weight)) {
    throw new ClientError(400, 'Weight must be a number!');
  }
  const imageUrl = req.file?.filename ?? null;
  let sql;
  let params;
  if (imageUrl === null) {
    sql = `
    insert into "entries" ("weight", "date", "photoUrl")
    values ($1, $2, $3)
    returning *
    `;
    params = [weight, date, imageUrl];
  } else {
    const url = `/images/${req.file.filename}`;
    sql = `
    insert into "entries" ("weight", "date", "photoUrl")
    values ($1, $2, $3)
    returning *
    `;
    params = [weight, date, url];
  }
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => {
      next(err);
    });

});

app.delete('/api/entries/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  const sql = `
    delete from "entries"
      where "entryId" = $1
  `;
  const params = [entryId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/api/users/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning "username", "userId", "joinedAt"
      `;
      const params = [username, hashedPassword];

      return db.query(sql, params)
        .then(result => {
          res.status(201).json(result.rows[0]);
        })
        .catch(err => next(err));
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
