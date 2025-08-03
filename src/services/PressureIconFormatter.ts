import { PressureLevel } from "./WeatherRetriever";

const PRESSURE_ICONS: Record<PressureLevel, string> = {
  [PressureLevel.Normal]: ":ok:",
  [PressureLevel.Stable]: ":ok:",
  [PressureLevel.Decreasing]: ":arrow_heading_down:",
  [PressureLevel.Warning]: ":warning:",
  [PressureLevel.Alert]: ":bomb:",
};

export class PressureIconFormatter {
  getPressureText(type: PressureLevel | string): string {
    return PRESSURE_ICONS[type as PressureLevel] ?? ":innocent:";
  }
}

export const pressureIconFormatter = new PressureIconFormatter();
