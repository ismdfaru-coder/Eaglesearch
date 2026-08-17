# EagleSearch Website

A modern, privacy-focused search engine website inspired by Brave.com, rebranded as EagleSearch.

## Overview

EagleSearch is a complete website template for a privacy-first search engine that includes:
- **EagleSearch** - Main search product
- **EagleSearch API** - Developer API for integrating search
- **EagleSearch for Business** - Enterprise solutions

## Project Structure

```
eaglesearch/
├── index.html          # Main landing page
├── css/
│   └── styles.css      # All styles and responsive design
├── js/
│   └── main.js         # Interactive features and animations
├── images/             # Image assets directory
│   └── README.md       # Image requirements documentation
└── README.md           # This file
```

## Features

### Homepage Sections
1. **Hero Section** - Search box with call-to-action
2. **Features** - Six key features (Privacy, Speed, Unbiased, Secure, AI-Powered, Customizable)
3. **API Section** - Developer API information with code samples
4. **Business Section** - Three enterprise offerings (Enterprise Search, Private Index, White Label)
5. **Download Section** - Platform-specific download options (Windows, macOS, Android, iOS, Linux)
6. **About Section** - Company mission and statistics
7. **Footer** - Navigation links and social media

### Technical Features
- Fully responsive design (mobile, tablet, desktop)
- Smooth scroll animations
- Mobile hamburger menu
- Intersection Observer for scroll animations
- Counter animations for statistics
- Code sample copy functionality
- Dynamic copyright year
- SEO optimized with structured data
- Open Graph and Twitter Card meta tags

## Branding

- **Primary Color**: #FF6B00 (Orange)
- **Secondary Color**: #1a1a2e (Dark Blue)
- **Font**: System fonts stack for optimal performance

## Required Images

See `images/README.md` for the complete list of required image assets.

## Customization

### To change brand colors:
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #FF6B00;     /* Change this */
    --secondary-color: #1a1a2e;   /* Change this */
}
```

### To modify content:
Edit `index.html` - all text content is directly in the HTML.

### To add new sections:
1. Add HTML structure in `index.html`
2. Add corresponding styles in `css/styles.css`
3. Add any interactive features in `js/main.js`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This is a custom template. Replace placeholder content with your actual business information.

## Next Steps

1. Create or source logo and image assets
2. Customize content for your specific offerings
3. Set up actual search functionality
4. Implement API backend
5. Configure analytics
6. Deploy to hosting platform
