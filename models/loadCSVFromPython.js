import { exec } from 'child_process';
import { importProductsFromCSV } from './loadProducts.js';

export const fetchAndImportProducts = () => {
  console.log('Starting Python Kaggle CSV download...');

  exec('python download_flipkart.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Python exec error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      return;
    }
    console.log(stdout); // Output from Python script
    console.log('Python CSV download finished. Importing to MongoDB...');

    importProductsFromCSV(); // Import CSV to MongoDB
  });
};
