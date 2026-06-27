/**
 * Usage:
 *   node createAdmin.js <email> <password> <name> [privilege]
 *
 * Privilege levels:
 *   super    — full access (create/delete admins, all settings)
 *   moderate — orders, products, banners, categories, coupons
 *   low      — read-only views
 *
 * Examples:
 *   node createAdmin.js admin@yourstore.com MyPass123 "Store Owner" super
 *   node createAdmin.js staff@yourstore.com StaffPass "Jane Smith" moderate
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/adminModel');

dotenv.config({ path: '.env' });

const [,, email, password, name, privilege = 'super'] = process.argv;

if (!email || !password || !name) {
    console.error('Usage: node createAdmin.js <email> <password> <name> [privilege]');
    console.error('Example: node createAdmin.js admin@store.com MyPass123 "Store Owner" super');
    process.exit(1);
}

const VALID_PRIVILEGES = ['super', 'moderate', 'low'];
if (!VALID_PRIVILEGES.includes(privilege)) {
    console.error(`Invalid privilege "${privilege}". Must be one of: ${VALID_PRIVILEGES.join(', ')}`);
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const existing = await Admin.findOne({ email });
        if (existing) {
            existing.password = password;
            existing.name = name;
            existing.privilege = privilege;
            await existing.save();
            console.log(`✓ Admin updated: ${email} (${privilege})`);
        } else {
            await Admin.create({ name, email, password, privilege });
            console.log(`✓ Admin created: ${email} (${privilege})`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    });
