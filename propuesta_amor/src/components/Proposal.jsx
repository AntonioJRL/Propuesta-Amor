import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldAlert } from 'lucide-react';

const Proposal = ({ onAccept }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [showNoModal, setShowNoModal] = useState(false);
  const containerRef = useRef(null);

  const noButtonTexts = [
    "No",
    "¿Segura? 🥺",
    "Piénsalo bien... 🧐",
    "Anda, di que sí... 💖",
    "¡Opción bloqueada! 😂",
    "Prueba el de la izquierda 😉",
    "¡No se vale! 😜",
    "¡Error 404: Opción no válida! 🚫"
  ];

  const handleNoHover = () => {
    // Generar coordenadas aleatorias dentro de ciertos rangos
    const randomX = (Math.random() - 0.5) * 320; // entre -160 y 160px
    const randomY = (Math.random() - 0.5) * 180; // entre -90 y 90px
    
    // Asegurar que se mueva una distancia mínima para que no se quede quieto
    const dx = randomX - position.x;
    const dy = randomY - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 60) {
      // Reintentar si el movimiento es muy pequeño
      handleNoHover();
      return;
    }

    setPosition({ x: randomX, y: randomY });
    setNoAttempts(prev => prev + 1);
  };

  const handleNoClick = (e) => {
    e.preventDefault();
    // Contingencia por si logran hacer clic en móvil o rápidamente
    setShowNoModal(true);
  };

  return (
    <motion.div 
      className="glass-card"
      style={{ overflow: 'visible' }} // Permitir que el botón "No" se mueva fuera de los límites visuales
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      ref={containerRef}
    >
      <div className="tulip-css tulip-pulse" style={{ height: '70px', marginBottom: '15px', width: '60px' }}>
        <div className="tulip-flower" style={{ width: '40px', height: '50px' }}>
          <div className="tulip-petal-back" style={{ width: '26px', height: '42px', left: '7px', background: '#ff4d6d' }} />
          <div className="tulip-petal-left" style={{ width: '24px', height: '45px', background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)' }} />
          <div className="tulip-petal-right" style={{ width: '24px', height: '45px', background: 'linear-gradient(225deg, #ff758f 0%, #ff4d6d 100%)' }} />
          <div className="tulip-petal-center" style={{ width: '20px', height: '48px', left: '10px', background: 'linear-gradient(180deg, #ff4d6d 0%, #c9184a 100%)' }} />
        </div>
      </div>

      <h1 className="romantic-title" style={{ fontSize: 'clamp(1.7rem, 6vw, 2.4rem)' }}>Tengo una pregunta muy importante...</h1>
      <h2 style={{ 
        fontFamily: 'var(--font-title)', 
        color: 'var(--tulip-pink-dark)', 
        fontSize: 'clamp(1.5rem, 5.5vw, 2.1rem)', 
        margin: '20px 0 30px 0',
        fontWeight: 'bold',
        lineHeight: '1.2'
      }}>
        ¿Me permites ser tu novio? 🌷
      </h2>

      <div className="proposal-buttons">
        {/* Botón Sí */}
        <button 
          className="btn-primary btn-yes" 
          onClick={onAccept}
          style={{ fontSize: '1.2rem', padding: '16px 42px' }}
        >
          ¡Sí, quiero! <Heart size={20} fill="#ffffff" stroke="none" style={{ marginLeft: '6px' }} />
        </button>

        {/* Botón No (Evasivo) */}
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover} // Soporte para móviles
          className="btn-no-container"
        >
          <button 
            className="btn-secondary btn-no"
            onClick={handleNoClick}
            style={{ fontSize: '1.1rem', padding: '14px 28px' }}
          >
            {noButtonTexts[Math.min(noAttempts, noButtonTexts.length - 1)]}
          </button>
        </motion.div>
      </div>

      {/* Modal gracioso de error */}
      <AnimatePresence>
        {showNoModal && (
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.96)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '25px',
              zIndex: 100,
              boxSizing: 'border-box',
              boxShadow: 'var(--shadow-lg)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ShieldAlert size={44} style={{ color: 'var(--tulip-pink-dark)', marginBottom: '15px' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--tulip-pink-dark)', margin: '0 0 10px 0' }}>
              ¡Acción no válida! 🚫
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', textAlign: 'center', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Ups, parece que el botón de "No" tiene fallas técnicas en este momento. Te recomendamos encarecidamente presionar el botón de "Sí, quiero". 😉🌷
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setShowNoModal(false)}
              style={{ padding: '10px 24px', fontSize: '0.95rem' }}
            >
              Entendido 👌
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Proposal;
