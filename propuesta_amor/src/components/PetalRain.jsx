import React, { useMemo } from 'react';

const PetalRain = () => {
  const petalsCount = 28;

  const petals = useMemo(() => {
    const arr = [];
    const colors = ['pink', 'red', 'yellow', 'lilac'];
    
    for (let i = 0; i < petalsCount; i++) {
      const left = Math.random() * 100; // % de la pantalla
      const duration = 6 + Math.random() * 8; // duración entre 6s y 14s
      const delay = Math.random() * -14; // delay negativo para que aparezcan ya cayendo al cargar la web
      const size = 12 + Math.random() * 18; // tamaño entre 12px y 30px
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      arr.push({
        id: i,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 1.3}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
        className: `petal petal-${color}`,
      });
    }
    return arr;
  }, []);

  return (
    <div className="petal-rain-container">
      {petals.map((petal) => (
        <div key={petal.id} className={petal.className} style={petal.style} />
      ))}
    </div>
  );
};

export default PetalRain;
