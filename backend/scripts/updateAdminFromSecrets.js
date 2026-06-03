const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ quiet: true });

const SEEDED_ADMIN_EMAIL = 'admin@craftweave.com';
const ADMIN_NAME = 'Admin User';

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const redactConfiguredSecrets = (message) => {
  let redacted = message || 'Unknown error';

  ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].forEach((name) => {
    const value = process.env[name];

    if (value) {
      redacted = redacted.split(value).join(`[${name} redacted]`);
    }
  });

  return redacted;
};

const findAdminToUpdate = async (adminEmail) => {
  const seededAdmin = await User.findOne({
    email: SEEDED_ADMIN_EMAIL,
    isAdmin: true,
  });

  if (seededAdmin) {
    return seededAdmin;
  }

  const targetAdmin = await User.findOne({
    email: adminEmail,
    isAdmin: true,
  });

  if (targetAdmin) {
    return targetAdmin;
  }

  const admins = await User.find({ isAdmin: true }).sort({ createdAt: 1 }).limit(2);

  if (admins.length === 1) {
    return admins[0];
  }

  if (admins.length > 1) {
    throw new Error('Multiple admin users exist; refusing to update credentials without a single target admin.');
  }

  return null;
};

const assertTargetEmailIsSafe = async (adminEmail, adminUser) => {
  const emailOwner = await User.findOne({ email: adminEmail });

  if (!emailOwner) {
    return;
  }

  if (adminUser && emailOwner._id.equals(adminUser._id)) {
    return;
  }

  if (emailOwner.isAdmin) {
    throw new Error('Target admin email already belongs to a different admin user; refusing to update ambiguously.');
  }

  throw new Error('Target admin email already belongs to a non-admin user; refusing to update normal users.');
};

const updateAdminCredentials = async () => {
  const mongoUri = getRequiredEnv('MONGODB_URI').trim();
  const adminEmail = getRequiredEnv('ADMIN_EMAIL').trim();
  const adminPassword = getRequiredEnv('ADMIN_PASSWORD');

  await mongoose.connect(mongoUri);

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const adminUser = await findAdminToUpdate(adminEmail);

  await assertTargetEmailIsSafe(adminEmail, adminUser);

  if (adminUser) {
    adminUser.name = adminUser.name || ADMIN_NAME;
    adminUser.email = adminEmail;
    adminUser.password = hashedPassword;
    adminUser.isAdmin = true;

    await adminUser.save();
  } else {
    await User.findOneAndUpdate(
      { email: adminEmail, isAdmin: true },
      {
        $setOnInsert: {
          name: ADMIN_NAME,
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true,
        },
      },
      {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      }
    );
  }

  console.log('Admin credentials updated successfully.');
};

updateAdminCredentials()
  .catch((error) => {
    console.error(`Admin credential update failed: ${redactConfiguredSecrets(error.message)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
