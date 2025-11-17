# Complete Setup Guide - MERN E-Commerce Platform

## Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- MongoDB (local or MongoDB Atlas account)
- Git (optional)

## Step 1: Install MongoDB (Windows)

### Option A: MongoDB Community Edition (Local)

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows version
   - Download and run the installer

2. **Install MongoDB:**
   ```cmd
   # Run the downloaded .msi file
   # Choose "Complete" installation
   # Install MongoDB as a Service (recommended)
   # Install MongoDB Compass (GUI tool)
   ```

3. **Verify Installation:**
   ```cmd
   mongod --version
   mongo --version
   ```

4. **Start MongoDB Service:**
   ```cmd
   # MongoDB should start automatically as a service
   # To manually start:
   net start MongoDB
   
   # To stop:
   net stop MongoDB
   ```

### Option B: MongoDB Atlas (Cloud - Recommended for beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Install Project Dependencies

Open Command Prompt or PowerShell in the project root directory:

```cmd
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ..
```

Or use the shortcut command:

```cmd
npm run install-all
```

## Step 3: Configure Environment Variables

### Server Configuration

1. Navigate to the `server` folder
2. Copy `.env.example` to `.env`:

```cmd
cd server
copy .env.example .env
```

3. Edit `server/.env` with your settings:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ecommerce

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration (Optional - for production)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@eshop.com
ADMIN_EMAIL=admin@eshop.com

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Client Configuration

1. Navigate to the `client` folder
2. Copy `.env.example` to `.env`:

```cmd
cd client
copy .env.example .env
```

3. Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Generate Secure JWT Secrets

You can generate secure random strings for JWT secrets:

### Using Node.js:

```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

### Or use online generator:
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Key" or similar

## Step 5: Start the Application

### Option A: Start Both Client and Server Together (Recommended)

From the root directory:

```cmd
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

### Option B: Start Separately

**Terminal 1 - Start Server:**
```cmd
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```cmd
cd client
npm run dev
```

## Step 6: Verify Installation

1. **Check Server:**
   - Open browser: http://localhost:5000
   - You should see: `{"message":"E-Commerce API is running..."}`

2. **Check Client:**
   - Open browser: http://localhost:5173
   - You should see the E-Shop homepage

3. **Check MongoDB Connection:**
   - Look at server terminal
   - You should see: `MongoDB Connected: ...`

## Step 7: Create Admin User (Optional)

You can create an admin user directly in MongoDB:

### Using MongoDB Compass (GUI):

1. Open MongoDB Compass
2. Connect to your database
3. Select `ecommerce` database
4. Select `users` collection
5. Click "Add Data" → "Insert Document"
6. Paste this (password will be hashed on first login):

```json
{
  "name": "Admin User",
  "email": "admin@eshop.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "isActive": true,
  "emailVerified": true,
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

### Or Register Normally and Update Role:

1. Register a new account at http://localhost:5173/register
2. In MongoDB, find the user and change `role` from `customer` to `admin`

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
```cmd
# Check if MongoDB is running
net start MongoDB

# Or restart MongoDB
net stop MongoDB
net start MongoDB
```

### Issue 2: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```cmd
# Delete node_modules and reinstall
cd server
rmdir /s /q node_modules
npm install

cd ../client
rmdir /s /q node_modules
npm install
```

### Issue 4: CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Ensure `CLIENT_URL` in `server/.env` matches your frontend URL
- Default should be: `CLIENT_URL=http://localhost:5173`

## Development Workflow

### Available Scripts

From root directory:

```cmd
# Install all dependencies
npm run install-all

# Start both client and server
npm run dev

# Start server only
npm run server

# Start client only
npm run client

# Build client for production
npm run build

# Start production server
npm start
```

### Server Scripts

```cmd
cd server

# Start with nodemon (auto-restart)
npm run dev

# Start normally
npm start
```

### Client Scripts

```cmd
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Testing the Application

### 1. Test User Registration
- Go to http://localhost:5173/register
- Create a new account
- Check MongoDB to verify user was created

### 2. Test Login
- Login with your credentials
- Check browser cookies for JWT tokens
- Verify you can access protected routes

### 3. Test Product Features
- Go to Products page
- Test filters and search
- Add products to cart

### 4. Test Admin Features
- Login as admin
- Go to http://localhost:5173/admin
- Test product/order/user management

## Production Deployment

### Environment Variables for Production

Update these in production:

```env
NODE_ENV=production
CLIENT_URL=https://your-domain.com
MONGODB_URI=mongodb+srv://...your-atlas-connection
JWT_SECRET=very-long-random-string-min-64-chars
JWT_REFRESH_SECRET=another-very-long-random-string
```

### Build Client

```cmd
cd client
npm run build
```

The build output will be in `client/dist/`

### Deploy Options

1. **Vercel/Netlify** (Frontend)
2. **Heroku/Railway/Render** (Backend)
3. **MongoDB Atlas** (Database)
4. **Cloudinary** (Images)

## Additional Configuration

### Email Setup (Gmail)

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password:
   - Go to Google Account → Security
   - App Passwords → Generate
3. Use the generated password in `EMAIL_PASSWORD`

### Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get your credentials from Dashboard
3. Add to `server/.env`

### Payment Gateway Setup

**Stripe:**
1. Sign up at https://stripe.com
2. Get test API keys from Dashboard
3. Add to `server/.env`

**Razorpay:**
1. Sign up at https://razorpay.com
2. Get test API keys
3. Add to `server/.env`

## Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all dependencies are installed
5. Review the error logs in terminal

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start MongoDB
4. ✅ Run the application
5. 📝 Create admin user
6. 🎨 Customize theme and branding
7. 📦 Add products and categories
8. 🚀 Deploy to production

---

**Happy Coding! 🚀**
