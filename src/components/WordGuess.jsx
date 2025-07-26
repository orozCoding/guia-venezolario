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
              Si eres un mal perdedor y le quieres quitar el chiste al juego, puedes escribir las pistas y encontrar sugerencias de posibles palabras
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
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold text-sm rounded-lg shadow-[0_2px_0_#1e40af] flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      placeholder={`Pista ${index + 1}...`}
                      className="flex-1 px-4 py-3 text-base font-medium text-gray-800 bg-white rounded-lg border-2 border-white shadow-[0_2px_0_#d1d5db] focus:shadow-[0_1px_0_#d1d5db] focus:translate-y-0.5 transition-all duration-150 outline-none"
                      disabled={loading}
                    />
                    {hints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="w-10 h-10 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 text-white font-bold rounded-lg shadow-[0_2px_0_#dc2626] hover:shadow-[0_1px_0_#dc2626] active:shadow-[0_0px_0_#dc2626] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 flex-shrink-0"
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
                className="w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-[0_3px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] active:shadow-[0_1px_0_#16a34a] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150"
                disabled={loading}
              >
                Agregar pista
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
                  className="w-14 h-14 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold text-xl rounded-lg shadow-[0_3px_0_#ea580c] hover:shadow-[0_2px_0_#ea580c] active:shadow-[0_1px_0_#ea580c] disabled:shadow-[0_3px_0_#6b7280] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150"
                  disabled={loading || letterCount <= 1}
                >
                  −
                </button>
                <div className="bg-white rounded-lg px-8 py-4 shadow-[0_4px_0_#d1d5db] border-2 border-white">
                  <div className="text-4xl font-bold text-gray-800 text-center">
                    {letterCount}
                  </div>
                  <div className="text-gray-600 text-sm text-center mt-1">
                    {letterCount === 1 ? 'letra' : 'letras'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={incrementLetters}
                  className="w-14 h-14 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold text-xl rounded-lg shadow-[0_3px_0_#ea580c] hover:shadow-[0_2px_0_#ea580c] active:shadow-[0_1px_0_#ea580c] disabled:shadow-[0_3px_0_#6b7280] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150"
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
              className="w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold py-5 px-6 rounded-xl shadow-[0_6px_0_#1e40af] hover:shadow-[0_4px_0_#1e40af] active:shadow-[0_2px_0_#1e40af] disabled:shadow-[0_6px_0_#6b7280] transform hover:-translate-y-1 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-blue-300 disabled:border-gray-300"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-lg">Pensando... 🧠</span>
                </div>
              ) : (
                <span className="text-lg font-bold">¡Dame las respuestas! 🔮</span>
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
          <div className="bg-white rounded-xl shadow-[0_6px_0_#d1d5db] border-4 border-white p-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  ¡Posibles respuestas!
                </h3>
                <p className="text-gray-600 text-sm">Palabras de {letterCount} letras</p>
              </div>
            </div>
            <div className="space-y-4">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-purple-300 to-purple-500 hover:from-purple-200 hover:to-purple-400 p-4 rounded-lg text-center shadow-[0_4px_0_#7c3aed] hover:shadow-[0_2px_0_#7c3aed] transform hover:-translate-y-1 transition-all duration-150 cursor-pointer border-2 border-purple-200"
                >
                  <span className="text-lg font-bold text-white uppercase tracking-wide">
                    {word}
                  </span>
                  <div className="flex justify-center items-center space-x-2 mt-2">
                    <span className="text-xs text-white/80">#{index + 1}</span>
                    <div className="flex space-x-1">
                      {[...Array(Math.max(1, 5 - index))].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                      ))}
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