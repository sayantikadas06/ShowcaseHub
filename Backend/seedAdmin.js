require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL.toLowerCase().trim() },
      { 
        email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
        password: hashedPassword 
      },
      { upsert: true, new: true, runValidators: true }
    );
    const checkAdmin = await Admin.findOne({
  email: process.env.ADMIN_EMAIL.toLowerCase().trim()
});

const passwordWorks = await bcrypt.compare(
  process.env.ADMIN_PASSWORD,
  checkAdmin.password
);

console.log("Admin found:", !!checkAdmin);
console.log("Password matches:", passwordWorks);
    console.log("Admin credentials updated successfully!");
  } catch (error) {
    console.log("Admin seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();