import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: String,
  image: String,
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      url: String,
      publicId: String,
    },
    subcategories: [subcategorySchema],
    icon: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  // Generate slugs for subcategories
  if (this.subcategories && this.subcategories.length > 0) {
    this.subcategories.forEach((sub) => {
      if (!sub.slug) {
        sub.slug = sub.name.toLowerCase().replace(/\s+/g, '-');
      }
    });
  }
  
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
