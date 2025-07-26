import { useState } from 'react'
import Mascot from './Mascot'
import PageTitle from './PageTitle'

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
    <div className="min-h-screen px-2 py-8 relative">
      {/* Floating Back Button */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm border border-gray-200"
      >
        ← Volver
      </button>
      
      <div className="w-full max-w-md mx-auto space-y-8 pt-4">{/* Added pt-4 for spacing */}

        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Mascot type="guess" />
            <PageTitle size="medium">
              Adivinar palabra
            </PageTitle>
            <p className="text-gray-800 text-xs leading-relaxed">
              Si eres un mal perdedor y le quieres quitar el chiste al juego, puedes escribir las pistas y encontrar sugerencias de posibles soluciones
            </p>
          </div>
          
          
        </div>

        {/* Form Section */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hints Section */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-bold text-center text-lg">
                ¿Cuáles son las pistas? 🤔
              </label>
              <div className="space-y-4">
                {hints.map((hint, index) => (
                  <div key={index} className="flex space-x-3 items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-500 text-white font-bold text-sm rounded-xl shadow-[0_3px_0_#dc2626] flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      placeholder={`Pista ${index + 1}...`}
                      className="flex-1 px-4 py-3 text-base font-medium text-gray-800 bg-white rounded-xl border-2 border-gray-200 shadow-[0_3px_0_#e5e7eb] focus:border-red-300 focus:shadow-[0_2px_0_#e5e7eb] focus:translate-y-0.5 transition-all duration-150 outline-none"
                      disabled={loading}
                    />
                    {hints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="w-10 h-10 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-xl shadow-[0_3px_0_#6b7280] hover:shadow-[0_2px_0_#6b7280] active:shadow-[0_1px_0_#6b7280] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 flex-shrink-0"
                        disabled={loading}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addHint}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-xl shadow-[0_3px_0_#9ca3af] hover:shadow-[0_2px_0_#9ca3af] active:shadow-[0_1px_0_#9ca3af] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 border-2 border-gray-200"
                disabled={loading}
              >
                ➕ Agregar pista
              </button>
            </div>

            {/* Letter Counter Section */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-bold text-center text-lg">
                ¿Cuántas letras tiene? 📝
              </label>
              <div className="flex items-center justify-center space-x-6">
                <button
                  type="button"
                  onClick={decrementLetters}
                  className="w-14 h-14 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-800 font-bold text-xl rounded-xl shadow-[0_3px_0_#9ca3af] hover:shadow-[0_2px_0_#9ca3af] active:shadow-[0_1px_0_#9ca3af] disabled:shadow-[0_3px_0_#d1d5db] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-gray-200"
                  disabled={loading || letterCount <= 1}
                >
                  −
                </button>
                <div className="bg-white rounded-xl px-8 py-4 shadow-[0_4px_0_#e5e7eb] border-2 border-gray-200">
                  <div className="text-4xl font-bold text-red-500 text-center">
                    {letterCount}
                  </div>
                  <div className="text-gray-600 text-sm text-center mt-1">
                    {letterCount === 1 ? 'letra' : 'letras'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={incrementLetters}
                  className="w-14 h-14 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-800 font-bold text-xl rounded-xl shadow-[0_3px_0_#9ca3af] hover:shadow-[0_2px_0_#9ca3af] active:shadow-[0_1px_0_#9ca3af] disabled:shadow-[0_3px_0_#d1d5db] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-gray-200"
                  disabled={loading || letterCount >= 20}
                >
                  +
                </button>
              </div>
            </div>

            {/* Submit Button - Main CTA */}
            <button
              type="submit"
              disabled={loading || hints.every(hint => !hint.trim())}
              className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 disabled:from-gray-300 disabled:to-gray-400 text-gray-900 disabled:text-gray-500 font-bold py-6 px-6 rounded-xl shadow-[0_6px_0_#ca8a04] hover:shadow-[0_4px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] disabled:shadow-[0_6px_0_#9ca3af] transform hover:-translate-y-1 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-yellow-300 disabled:border-gray-200 text-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  <span className="text-lg">Pensando... 🧠</span>
                </div>
              ) : (
                <span className="font-bold">¡Dame las respuestas! 🫣</span>
              )}
            </button>
          </form>
        </div>

        {/* Error Section */}
        {error && (
          <div className="bg-gradient-to-b from-red-400 to-red-600 text-white p-5 rounded-xl shadow-[0_4px_0_#dc2626] border-2 border-red-300">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">😵</span>
              <div className="space-y-1">
                <p className="font-bold text-base">¡Oops! Algo salió mal</p>
                <p className="text-sm opacity-90 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-xl shadow-[0_6px_0_#e5e7eb] border-2 border-gray-200 p-6">
            <div class="w-full text-center font-bold text-lg mb-4"> 🤖 ¡Posibles respuestas! 🤖</div>
            <div className="space-y-3">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  onClick={() => navigator.clipboard.writeText(word)}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 cursor-pointer transition-all duration-150 active:scale-95"
                  title={`Tocar para copiar: ${word}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-red-500 text-white font-bold text-sm rounded-full">
                      {index + 1}
                    </span>
                    <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                      {word}
                    </span>
                  </div>
                  <div className="text-gray-400 text-lg">
                    📋
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