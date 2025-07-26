import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Mascot from './Mascot'
import PageTitle from './PageTitle'

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
        <div className="text-center">
          <div className="space-y-2">
            <Mascot type="look" />
            <PageTitle size="medium">
              Consultar palabra
            </PageTitle>
            <p className="text-gray-800 font-medium text-xs leading-relaxed">
              Escribe una palabra y aprende sobre su historia, contexto y usos en Venezuela
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Escribe la palabra aquí..."
                className="w-full px-5 py-4 text-lg font-bold text-gray-800 bg-white rounded-xl border-4 border-white shadow-[0_4px_0_#d1d5db] focus:shadow-[0_2px_0_#d1d5db] focus:translate-y-0.5 transition-all duration-150 outline-none"
                disabled={loading}
              />
              <p className="text-gray-700 text-sm text-center leading-relaxed">
                Ej: conuco, totumo, caleta, sortario...
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold py-5 px-6 rounded-xl shadow-[0_6px_0_#ca8a04] hover:shadow-[0_4px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] disabled:shadow-[0_6px_0_#6b7280] transform hover:-translate-y-1 active:translate-y-0.5 disabled:translate-y-0 transition-all duration-150 border-2 border-yellow-300 disabled:border-gray-300"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-lg">Buscando...</span>
                </div>
              ) : (
                <span className="text-lg font-bold">¡Buscar! 🤖</span>
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

        {/* Result Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-[0_6px_0_#d1d5db] border-4 border-white p-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-bold text-gray-800">
                "{word}"
              </h3>
            </div>
            <div className="text-gray-700 prose prose-gray max-w-none">
              <ReactMarkdown 
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold text-gray-800 mb-4">{children}</h1>,
                  h2: ({children}) => <h2 className="text-lg font-bold text-gray-800 mb-3 mt-6">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-bold text-gray-800 mb-2 mt-4">{children}</h3>,
                  p: ({children}) => <p className="text-base mb-4 leading-relaxed">{children}</p>,
                  strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                  ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="text-base leading-relaxed">{children}</li>,
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