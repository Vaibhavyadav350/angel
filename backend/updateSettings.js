const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');
require('dotenv').config();

async function updateSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const settings = await Settings.findOne();
    if (settings) {
      settings.standardShippingPrice = 8;
      settings.expressShippingPrice = 18;
      settings.freeShippingThreshold = 200;
      await settings.save();
      console.log('Settings updated successfully:', settings);
    } else {
      console.log('Settings document not found, creating one...');
      const newSettings = new Settings({
        standardShippingPrice: 8,
        expressShippingPrice: 18,
        freeShippingThreshold: 200,
      });
      await newSettings.save();
      console.log('Settings created successfully:', newSettings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

updateSettings();
