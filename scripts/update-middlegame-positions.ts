import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { middlegamePositions } from '../components/analysis/training-plan/training-topics/middlegame/positions.js';

interface MiddlegamePositions {
  [key: string]: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIDDLEGAME_DIR = path.join(__dirname, '../app/dashboard/learning/middlegame');

// Function to update a single page
function updatePage(pagePath: string, position: string) {
  if (!fs.existsSync(pagePath)) {
    console.log(`Page not found: ${pagePath}`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Update the FEN position
  content = content.replace(
    /const\s+initialPosition\s*=\s*['"].*?['"]/,
    `const initialPosition = '${position}'`
  );

  fs.writeFileSync(pagePath, content);
  console.log(`Updated ${pagePath}`);
}

// Update all pages
Object.entries(middlegamePositions).forEach(([topic, position]) => {
  const pagePath = path.join(MIDDLEGAME_DIR, topic, 'page.tsx');
  updatePage(pagePath, position);
});

console.log('All pages updated successfully!'); 