import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const IntroCard = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="tulip-css tulip-pulse" style={{ height: '70px', marginBottom: '20px', width: '60px' }}>
        <div className="tulip-flower" style={{ width: '40px', height: '50px' }}>
          <div className="tulip-petal-back" style={{ width: '26px', height: '42px', left: '7px' }} />
          <div className="tulip-petal-left" style={{ width: '24px', height: '45px' }} />
          <div className="tulip-petal-right" style={{ width: '24px', height: '45px' }} />
          <div className="tulip-petal-center" style={{ width: '20px', height: '48px', left: '10px' }} />
        </div>
      </div>
      
      <h1 className="romantic-title">Una sorpresa para ti</h1>
      <p className="romantic-subtitle">
        He preparado este pequeño rincón con mucho cariño. Haz clic en el sobre para abrirlo.
      </p>

      <div className="envelope-wrapper" onClick={() => setIsOpen(true)}>
        <div className={`envelope ${isOpen ? 'open' : ''}`}>
          {/* La carta se posiciona primero en el DOM para asegurar que quede por detrás del bolsillo y la solapa */}
          <div className="letter">
            <p className="letter-text">
              "Hola, hermosa Ingrid... 🌷<br />
              He creado este pequeño espacio para recordarte lo importante que eres para mí y lo mucho que alegras mis días. Tengo algo especial que decirte, pero antes, quiero regalarte unas flores..."
            </p>
            {isOpen && (
              <motion.button
                className="btn-primary"
                style={{ marginTop: '20px', padding: '10px 24px', fontSize: '0.95rem' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.35, duration: 0.4 }}
                onClick={(e) => {
                  e.stopPropagation(); // Evita que se dispare el evento del contenedor
                  onNext();
                }}
              >
                Recibir flores <Sparkles size={16} />
              </motion.button>
            )}
          </div>

          <div className="envelope-flap" />
          <div className="envelope-left-fold" />
          <div className="envelope-right-fold" />
          <div className="envelope-bottom-fold" />
          
          <div className="wax-seal">
            <Heart size={24} fill="#ffffff" stroke="none" />
          </div>
        </div>
      </div>

      {!isOpen && (
        <p className="intro-instruction">Toca el sobre para descubrir su contenido</p>
      )}
    </motion.div>
  );
};

export default IntroCard;
