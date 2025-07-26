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
    <div className="min-h-screen bg-gradient-to-b from-gray-300 to-white relative">
      {/* Background Image */}
      <div className="fixed inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{
            backgroundImage: 'url(/background.png)'
          }}
        ></div>
      </div>
      
      {/* 3D Gaming Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15)_0%,transparent_50%)]"></div>
        {/* Gaming dots pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="relative z-10 px-4 py-4">
        {renderView()}
      </div>
    </div>
  )
}

export default App
