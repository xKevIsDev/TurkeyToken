import { motion, AnimatePresence } from "framer-motion";

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseMenu({ isOpen, onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            {/* Binary Rain Effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-500/20 font-mono"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -100
                }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.div>
            ))}

            {/* Menu Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/80 p-8 rounded-lg border border-blue-500/30 w-80 mx-auto backdrop-blur-md"
            >
              <h2 className="text-3xl font-mono text-blue-400 text-center mb-8">
                SYSTEM PAUSED_
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={onResume}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 
                           py-3 px-6 rounded-lg transition-colors font-mono border border-blue-500/50
                           hover:text-blue-200"
                >
                  RESUME PROCESS
                </button>
                
                <button
                  onClick={onRestart}
                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 
                           py-3 px-6 rounded-lg transition-colors font-mono border border-yellow-500/50
                           hover:text-yellow-200"
                >
                  REBOOT SYSTEM
                </button>
                
                <button
                  onClick={onQuit}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 
                           py-3 px-6 rounded-lg transition-colors font-mono border border-red-500/50
                           hover:text-red-200"
                >
                  TERMINATE PROCESS
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 