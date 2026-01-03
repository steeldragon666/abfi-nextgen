@echo off
REM ============================================================================
REM ABFI Platform - MySQL Setup Script
REM Run this script as Administrator to initialize and configure MySQL
REM ============================================================================

echo ============================================
echo ABFI Platform - MySQL Setup
echo ============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click on this file and select "Run as administrator"
    pause
    exit /b 1
)

set MYSQL_HOME=C:\Program Files\MySQL\MySQL Server 8.4
set DATA_DIR=C:\ProgramData\MySQL\MySQL Server 8.4\Data

echo Creating data directory...
if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"

echo.
echo Initializing MySQL database with insecure mode...
echo This will create a root user with no password initially.
echo.
"%MYSQL_HOME%\bin\mysqld.exe" --initialize-insecure --basedir="%MYSQL_HOME%" --datadir="%DATA_DIR%"

if %errorLevel% neq 0 (
    echo ERROR: Failed to initialize MySQL database
    pause
    exit /b 1
)

echo.
echo Installing MySQL as Windows service...
"%MYSQL_HOME%\bin\mysqld.exe" --install MySQL84 --datadir="%DATA_DIR%"

if %errorLevel% neq 0 (
    echo ERROR: Failed to install MySQL service
    pause
    exit /b 1
)

echo.
echo Starting MySQL service...
net start MySQL84

if %errorLevel% neq 0 (
    echo ERROR: Failed to start MySQL service
    pause
    exit /b 1
)

echo.
echo ============================================
echo MySQL is now running!
echo ============================================
echo.
echo Setting up ABFI database and user...
echo.

REM Create the database and user
"%MYSQL_HOME%\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS abfi_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
"%MYSQL_HOME%\bin\mysql.exe" -u root -e "CREATE USER IF NOT EXISTS 'abfi_user'@'localhost' IDENTIFIED BY 'abfi_password';"
"%MYSQL_HOME%\bin\mysql.exe" -u root -e "GRANT ALL PRIVILEGES ON abfi_platform.* TO 'abfi_user'@'localhost';"
"%MYSQL_HOME%\bin\mysql.exe" -u root -e "FLUSH PRIVILEGES;"

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Database: abfi_platform
echo User: abfi_user
echo Password: abfi_password
echo.
echo Connection string:
echo mysql://abfi_user:abfi_password@localhost:3306/abfi_platform
echo.
echo You can now run: npm run db:push
echo Then run seed scripts to populate data.
echo.
pause
