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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <span className="text-xl">←</span>
          <span>Volver al inicio</span>
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-gray-900 mb-4">Adivinar palabra</h2>
          <p className="text-gray-600">
            Ingresa las pistas que tienes y te ayudamos a encontrar la palabra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                  {hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="px-3 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              disabled={loading}
            >
              + Agregar otra pista
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Número de letras
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={decrementLetters}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-colors duration-200"
                disabled={loading || letterCount <= 1}
              >
                −
              </button>
              <div className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">
                {letterCount}
              </div>
              <button
                type="button"
                onClick={incrementLetters}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-colors duration-200"
                disabled={loading || letterCount >= 20}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || hints.every(hint => !hint.trim())}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
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

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Sugerencias de palabras de {letterCount} letras:
            </h3>
            <div className="grid gap-3">
              {suggestions.map((word, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-blue-200 text-center"
                >
                  <span className="text-xl font-bold text-blue-900 uppercase tracking-wider">
                    {word}
                  </span>
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