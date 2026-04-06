const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '../public/assets/landing');

// Ensure directory exists
if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Download helper
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const dest = path.join(ASSETS_DIR, filename);
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            // Handle redirects if any
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filename);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

// Curated Images mappings
// High-quality vertical fashion imagery
const imageUrls = [
    // --- Hero Section ---
    { url: 'https://images.unsplash.com/photo-1596489433621-e37defbdf2f9?w=1920&q=80', filename: 'hero-lehenga.jpg' }, // Bridal Edit
    { url: 'https://images.unsplash.com/photo-1610030469983-98e550905b06?w=1920&q=80', filename: 'hero-saree.jpg' },   // Royal Drapes
    { url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=80', filename: 'hero-men.jpg' },     // Mens Sherwani

    // --- Cinematic Journey ---
    { url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1920', filename: 'cinematic.jpg' },

    // --- Category Directory ---
    { url: 'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=600&q=80', filename: 'cat-lehenga.jpg' },
    { url: 'https://images.unsplash.com/photo-1614995540130-1c09eb2c5db0?w=600&q=80', filename: 'cat-saree.jpg' },
    { url: 'https://images.unsplash.com/photo-1596489394142-f28cc29d665b?w=600&q=80', filename: 'cat-sherwani.jpg' },
    { url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600&q=80', filename: 'cat-anarkali.jpg' },
    { url: 'https://images.unsplash.com/photo-1599643478514-4a410f06f564?w=600&q=80', filename: 'cat-jewelry.jpg' },
    { url: 'https://images.unsplash.com/photo-1519758774780-60b542023d8c?w=600&q=80', filename: 'cat-kids.jpg' },

    // --- Brand Philosophy ---
    { url: 'https://images.unsplash.com/photo-1596489394019-dc1324707834?w=1200&q=80', filename: 'philosophy.jpg' },

    // --- Mock Data: Salwar/Anarkali ---
    { url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&q=80', filename: 'salwar-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1649232930263-d3493e80820e?w=600&q=80', filename: 'salwar-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1604085465947-6df790250bb0?w=600&q=80', filename: 'salwar-3.jpg' },
    { url: 'https://images.unsplash.com/photo-1614995400287-24bedd82b4fb?w=600&q=80', filename: 'salwar-4.jpg' },

    // --- Mock Data: Lehengas ---
    { url: 'https://images.unsplash.com/photo-1596489433621-e37defbdf2f9?w=600&q=80', filename: 'lehenga-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1584305586616-568ea4663efd?w=600&q=80', filename: 'lehenga-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1549448092-2df40fe2c918?w=600&q=80', filename: 'lehenga-3.jpg' },
    { url: 'https://images.unsplash.com/photo-1602494957518-a6211831c26b?w=600&q=80', filename: 'lehenga-4.jpg' },

    // --- Mock Data: Sarees ---
    { url: 'https://images.unsplash.com/photo-1610030469983-98e550905b06?w=600&q=80', filename: 'saree-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1596489394391-76495dbfec96?w=600&q=80', filename: 'saree-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1614051054366-248cd4d52f6f?w=600&q=80', filename: 'saree-3.jpg' },
    { url: 'https://images.unsplash.com/photo-1584305586616-568ea4663efd?w=600&q=80', filename: 'saree-4.jpg' }
];

async function run() {
    console.log('Downloading high-quality assets...');
    for (const item of imageUrls) {
        try {
            console.log(`Downloading ${item.filename}...`);
            await downloadImage(item.url, item.filename);
            console.log(`✅ Saved ${item.filename}`);
        } catch (err) {
            console.error(`❌ Failed to download ${item.filename}:`, err.message);
        }
    }
    console.log('✨ Download process complete.');
}

run();
