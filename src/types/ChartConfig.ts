export default interface ChartConfig {
    type: string;
    url?: string;
    description?: string;
    xKey?: string;
    yKey?: string;
    zKey?: string;
    formatTickX?: Function,
    formatTickY?: Function,
    includeCaption?: boolean,
    caption?: string,
    xTicks?: number|Array<number>|Function,
  }