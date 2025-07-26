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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="transition-all duration-500 ease-in-out">
          {renderView()}
        </div>
      </div>
    </div>
  )
}

export default App
