const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'ditwkoldt', 
  api_key: '151916886548332', 
  api_secret: 'ac0ADM6DLQxjMZpqdWJ7SFu-s-4' 
});

const dir = path.join(__dirname, 'public', 'chapter4');
const files = fs.readdirSync(dir);
const links = {};

(async () => {
  console.log("Starting upload...");
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(dir, file);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'chapter4_assets',
          public_id: path.parse(file).name,
          overwrite: true
        });
        links[file] = result.secure_url;
        console.log(`Uploaded ${file} -> ${result.secure_url}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }
  fs.writeFileSync('chapter4_links.json', JSON.stringify(links, null, 2));
  console.log("Done uploading. Links saved to chapter4_links.json");
})();
