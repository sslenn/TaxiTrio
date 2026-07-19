#!/bin/bash
DB_NAME="taxitrio"
DB_USER="postgres"
BACKUP_DIR="$(dirname "$0")/backups"

echo "Available backups:"
ls -1 "$BACKUP_DIR"/*.sql 2>/dev/null

read -p "Enter backup filename to restore (e.g. taxitrio_backup.sql): " BACKUP_NAME
BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring database $DB_NAME from $BACKUP_FILE..."
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Restore completed successfully."
else
    echo "Restore failed."
    exit 1
fi
