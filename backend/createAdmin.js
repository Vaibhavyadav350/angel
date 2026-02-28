const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/adminModel');

dotenv.config({ path: '.env' });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        let admin = await Admin.findOne({ email: 'admin@example.com' });
        if (!admin) {
            admin = await Admin.create({
                name: 'Test Admin',
                email: 'admin@example.com',
                password: 'password123',
                privilege: 'superadmin'
            });
            console.log('Admin created.');
        } else {
            admin.password = 'password123';
            await admin.save();
            console.log('Admin password updated.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
