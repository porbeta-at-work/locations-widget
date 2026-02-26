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

3. Validate exported widgets:
   ```bash
   npm run validate
   ```
   Opens http://localhost:3001 to test widgets in a Drupal-like environment

## Building for Drupal

When you're ready to deploy your changes to Drupal:

```bash
npm run build
```

This generates multiple options in the `dist/` folder:

- **`complete-widget.html`** - Full component with info boxes (matches original page exactly)
- **`minimal-widget.html`** - Just the locations filter (for custom layouts)  
- **`widget-html.html`** - HTML structure only (for separate CSS/JS integration)
- **`widget-styles.css`** - CSS styling (for theme integration)
- **`widget-script.js`** - JavaScript functionality (for theme assets)

## Validation & Testing

Use the validation environment to ensure your exports match the original:

```bash
npm run validate
```

This opens a test page where you can:
- Compare your exported widgets with the [original site](https://training.archives.gov/locations)
- Test both complete and minimal widget versions
- Verify functionality in a Drupal-like environment

## Features

- Local development with live reload
- Filter locations by type (All, Research, Federal Records Centers, Presidential Libraries)
- Responsive Bootstrap styling
- Sample location data for testing
- Build script to generate Drupal-compatible output

## Dependencies

The component uses:
- jQuery 3.6.0
- Bootstrap 3.4.1 (CSS framework)
- Bootstrap Glyphicons (icons)
- Font Awesome 4.7.0 (additional icons)

## Development Workflow

1. Make changes to the HTML, CSS, or JavaScript files
2. Test locally using `npm start`
3. When satisfied, run `npm run build` to generate Drupal code
4. Copy the generated code from `dist/` to your Drupal site