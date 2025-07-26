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
    <div className="max-w-lg mx-auto px-4">
      {/* Back Button - Modern */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20 hover:border-white/40 group"
        >
          <span className="text-xl group-hover:animate-bounce">←</span>
          <span className="font-medium">Volver al inicio</span>
        </button>
      </div>

      {/* Main Card - Super Modern */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-blue-600/20 opacity-50"></div>
        
        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">🎯</div>
          <h2 className="text-3xl sm:text-4xl text-white font-bold mb-3 drop-shadow-lg">
            Adivinar palabra
          </h2>
          <p className="text-white/80 text-base px-4">
            Dame las pistas y el número de letras, yo te ayudo a resolverlo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-8">
          {/* Hints Section - Fun */}
          <div>
            <label className="block text-white font-medium mb-4 text-center text-lg">
              ¿Cuáles son las pistas? 🤔
            </label>
            <div className="space-y-4">
              {hints.map((hint, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => updateHint(index, e.target.value)}
                    placeholder={`Escribe la pista ${index + 1}...`}
                    className="flex-1 px-5 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-300 text-white placeholder-white/60 font-medium shadow-lg"
                    disabled={loading}
                  />
                  {hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="w-12 h-12 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-2xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                      disabled={loading}
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHint}
              className="mt-4 w-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 py-3 px-5 rounded-2xl border border-white/20 hover:border-white/40 backdrop-blur-sm font-medium"
              disabled={loading}
            >
              ➕ Agregar otra pista
            </button>
          </div>

          {/* Letter Counter - Fun & Interactive */}
          <div>
            <label className="block text-white font-medium mb-4 text-center text-lg">
              ¿Cuántas letras tiene? 📝
            </label>
            <div className="flex items-center justify-center space-x-8">
              <button
                type="button"
                onClick={decrementLetters}
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 disabled:opacity-50 flex items-center justify-center text-white font-bold text-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg"
                disabled={loading || letterCount <= 1}
              >
                −
              </button>
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-4 border border-white/30 shadow-xl">
                <div className="text-5xl font-bold text-white text-center">
                  {letterCount}
                </div>
                <div className="text-white/60 text-sm text-center mt-1">
                  {letterCount === 1 ? 'letra' : 'letras'}
                </div>
              </div>
              <button
                type="button"
                onClick={incrementLetters}
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 disabled:opacity-50 flex items-center justify-center text-white font-bold text-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg"
                disabled={loading || letterCount >= 20}
              >
                +
              </button>
            </div>
          </div>

          {/* Submit Button - Exciting */}
          <button
            type="submit"
            disabled={loading || hints.every(hint => !hint.trim())}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-2xl hover:shadow-blue-500/25 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {loading ? (
              <div className="relative flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-lg">Pensando...</span>
                <span className="text-xl animate-bounce">🧠</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center space-x-2">
                <span className="text-lg">¡Dame las respuestas!</span>
                <span className="text-xl group-hover:animate-bounce">🔮</span>
              </div>
            )}
          </button>
        </form>

        {/* Error State - Modern */}
        {error && (
          <div className="relative mt-8 p-5 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl animate-slide-up">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">😵</span>
              <div>
                <p className="text-white font-medium">¡Oops! Algo salió mal</p>
                <p className="text-white/80 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results - Exciting */}
        {suggestions.length > 0 && (
          <div className="relative mt-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl animate-fade-in shadow-xl border border-white/30">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  ¡Posibles respuestas!
                </h3>
                <p className="text-gray-600">Palabras de {letterCount} letras</p>
              </div>
            </div>
            <div className="grid gap-4">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-2xl border border-blue-200 text-center overflow-hidden group hover:from-blue-200 hover:to-purple-200 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative">
                    <span className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
                      {word}
                    </span>
                    <div className="flex justify-center items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-600">#{index + 1}</span>
                      <div className="flex space-x-1">
                        {[...Array(5 - index)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
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