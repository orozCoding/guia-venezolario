function HomePage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-6xl md:text-7xl text-gray-900 mb-6 tracking-tight">
          Guía Venezolario
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light tracking-wide mb-8">
          Tu compañero para el juego de palabras venezolanas
        </p>
      </div>

      <div className="space-y-6 w-full max-w-md">
        <button
          onClick={() => onNavigate('lookup')}
          className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🔍</span>
            <span className="text-lg">Consulta una palabra</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Aprende el significado de palabras venezolanas
          </p>
        </button>

        <button
          onClick={() => onNavigate('guess')}
          className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🎯</span>
            <span className="text-lg">Adivinar palabra</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Obtén sugerencias para resolver el juego
          </p>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Complemento web para la aplicación móvil Venezolario
        </p>
      </div>
    </div>
  )
}

export default HomePage