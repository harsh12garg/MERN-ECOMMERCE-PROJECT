# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Step-by-Step Installation

### 1. Install All Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for both client and server.

Alternatively, install manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

#### Server Configuration

Create a `.env` file in the `server` folder:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

#### Client Configuration

Create a `.env` file in the `client` folder:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

If using local MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud) by updating the `MONGODB_URI` in server/.env

### 4. Run the Application

#### Development Mode (Both Client & Server)

From the root directory:

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

#### Run Separately

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

### 5. Verify Installation

1. Open browser to http://localhost:5173
2. You should see the E-Shop homepage
3. Try registering a new account
4. Check MongoDB to verify user was created

## Production Build

### Build Client

```bash
cd client
npm run build
```

The build output will be in `client/dist/`

### Start Production Server

```bash
cd server
npm start
```

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Change `PORT` in `server/.env`
2. Update `VITE_API_URL` in `client/.env`
3. Update proxy in `client/vite.config.js`

### MongoDB Connection Error

- Verify MongoDB is running
- Check `MONGODB_URI` in `server/.env`
- Ensure MongoDB is accessible

### CORS Issues

- Verify `CLIENT_URL` in `server/.env` matches your frontend URL
- Check CORS configuration in `server/server.js`

## Next Steps

1. Create an admin user (manually in MongoDB or via seeder script)
2. Add products and categories
3. Configure payment gateway (Stripe/Razorpay)
4. Customize theme and branding
5. Deploy to production

## Useful Commands

```bash
# Install all dependencies
npm run install-all

# Run both client and server
npm run dev

# Run server only
npm run server

# Run client only
npm run client

# Build for production
npm run build

# Start production server
npm start
```

## Support

For issues or questions, please check:
- README.md for project overview
- MongoDB documentation
- React/Vite documentation
- Express.js documentation
