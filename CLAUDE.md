# Guía Venezolario

## Project Overview
This project is IN SPANISH for the end-user. Every string user-visible should be in Spanish.
Guía Venezolario is a comprehensive Venezuelan guide built with React and Tailwind CSS. The app is designed to be hosted on Netlify and serves as a resource for Venezuelan-related information.

## Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS (latest version)
- **Build Tool**: Vite
- **Hosting**: Netlify

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Project Structure
```
├── src/
│   ├── App.tsx          # Main app component with centered Hello World
│   ├── index.css        # Tailwind CSS imports
│   └── main.tsx         # App entry point
├── public/              # Static assets
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## Features
- Responsive design with Tailwind CSS
- Smooth animations specially on section transitions
- Clean, centered layout
- Ready for Netlify deployment
- TypeScript support

## Deployment
This app is configured for Netlify deployment.

## Environment Variables

### Local Development
Create a `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Netlify Deployment
Add the following environment variable in Netlify:
- Key: `VITE_GEMINI_API_KEY`
- Value: Your actual Gemini API key

**Important**: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the client-side code.

## Notes for Claude
- The app name is "Guía Venezolario"
- Main page shows a centered "Hello World" with the app name
- Uses latest React and Tailwind CSS versions (no TypeScript)
- No database required - static site
- Optimized for Netlify hosting
- Environment variables are displayed on home page for testing