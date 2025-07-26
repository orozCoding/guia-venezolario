function App() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-7xl text-gray-900 mb-6 tracking-tight">
          Hola Mundo
        </h1>
        <h2 className="text-3xl text-gray-700 mb-4">
          Guía Venezolario
        </h2>
        <p className="text-xl text-gray-600 font-light tracking-wide mb-6">
          Tu guía completa de Venezuela
        </p>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-700 mb-2 font-medium">Estado de API Key:</p>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
            {geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'No configurada'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
