import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface Props {
  imageUrl: string; 
  messages: string[]; 
}

export default function Character({ imageUrl, messages }: Props) {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [jump, setJump] = useState(false);
  const [canTalk, setCanTalk] = useState(false);

  // Función para mostrar mensaje aleatorio
  const showRandomMessage = () => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(msg);
    setVisible(true);
    setCanTalk(false);

    // Ocultar globo después de 5 segundos
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  // Función de brinco
  const doJump = () => {
    setJump(true);
    setTimeout(() => setJump(false), 300);
  };

  // Brincos aleatorios
  useEffect(() => {
    const interval = setInterval(() => {
      if (!visible && Math.random() < 0.1) {
        doJump();
        setCanTalk(true); 
      }
    }, 5000); // cada 5 segundos

    return () => clearInterval(interval);
  }, [visible]);

  // Click en el personaje
  const handleClick = () => {
    if (!canTalk) return; 
    doJump();
    showRandomMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
      {/* Globo de texto */}
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="relative bg-white border-2 border-gray-300 rounded-xl p-4 shadow-lg max-w-xs"
        >
          <p className="text-gray-800">{currentMessage}</p>
          {/* Botón cerrar */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1 right-2 text-gray-500 hover:text-gray-800 font-bold"
          >
            ×
          </button>

          {/* Triángulo del globo */}
          <div className="absolute -bottom-3 right-4 w-0 h-0 border-l-8 border-t-8 border-l-transparent border-t-white"></div>
        </motion.div>
      )}

      {/* Imagen del personaje */}
      <motion.img
        src={imageUrl}
        alt="Personaje"
        className="w-28 h-28 rounded-full shadow-lg object-cover cursor-pointer"
        animate={jump ? { y: -20, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
      />

      {/* Signo de admiración */}
      {canTalk && !visible && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-28 right-2 bg-yellow-300 text-black rounded-full p-1 shadow-lg"
        >
          <AlertCircle className="w-5 h-5" />
        </motion.div>
      )}
    </div>
  );
}
