# Quick Start Guide - 5 Minutes Setup

## Prerequisites
- Node.js installed
- MongoDB installed OR MongoDB Atlas account

## Quick Setup Commands

### 1. Install Dependencies (2 minutes)

```cmd
npm run install-all
```

### 2. Setup Environment Variables (1 minute)

```cmd
# Copy environment files
cd server
copy .env.example .env
cd ../client
copy .env.example .env
cd ..
```

**Edit `server/.env`:**
- Change `MONGODB_URI` to your MongoDB connection string
- Generate JWT secrets (run twice):
  ```cmd
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 3. Start MongoDB (if using local)

```cmd
net start MongoDB
```

### 4. Run the Application (1 minute)

```cmd
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin

## Default Test Credentials

After registering, update user role to 'admin' in MongoDB to access admin panel.

## That's It! 🎉

Your e-commerce platform is now running!

---

## Minimal .env Configuration

### server/.env (Minimum Required)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change_this_to_a_long_random_string_min_32_chars
JWT_REFRESH_SECRET=change_this_to_another_long_random_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

**MongoDB not connecting?**
```cmd
net start MongoDB
```

**Port already in use?**
```cmd
# Change PORT in server/.env to 5001
```

**Dependencies error?**
```cmd
# Reinstall
npm run install-all
```

## Next Steps

1. Register a new user
2. Update user role to 'admin' in MongoDB
3. Login and access admin panel
4. Add products and categories
5. Test the complete flow

---

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
