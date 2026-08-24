$(> db/bookings.sqlite)
cat db/migrate.sql | sqlite3 db/bookings.sqlite
