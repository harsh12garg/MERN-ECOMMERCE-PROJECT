import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@eshop.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    emailVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    isActive: true,
    emailVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
    isActive: true,
    emailVerified: true,
  },
];

// Sample Categories
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories' },
      { name: 'Laptops', slug: 'laptops', description: 'Laptops and computers' },
      { name: 'Headphones', slug: 'headphones', description: 'Audio devices' },
    ],
    icon: '📱',
    order: 1,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    subcategories: [
      { name: 'Men', slug: 'men', description: "Men's clothing" },
      { name: 'Women', slug: 'women', description: "Women's clothing" },
      { name: 'Kids', slug: 'kids', description: "Children's clothing" },
    ],
    icon: '👕',
    order: 2,
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home appliances and kitchen items',
    subcategories: [
      { name: 'Furniture', slug: 'furniture', description: 'Home furniture' },
      { name: 'Kitchen', slug: 'kitchen', description: 'Kitchen appliances' },
      { name: 'Decor', slug: 'decor', description: 'Home decoration' },
    ],
    icon: '🏠',
    order: 3,
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books and literature',
    subcategories: [
      { name: 'Fiction', slug: 'fiction', description: 'Fiction books' },
      { name: 'Non-Fiction', slug: 'non-fiction', description: 'Non-fiction books' },
      { name: 'Educational', slug: 'educational', description: 'Educational books' },
    ],
    icon: '📚',
    order: 4,
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    subcategories: [
      { name: 'Fitness', slug: 'fitness', description: 'Fitness equipment' },
      { name: 'Outdoor', slug: 'outdoor', description: 'Outdoor gear' },
      { name: 'Sports', slug: 'sports', description: 'Sports equipment' },
    ],
    icon: '⚽',
    order: 5,
  },
];

