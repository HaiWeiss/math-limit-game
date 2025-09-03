interface Props {
  onStart: () => void;
}

export default function Menu({ onStart }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-8 font-sans bg-white rounded-xl shadow p-8">
        
        {/* Título */}
        <h1 className="text-5xl font-bold text-black">✨ Juego de Límites ✨</h1>

        {/* Botón jugar */}
        <button
          onClick={onStart}
          className="px-10 py-4 bg-[#f72585] text-white hover:bg-[#cf1066] font-bold text-xl rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Jugar
        </button>
      </div>
    </div>
  );
}
