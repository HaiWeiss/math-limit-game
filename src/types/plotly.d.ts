declare module "react-plotly.js" {
  import { Component } from "react";
  import { Layout, Config, Data } from "plotly.js";

  export interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    frames?: any[];
    onInitialized?: (figure: PlotParams, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: PlotParams, graphDiv: HTMLElement) => void;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    divId?: string;
  }

  export default class Plot extends Component<PlotParams> {}
}
