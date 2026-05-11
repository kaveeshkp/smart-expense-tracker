# Quick Start Guide - Smart Expense Tracker

## ⚠️ Prerequisites Check

Before running the application, ensure you have:

### 1. MySQL Database
✓ MySQL 5.7+ installed and running
✓ Database created: `expense_tracker`
✓ Root user with password set

### 2. Java Environment
✓ Java 17+ installed
```bash
java -version
```

### 3. Node.js
✓ Node.js 18+ installed
```bash
node --version
npm --version
```

---

## 🗄️ MySQL Setup (Windows)

### Option 1: Using MySQL Community Server (Recommended)

1. **Download MySQL from**: https://dev.mysql.com/downloads/mysql/
   - Select MySQL Community Server (latest version)
   - Download MSI Installer for Windows

2. **Install MySQL**:
   - Run the installer
   - Choose "Server Machine" setup type
   - Port: 3306 (default)
   - Windows Service: Enable
   - Root password: Set a strong password (remember it!)

3. **Create Database**:
```bash
# Open Command Prompt or PowerShell
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE expense_tracker;
EXIT;
```

### Option 2: Using Docker (If Installed)

```bash
docker run -d ^
  --name mysql-expense ^
  -e MYSQL_ROOT_PASSWORD=root_password_change_me ^
  -e MYSQL_DATABASE=expense_tracker ^
  -p 3306:3306 ^
  mysql:8.0
```

---

## 🔧 Configure Backend

### 1. Update Backend Configuration

**File:** `backend/.env` (create if doesn't exist)

```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USER=root
DB_PASSWORD=your_mysql_root_password

# JWT Configuration (generate a strong secret)
JWT_SECRET=use_a_very_long_random_string_at_least_256_bits_!@#$%^&*()_+-=[]{}|;:',.<>?/`$!
JWT_EXPIRATION=86400000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🚀 Running the Application

### Terminal 1: Start Backend

```bash
cd backend

# First time setup
mvn clean install

# Run backend
mvn spring-boot:run
```

You should see:
```
Started ExpenseTrackerApplication in X seconds
```

Backend will be at: **http://localhost:8080**

API Docs: **http://localhost:8080/swagger-ui.html**

### Terminal 2: Start Frontend

```bash
cd frontend

# First time setup
npm install

# Run frontend
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

Frontend will be at: **http://localhost:5173**

---

## ✅ Verification Checklist

- [ ] MySQL running on port 3306
- [ ] Database `expense_tracker` created
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Can access Swagger docs: http://localhost:8080/swagger-ui.html
- [ ] Can open http://localhost:5173 in browser

---

## 🧪 Test the Application

### Register a New User

**URL:** http://localhost:5173/register

**Fill in:**
- Full Name: John Doe
- Email: john@example.com
- Password: StrongPass@123 (must contain uppercase, lowercase, number, special char)

**Expected**: Redirects to dashboard after successful registration

### Login

**URL:** http://localhost:5173/login

**Use credentials:**
- Email: john@example.com
- Password: StrongPass@123

---

## 🐛 Troubleshooting

### Backend won't start - "Connection refused"
**Solution:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Check DB_URL connection string

### Frontend can't connect to backend
**Solution:**
- Verify backend is running on 8080
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` in `.env.development`

### Port already in use
**Backend (8080):**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Frontend (5173):**
```bash
# Vite will automatically use next available port
# Or kill process and restart
```

### "Public Key Retrieval is not allowed"
**Solution:**
- Already fixed in application.yml
- Ensure `allowPublicKeyRetrieval=true` in connection string

---

## 📚 API Testing

### Using Swagger UI
- Go to: http://localhost:8080/swagger-ui.html
- Click "Authorize" button
- Paste your JWT token from login
- Try endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass@123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPass@123"
  }'
```

---

## 🔐 Password Requirements

Passwords must contain:
- ✓ Minimum 8 characters
- ✓ At least 1 uppercase letter (A-Z)
- ✓ At least 1 lowercase letter (a-z)
- ✓ At least 1 number (0-9)
- ✓ At least 1 special character (!@#$%^&*)

**Valid examples:**
- StrongPass@123
- MyPass!456abc
- Secure#2026Exp

---

## 📞 Need Help?

1. Check the logs in the terminal
2. Visit: http://localhost:8080/swagger-ui.html for API docs
3. Check PROJECT_REVIEW.md for architecture details
4. Check SETUP_GUIDE.md for deployment options

---

**Last Updated**: May 2026
**All Security Issues Fixed**: ✅ Yes
