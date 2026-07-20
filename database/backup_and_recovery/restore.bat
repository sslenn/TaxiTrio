@echo off
SET DB_NAME=taxitrio
SET DB_USER=postgres

echo list of available backups:
dir "%~dp0backups\*.sql" /B

set /p BACKUP_NAME="Enter filename to restore (e.g. taxitrio_backup_2026-07-10.sql): "
SET BACKUP_FILE=%~dp0backups\%BACKUP_NAME%

if not exist "%BACKUP_FILE%" (
    echo Backup file does not exist: %BACKUP_FILE%
    pause
    exit /b
)

echo Restoring database %DB_NAME% from %BACKUP_FILE%...
psql -h localhost -U %DB_USER% -d %DB_NAME% -f "%BACKUP_FILE%"

if %ERRORLEVEL% equ 0 (
    echo Restore completed successfully.
) else (
    echo Restore failed with error code %ERRORLEVEL%.
)
pause
