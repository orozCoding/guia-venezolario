import Mascot from './Mascot'

function HomePage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* 3D Gaming Header */}
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-2 drop-shadow-[0_6px_0_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform">
          Guía Venezolario
        </h1>


        {/* Main Mascot */}
        <Mascot type="main" />
      </div>


      {/* 3D Gaming Buttons */}
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate('lookup')}
          className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_0_#ca8a04] hover:shadow-[0_6px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] transform hover:-translate-y-1 active:translate-y-1 transition-all duration-150 border-2 border-yellow-300"
        >
          <div className="flex flex-col items-center space-y-1">
            <div className="text-3xl">🔍</div>
            <span className="text-2xl">Consultar palabra</span>
            <span className="text-sm text-gray-200">Busca información sobre una palabra...</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('guess')}
          className="w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_0_#1e40af] hover:shadow-[0_6px_0_#1e40af] active:shadow-[0_2px_0_#1e40af] transform hover:-translate-y-1 active:translate-y-1 transition-all duration-150 border-2 border-blue-300"
        >
          <div className="flex flex-col items-center space-y-1">
            <div className="text-3xl">🎯</div>
            <span className="text-2xl">Adivinar palabra</span>
            <span className="text-sm text-gray-200">Incluye pistas y te ayudará a resolver la palabra...</span>
          </div>
        </button>
      </div>

      <p className="mt-8 text-white/80 text-sm font-medium drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]">
        Hecho con ❤️ para todos los panas venezolanos
      </p>
    </div>
  )
}

export default HomePage