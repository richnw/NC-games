## Project Description

This project is now hosted at https://nc-games-z0p2.onrender.com/ where calls to all the endpoints can be made. A list of API endpoints can be seen in endpoints.json or at https://nc-games-z0p2.onrender.com/api/.

It is an Express API backend with PostgreSQL which makes calls to a database of board game reviews. The fully hosted front end which makes use of this back end is found at https://richboardgames.netlify.app/

## Setup

This project can be cloned with

```
$ git clone https://github.com/richnw/NC-games-BE.git
```

Dependencies need to be installed and then the databases created and seeded

```
$ npm install
$ npm run setup-dbs
$ npm run seed
```

The full test suite is run with

```
$ npm run test
```

You will need to setup your own environment variables to run this project.
-First, create two .env files locally.
-The first should be called ".env.development". This file should contain only the line PGDATABASE=nc_games This links to your main database.
-The second file you need to create should be called ".env.test". This file should contain only the line PGDATABASE=nc_games_test This links to your test database.

Please note this project requires at least Node 3.0.0 and PostgreSQL 14.6
