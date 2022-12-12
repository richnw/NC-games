You will need to setup your own environment variables to run this project.

First, create two .env files locally.

The first should be called ".env.development". This file should contain only the line PGDATABASE=nc_games This links to your main database.

The second file you need to create should be called ".env.test". This file should contain only the line PGDATABASE=nc_games_test This links to your test database.
