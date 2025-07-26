import Mascot from './Mascot'
import PageTitle from './PageTitle'

function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8">
      <div className="w-full max-w-sm mx-auto text-center space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <PageTitle>
            Guía Venezolario
          </PageTitle>
          
          <Mascot type="main" />
        </div>

        {/* Buttons Section */}
        <div className="space-y-6">
          <button
            onClick={() => onNavigate('lookup')}
            className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-white font-bold py-6 px-6 rounded-2xl shadow-[0_8px_0_#ca8a04] hover:shadow-[0_6px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] transform hover:-translate-y-1 active:translate-y-1 transition-all duration-150 border-2 border-yellow-300"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-4xl">🔍</div>
              <span className="text-xl font-bold">Consultar palabra</span>
              <span className="text-sm text-yellow-100 opacity-90 leading-relaxed">
                Busca información sobre una palabra
              </span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('guess')}
            className="w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-bold py-6 px-6 rounded-2xl shadow-[0_8px_0_#1e40af] hover:shadow-[0_6px_0_#1e40af] active:shadow-[0_2px_0_#1e40af] transform hover:-translate-y-1 active:translate-y-1 transition-all duration-150 border-2 border-blue-300"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-4xl">🎯</div>
              <span className="text-xl font-bold">Adivinar palabra</span>
              <span className="text-sm text-blue-100 opacity-90 leading-relaxed">
                Ayuda a resolver una palabra o nivel
              </span>
            </div>
          </button>
        </div>

        {/* Footer Section */}
        <div className="pt-4">
          <p className="text-gray-600 text-sm font-medium">
            Made by ❤️ + 🤖 by <a href="https://orozcoding.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@orozCoding</a>
          </p>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">
            Guía no oficial para el juego móvil Venezolario. Aprende sobre palabras, jerga y modismos de Venezuela.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage