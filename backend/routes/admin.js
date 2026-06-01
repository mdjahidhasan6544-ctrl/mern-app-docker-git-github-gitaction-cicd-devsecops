const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: 'Admin access required' });
};

router.get('/overview', protect, adminOnly, async (req, res) => {
  const [products, orders, users] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
  ]);

  res.json({ products, orders, users });
});

router.post('/upload', protect, adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  res.status(201).json({
    imageUrl: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

router.get('/products', protect, adminOnly, async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

router.post('/products', protect, adminOnly, async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    color: req.body.color,
    material: req.body.material,
    countInStock: req.body.countInStock,
    images: req.body.images || [],
  });

  res.status(201).json(product);
});

router.put('/products/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  Object.assign(product, {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    color: req.body.color,
    material: req.body.material,
    countInStock: req.body.countInStock,
    images: req.body.images || [],
  });

  const updated = await product.save();
  res.json(updated);
});

router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

router.get('/orders', protect, adminOnly, async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/orders/:id/deliver', protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  const updated = await order.save();
  res.json(updated);
});

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.put('/users/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  if (typeof req.body.isAdmin === 'boolean') {
    user.isAdmin = req.body.isAdmin;
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
  });
});

module.exports = router;