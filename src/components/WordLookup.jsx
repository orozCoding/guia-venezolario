import { useState } from 'react'

function WordLookup({ onBack }) {
  const [word, setWord] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!word.trim()) return

    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Explica el significado de la palabra venezolana "${word}". Incluye:
              1. Definición clara y concisa
              2. Contexto de uso en Venezuela
              3. Origen o historia si es relevante
              4. Ejemplos de uso en oraciones
              
              Responde en español de forma educativa y amigable.`
            }]
          }]
        })
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setResult(data.candidates[0].content.parts[0].text)
      } else {
        throw new Error('No se pudo obtener una explicación')
      }
    } catch (err) {
      setError('Error al consultar la palabra. Intenta de nuevo.')
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
          <h2 className="text-4xl text-gray-900 mb-4">Consulta una palabra</h2>
          <p className="text-gray-600">
            Escribe una palabra venezolana para conocer su significado y contexto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
              Palabra venezolana
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Ej: arepa, chévere, marico..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Consultando...</span>
              </div>
            ) : (
              'Consultar palabra'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Explicación de "{word}"
            </h3>
            <div className="text-green-700 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordLookup