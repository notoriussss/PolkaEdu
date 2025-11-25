#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Build Verification ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

const distPath = path.join(process.cwd(), 'dist', 'index.js');
const distDir = path.join(process.cwd(), 'dist');

console.log('Looking for dist/index.js at:', distPath);

if (fs.existsSync(distPath)) {
  console.log('✓ SUCCESS: dist/index.js exists');
  const stats = fs.statSync(distPath);
  console.log('File size:', stats.size, 'bytes');
  process.exit(0);
} else {
  console.error('✗ ERROR: dist/index.js not found!');
  
  // Check if dist directory exists
  if (fs.existsSync(distDir)) {
    console.log('dist directory exists. Contents:');
    try {
      const files = fs.readdirSync(distDir);
      files.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.isDirectory() ? 'dir' : 'file'}, ${stats.size} bytes)`);
      });
    } catch (err) {
      console.error('Error reading dist directory:', err.message);
    }
  } else {
    console.error('dist directory does not exist!');
    
    // Check what's in the current directory
    console.log('\nContents of current directory:');
    try {
      const files = fs.readdirSync(process.cwd());
      files.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
      });
    } catch (err) {
      console.error('Error reading current directory:', err.message);
    }
  }
  
  process.exit(1);
}

