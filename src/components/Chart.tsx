import Plot from "react-plotly.js";
import { create, all } from "mathjs";

const math = create(all);

interface Props {
  funcion: string;
}

export default function Chart({ funcion }: Props) {
  const generarDatos = () => {
    try {
      const expr = math.parse(funcion).compile();
      const xVals = Array.from({ length: 200 }, (_, i) => -5 + i * 0.05);
      const yVals = xVals.map((x) => {
        try {
          return expr.evaluate({ x });
        } catch {
          return NaN;
        }
      });
      return { xVals, yVals };
    } catch {
      return { xVals: [], yVals: [] };
    }
  };

  const { xVals, yVals } = generarDatos();

  return (
    <Plot
      data={[
        {
          x: xVals,
          y: yVals,
          type: "scatter",
          mode: "lines",
          line: { color: "blue" },
        },
      ]}
      layout={{
        width: 500,
        height: 400,
        margin: { l: 40, r: 20, t: 20, b: 40 },
      }}
    />
  );
}