// Sample Products (will be created after categories)
const getProducts = (categoryIds) => [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features include 6.7-inch Super Retina XDR display, ProMotion technology, and all-day battery life.',
    shortDescription: 'Premium smartphone with cutting-edge technology',
    price: 1199,
    comparePrice: 1299,
    category: categoryIds.Electronics,
    subcategory: 'Smartphones',
    brand: 'Apple',
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592286927505-2fd0d113e4e4?w=500',
        alt: 'iPhone 15 Pro Max',
      },
    ],
    tags: ['smartphone', 'apple', 'premium', 'new'],
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    rating: 4.8,
    numReviews: 245,
    featured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Flagship Samsung phone with S Pen, 200MP camera, and AI features. Includes 6.8-inch Dynamic AMOLED display and powerful Snapdragon processor.',
    shortDescription: 'Ultimate Android flagship with S Pen',
    price: 1099,
    comparePrice: 1199,
    category: categoryIds.Electronics,
    subcategory: 'Smartphones',
    brand: 'Samsung',
    stock: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
        alt: 'Samsung Galaxy S24 Ultra',
      },
    ],
    tags: ['smartphone', 'samsung', 'android', 'flagship'],
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
    sizes: ['256GB', '512GB', '1TB'],
    rating: 4.7,
    numReviews: 189,
    featured: true,
  },
  {
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Powerful laptop with M3 Pro chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life. Perfect for professionals and creators.',
    shortDescription: 'Professional laptop with M3 Pro chip',
    price: 2499,
    comparePrice: 2699,
    category: categoryIds.Electronics,
    subcategory: 'Laptops',
    brand: 'Apple',
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        alt: 'MacBook Pro',
      },
    ],
    tags: ['laptop', 'apple', 'professional', 'creator'],
    colors: ['Space Gray', 'Silver'],
    sizes: ['512GB', '1TB', '2TB'],
    rating: 4.9,
    numReviews: 312,
    featured: true,
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality. Features 30-hour battery life, multipoint connection, and speak-to-chat technology.',
    shortDescription: 'Premium noise-canceling headphones',
    price: 399,
    comparePrice: 449,
    category: categoryIds.Electronics,
    subcategory: 'Headphones',
    brand: 'Sony',
    stock: 75,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
        alt: 'Sony Headphones',
      },
    ],
    tags: ['headphones', 'sony', 'noise-canceling', 'wireless'],
    colors: ['Black', 'Silver'],
    rating: 4.8,
    numReviews: 456,
    featured: true,
  },
  {
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    description: 'High-performance laptop with Intel Core i7, NVIDIA RTX graphics, and stunning InfinityEdge display. Ideal for work and entertainment.',
    shortDescription: 'Powerful Windows laptop',
    price: 1799,
    comparePrice: 1999,
    category: categoryIds.Electronics,
    subcategory: 'Laptops',
    brand: 'Dell',
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
        alt: 'Dell XPS 15',
      },
    ],
    tags: ['laptop', 'dell', 'windows', 'gaming'],
    colors: ['Platinum Silver', 'Frost White'],
    sizes: ['512GB', '1TB'],
    rating: 4.6,
    numReviews: 178,
  },

  // Clothing
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'Premium quality cotton t-shirt with comfortable fit. Made from 100% organic cotton, perfect for everyday wear.',
    shortDescription: 'Comfortable everyday t-shirt',
    price: 29.99,
    comparePrice: 39.99,
    category: categoryIds.Clothing,
    subcategory: 'Men',
    brand: 'ComfortWear',
    stock: 200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        alt: 'Cotton T-Shirt',
      },
    ],
    tags: ['t-shirt', 'cotton', 'casual', 'men'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    numReviews: 89,
  },
  {
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    description: 'Classic fit denim jeans with stretch comfort. Durable construction with modern styling.',
    shortDescription: 'Classic denim jeans',
    price: 79.99,
    comparePrice: 99.99,
    category: categoryIds.Clothing,
    subcategory: 'Men',
    brand: 'DenimCo',
    stock: 150,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        alt: 'Denim Jeans',
      },
    ],
    tags: ['jeans', 'denim', 'casual', 'men'],
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    rating: 4.4,
    numReviews: 156,
  },
  {
    name: 'Summer Dress',
    slug: 'summer-dress',
    description: 'Elegant summer dress with floral print. Lightweight and breathable fabric perfect for warm weather.',
    shortDescription: 'Elegant floral summer dress',
    price: 89.99,
    comparePrice: 119.99,
    category: categoryIds.Clothing,
    subcategory: 'Women',
    brand: 'FashionHub',
    stock: 100,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        alt: 'Summer Dress',
      },
    ],
    tags: ['dress', 'summer', 'floral', 'women'],
    colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7,
    numReviews: 234,
  },

  // Home & Kitchen
  {
    name: 'Coffee Maker Pro',
    slug: 'coffee-maker-pro',
    description: 'Programmable coffee maker with thermal carafe. Brews perfect coffee every time with customizable settings.',
    shortDescription: 'Programmable coffee maker',
    price: 129.99,
    comparePrice: 159.99,
    category: categoryIds['Home & Kitchen'],
    subcategory: 'Kitchen',
    brand: 'BrewMaster',
    stock: 60,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        alt: 'Coffee Maker',
      },
    ],
    tags: ['coffee', 'kitchen', 'appliance', 'home'],
    colors: ['Black', 'Stainless Steel'],
    rating: 4.6,
    numReviews: 267,
  },
  {
    name: 'Modern Office Chair',
    slug: 'modern-office-chair',
    description: 'Ergonomic office chair with lumbar support and adjustable features. Comfortable for long working hours.',
    shortDescription: 'Ergonomic office chair',
    price: 299.99,
    comparePrice: 399.99,
    category: categoryIds['Home & Kitchen'],
    subcategory: 'Furniture',
    brand: 'ComfortSeating',
    stock: 40,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500',
        alt: 'Office Chair',
      },
    ],
    tags: ['chair', 'office', 'furniture', 'ergonomic'],
    colors: ['Black', 'Gray', 'Blue'],
    rating: 4.5,
    numReviews: 145,
  },

  // Books
  {
    name: 'The Art of Programming',
    slug: 'art-of-programming',
    description: 'Comprehensive guide to modern programming practices. Covers algorithms, data structures, and best practices.',
    shortDescription: 'Complete programming guide',
    price: 49.99,
    comparePrice: 59.99,
    category: categoryIds.Books,
    subcategory: 'Educational',
    brand: 'TechBooks',
    stock: 120,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        alt: 'Programming Book',
      },
    ],
    tags: ['book', 'programming', 'education', 'technology'],
    rating: 4.8,
    numReviews: 89,
  },
  {
    name: 'Mystery Novel Collection',
    slug: 'mystery-novel-collection',
    description: 'Bestselling mystery novel with thrilling plot twists. Perfect for mystery lovers.',
    shortDescription: 'Thrilling mystery novel',
    price: 24.99,
    comparePrice: 29.99,
    category: categoryIds.Books,
    subcategory: 'Fiction',
    brand: 'PageTurner',
    stock: 200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        alt: 'Mystery Novel',
      },
    ],
    tags: ['book', 'fiction', 'mystery', 'bestseller'],
    rating: 4.6,
    numReviews: 312,
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Non-slip yoga mat with extra cushioning. Eco-friendly material, perfect for yoga and fitness.',
    shortDescription: 'Premium non-slip yoga mat',
    price: 39.99,
    comparePrice: 49.99,
    category: categoryIds['Sports & Outdoors'],
    subcategory: 'Fitness',
    brand: 'YogaPro',
    stock: 150,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        alt: 'Yoga Mat',
      },
    ],
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    colors: ['Purple', 'Blue', 'Pink', 'Black'],
    rating: 4.7,
    numReviews: 178,
  },
  {
    name: 'Camping Tent 4-Person',
    slug: 'camping-tent-4-person',
    description: 'Waterproof camping tent for 4 people. Easy setup with durable construction for outdoor adventures.',
    shortDescription: 'Waterproof 4-person tent',
    price: 199.99,
    comparePrice: 249.99,
    category: categoryIds['Sports & Outdoors'],
    subcategory: 'Outdoor',
    brand: 'OutdoorGear',
    stock: 35,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500',
        alt: 'Camping Tent',
      },
    ],
    tags: ['camping', 'tent', 'outdoor', 'adventure'],
    colors: ['Green', 'Blue', 'Orange'],
    rating: 4.5,
    numReviews: 92,
  },
];

// Import Data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);

    // Create Users one by one to trigger password hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log('Users Created!'.green.inverse);

    // Create Categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories Created!'.green.inverse);

    // Map category names to IDs
    const categoryIds = {};
    createdCategories.forEach((cat) => {
      categoryIds[cat.name] = cat._id;
    });

    // Create Products
    const products = getProducts(categoryIds);
    await Product.insertMany(products);
    console.log('Products Created!'.green.inverse);

    console.log('Data Imported Successfully!'.green.inverse);
    console.log('\nLogin Credentials:'.cyan.bold);
    console.log('Admin:'.yellow);
    console.log('  Email: admin@eshop.com');
    console.log('  Password: admin123');
    console.log('\nCustomer:'.yellow);
    console.log('  Email: john@example.com');
    console.log('  Password: password123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
