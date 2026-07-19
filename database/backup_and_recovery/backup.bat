@echo off
SET DB_NAME=taxitrio
SET DB_USER=postgres
SET BACKUP_DIR=%~dp0backups
SET BACKUP_FILE=%BACKUP_DIR%\taxitrio_backup_%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%.sql

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

echo Backing up database %DB_NAME% to %BACKUP_FILE%...
pg_dump -h localhost -U %DB_USER% -d %DB_NAME% -F p -v -f "%BACKUP_FILE%"

if %ERRORLEVEL% equ 0 (
    echo Backup completed successfully.
) else (
    echo Backup failed with error code %ERRORLEVEL%.
)
pause
