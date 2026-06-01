const mongoose = require('mongoose');
const Product = require('../../models/Product');
const db = require('../setup/db');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Product Model Unit Test', () => {
  it('should create & save a product successfully', async () => {
    const validProduct = new Product({
      name: 'Test Bag',
      description: 'A great test bag',
      price: 150,
      category: 'Backpack',
      brand: 'TestBrand',
      color: 'Black',
      material: 'Leather',
      countInStock: 10,
    });
    const savedProduct = await validProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe('Test Bag');
    expect(savedProduct.countInStock).toBe(10);
  });

  it('should fail to save product without required fields', async () => {
    const productWithoutRequiredField = new Product({ name: 'Test Bag' });
    let err;
    try {
      await productWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });
});
