# MERN E-Commerce Boilerplate

A complete, production-ready MERN stack e-commerce platform with authentication, role-based access, and payment integration structure.

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication + bcrypt
- Cookie-based auth
- Role-based access control

### Frontend
- React 18 + Vite
- Redux Toolkit
- React Router v6
- Material UI + TailwindCSS
- Axios
- Dark/Light theme

## Project Structure

```
mern-ecommerce-boilerplate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── services/      # API services
│   │   ├── utils/         # Utilities
│   │   ├── routes/        # Route configuration
│   │   └── theme/         # Theme configuration
│   └── public/
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utilities
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone and install dependencies:
```bash
npm run install-all
```

2. Configure environment variables:

**Server (.env in server folder):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client (.env in client folder):**
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development servers:
```bash
npm run dev
```

This runs both client (port 5173) and server (port 5000) concurrently.

## Available Scripts

- `npm run install-all` - Install all dependencies
- `npm run dev` - Run both client and server
- `npm run client` - Run client only
- `npm run server` - Run server only
- `npm run build` - Build client for production
- `npm start` - Start production server

## Features

### Authentication
- JWT-based authentication
- Secure HTTP-only cookies
- Password hashing with bcrypt
- Protected routes (frontend + backend)
- Role-based access (Admin, Customer)

### Backend API
- User registration/login
- User profile management
- Product CRUD operations
- Category management
- Order management structure
- Payment integration-ready

### Frontend
- Responsive design
- Dark/Light theme toggle
- Protected routes
- Redux state management
- Material UI components
- Landing page
- Authentication pages
- Dashboard
- Product listing

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (Admin)

## Default Admin Credentials

After seeding (optional):
- Email: admin@example.com
- Password: admin123

## Payment Integration

The boilerplate includes structure for:
- Stripe integration
- Razorpay integration

Configure in `server/config/payment.js`

## Security Features

- HTTP-only cookies
- CORS configuration
- Helmet.js security headers
- Rate limiting ready
- Input validation
- XSS protection

## Contributing

Feel free to submit issues and enhancement requests.

## License

MIT
