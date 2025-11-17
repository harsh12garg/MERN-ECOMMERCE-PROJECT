import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const updateCategoryCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    const categories = await Category.find();
    console.log(`Found ${categories.length} categories`);

    for (const category of categories) {
      const count = await Product.countDocuments({ 
        category: category._id,
        isActive: true 
      });
      category.productCount = count;
      await category.save();
      console.log(`Updated ${category.name}: ${count} products`);
    }

    console.log('All category counts updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating category counts:', error);
    process.exit(1);
  }
};

updateCategoryCounts();
