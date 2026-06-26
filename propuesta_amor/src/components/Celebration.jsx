import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const Celebration = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showPromise, setShowPromise] = useState(false);
  const [floatingWords, setFloatingWords] = useState([]);
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const noteIdRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  const particlesRef = useRef([]);

  // 1. Efecto de audio (Erik Satie)
  useEffect(() => {
    audioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/0/0b/Satie_Gymnopedie_No_1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.45;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay bloqueado");
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 2. Notas musicales flotando del reproductor
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const symbols = ['♪', '♫', '♬', '♩', '♥'];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const id = noteIdRef.current++;
      const dx = (Math.random() - 0.5) * 90;
      const deg = (Math.random() - 0.5) * 60;
      
      setNotes((prev) => [...prev, { id, symbol: randomSymbol, dx, deg }]);

      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    }, 700);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3. Sistema de Partículas en Canvas (Confeti inicial + Estela del cursor)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Funciones de dibujo de formas en Canvas
    const drawHeart = (c, x, y, size, color, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.translate(x, y);
      c.beginPath();
      // Dibujar corazón mediante curvas de Bezier
      c.moveTo(0, 0 + size / 4);
      c.quadraticCurveTo(0, 0, size / 2, 0);
      c.quadraticCurveTo(size, 0, size, 0 + size / 3);
      c.quadraticCurveTo(size, 0 + (size * 2) / 3, size / 2, size);
      c.quadraticCurveTo(0, 0 + (size * 2) / 3, 0, 0 + size / 3);
      c.quadraticCurveTo(0, 0, 0, 0 + size / 4);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c, x, y, size, angle, color, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      // Dibujar pétalo elíptico
      c.moveTo(0, size);
      c.bezierCurveTo(-size * 0.8, size / 2, -size * 0.4, 0, 0, 0);
      c.bezierCurveTo(size * 0.4, 0, size * 0.8, size / 2, 0, size);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawSparkle = (c, x, y, size, color, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.translate(x, y);
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(0, size);
        c.lineTo(size * 0.2, 0);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Lanzar confeti inicial
    const createConfettiBurst = () => {
      const colors = ['#ff7597', '#ff4d6d', '#c8b6ff', '#fec89a', '#ffd166'];
      const particleCount = 130;
      
      // Desde el lateral izquierdo
      for (let i = 0; i < particleCount / 2; i++) {
        particlesRef.current.push({
          x: 0,
          y: canvas.height * 0.85,
          vx: 8 + Math.random() * 12,
          vy: -10 - Math.random() * 15,
          gravity: 0.22,
          size: 8 + Math.random() * 12,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.008 + Math.random() * 0.008,
          type: Math.random() > 0.5 ? 'heart' : 'petal'
        });
      }
      
      // Desde el lateral derecho
      for (let i = 0; i < particleCount / 2; i++) {
        particlesRef.current.push({
          x: canvas.width,
          y: canvas.height * 0.85,
          vx: -8 - Math.random() * 12,
          vy: -10 - Math.random() * 15,
          gravity: 0.22,
          size: 8 + Math.random() * 12,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.008 + Math.random() * 0.008,
          type: Math.random() > 0.5 ? 'heart' : 'petal'
        });
      }
    };
    
    // Ejecutar el estallido inicial
    createConfettiBurst();

    // Eventos del cursor para la estela brillante
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      // Generar 2 partículas por movimiento para estela densa pero eficiente
      const trailColors = ['#ff7597', '#ffb3c6', '#c8b6ff', '#ffe5a3'];
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: clientX,
          y: clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: -1.5 - Math.random() * 2, // Flotan hacia arriba
          gravity: -0.02, // Empuje ascendente
          size: 4 + Math.random() * 8,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.08,
          color: trailColors[Math.floor(Math.random() * trailColors.length)],
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.015,
          type: Math.random() > 0.6 ? 'heart' : 'sparkle'
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Bucle de animación a 60 fps
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Filtrar y actualizar partículas
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.angle += p.spin;
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) return false;
        
        // Dibujar según el tipo
        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha);
        }
        return true;
      });

      animationFrameIdRef.current = requestAnimationFrame(update);
    };
    update();

    // Limpieza
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // 4. Interacción con los tulipanes del ramo (despachar palabras flotantes)
  const handleTulipTouch = (tulipIndex) => {
    const expressions = [
      "Te amo ♥",
      "Siempre Juntos",
      "Mi Princesa",
      "Gracias Ingrid",
      "Eres mi sueño",
      "Novios Oficiales 🔗",
      "Mi Amor 🌷",
      "El mejor día ♥"
    ];
    
    // Seleccionar expresión aleatoria y posicionar con offset
    const text = expressions[Math.floor(Math.random() * expressions.length)];
    const id = Date.now() + Math.random();
    const xOffset = (Math.random() - 0.5) * 60; // Desplazamiento X aleatorio
    
    setFloatingWords((prev) => [...prev, { id, text, x: xOffset, index: tulipIndex }]);
    
    // Limpiar palabra
    setTimeout(() => {
      setFloatingWords((prev) => prev.filter((w) => w.id !== id));
    }, 1500);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log(err));
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Lienzo Canvas interactivo para Confeti y Estela (pantalla completa detrás de las tarjetas pero encima del fondo) */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '560px', zIndex: 10 }}
      >
        <div className="heart-celebration">💖</div>
        
        <h1 className="romantic-title">¡Siiii! 🌷✨</h1>
        
        <p className="romantic-subtitle" style={{ marginBottom: '10px' }}>
          ¡Me haces la persona más feliz del universo, Ingrid! 
          Te prometo llenar tus días de sonrisas, amor sincero, apoyo y, por supuesto, muchísimos tulipanes.
        </p>

        {/* Ramo de tulipanes interactivos en CSS puro */}
        <div className="tulip-bouquet" style={{ margin: '20px auto 30px auto' }}>
          {/* Contenedor absoluto para palabras flotantes animadas al hacer clic */}
          <div style={{ position: 'absolute', top: '-10px', left: 0, width: '100%', height: '20px', pointerEvents: 'none' }}>
            <AnimatePresence>
              {floatingWords.map((word) => (
                <motion.span
                  key={word.id}
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -70, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: `calc(${33 * (word.index + 1) - 16}% + ${word.x}px)`,
                    color: 'var(--tulip-pink-dark)',
                    fontWeight: 'bold',
                    fontSize: '0.92rem',
                    textShadow: '0 2px 6px rgba(255, 255, 255, 0.95)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {word.text}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Tulipán Izquierdo (Naranja/Amarillo) */}
          <motion.div 
            className="tulip-css bouquet-tulip-1" 
            whileTap={{ scale: 0.85, rotate: -25 }}
            onClick={() => handleTulipTouch(0)}
          >
            <div className="tulip-flower" style={{ width: '36px', height: '45px' }}>
              <div className="tulip-petal-back" />
              <div className="tulip-petal-left" />
              <div className="tulip-petal-right" />
              <div className="tulip-petal-center" />
            </div>
            <div className="tulip-stem" style={{ height: '90px' }}>
              <div className="tulip-leaf-left" />
            </div>
          </motion.div>

          {/* Tulipán Central (Rojo) */}
          <motion.div 
            className="tulip-css bouquet-tulip-2"
            whileTap={{ scale: 0.85, y: -5 }}
            onClick={() => handleTulipTouch(1)}
          >
            <div className="tulip-flower" style={{ width: '40px', height: '50px' }}>
              <div className="tulip-petal-back" style={{ width: '26px', height: '42px', left: '7px', background: '#d90429' }} />
              <div className="tulip-petal-left" style={{ width: '24px', height: '45px', background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)' }} />
              <div className="tulip-petal-right" style={{ width: '24px', height: '45px', background: 'linear-gradient(225deg, #ff758f 0%, #ff4d6d 100%)' }} />
              <div className="tulip-petal-center" style={{ width: '20px', height: '48px', left: '10px', background: 'linear-gradient(180deg, #ff4d6d 0%, #c9184a 100%)' }} />
            </div>
            <div className="tulip-stem" style={{ height: '110px' }}>
              <div className="tulip-leaf-left" style={{ transform: 'rotate(-35deg)' }} />
              <div className="tulip-leaf-right" style={{ transform: 'rotate(35deg)' }} />
            </div>
          </motion.div>

          {/* Tulipán Derecho (Rosa Claro) */}
          <motion.div 
            className="tulip-css bouquet-tulip-3"
            whileTap={{ scale: 0.85, rotate: 25 }}
            onClick={() => handleTulipTouch(2)}
          >
            <div className="tulip-flower" style={{ width: '36px', height: '45px' }}>
              <div className="tulip-petal-back" />
              <div className="tulip-petal-left" />
              <div className="tulip-petal-right" />
              <div className="tulip-petal-center" />
            </div>
            <div className="tulip-stem" style={{ height: '90px' }}>
              <div className="tulip-leaf-right" />
            </div>
          </motion.div>

          <div className="bouquet-ribbon">Para ti</div>
        </div>

        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 10px 0' }}>
          "Descubre los sentimientos de las flores o haz clic en la tortuga mensajera..."
        </p>

        {/* Botones de acción final: Tortuga Marina Mensajera */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
          <div className="turtle-container" onClick={() => setShowPromise(true)} title="Toca la tortuga marina para recibir la promesa">
            <svg viewBox="0 0 120 100" className="sea-turtle">
              {/* Flippers (back layer) */}
              <path className="flipper back-left" d="M 30,75 C 20,80 15,90 20,95 C 25,100 35,95 38,85 Z" fill="#2d6a4f" />
              <path className="flipper back-right" d="M 90,75 C 100,80 105,90 100,95 C 95,100 85,95 82,85 Z" fill="#2d6a4f" />
              
              {/* Flippers (front layer) */}
              <path className="flipper front-left" d="M 25,45 C 5,42 -5,55 2,65 C 10,75 25,65 30,55 Z" fill="#52b788" />
              <path className="flipper front-right" d="M 95,45 C 115,42 125,55 118,65 C 110,75 95,65 90,55 Z" fill="#52b788" />

              {/* Tail */}
              <path d="M 60,85 L 57,95 L 63,95 Z" fill="#52b788" />

              {/* Head */}
              <path d="M 60,25 C 52,25 50,10 60,10 C 70,10 68,25 60,25 Z" fill="#52b788" />
              <circle cx="56" cy="16" r="1.5" fill="black" />
              <circle cx="64" cy="16" r="1.5" fill="black" />
              
              {/* Shell (Caparazón) */}
              <ellipse cx="60" cy="55" rx="32" ry="38" fill="#1b4332" stroke="#2d6a4f" stroke-width="2" />
              <ellipse cx="60" cy="55" rx="24" ry="28" fill="none" stroke="#52b788" stroke-width="1.5" stroke-dasharray="8,4" />
              <ellipse cx="60" cy="55" rx="14" ry="18" fill="none" stroke="#74c69d" stroke-width="1.5" />
              
              {/* Scroll (Pergamino) en su boca */}
              <g transform="translate(43, 16) rotate(-12)">
                <rect x="0" y="0" width="32" height="9" rx="2" fill="#fec89a" stroke="#d5bdaf" stroke-width="1" />
                <rect x="13" y="0" width="6" height="9" fill="#ff4d6d" />
              </g>
            </svg>
            <span className="turtle-label">📜 ¡Toca la tortuguita! 🐢</span>
          </div>

          {/* Reproductor de Música de Vinilo */}
          <div className="music-player" style={{ marginTop: '5px' }}>
            <div className="vinyl-container">
              <div className={`vinyl-disc ${isPlaying ? 'playing' : ''}`}>
                <div className="vinyl-center" />
              </div>
              
              {/* Notas musicales flotantes */}
              <AnimatePresence>
                {notes.map((note) => (
                  <span
                    key={note.id}
                    className="floating-note"
                    style={{
                      '--dx': `${note.dx}px`,
                      '--deg': `${note.deg}deg`,
                      left: '18px',
                      top: '-10px',
                    }}
                  >
                    {note.symbol}
                  </span>
                ))}
              </AnimatePresence>
            </div>

            <div className="music-info">
              <h4 className="music-title">Gymnopédie No. 1</h4>
              <p className="music-artist">Erik Satie (Piano)</p>
            </div>

            <div className="music-controls">
              <button className="music-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}>
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="4" x2="18" y2="20"></line><line x1="6" y1="4" x2="6" y2="20"></line></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal interactivo de la Carta de Promesa */}
      <AnimatePresence>
        {showPromise && (
          <div className="promise-modal-overlay" onClick={() => setShowPromise(false)}>
            <motion.div
              className="glass-card promise-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 180 }}
              onClick={(e) => e.stopPropagation()} // Evitar que cierre al hacer clic adentro
            >
              <h2 className="romantic-title" style={{ fontSize: '1.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                Nuestra Promesa 🐢📜
              </h2>
              
              <p className="letter-text" style={{ 
                fontSize: '0.98rem', 
                lineHeight: '1.6', 
                textAlign: 'left', 
                fontStyle: 'normal',
                color: 'var(--text-dark)'
              }}>
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--tulip-pink-dark)', marginBottom: '15px' }}>
                  Querida Ingrid... 💖
                </span>
                Hoy comienza una hermosa historia que escribiremos juntos día a día. En este momento tan especial, quiero prometerte con todo mi corazón:
                <br /><br />
                🌸 <strong>Estar a tu lado:</strong> En cada paso del camino, celebrando tus alegrías y apoyándote con ternura en tus momentos difíciles.
                <br /><br />
                🌸 <strong>Llenar tus días:</strong> De sonrisas sinceras, abrazos cálidos que te hagan sentir segura y detalles que te recuerden lo mucho que te amo.
                <br /><br />
                🌸 <strong>Cuidar de nosotros:</strong> Escuchándote siempre con paciencia, respetando tu espacio y construyendo juntos una relación de confianza y cariño.
                <br /><br />
                🌸 <strong>Y nunca olvidar:</strong> Lo increíblemente afortunado que soy de tenerte a mi lado y lo mucho que tu hermosa sonrisa ilumina mi mundo.
                <br /><br />
                Gracias por darme el honor de ser tu novio. Prometo dar lo mejor de mí para hacerte inmensamente feliz. 🌷✨
              </p>

              <button 
                className="btn-primary" 
                onClick={() => setShowPromise(false)}
                style={{ marginTop: '25px', width: '100%', maxWidth: '240px' }}
              >
                Cerrar con Amor ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Celebration;
