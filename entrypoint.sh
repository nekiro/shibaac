#!/bin/sh

# Check if .initialized file exists
if [ ! -f /usr/app/.initialized ]; then
    echo "Running migrations and seeds for the first time..."
    npm run migrations:run && npm run create:seeds
    # Create .initialized file
    touch /usr/app/.initialized
else
    echo "Migrations and seeds already initialized. Skipping..."
fi

npm run dev
