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
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
              
              Estoy jugando Venezolario, un juego que pone a prueba cuantas palabras usadas en Venezuela conoces. El juego te dice una frase o te da una o más pistas, y debes adivinar la palabra que esté relacionada.

              Este juego a veces es controversial porque las personas, venezolanas, no conocen algunas de las palabras. En mi caso, no entiendo la palabra "${word}"

              Explica el significado de la palabra en el contexto de jerga venezolana.
              1. Definición clara y concisa
              2. Contexto de uso en Venezuela
              3. Origen o historia si es relevante
              4. En qué ciudades, estados o regiones de Venezuela se usa
              5. Ejemplos de uso en oraciones
              6. Es MUY posible que en diferentes contextos o regiones la palabra se use de manera diferente, así que es tu deber explicar el significado de la palabra en cada contexto o región posible, repitiendo los items de arriba,
              
              Responde en español de forma educativa y amigable, sin mencionar los títulos o items de la lista anterior. No saludes, no digas Hola.`
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
    <div className="max-w-md mx-auto px-2">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-yellow-700 hover:text-yellow-800 transition-colors duration-200 bg-yellow-50 hover:bg-yellow-100 px-3 py-2 rounded-full"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Inicio</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-yellow-200/50">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-2xl sm:text-3xl text-yellow-800 mb-2">Consulta una palabra</h2>
          <p className="text-sm text-yellow-700 opacity-90 px-2">
            Escribe una palabra venezolana para conocer su significado
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-yellow-800 mb-2">
              Palabra venezolana
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Ej: arepa, chévere, marico..."
              className="w-full px-4 py-4 border border-yellow-300 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/80 text-gray-800 placeholder-yellow-600/60"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-sm"
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

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 p-5 bg-white/90 border border-yellow-200 rounded-2xl animate-fade-in shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">💡</span>
              <h3 className="text-lg font-semibold text-yellow-800">
                "{word}"
              </h3>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordLookup