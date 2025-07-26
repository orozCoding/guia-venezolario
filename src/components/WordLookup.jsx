import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-yellow-600/20 opacity-50"></div>
        
        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <h2 className="text-3xl sm:text-4xl text-white font-bold mb-3 drop-shadow-lg">
            Consulta una palabra
          </h2>
          <p className="text-white/80 text-base px-4">
            Escribe cualquier palabra venezolana y te explico todo sobre ella
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div>
            <label htmlFor="word" className="block text-white font-medium mb-3 text-center">
              ¿Cuál palabra no entiendes?
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Escribe la palabra aquí..."
              className="w-full px-6 py-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-yellow-400/50 focus:border-yellow-300 transition-all duration-300 text-white placeholder-white/60 text-lg font-medium shadow-lg"
              disabled={loading}
            />
            <p className="text-white/60 text-sm mt-2 text-center">
              Ej: arepa, chévere, marico, pana, chamo...
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-2xl hover:shadow-yellow-500/25 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {loading ? (
              <div className="relative flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-lg">Buscando...</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center space-x-2">
                <span className="text-lg">¡Búscala!</span>
                <span className="text-xl group-hover:animate-bounce">🚀</span>
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

        {/* Result - Beautiful */}
        {result && (
          <div className="relative mt-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl animate-fade-in shadow-xl border border-white/30">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">💡</span>
              <h3 className="text-2xl font-bold text-gray-800">
                "{word}"
              </h3>
            </div>
            <div className="text-gray-700 leading-relaxed prose prose-gray max-w-none">
              <ReactMarkdown 
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold text-gray-800 mb-3">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold text-gray-800 mb-2 mt-4">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold text-gray-800 mb-2 mt-3">{children}</h3>,
                  p: ({children}) => <p className="text-base mb-3 leading-relaxed">{children}</p>,
                  strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                  ul: ({children}) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="text-base">{children}</li>,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordLookup