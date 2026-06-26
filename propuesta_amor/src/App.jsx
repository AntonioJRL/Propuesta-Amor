import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PetalRain from './components/PetalRain';
import IntroCard from './components/IntroCard';
import TulipGarden from './components/TulipGarden';
import Proposal from './components/Proposal';
import Celebration from './components/Celebration';
import './App.css';

function App() {
  const [step, setStep] = useState('intro'); // 'intro', 'garden', 'proposal', 'celebration'

  return (
    <div className="app-container">
      {/* Lluvia persistente de pétalos de tulipán en el fondo */}
      <PetalRain />

      {/* Transiciones animadas y fluidas entre cada etapa */}
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            className="page-transition-container"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <IntroCard onNext={() => setStep('garden')} />
          </motion.div>
        )}

        {step === 'garden' && (
          <motion.div
            key="garden"
            className="page-transition-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TulipGarden onNext={() => setStep('proposal')} />
          </motion.div>
        )}

        {step === 'proposal' && (
          <motion.div
            key="proposal"
            className="page-transition-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Proposal onAccept={() => setStep('celebration')} />
          </motion.div>
        )}

        {step === 'celebration' && (
          <motion.div
            key="celebration"
            className="page-transition-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Celebration />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
