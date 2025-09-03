import { useState } from "react";
import type { Question } from "../types/question";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { parse } from "mathjs";

interface Props {
    onCreate: (q: Question) => void;
}

function convertToLatex(exp: string) {
    try {
        return parse(exp).toTex({ parenthesis: 'keep' });
    } catch {
        return exp;
    }
}

export default function QuestionForm({ onCreate }: Props) {
    const [tipo, setTipo] = useState<"funcion" | "imagen">("funcion");
    const [funcion, setFuncion] = useState("");
    const [punto, setPunto] = useState("");
    const [lado, setLado] = useState<"" | "+" | "-">("");
    const [imagenUrl, setImagenUrl] = useState("");
    const [pregunta, setPregunta] = useState("");
    const [respuestas, setRespuestas] = useState<string[]>([]);
    const [inputRespuesta, setInputRespuesta] = useState("");
    const [respuestaCorrecta, setRespuestaCorrecta] = useState("");

    const handleAddRespuesta = () => {
        if (inputRespuesta.trim() !== "") {
            setRespuestas([...respuestas, inputRespuesta]);
            setInputRespuesta("");
        }
    };

    const handleSubmit = () => {
        if (!pregunta || (tipo === "funcion" && (!funcion || !punto)) || respuestas.length === 0 || !respuestaCorrecta) {
            alert("Completa todos los campos antes de guardar la pregunta");
            return;
        }

        const newQuestion: Question = {
            tipo,
            funcion: tipo === "funcion" ? funcion : undefined,
            punto: tipo === "funcion" ? punto : undefined,
            lado: tipo === "funcion" ? lado : undefined,
            imagenUrl: tipo === "imagen" ? imagenUrl : undefined,
            pregunta,
            respuestas,
            respuestaCorrecta,
        };

        onCreate(newQuestion);

        // Reset completo
        setTipo("funcion");
        setFuncion("");
        setPunto("");
        setLado("");
        setImagenUrl("");
        setPregunta("");
        setRespuestas([]);
        setInputRespuesta("");
        setRespuestaCorrecta("");
    };

    return (
        <div className="relative flex flex-col bg-white rounded-xl max-w-xl h-[86vh] font-sans">
            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-800 text-center p-4">Crear Pregunta</h2>

            {/* Contenedor scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Tipo de pregunta */}
                <div className="flex flex-col space-y-1">
                    <label className="font-medium text-gray-700">Tipo de pregunta:</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as "funcion" | "imagen")}
                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="funcion">Función</option>
                        <option value="imagen">Imagen</option>
                    </select>
                </div>

                {/* Formulario */}
                {tipo === "funcion" && (
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Función <span className="text-red-500">*</span></label>
                            <input
                                placeholder="Ej: sin(x)/x"
                                value={funcion}
                                onChange={(e) => setFuncion(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Punto del límite <span className="text-red-500">*</span></label>
                            <input
                                placeholder="Ej: 0"
                                value={punto}
                                onChange={(e) => setPunto(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Lado del límite:</label>
                            <select
                                value={lado}
                                onChange={(e) => setLado(e.target.value as "+" | "-" | "")}
                                className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            >
                                <option value="">Normal</option>
                                <option value="+">Por la derecha → a⁺</option>
                                <option value="-">Por la izquierda → a⁻</option>
                            </select>
                        </div>

                        {funcion && (
                            <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
                                <p className="font-medium mb-1">Vista previa de la función:</p>
                                <BlockMath math={convertToLatex(funcion)} />
                            </div>
                        )}
                    </div>
                )}

                {/* Formulario imagen */}
                {tipo === "imagen" && (
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">Subir imagen:</label>
                        <label className="cursor-pointer bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition">
                            Seleccionar archivo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => setImagenUrl(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                        {imagenUrl && (
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-center text-sm font-semibold">
                                Imagen cargada
                            </span>
                        )}
                    </div>
                )}

                {/* Enunciado */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Enunciado <span className="text-red-500">*</span></label>
                    <input
                        placeholder="Escribe la pregunta"
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Respuestas */}
                <div className="flex space-x-2">
                    <input
                        placeholder="Agregar respuesta"
                        value={inputRespuesta}
                        onChange={(e) => setInputRespuesta(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddRespuesta()}
                        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        onClick={handleAddRespuesta}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 shadow"
                    >
                        Agregar
                    </button>
                </div>

                {/* Respuestas en capsulas */}
                {respuestas.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">Haz click en la respuesta correcta</p>
                        <div className="flex flex-wrap gap-2">
                            {respuestas.map((r, i) => (
                                <span
                                    key={i}
                                    className={`cursor-pointer px-4 py-2 rounded-full text-white font-semibold transition transform hover:scale-105
                ${r === respuestaCorrecta
                                            ? "bg-green-500 border-2 border-green-700"
                                            : "bg-blue-500 hover:bg-blue-600 border-2 border-transparent"}`}
                                    onClick={() => setRespuestaCorrecta(r)}
                                >
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Botón sticky */}
            <div className="pt-4 bg-white">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#f72585] text-white hover:bg-[#cf1066]  font-bold py-3 px-6 rounded-xl shadow-lg transition transform hover:scale-105 text-lg"
                >
                    Guardar Pregunta
                </button>
            </div>
        </div>

    );
}
