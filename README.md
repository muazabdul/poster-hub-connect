
# CSC Portal PHP Migration

This project has been migrated from Supabase to a PHP/MySQL backend.

## Project Setup

### Backend Setup

1. **Database Setup**:
   - Create a MySQL database named `csc_portal`
   - Import the database schema from `api/database.sql`

2. **PHP Configuration**:
   - Ensure PHP 7.4+ is installed on your server
   - Required PHP extensions: PDO, PDO_MySQL, JSON, FileInfo
   - Update database connection settings in `api/config/database.php` with your MySQL credentials

3. **File Permissions**:
   - Set write permissions for the uploads directory:
   ```
   chmod -R 755 uploads/
   ```

4. **Default Admin Account**:
   - Email: admin@example.com
   - Password: admin123

### Frontend Setup

1. **Build the React app**:
   ```
   npm run build
   ```

2. **Upload to server**:
   - Upload all files to your web hosting directory
   - Ensure the `.htaccess` file is included for Apache servers
   - If using Nginx, configure URL rewriting similar to the `.htaccess` rules

## API Endpoints

The API endpoints are structured as follows:

### Authentication
- `api/auth/login.php` - User login
- `api/auth/register.php` - User registration
- `api/auth/logout.php` - User logout
- `api/auth/user.php` - Get current user data

### Content
- `api/posters/list.php` - List posters
- `api/categories/list.php` - List categories
- `api/plans/list.php` - List pricing plans
- `api/settings/get.php` - Get application settings
- `api/settings/update.php` - Update application settings

### Media
- `api/upload/image.php` - Upload images

## Directory Structure

```
/api              # PHP backend API
  /auth           # Authentication endpoints
  /categories     # Category-related endpoints
  /config         # Configuration files
  /plans          # Plan-related endpoints
  /posters        # Poster-related endpoints
  /settings       # Settings-related endpoints
  /upload         # File upload endpoints
  database.sql    # Database schema

/public           # Static web assets
  .htaccess       # Apache configuration

/src              # React source code
  /components     # React components
  /lib            # Utility libraries
  /pages          # Page components
```

## Database Structure

The application uses the following database tables:

- `users` - User accounts and profile information
- `user_sessions` - Authentication sessions
- `categories` - Poster categories
- `posters` - Marketing posters
- `downloads` - Download tracking
- `plans` - Subscription plans
- `subscriptions` - User subscriptions
- `settings` - Application settings
