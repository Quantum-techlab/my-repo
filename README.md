# Image Text Extractor

A modern, beautiful web application for extracting text from images using OCR (Optical Character Recognition) technology. Built with vanilla JavaScript and powered by Tesseract.js.

## Features

- **Advanced OCR Technology**: Extract text from images with high accuracy using Tesseract.js
- **Drag & Drop Support**: Simply drag and drop your images for instant processing
- **Image Preview**: See a preview of your uploaded image before extraction
- **Real-time Progress**: Visual progress bar showing the extraction status
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Copy to Clipboard**: One-click copy functionality for extracted text
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Multiple Image Formats**: Supports JPG, PNG, GIF, and BMP files

## Tech Stack

- **Vite**: Fast build tool and development server
- **Tesseract.js**: Pure JavaScript OCR engine
- **Vanilla JavaScript**: No framework dependencies
- **CSS Variables**: For easy theming and dark mode
- **Inter Font**: Modern, clean typography

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd image-text-extractor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Usage

1. **Upload an Image**:
   - Click on the upload area to browse for an image
   - Or drag and drop an image file directly onto the upload area

2. **Extract Text**:
   - Click the "Extract Text" button
   - Watch the progress bar as the OCR processes your image

3. **Copy Text**:
   - Once extraction is complete, click "Copy Text" to copy the results to your clipboard

4. **Toggle Dark Mode**:
   - Click the sun/moon icon in the top-right corner to switch themes
   - Your preference is automatically saved

## Project Structure

```
image-text-extractor/
├── index.html          # Main HTML file
├── style.css           # All styles with CSS variables
├── script.js           # Application logic
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel deployment config
└── README.md          # This file
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Other Platforms

The application is a static site and can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Push the `dist` folder to the `gh-pages` branch
- **Cloudflare Pages**: Connect your repository and set build command to `npm run build`

## Browser Support

- Chrome/Edge (recommended for best performance)
- Firefox
- Safari
- Opera

Note: The Clipboard API requires a secure context (HTTPS) in production.

## Performance

- First load initializes the Tesseract.js worker
- Subsequent extractions reuse the worker for better performance
- Average processing time: 3-5 seconds per image (depending on image size and complexity)

## Customization

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --color-primary: #2563eb;      /* Primary blue color */
  --color-primary-hover: #1d4ed8; /* Hover state */
  /* ... other variables */
}
```

### Supporting More Languages

Modify `script.js` to change or add languages:

```javascript
worker = await createWorker('eng', 1, { /* options */ });
// Change 'eng' to 'fra' for French, 'spa' for Spanish, etc.
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [Vite](https://vitejs.dev/) - Build tool
- [Inter Font](https://rsms.me/inter/) - Typography

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with care for extracting text from images.
