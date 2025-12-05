// src/database/seed.ts - UPDATED WITH REALISTIC CATEGORIES
import 'reflect-metadata';
import AppDataSource from '../../ormconfig';
import { Category } from '../entities/category';

const seedDatabase = async () => {
  await AppDataSource.initialize();
  const categoryRepository = AppDataSource.getRepository(Category);

  // Delete existing categories (optional)
  // await categoryRepository.clear();

  const realisticCategories = [
    // Income Categories
    { name: 'Salary' },
    { name: 'Freelance' },
    { name: 'Business Income' },
    { name: 'Investment Returns' },
    { name: 'Gift/Bonus' },
    { name: 'Other Income' },

    // Housing & Utilities
    { name: 'Rent/Mortgage' },
    { name: 'Electricity' },
    { name: 'Water' },
    { name: 'Gas' },
    { name: 'Internet' },
    { name: 'Phone' },
    { name: 'Home Maintenance' },
    { name: 'Property Tax' },

    // Food & Dining
    { name: 'Groceries' },
    { name: 'Restaurants' },
    { name: 'Coffee Shops' },
    { name: 'Fast Food' },
    { name: 'Food Delivery' },

    // Transportation
    { name: 'Public Transport' },
    { name: 'Gas/Fuel' },
    { name: 'Car Payment' },
    { name: 'Car Insurance' },
    { name: 'Car Maintenance' },
    { name: 'Parking' },
    { name: 'Taxi/Uber' },

    // Health & Fitness
    { name: 'Health Insurance' },
    { name: 'Doctor Visits' },
    { name: 'Pharmacy/Medicine' },
    { name: 'Gym Membership' },
    { name: 'Sports Equipment' },
    { name: 'Mental Health' },

    // Shopping
    { name: 'Clothing' },
    { name: 'Shoes' },
    { name: 'Accessories' },
    { name: 'Electronics' },
    { name: 'Home Goods' },
    { name: 'Personal Care' },

    // Entertainment & Leisure
    { name: 'Movies/Theater' },
    { name: 'Concerts/Events' },
    { name: 'Streaming Services' },
    { name: 'Gaming' },
    { name: 'Books' },
    { name: 'Hobbies' },
    { name: 'Vacation/Travel' },

    // Education
    { name: 'Tuition' },
    { name: 'Books & Supplies' },
    { name: 'Online Courses' },
    { name: 'Training/Workshops' },

    // Financial
    { name: 'Bank Fees' },
    { name: 'Credit Card Payment' },
    { name: 'Loan Payment' },
    { name: 'Savings' },
    { name: 'Investments' },
    { name: 'Insurance' },

    // Personal & Family
    { name: 'Childcare' },
    { name: 'Pet Care' },
    { name: 'Gifts' },
    { name: 'Donations/Charity' },
    { name: 'Personal Development' },

    // Miscellaneous
    { name: 'Subscriptions' },
    { name: 'Professional Services' },
    { name: 'Legal Fees' },
    { name: 'Other Expenses' }
  ];

  console.log('Seeding database with realistic categories...');
  
  for (const category of realisticCategories) {
    const existingCategory = await categoryRepository.findOneBy({ name: category.name });
    if (!existingCategory) {
      await categoryRepository.save(category);
      console.log(`✓ Added category: ${category.name}`);
    } else {
      console.log(`- Category already exists: ${category.name}`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`Total categories: ${await categoryRepository.count()}`);
  
  process.exit();
};

seedDatabase().catch((error) => {
  console.error('❌ Seeding error:', error);
  process.exit(1);
});