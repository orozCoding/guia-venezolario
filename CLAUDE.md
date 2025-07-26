# Guía Venezolario

## Project Overview
This project is IN SPANISH for the end-user. Every string user-visible should be in Spanish.
Guía Venezolario is a comprehensive Venezuelan guide built with React and Tailwind CSS. The app is designed to be hosted on Netlify and serves as a resource for Venezuelan-related information.

## Tech Stack
- **Frontend**: React 18+ without TypeScript
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
- Mobile first Responsive design with Tailwind CSS
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

## App Features

### Main Features
1. **Word Lookup ("Consulta una palabra")**
   - Users can input Venezuelan words
   - Gemini AI provides detailed explanations including:
     - Clear definition
     - Venezuelan context and usage
     - Etymology/history when relevant
     - Example sentences

2. **Word Guessing ("Adivinar palabra")**
   - Users can input multiple hints/clues
   - Users specify the number of letters (1-20)
   - Gemini AI generates 5 possible Venezuelan word suggestions
   - Interactive stepper for letter count

### User Interface
- Mobile-first responsive design
- Smooth animations and transitions
- Clean, intuitive navigation
- Custom fonts: Luckiest Guy (headings) + Rubik (body)
- Glass-morphism design with backdrop blur effects

### Technical Implementation
- Component-based architecture
- State management with React hooks
- Direct Gemini API integration
- Error handling and loading states
- Animated feedback for user actions

## Notes for Claude
- The app name is "Guía Venezolario"
- Complement for mobile app "Venezolario" (word guessing game)
- All user-visible text in Spanish
- Uses latest React and Tailwind CSS versions (no TypeScript)
- No database required - static site
- Optimized for Netlify hosting
- Gemini API key required for functionality