import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TulipGarden = ({ onNext }) => {
  const [openedTulips, setOpenedTulips] = useState({});
  const [activeTulipId, setActiveTulipId] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [particles, setParticles] = useState([]);
  
  const tulipsData = [
    {
      id: 1,
      title: "Tu Sonrisa",
      message: "Esa hermosa sonrisa que ilumina mis días más grises. Ver tu felicidad es lo más lindo de mi vida.",
    },
    {
      id: 2,
      title: "Tu Ternura",
      message: "La forma tan dulce y atenta en la que me tratas. Tienes el corazón más puro, noble y hermoso.",
    },
    {
      id: 3,
      title: "Nuestros Momentos",
      message: "Cada segundo a tu lado es especial. Compartir risas y pláticas contigo es mi parte favorita del día.",
    }
  ];

  // 1. Efecto máquina de escribir para revelar la promesa progresivamente sin desorganizar el texto
  useEffect(() => {
    if (!activeTulipId) {
      setDisplayedText("");
      return;
    }

    const fullText = tulipsData.find(t => t.id === activeTulipId).message;
    setDisplayedText("");
    
    let currentText = "";
    let index = 0;
    let timeoutId;

    const typeCharacter = () => {
      if (index < fullText.length) {
        currentText += fullText.charAt(index);
        setDisplayedText(currentText);
        index++;
        timeoutId = setTimeout(typeCharacter, 22); // Velocidad ideal de lectura fluida
      }
    };

    timeoutId = setTimeout(typeCharacter, 22);

    return () => clearTimeout(timeoutId);
  }, [activeTulipId]);

  const handleTulipClick = (id) => {
    const isFirstTime = !openedTulips[id];
    
    setOpenedTulips(prev => ({
      ...prev,
      [id]: true
    }));
    setActiveTulipId(id);

    // 2. Lanzar estallido de destellos si es la primera vez que se abre
    if (isFirstTime) {
      const newParticles = [];
      const colors = ['#ffd166', '#ff758f', '#ff4d6d', '#c8b6ff', '#ffe5a3'];
      const symbols = ['★', '♥', '✨', '✦', '🌸'];
      
      for (let i = 0; i < 12; i++) {
        // Trayectoria en abanico ascendente
        const angle = (Math.random() * Math.PI * 1.2) - Math.PI * 1.1; 
        const speed = 3 + Math.random() * 5;
        const particleId = Math.random() + Date.now();
        
        newParticles.push({
          id: particleId,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Sesgo hacia arriba
          tulipId: id
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);

      // Limpieza automática
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    }
  };

  const allOpened = tulipsData.every(tulip => openedTulips[tulip.id]);

  return (
    <motion.div 
      className="glass-card"
      style={{ maxWidth: '620px' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="romantic-title">Un jardín para ti</h1>
      <p className="romantic-subtitle" style={{ marginBottom: '15px' }}>
        He plantado estos tulipanes virtuales para ti. Cada uno de ellos esconde un mensaje especial. Haz clic en ellos para descubrirlos.
      </p>

      {/* Grid de 3 columnas - Fijo y fluido en móvil y desktop */}
      <div className="garden-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '20px 0' }}>
        {tulipsData.map((tulip) => {
          const isOpened = openedTulips[tulip.id];
          const isActive = activeTulipId === tulip.id;
          
          return (
            <div 
              key={tulip.id} 
              className={`garden-tulip-item ${isOpened ? 'opened' : ''} ${isActive ? 'active' : ''}`}
              onClick={() => handleTulipClick(tulip.id)}
              style={{
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Contenedor de partículas locales para el estallido al hacer clic */}
              <div style={{ position: 'absolute', top: '30px', left: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
                <AnimatePresence>
                  {particles.filter(p => p.tulipId === tulip.id).map(p => (
                    <motion.span
                      key={p.id}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ 
                        x: p.vx * 15, 
                        y: p.vy * 15 - 25, 
                        opacity: 0,
                        scale: 1.25,
                        rotate: Math.random() * 360
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.85, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        color: p.color,
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 30
                      }}
                    >
                      {p.symbol}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Tulipán en CSS puro (removidos estilos de altura inline del tallo para usar index.css que soporta la transición de crecimiento) */}
              <div className="tulip-css" style={{ height: '140px' }}>
                <div className="tulip-flower" style={{ width: '38px', height: '48px' }}>
                  <div className="tulip-petal-back" style={
                    tulip.id === 1 
                      ? { background: '#d90429' } 
                      : tulip.id === 3 
                      ? { background: '#e85d04' } 
                      : {}
                  } />
                  <div className="tulip-petal-left" style={
                    tulip.id === 1 
                      ? { background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)' } 
                      : tulip.id === 3 
                      ? { background: 'linear-gradient(135deg, #fec89a 0%, #f9844a 100%)' } 
                      : {}
                  } />
                  <div className="tulip-petal-right" style={
                    tulip.id === 1 
                      ? { background: 'linear-gradient(225deg, #ff758f 0%, #ff4d6d 100%)' } 
                      : tulip.id === 3 
                      ? { background: 'linear-gradient(225deg, #fec89a 0%, #f9844a 100%)' } 
                      : {}
                  } />
                  <div className="tulip-petal-center" style={
                    tulip.id === 1 
                      ? { background: 'linear-gradient(180deg, #ff4d6d 0%, #c9184a 100%)' } 
                      : tulip.id === 3 
                      ? { background: 'linear-gradient(180deg, #f9844a 0%, #d00000 100%)' } 
                      : {}
                  } />
                </div>
                <div className="tulip-stem">
                  <div className="tulip-leaf-left" style={{ bottom: '15px' }} />
                  <div className="tulip-leaf-right" style={{ bottom: '5px' }} />
                </div>
              </div>

              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: isActive 
                  ? 'var(--tulip-pink-dark)' 
                  : isOpened 
                  ? 'var(--text-muted)' 
                  : 'var(--tulip-pink)', 
                marginTop: '6px', 
                transition: 'color 0.3s' 
              }}>
                {isActive ? 'Abierto ✨' : isOpened ? 'Leído ✓' : 'Descúbreme 🌷'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contenedor de mensaje dedicado - Previene desbordamientos y solapamientos */}
      <div style={{ minHeight: '110px', margin: '15px 0 20px 0' }}>
        <AnimatePresence mode="wait">
          {activeTulipId ? (
            <motion.div
              key={activeTulipId}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'rgba(255, 255, 255, 0.55)',
                border: '1px solid rgba(255, 117, 151, 0.3)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}
            >
              <h3 style={{ 
                fontFamily: 'var(--font-title)', 
                color: 'var(--tulip-pink-dark)', 
                margin: '0 0 6px 0',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                {tulipsData.find(t => t.id === activeTulipId).title}
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                margin: 0, 
                color: 'var(--text-dark)', 
                lineHeight: '1.45',
                fontWeight: 'normal'
              }}>
                "{displayedText}"
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              style={{
                border: '1.5px dashed rgba(224, 82, 117, 0.3)',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                fontSize: '0.9rem'
              }}
            >
              Haz clic en cada tulipán del jardín para descubrirlos... 🌷
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatePresence>
          {allOpened && (
            <motion.button
              className="btn-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 120 }}
              onClick={onNext}
              style={{ width: '100%', maxWidth: '280px' }}
            >
              Lo más importante <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TulipGarden;
