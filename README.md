# ExpenseIQ - Backend API

A secure REST API for the ExpenseIQ Expense Tracker application built with Node.js, Express, and MongoDB.

## 🚀 Live Demo
API Base URL: https://expense-tracker-backend-4dx3.onrender.com

## ✨ Features
- JWT Authentication (Register/Login)
- Private expense data per user
- Full CRUD operations for expenses
- Category-wise expense summary
- Input validation with express-validator
- Password hashing with bcryptjs
- CORS protection

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Auth:** JSON Web Tokens (JWT)
- **Security:** bcryptjs, CORS
- **Validation:** express-validator
- **Deploy:** Render

## 📁 Project Structure
```
backend/
├── models/
│   ├── User.js          # User schema with bcrypt hashing
│   └── Expense.js       # Expense schema with userId linking
├── routes/
│   ├── auth.js          # Register, Login, Get Me
│   └── expenses.js      # Full CRUD + category summary
├── middleware/
│   └── auth.js          # JWT verification middleware
├── server.js            # Entry point
└── package.json
```

## 🔗 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get logged in user | Private |

### Expense Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/expenses | Get all expenses | Private |
| POST | /api/expenses | Add new expense | Private |
| PUT | /api/expenses/:id | Update expense | Private |
| DELETE | /api/expenses/:id | Delete expense | Private |
| GET | /api/expenses/summary/categories | Category summary | Private |

## ⚙️ Environment Variables
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=your_frontend_url
```

## 🏃 Run Locally
```bash
# Clone repository
git clone https://github.com/Propika4/expense-tracker-backend.git

# Install dependencies
cd expense-tracker-backend
npm install

# Create .env file and add environment variables

# Start development server
npm run dev
```

## 👨‍💻 Author
**Atul** - [GitHub](https://github.com/Propika4)