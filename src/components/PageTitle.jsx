function PageTitle({ children, size = "large" }) {
  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'text-5xl sm:text-6xl'
      case 'medium':
        return 'text-3xl sm:text-4xl'
      case 'small':
        return 'text-2xl sm:text-3xl'
      default:
        return 'text-5xl sm:text-6xl'
    }
  }

  return (
    <div className="relative inline-block">
      <h1 
        className={`${getSizeClasses()} font-extrabold text-center leading-tight relative z-10 px-4`}
        style={{
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(3px 3px 0px #000) drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000) drop-shadow(-1px 1px 0px #000)'
        }}
      >
        {children}
      </h1>
      
      {/* Cartoon decorative elements */}
      <div className="absolute -top-2 -left-1 w-5 h-5 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute -bottom-1 -right-0 w-4 h-4 bg-orange-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 -left-2 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/4 -right-1 w-2 h-2 bg-orange-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
    </div>
  )
}

export default PageTitle