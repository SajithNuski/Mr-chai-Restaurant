import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB_PATH = path.join(__dirname, 'local_db.json');

if (fs.existsSync(LOCAL_DB_PATH)) {
  try {
    const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    console.log('Local DB Stats:');
    console.log(`- Users: ${data.users?.length || 0}`);
    console.log(`- Messages: ${data.messages?.length || 0}`);
    console.log(`- Subscriptions: ${data.subscriptions?.length || 0}`);
    console.log(`- Orders: ${data.orders?.length || 0}`);
    console.log(`- Menu: ${data.menu?.length || 0}`);
    console.log(`- Gallery: ${data.gallery?.length || 0}`);
    
    if (data.menu && data.menu.length > 0) {
      console.log('\nFirst few Menu items:');
      data.menu.slice(0, 3).forEach(item => {
        console.log(`  - ${item.name} (${item.category}): image size = ${item.image ? item.image.length : 0} chars`);
      });
    }
    if (data.gallery && data.gallery.length > 0) {
      console.log('\nFirst few Gallery items:');
      data.gallery.slice(0, 3).forEach(item => {
        console.log(`  - ${item.title} (${item.category}): image size = ${item.image ? item.image.length : 0} chars`);
      });
    }
  } catch (err) {
    console.error('Failed to parse local_db.json:', err);
  }
} else {
  console.log('local_db.json does not exist.');
}
