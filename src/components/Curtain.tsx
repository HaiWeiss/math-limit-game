import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  trigger: number;
}

export default function Curtain({ trigger }: Props) {
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState("black");

  useEffect(() => {
    if (trigger < 0) return;

    // Elegir color aleatorio
    const colors = ["#f72585", "#7209b7", "#3a0ca3", "#4361ee", "#4cc9f0"];
    setColor(colors[Math.floor(Math.random() * colors.length)]);

    // Mostrar cortina
    setVisible(true);

    // Ocultarla después de la animación completa
    const timer = setTimeout(() => setVisible(false), 1200)
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={trigger}
          initial={{ x: "100%" }}
          animate={{ x: ["100%", "0%", "-100%"] }} // entra → cubre → sale
          transition={{ duration: 1.2, ease: "easeInOut" }}
          exit={{}} 
          className="fixed top-0 left-0 w-full h-full z-50"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}
