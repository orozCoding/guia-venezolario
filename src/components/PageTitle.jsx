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
    <h1 
      className={`${getSizeClasses()} font-extrabold text-white text-center leading-tight`}
      style={{
        textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
      }}
    >
      {children}
    </h1>
  )
}

export default PageTitle