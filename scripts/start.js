#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(process.cwd(), 'dist', 'index.js');

// Verificar si dist/index.js existe
if (!fs.existsSync(distPath)) {
  console.log('⚠️  dist/index.js not found. Running build...');
  try {
    execSync('yarn build', { stdio: 'inherit', cwd: process.cwd() });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
  
  // Verificar nuevamente después del build
  if (!fs.existsSync(distPath)) {
    console.error('❌ ERROR: dist/index.js still not found after build!');
    console.error('Current directory:', process.cwd());
    console.error('Looking for:', distPath);
    process.exit(1);
  }
}

// Ejecutar la aplicación
console.log('🚀 Starting application...');
require(distPath);

