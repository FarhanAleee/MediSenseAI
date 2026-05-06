# 🔐 MediSense AI - Authentication System Setup Guide

## Overview
Complete production-ready authentication system with:
- JWT token-based authentication
- PostgreSQL user storage
- bcrypt password hashing
- Protected routes
- React Router integration
- Axios with interceptors

---

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Set Up PostgreSQL Database
Make sure PostgreSQL is running. The default connection string is:
```
postgresql://postgres:password@localhost:5432/medisense
```

To change this, set the environment variable:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/medisense"
```

### Step 3: Start Backend
```bash
cd backend
python main.py
```

The backend will automatically create the `users` table on startup.

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📋 Features Implemented

### Backend (FastAPI)

#### 1. User Model
- **Table**: `users`
- **Columns**:
  - `id` (Integer, Primary Key)
  - `first_name` (String)
  - `last_name` (String)
  - `email` (String, Unique, Indexed)
  - `hashed_password` (String)
  - `created_at` (DateTime)

#### 2. Auth Endpoints

**POST /auth/signup**
```json
Request:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**POST /auth/login**
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### 3. Security Features
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ Email uniqueness constraint
- ✅ Input validation (Pydantic)
- ✅ CORS enabled for frontend

### Frontend (React)

#### 1. Authentication Pages

**SignupPage.jsx**
- Form fields: First Name, Last Name, Email, Password, Confirm Password
- Client-side validation
- Error handling
- Auto-redirect to dashboard on success

**LoginPage.jsx**
- Form fields: Email, Password
- Client-side validation
- Error handling
- Auto-redirect to dashboard on success

#### 2. Routing with React Router
- `/signup` - Signup page (public)
- `/login` - Login page (public)
- `/dashboard` - Protected dashboard (requires token)
- `/` - Redirects to dashboard

#### 3. Protected Routes
- ProtectedRoute component checks for valid token
- Redirects to login if no token found
- Automatically logs out on token expiration

#### 4. Axios Integration
- Automatic token injection in all requests
- Global error handling
- 401 response redirects to login
- Token refresh capability (ready to implement)

---

## 🔑 Authentication Flow

### Signup Flow
```
1. User fills signup form
2. Frontend validates input
3. POST /auth/signup with credentials
4. Backend hashes password with bcrypt
5. Backend stores user in PostgreSQL
6. Backend generates JWT token
7. Token stored in localStorage
8. User redirected to dashboard
```

### Login Flow
```
1. User fills login form
2. Frontend validates input
3. POST /auth/login with credentials
4. Backend verifies email + password
5. Backend generates JWT token
6. Token stored in localStorage
7. User redirected to dashboard
```

### Protected Route Flow
```
1. User tries to access /dashboard
2. ProtectedRoute checks localStorage for token
3. If no token → redirect to /login
4. If token exists → render protected component
5. Token sent in Authorization header (Bearer scheme)
6. Backend validates token in future requests
```

---

## 🛠️ Customization

### Change Token Expiration
Edit `backend/routers/auth.py`:
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # Change this value
```

### Change Secret Key (IMPORTANT FOR PRODUCTION)
Edit `backend/config.py`:
```python
SECRET_KEY = os.getenv("SECRET_KEY", "your-new-secret-key")
```

Or set environment variable:
```bash
export SECRET_KEY="your-production-secret-key"
```

### Change Database URL
```bash
export DATABASE_URL="postgresql://user:password@your-server:5432/medisense"
```

---

## 📦 Backend Dependencies

New dependencies added:
- `bcrypt==4.1.2` - Password hashing
- `PyJWT==2.8.1` - JWT token generation/verification
- `python-dotenv==1.0.0` - Environment variable management

---

## 📦 Frontend Dependencies

New dependencies added:
- `react-router-dom==^6.22.0` - Routing
- `axios==^1.6.8` - HTTP client

---

## 🧪 Testing the System

### Test Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Use Token in Protected Request
```bash
curl -X GET http://localhost:8000/symptoms/list \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚨 Error Handling

### Common Errors

**"Email already registered"**
- Status: 400 Bad Request
- Solution: Use a different email or login if account exists

**"Invalid email or password"**
- Status: 401 Unauthorized
- Solution: Check credentials and try again

**"Token expired"**
- Status: 401 Unauthorized
- Solution: Frontend auto-redirects to login

**"Password must be at least 8 characters"**
- Status: 400 Bad Request
- Solution: Use a stronger password

---

## 🔒 Security Best Practices

✅ **Implemented**
- Passwords hashed with bcrypt (industry standard)
- JWT tokens with expiration
- HTTPS-ready (use in production)
- Input validation with Pydantic
- Email uniqueness constraint
- CORS properly configured

⚠️ **For Production**
- Change SECRET_KEY to a strong random value
- Use environment variables for all secrets
- Enable HTTPS only
- Set SECURE, HttpOnly cookies for tokens (optional)
- Implement rate limiting on auth endpoints
- Add request logging and monitoring
- Use strong PostgreSQL password
- Regular security audits

---

## 📚 File Structure

```
MediSense AI/
├── backend/
│   ├── routers/
│   │   └── auth.py (✨ UPDATED - JWT auth endpoints)
│   ├── models/
│   │   ├── db_models.py (✨ UPDATED - User model with names)
│   │   └── schemas.py (✨ UPDATED - Auth schemas)
│   ├── utils/
│   │   └── helpers.py (✨ UPDATED - bcrypt hashing)
│   ├── config.py (✨ UPDATED - SECRET_KEY)
│   ├── main.py
│   ├── database.py
│   └── requirements.txt (✨ UPDATED - new deps)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx (✨ NEW)
│   │   │   ├── SignupPage.jsx (✨ NEW)
│   │   │   ├── AuthPages.css (✨ NEW)
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx (✨ NEW)
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js (✨ UPDATED - Axios integration)
│   │   └── App.jsx (✨ UPDATED - React Router)
│   └── package.json (✨ UPDATED - new deps)
```

---

## ✅ Next Steps

1. **Database Setup**: Ensure PostgreSQL is running and accessible
2. **Install Dependencies**: Run `pip install -r requirements.txt` and `npm install`
3. **Start Services**: Launch backend and frontend
4. **Test Authentication**: Try signup and login flows
5. **Monitor Logs**: Watch for any errors
6. **Deploy**: Use production-grade settings

---

## 🐛 Troubleshooting

**"Connection refused" on backend startup**
- Check PostgreSQL is running
- Verify DATABASE_URL environment variable
- Ensure port 8000 is available

**"Module not found" errors**
- Run `pip install -r requirements.txt` (backend)
- Run `npm install` (frontend)

**"CORS error" on login/signup**
- Backend CORS is configured for localhost:3000 and localhost:5173
- Check frontend URL matches one of these

**"Token not persisting"**
- Check browser's localStorage is enabled
- Open DevTools → Application → Local Storage

---

## 📞 Support

For issues or questions:
1. Check the error messages carefully
2. Review the Security Best Practices section
3. Verify database connection
4. Check environment variables
5. Review browser console for client-side errors
6. Check backend logs for server-side errors

---

**Last Updated**: May 2026
**Version**: 1.0.0
