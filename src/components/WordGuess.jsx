import { useState } from 'react'

function WordGuess({ onBack }) {
  const [hints, setHints] = useState([''])
  const [letterCount, setLetterCount] = useState(5)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addHint = () => {
    setHints([...hints, ''])
  }

  const removeHint = (index) => {
    if (hints.length > 1) {
      setHints(hints.filter((_, i) => i !== index))
    }
  }

  const updateHint = (index, value) => {
    const newHints = [...hints]
    newHints[index] = value
    setHints(newHints)
  }

  const incrementLetters = () => {
    setLetterCount(prev => Math.min(prev + 1, 20))
  }

  const decrementLetters = () => {
    setLetterCount(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validHints = hints.filter(hint => hint.trim())
    
    if (validHints.length === 0) return

    setLoading(true)
    setError('')
    setSuggestions([])

    try {
      const hintsText = validHints.map((hint, i) => `${i + 1}. ${hint}`).join('\n')
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Estoy jugando Venezolario, un juego que pone a prueba cuantas palabras usadas en Venezuela conoces. El juego te dice una frase o te da una o más pistas, y debes adivinar la palabra que esté relacionada. Es posible ver el número de letras. Estoy estancado en una palabra que no logro descifrar.



Las pistas son: ${hintsText}



La palabra tiene ${letterCount} letras

IMPORTANTE: 
- Solo palabras típicamente venezolanas (modismos, comida, objetos, expresiones)
- Responde SOLO con una lista numerada de palabras, sin explicaciones adicionales
- No hay limite de cuantas palabras, pero tienen que estar relacionadas. Intenta incluir al menos 3 palabras.
- Una palabra por línea en este formato: "1. palabra"
- El orden de las palabras debería ser de mayor a menor posibilidad

Respuesta:`
            }]
          }]
        })
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text
        // Extract words from numbered list
        const words = rawText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(word => word.length > 0)
          .slice(0, 5)
        
        setSuggestions(words)
      } else {
        throw new Error('No se pudieron obtener sugerencias')
      }
    } catch (err) {
      setError('Error al obtener sugerencias. Intenta de nuevo.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-2">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Inicio</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-blue-200/50">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl sm:text-3xl text-blue-800 mb-2">Adivinar palabra</h2>
          <p className="text-sm text-blue-700 opacity-90 px-2">
            Ingresa las pistas y te ayudamos a encontrar la palabra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hints Section */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-3">
              Pistas o clues
            </label>
            <div className="space-y-3">
              {hints.map((hint, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => updateHint(index, e.target.value)}
                    placeholder={`Pista ${index + 1}...`}
                    className="flex-1 px-4 py-3 border border-blue-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/80 text-gray-800 placeholder-blue-600/60 text-sm"
                    disabled={loading}
                  />
                  {hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="w-12 h-12 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHint}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full"
              disabled={loading}
            >
              + Agregar otra pista
            </button>
          </div>

          {/* Letter Counter */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-3 text-center">
              Número de letras
            </label>
            <div className="flex items-center justify-center space-x-6">
              <button
                type="button"
                onClick={decrementLetters}
                className="w-12 h-12 rounded-full bg-blue-200 hover:bg-blue-300 disabled:bg-gray-200 flex items-center justify-center text-blue-800 font-bold transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100"
                disabled={loading || letterCount <= 1}
              >
                −
              </button>
              <div className="text-4xl font-bold text-blue-800 min-w-[80px] text-center bg-white/80 rounded-2xl py-2 px-4 border border-blue-200">
                {letterCount}
              </div>
              <button
                type="button"
                onClick={incrementLetters}
                className="w-12 h-12 rounded-full bg-blue-200 hover:bg-blue-300 disabled:bg-gray-200 flex items-center justify-center text-blue-800 font-bold transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100"
                disabled={loading || letterCount >= 20}
              >
                +
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || hints.every(hint => !hint.trim())}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generando sugerencias...</span>
              </div>
            ) : (
              'Obtener sugerencias'
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {suggestions.length > 0 && (
          <div className="mt-6 p-5 bg-white/90 border border-blue-200 rounded-2xl animate-fade-in shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">💡</span>
              <h3 className="text-lg font-semibold text-blue-800">
                Sugerencias ({letterCount} letras)
              </h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-white/30 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="text-xl font-bold text-blue-900 uppercase tracking-wider relative">
                    {word}
                  </span>
                  <div className="text-xs text-blue-600 mt-1 relative">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordGuess