import { useState } from "react";
import type { Question } from "../types/question";
import Chart from "./Chart";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { parse } from "mathjs";

function convertToLatex(exp: string) {
  try {
    return parse(exp).toTex({ parenthesis: 'keep' });
  } catch {
    return exp;
  }
}

interface Props {
  question: Question;
  onNext: (correct: boolean) => void;
}

export default function Game({ question, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSelect = (r: string) => {
    if (answered) return;
    const isCorrect = r === question.respuestaCorrecta;
    setSelected(r);
    setCorrect(isCorrect);
    setAnswered(true);
  };

  const handleNext = () => {
    onNext(correct);
    setSelected(null);
    setAnswered(false);
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">

      {/* Pregunta */}
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{question.pregunta}</h2>

        {question.tipo === "funcion" && question.funcion && question.punto && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="font-medium">Límite de:</p>
            <BlockMath math={convertToLatex(question.funcion)} />
            <p className="mt-1">
              cuando x → {question.punto}{question.lado}
            </p>
            <div className="mt-4 flex justify-center">
              <Chart funcion={question.funcion} />
            </div>
          </div>
        )}

        {question.tipo === "imagen" && question.imagenUrl && (
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
            <img
              src={question.imagenUrl}
              alt="Gráfico de la pregunta"
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Respuestas */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        {question.respuestas.map((r, i) => {
          let baseColor = "bg-white hover:bg-zinc-100";
          if (answered) {
            if (r === question.respuestaCorrecta) baseColor = "bg-green-500 text-zinc-900";
            else if (r === selected && !correct) baseColor = "bg-red-500 text-zinc-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className={`p-4 rounded-xl text-zinc-600 font-bold text-lg transition transform hover:scale-105 shadow-lg ${baseColor}`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Botón siguiente */}
      <div className="w-full max-w-3xl">
        <button
          onClick={handleNext}
          disabled={!answered}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-50"
        >
          Siguiente pregunta
        </button>
      </div>
    </div>
  );
}
