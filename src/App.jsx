import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import WordLookup from './components/WordLookup'
import WordGuess from './components/WordGuess'
import BackButton from './components/BackButton'

function App() {
  const [currentView, setCurrentView] = useState('home')

  // Handle PWA shortcuts from manifest.json
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const action = urlParams.get('action')
    
    if (action === 'lookup') {
      setCurrentView('lookup')
    } else if (action === 'guess') {
      setCurrentView('guess')
    }

    // PWA install prompt handling
    let deferredPrompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      console.log('PWA: Install prompt available')
      
      // Show custom install button after 10 seconds
      setTimeout(() => {
        if (deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
          const installBtn = document.createElement('div')
          installBtn.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: #fbbf24; color: black; padding: 12px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000; font-family: system-ui;">
              📱 Instalar App
            </div>
          `
          installBtn.onclick = () => {
            deferredPrompt.prompt()
            deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('PWA: User accepted install')
              }
              deferredPrompt = null
              installBtn.remove()
            })
          }
          document.body.appendChild(installBtn)
        }
      }, 10000) // Show after 10 seconds
    })
  }, [])

  const handleNavigate = (view) => {
    setCurrentView(view)
    window.scrollTo(0, 0)
  }

  const renderView = () => {
    switch (currentView) {
      case 'lookup':
        return (
          <div key="lookup" className="animate-fade-in">
            <WordLookup />
          </div>
        )
      case 'guess':
        return (
          <div key="guess" className="animate-fade-in">
            <WordGuess />
          </div>
        )
      default:
        return (
          <div key="home" className="animate-fade-in">
            <HomePage onNavigate={handleNavigate} />
          </div>
        )
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
      
      {/* Floating Back Button - Outside transitions */}
      {currentView !== 'home' && (
        <BackButton onClick={() => {
          setCurrentView('home')
          window.scrollTo(0, 0)
        }} />
      )}
      
      <div className="relative z-10 px-4 py-4">
        <div className="transition-all duration-300 ease-in-out">
          {renderView()}
        </div>
      </div>
    </div>
  )
}

export default App
