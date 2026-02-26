# Locations Widget - Local Development

This project provides a local development environment for the National Archives locations component that can be used in Drupal.

## Project Structure

```
locations-widget/
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── data/                   # Sample location data
├── dist/                   # Built files for Drupal
├── scripts/                # Build scripts
├── index.html              # Development page
├── package.json            # Dependencies
└── README.md               # This file
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   Opens http://localhost:3000 with the full development environment

## Building for Drupal

When you're ready to deploy your changes to Drupal:

```bash
npm run build
```

This generates the following files in the `dist/` folder:

- **`widget-content.html`** - Complete widget content ready to paste into Drupal
- **`README.md`** - Integration instructions and dependencies

## Features

- Local development with live reload
- Filter locations by type (All, Research, Federal Records Centers, Presidential Libraries)
- Responsive Bootstrap styling
- Sample location data for testing
- Build script to generate Drupal-compatible output

## Development Workflow

1. Make changes to the HTML, CSS, or JavaScript files
2. Test locally using `npm start`
3. When satisfied, run `npm run build` to generate Drupal code
4. Copy the generated code from `dist/` to your Drupal site