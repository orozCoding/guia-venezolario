function HomePage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
      {/* Header with Venezuelan vibes */}
      <div className="mb-12 animate-bounce-in">
        <div className="relative mb-6">
          <h1 className="text-5xl sm:text-6xl text-white font-extrabold mb-4 drop-shadow-2xl text-red-200">
            Guía Venezolario
          </h1>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🇻🇪</div>
        </div>
        <p className="text-lg sm:text-xl text-white/90 font-medium drop-shadow-lg px-4">
          ¡Tu pana para descifrar palabras venezolanas!
        </p>
      </div>

      {/* Venezuelan Stars Decoration */}
      <div className="flex justify-center space-x-3 mb-10">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-white rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>

      {/* Action Buttons - Modern & Fun */}
      <div className="space-y-6 w-full max-w-sm">
        <button
          onClick={() => onNavigate('lookup')}
          className="group relative w-full overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 transform transition-all duration-500 hover:scale-105 hover:bg-white/30 active:scale-95 shadow-2xl hover:shadow-yellow-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex flex-col items-center space-y-3">
            <div className="text-5xl group-hover:animate-bounce">🔍</div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-100 transition-colors">
              Consulta una palabra
            </h3>
            <p className="text-sm text-white/80 group-hover:text-white transition-colors">
              Descubre qué significa esa palabra que no conoces
            </p>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('guess')}
          className="group relative w-full overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 transform transition-all duration-500 hover:scale-105 hover:bg-white/30 active:scale-95 shadow-2xl hover:shadow-blue-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex flex-col items-center space-y-3">
            <div className="text-5xl group-hover:animate-bounce">🎯</div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
              Adivinar palabra
            </h3>
            <p className="text-sm text-white/80 group-hover:text-white transition-colors">
              Dame las pistas y te ayudo a resolver el juego
            </p>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer with Venezuelan flair */}
      <div className="mt-12 text-center">
        <p className="text-white/70 text-sm font-medium">
          Hecho con ❤️ para todos los panas venezolanos
        </p>
      </div>
    </div>
  )
}

export default HomePage