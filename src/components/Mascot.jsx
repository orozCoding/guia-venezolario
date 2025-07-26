function Mascot({ type }) {
  const getMascotImage = () => {
    switch (type) {
      case 'main':
        return '/main_mascot.png'
      case 'look':
        return '/look_mascot.png'
      case 'guess':
        return '/guess_mascot.png'
      default:
        return '/main_mascot.png'
    }
  }

  const getMascotAlt = () => {
    switch (type) {
      case 'main':
        return 'Mascota principal'
      case 'look':
        return 'Mascota consulta'
      case 'guess':
        return 'Mascota adivinanza'
      default:
        return 'Mascota'
    }
  }

  return (
    <div className="w-full text-center flex items-center justify-center">
      <div className="w-40">
        <img 
          src={getMascotImage()} 
          alt={getMascotAlt()} 
        />
      </div>
    </div>
  )
}

export default Mascot