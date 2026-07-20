#!/bin/bash
DB_NAME="taxitrio"
DB_USER="postgres"
BACKUP_DIR="$(dirname "$0")/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/taxitrio_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "Backing up database $DB_NAME to $BACKUP_FILE..."
pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" -F p -v -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup completed successfully."
else
    echo "Backup failed."
    exit 1
fi
