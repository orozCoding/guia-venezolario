function HomePage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[92vh] text-center px-2">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl text-gray-800 mb-3 tracking-tight leading-tight">
          Guía Venezolario
        </h1>
        <p className="text-base sm:text-lg text-gray-600 font-light px-4 leading-relaxed">
          Tu compañero para el juego de palabras venezolanas
        </p>
      </div>

      {/* Venezuelan Flag Decorative Element */}
      <div className="flex space-x-2 mb-8">
        <div className="w-8 h-2 bg-yellow-300 rounded-full opacity-60"></div>
        <div className="w-8 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="w-8 h-2 bg-red-400 rounded-full opacity-60"></div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate('lookup')}
          className="group w-full bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-800 font-medium py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 border border-yellow-200/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/0 via-white/20 to-yellow-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="relative flex flex-col items-center space-y-2">
            <span className="text-3xl">🔍</span>
            <span className="text-lg font-semibold">Consulta una palabra</span>
            <p className="text-sm text-yellow-700 opacity-90">
              Aprende el significado
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('guess')}
          className="group w-full bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 font-medium py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 border border-blue-200/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/0 via-white/20 to-blue-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="relative flex flex-col items-center space-y-2">
            <span className="text-3xl">🎯</span>
            <span className="text-lg font-semibold">Adivinar palabra</span>
            <p className="text-sm text-blue-700 opacity-90">
              Obtén sugerencias
            </p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 opacity-75">
          Complemento web para Venezolario
        </p>
      </div>
    </div>
  )
}

export default HomePage