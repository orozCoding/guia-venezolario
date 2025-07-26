import { useState } from 'react'
import HomePage from './components/HomePage'
import WordLookup from './components/WordLookup'
import WordGuess from './components/WordGuess'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const renderView = () => {
    switch (currentView) {
      case 'lookup':
        return <WordLookup onBack={() => setCurrentView('home')} />
      case 'guess':
        return <WordGuess onBack={() => setCurrentView('home')} />
      default:
        return <HomePage onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-blue-500 to-red-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg animate-ping"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="transition-all duration-700 ease-in-out">
          {renderView()}
        </div>
      </div>
    </div>
  )
}

export default App
