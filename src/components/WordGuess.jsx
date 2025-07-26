import { useState } from 'react'
import Mascot from './Mascot'

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
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 3D Back Button */}
      <button
        onClick={onBack}
        className="mb-6 bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-300 hover:to-gray-500 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_0_#4b5563] hover:shadow-[0_2px_0_#4b5563] active:shadow-[0_1px_0_#4b5563] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150"
      >
        ← Volver
      </button>

      {/* 3D Gaming Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600 drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] mb-2">
          Adivinar palabra
        </h2>
        <p className="text-gray-800 font-medium">
          Dame las pistas y te ayudo a resolverlo
        </p>
      </div>

      {/* Guess Mascot */}
      <div className="text-center mb-6">
        <Mascot type="guess" />
      </div>

      {/* 3D Gaming Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hints Section */}
        <div>
          <label className="block text-gray-800 font-bold mb-3 text-center">
            ¿Cuáles son las pistas? 🤔
          </label>
          <div className="space-y-3">
            {hints.map((hint, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold text-sm rounded-lg shadow-[0_2px_0_#1e40af]">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  placeholder={`Pista ${index + 1}...`}
                  className="flex-1 px-3 py-2 text-gray-800 font-medium bg-white rounded-lg border-2 border-white shadow-[0_2px_0_#d1d5db] focus:shadow-[0_1px_0_#d1d5db] focus:translate-y-0.5 transition-all duration-150 outline-none"
                  disabled={loading}
                />
                {hints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHint(index)}
                    className="w-8 h-8 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 text-white font-bold rounded-lg shadow-[0_2px_0_#dc2626] hover:shadow-[0_1px_0_#dc2626] active:shadow-[0_0px_0_#dc2626] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150"
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
            className="mt-3 w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-[0_3px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] active:shadow-[0_1px_0_#16a34a] transform hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150"
            disabled={loading}
          >
            Agregar pista
          </button>
        </div>

        {/* Letter Counter */}
        <div>
          <label className="block text-gray-800 font-bold mb-3 text-center">
            ¿Cuántas letras tiene?
          </label>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={decrementLetters}
              className="w-12 h-12 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold text-xl rounded-lg shadow-[0_3px_0_#ea580c] hover:shadow-[0_2px_0_#ea580c] active:shadow-[0_1px_0_#ea580c] disabled:shadow-[0_3px_0_#6b7280] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150"
              disabled={loading || letterCount <= 1}
            >
              −
            </button>
            <div className="bg-white rounded-lg px-6 py-3 shadow-[0_4px_0_#d1d5db] border-2 border-white">
              <div className="text-3xl font-bold text-gray-800 text-center">
                {letterCount}
              </div>
              <div className="text-gray-600 text-xs text-center">
                {letterCount === 1 ? 'letra' : 'letras'}
              </div>
            </div>
            <button
              type="button"
              onClick={incrementLetters}
              className="w-12 h-12 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold text-xl rounded-lg shadow-[0_3px_0_#ea580c] hover:shadow-[0_2px_0_#ea580c] active:shadow-[0_1px_0_#ea580c] disabled:shadow-[0_3px_0_#6b7280] transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150"
              disabled={loading || letterCount >= 20}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || hints.every(hint => !hint.trim())}
          className="w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl shadow-[0_6px_0_#1e40af] hover:shadow-[0_4px_0_#1e40af] active:shadow-[0_2px_0_#1e40af] disabled:shadow-[0_6px_0_#6b7280] transform hover:-translate-y-1 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-blue-300 disabled:border-gray-300"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Pensando... 🧠</span>
            </div>
          ) : (
            <span className="text-lg">¡Dame las respuestas! 🔮</span>
          )}
        </button>
      </form>

      {/* 3D Error State */}
      {error && (
        <div className="mt-4 bg-gradient-to-b from-red-400 to-red-600 text-white p-4 rounded-xl shadow-[0_4px_0_#dc2626] border-2 border-red-300">
          <div className="flex items-center space-x-2">
            <span className="text-xl">😵</span>
            <div>
              <p className="font-bold">¡Oops! Algo salió mal</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3D Results */}
      {suggestions.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-[0_6px_0_#d1d5db] border-4 border-white p-4">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                ¡Posibles respuestas!
              </h3>
              <p className="text-gray-600 text-sm">Palabras de {letterCount} letras</p>
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map((word, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-purple-300 to-purple-500 hover:from-purple-200 hover:to-purple-400 p-3 rounded-lg text-center shadow-[0_4px_0_#7c3aed] hover:shadow-[0_2px_0_#7c3aed] transform hover:-translate-y-1 transition-all duration-150 cursor-pointer border-2 border-purple-200"
              >
                <span className="text-lg font-bold text-white uppercase tracking-wide">
                  {word}
                </span>
                <div className="flex justify-center items-center space-x-2 mt-1">
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
  )
}

export default WordGuess