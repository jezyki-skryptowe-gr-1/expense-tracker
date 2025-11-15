#!/bin/bash
set -e

echo "🔄 Testing DB connection..."

PGPASSWORD="$REAL_PG_PASS" \
psql "host=$REAL_PG_HOST dbname=$REAL_PG_DB user=$REAL_PG_USER" \
  -c "SELECT current_database();"

echo "✅ Connection OK"

echo "🚀 Executing init.sql..."

PGPASSWORD="$REAL_PG_PASS" \
psql "host=$REAL_PG_HOST dbname=$REAL_PG_DB user=$REAL_PG_USER" \
  -f sql/init.sql

echo "🎉 init.sql executed successfully!"
