# Smart Expense Tracker

A modern, full-stack expense tracking application with AI-powered features. Built with React 19, Spring Boot 3.3, and MySQL.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with password strength requirements
- **Modern UI**: Beautiful responsive design with Tailwind CSS and Framer Motion animations
- **Type-Safe**: Full TypeScript support on frontend, Java with proper exception handling on backend
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Security**: Input validation, CORS protection, secure password hashing (BCrypt)
- **Error Handling**: Global exception handlers and error boundaries
- **Environment Management**: Configuration via environment variables for all environments

## 📋 Prerequisites

- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- MySQL 5.7+ (database)
- npm or yarn (package manager)

## 🛠️ Setup Instructions

### 1. Clone & Navigate to Project

```bash
git clone <repo-url>
cd smart-expense-tracker/smart-expense-tracker
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
mvn clean install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration (Use a strong 256-bit random secret)
JWT_SECRET=your_super_secret_key_minimum_256_bits_!@#$%^&*()_+-=[]{}|;:',.<>?/
JWT_EXPIRATION=86400000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 2.3 Create MySQL Database

```bash
mysql -u root -p
CREATE DATABASE expense_tracker;
```

#### 2.4 Run Backend

```bash
mvn spring-boot:run
```

Backend will start at `http://localhost:8080`

### 3. Frontend Setup

#### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables

Create a `.env.development` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

#### 3.3 Run Frontend

```bash
npm run dev
```

Frontend will start at `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## 🔐 Security Features

✅ **Input Validation**
- Email format validation
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Size constraints on all inputs

✅ **Authentication**
- JWT tokens with 24-hour expiration
- BCrypt password hashing (strength 12)
- Secure token storage

✅ **CORS Protection**
- Whitelisted origins via environment variables
- Limited allowed headers
- Credentials support

✅ **Error Handling**
- Custom exception classes
- Global exception handler
- Structured error responses
- No stack trace leaks

✅ **Request Limits**
- 1MB max request size
- 8KB max header size
- 10s request timeout

## 📦 Project Structure

```
smart-expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client configuration
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   ├── .env.development   # Dev environment variables
│   ├── .env.production    # Prod environment variables
│   └── package.json       # Dependencies
│
└── backend/
    ├── src/
    │   ├── config/        # Spring configuration
    │   ├── controller/    # REST endpoints
    │   ├── dto/           # Data transfer objects
    │   ├── entity/        # JPA entities
    │   ├── exception/     # Custom exceptions
    │   ├── repository/    # Data access
    │   ├── security/      # JWT & security
    │   └── service/       # Business logic
    ├── .env.example       # Example environment variables
    └── pom.xml            # Maven dependencies
```

## 🧪 Testing

### Frontend Lint

```bash
cd frontend
npm run lint
```

### Backend Build

```bash
cd backend
mvn clean build
```

## 🚀 Deployment

### Production Environment Variables

**Frontend** (`.env.production`):
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**Backend**:
```env
DB_URL=jdbc:mysql://prod-db-host:3306/expense_tracker
DB_USER=prod_user
DB_PASSWORD=strong_production_password
JWT_SECRET=production_256bit_random_secret
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Build for Production

**Frontend**:
```bash
npm run build
npm run preview
```

**Backend**:
```bash
mvn clean package
java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar
```

## 🔄 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

**Register Request**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Secure@Pass123"
}
```

**Login Request**:
```json
{
  "email": "john@example.com",
  "password": "Secure@Pass123"
}
```

**Response** (201/200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "fullName": "John Doe",
  "userId": 1
}
```

## ⚠️ Error Responses

```json
{
  "status": 409,
  "message": "An account with email 'john@example.com' already exists",
  "error": "Email Already Exists",
  "timestamp": "2026-05-11T15:30:45"
}
```

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify environment variables in `.env`
- Check logs: `mvn spring-boot:run` output

### Frontend can't connect to API
- Verify backend is running on port 8080
- Check `VITE_API_BASE_URL` in `.env.development`
- Check browser console for CORS errors

### Database connection error
- Create database: `CREATE DATABASE expense_tracker;`
- Verify credentials in `.env`
- Check MySQL is accessible

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📞 Support

For issues and questions, please create an issue on GitHub.

---

**Last Updated**: May 2026
**Status**: ✅ All critical issues fixed and documented
