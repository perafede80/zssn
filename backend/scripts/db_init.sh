#!/bin/bash

export PGUSER="postgres"

# Stop script on first error
set -e

# Drop the database if it exists
psql -c "DROP DATABASE IF EXISTS zssn"

# Create the database
psql -c "CREATE DATABASE zssn"

# Create the extension in the newly created database
psql -d zssn -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"