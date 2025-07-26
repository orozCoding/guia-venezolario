function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm border border-gray-200"
    >
      ← Volver
    </button>
  )
}

export default BackButton