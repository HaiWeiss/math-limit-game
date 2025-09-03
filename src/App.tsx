import { useEffect, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import Game from "./components/Game";
import type { Question } from "./types/question";
import Character from "./components/Character";
import Menu from "./components/Menu";
import { AnimatePresence, motion } from "framer-motion";
import Curtain from "./components/Curtain";
import { Eye, EyeOff } from "lucide-react";

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const stored = localStorage.getItem("questions");
    return stored ? JSON.parse(stored) : [];
  });

  const [menu, setMenu] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Sube al inicio al cambiar de pregunta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleAddQuestion = (q: Question) => {
    const updated = [...questions, q];
    setQuestions(updated);
    localStorage.setItem("questions", JSON.stringify(updated));
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    localStorage.setItem("questions", JSON.stringify(updated));
  };

  const handleStartGame = () => {
    if (questions.length > 0) {
      setPlaying(true);
      setShowFinalScreen(false);
      setCurrentIndex(0);
      setScore(0);
    }
  };

  const handleNext = (correct: boolean) => {
    if (correct) setScore(score + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPlaying(false);
      setShowFinalScreen(true);
    }
  };

  const handleBackToMenu = () => {
    setMenu(true);
    setPlaying(false);
    setShowFinalScreen(false);
    setCurrentIndex(0);
    setScore(0);
  };

  // estado para controlar qué preguntas muestran respuestas 
  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>(
    () => questions.map(() => false)
  );

  // Actualizamos visibleAnswers si cambia la cantidad de preguntas
  useEffect(() => {
    setVisibleAnswers(questions.map((_, i) => visibleAnswers[i] ?? false));
  }, [questions]);

  // Función para alternar mostrar/ocultar
  const toggleAnswerVisibility = (index: number) => {
    setVisibleAnswers(prev =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };


  // Render
  return (
    <div className="p-6 max-w-6xl m-auto font-sans relative overflow-visible h-full">
      <Curtain trigger={playing ? currentIndex : -1} />

      {/* Botón volver al menú */}
      {!menu && (
        <div className="mb-4">
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold shadow transition transform hover:scale-105"
          >
            ← Volver al menú
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Menu */}
        {menu && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Menu onStart={() => setMenu(false)} />
          </motion.div>
        )}

        {/* Editor de preguntas */}
        {!menu && !playing && !showFinalScreen && (
          <motion.div
            key="editor"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col lg:flex-row gap-6"
          >
            <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
              <QuestionForm onCreate={handleAddQuestion} />
            </div>

            <div className="flex-1 bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Preguntas creadas ({questions.length})
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 max-h-[475px]">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-4 bg-blue-50 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {i + 1}. {q.pregunta}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAnswerVisibility(i)}
                          className="p-2 bg-pink-400 text-white rounded-lg hover:bg-pink-300 transition"
                          title={visibleAnswers[i] ? "Ocultar respuestas" : "Mostrar respuestas"}
                        >
                          {visibleAnswers[i] ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(i)}
                          className="text-red-500 hover:text-red-700 text-lg transition"
                          title="Eliminar pregunta"
                        >
                          ❌
                        </button>
                      </div>
                    </div>

                    {q.respuestas?.length > 0 && (
                      <div
                        className={`flex flex-wrap gap-2 mt-2 transition-all ${visibleAnswers[i] ? "blur-0" : "blur-sm"
                          }`}
                      >
                        {q.respuestas.map((r, j) => (
                          <span
                            key={j}
                            className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${r === q.respuestaCorrecta ? "bg-green-500" : "bg-blue-400"
                              }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>


              {questions.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={handleStartGame}
                    className="w-full bg-zinc-900 hover:bg-zinc-950 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition transform hover:scale-105 text-lg"
                  >
                    Empezar juego
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Juego */}
        {playing && !showFinalScreen && (
          <motion.div
            key={currentIndex}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="space-y-4"
          >
            <Game question={questions[currentIndex]} onNext={handleNext} />
            <div className="text-gray-700 text-center font-medium">
              Pregunta {currentIndex + 1} / {questions.length} | Puntaje: {score}
            </div>
          </motion.div>
        )}

        {/* Pantalla final */}
        {showFinalScreen && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-white rounded-xl shadow text-center font-semibold text-gray-800 mt-6 space-y-4"
          >
            <p className="text-lg">Puntaje final: {score}/{questions.length}</p>

            {score === 0 ? (
              <div>
                <p className="mt-2 text-red-600 text-lg font-bold">
                  Increíble… no acertaste ni una...
                  {/*Hai dice que estudies 😤.*/}
                </p>
                <img
                  src="./stickers/lose.png"
                  alt="Sticker perder"
                  className="mx-auto mt-4 w-48 h-48 object-contain"
                />
              </div>
            ) : score === questions.length ? (
              <div>
                <p className="mt-2 text-green-600 text-lg font-bold">
                  ¡Impresionante! Respondiste todas correctamente, un verdadero crack.
                </p>
                <img
                  src="./stickers/win.png"
                  alt="Sticker ganar"
                  className="mx-auto mt-4 w-48 h-48 object-contain"
                />
              </div>
            ) : (
              <div>
                <p className="mt-2 text-blue-600 text-lg font-bold">
                  ¡Bien hecho! acertaste varias, pero todavía podés mejorar.
                </p>
                <img
                  src="./stickers/neutral.png"
                  alt="Sticker neutral"
                  className="mx-auto mt-4 w-48 h-48 object-contain"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personaje */}
      <Character
        imageUrl="./char.png"
        messages={[
          "Recuerda: el límite se fija en cómo se acerca la función, no en el valor exacto.",
          "Si los límites lateral izquierdo y derecho coinciden, listo: ese es el límite.",
          "Cuando dudes, intenta simplificar la expresión antes de calcular el límite.",
          "No olvides: infinito no siempre significa que el límite exista.",
          "Hai siempre dice: cada error es una pista hacia la respuesta.",
          "Si te gusta el juego, sigue a Hai en GitHub",
        ]}
      />
    </div>
  );
}
