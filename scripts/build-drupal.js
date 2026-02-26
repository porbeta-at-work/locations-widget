/**
 * Simple build script to extract Drupal-ready content from div#main-content
 * This script extracts just the main content div with all inline styles and scripts
 */

const fs = require('fs');
const path = require('path');

// File paths
const htmlFile = path.join(__dirname, '..', 'index.html');
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

function extractMainContent() {
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Find the main-content div
    const startPattern = '<div id="main-content"';
    const startIndex = htmlContent.indexOf(startPattern);
    
    if (startIndex === -1) {
        throw new Error('Could not find div#main-content');
    }
    
    // Find the opening tag end
    const openTagEnd = htmlContent.indexOf('>', startIndex) + 1;
    
    // Count divs to find the matching closing tag
    let divCount = 1;
    let currentIndex = openTagEnd;
    
    while (divCount > 0 && currentIndex < htmlContent.length) {
        const nextOpenDiv = htmlContent.indexOf('<div', currentIndex);
        const nextCloseDiv = htmlContent.indexOf('</div>', currentIndex);
        
        if (nextCloseDiv === -1) {
            throw new Error('Could not find matching closing div for main-content');
        }
        
        if (nextOpenDiv !== -1 && nextOpenDiv < nextCloseDiv) {
            divCount++;
            currentIndex = nextOpenDiv + 4;
        } else {
            divCount--;
            currentIndex = nextCloseDiv + 6;
        }
    }
    
    // Extract the content inside the main-content div (excluding the div tags themselves)
    const mainContentHTML = htmlContent.substring(openTagEnd, currentIndex - 6).trim();
    
    return mainContentHTML;
}

function createInstructions() {
    return `# National Archives Locations Widget - Drupal Integration

## Quick Integration
Copy the contents of \`widget-content.html\` and paste directly into your Drupal content area.

## What's Included
- Complete widget HTML with inline styles and JavaScript
- All functionality self-contained
- No external dependencies beyond jQuery and Bootstrap (standard in Drupal)

## Dependencies
The widget requires:
- jQuery 1.7+ (included with Drupal 7)
- Bootstrap 3.x CSS (for basic styling)
- Access to NARA locations data endpoint

## Data Endpoint
The widget fetches data from: /sites/all/modules/custom/nwsync/locations.js

Build date: ${new Date().toISOString().split('T')[0]}`;
}

// Main build process
console.log('🔨 Building Drupal-compatible widget...');

try {
    // Extract main content
    const mainContent = extractMainContent();
    
    // Write the content to dist folder
    fs.writeFileSync(path.join(distDir, 'widget-content.html'), mainContent);
    
    // Create instructions
    const instructions = createInstructions();
    fs.writeFileSync(path.join(distDir, 'README.md'), instructions);
    
    console.log('✅ Build complete! Files generated in dist/ folder:');
    console.log('   - widget-content.html (ready to paste into Drupal)');
    console.log('   - README.md (integration instructions)');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Copy the contents of dist/widget-content.html');
    console.log('   2. Paste into your Drupal content area');
    console.log('   3. Ensure jQuery and Bootstrap are loaded on the page');
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}