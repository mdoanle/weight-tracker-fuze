require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const authorizationMiddleware = require('./authorization-middleware');

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

app.post('/api/users/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required!');
  }
  const sql = `
  select "userId",
  "hashedPassword"
  from "users"
  where username = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isAMatch => {
          if (!isAMatch) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = {
            userId,
            username
          };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/entries', (req, res, next) => {
  const { userId } = req.user;
  let sql;
  let params;
  if (req.query.order === 'date') {
    sql = `
      select *
      from "entries"
      where "userId" = $1
      order by "date" ASC
  `;
    params = [userId];
  } else {
    sql = `
      select *
      from "entries"
      where "userId" = $1
      order by "date" DESC
  `;
    params = [userId];
  }
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/entries', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
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
    insert into "entries" ("weight", "date", "photoUrl", "userId")
    values ($1, $2, $3, $4)
    returning *
    `;
    params = [weight, date, imageUrl, userId];
  } else {
    const url = `/images/${req.file.filename}`;
    sql = `
    insert into "entries" ("weight", "date", "photoUrl", "userId")
    values ($1, $2, $3)
    returning *
    `;
    params = [weight, date, url, userId];
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
  const { userId } = req.user;
  const entryId = Number(req.params.entryId);
  const sql = `
    delete from "entries"
      where "entryId" = $1
      and "userId" = $2
  `;
  const params = [entryId, userId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      next(err);
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
