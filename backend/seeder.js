const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product.js');
const Order = require('./models/Order.js');
const User = require('./models/User.js');
const products = require('./data/products.js');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully for Seeding.'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Is your MONGO_URI missing from .env?');
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const adminPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            name: 'Admin User',
            email: 'admin@craftweave.com',
            password: adminPassword,
            isAdmin: true,
        });

        await Product.insertMany(products);

        console.log('✅ BagStore Data Imported!');
        console.log('✅ Admin login: admin@craftweave.com / admin123');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('🗑️ BagStore Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with destroy: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
