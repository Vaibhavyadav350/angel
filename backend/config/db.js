const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const data = await mongoose.connect(uri);
    console.log(`Database connected with ${data.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDb;
