import type { DrawOptions } from "@space-invaders-contributions/svg-creator";
import type { AnimationOptions } from "./generateAnimation";
import { palettes } from "./palettes";

export const parseOutputsOption = (lines: string[]) => lines.map(parseEntry);

export const parseEntry = (entry: string) => {
  const m = entry.trim().match(/^(.+\.(svg))(\?(.*)|\s*({.*}))?$/);

  if (!m) return null;

  const [, filename, format, _, q1, q2] = m;

  const query = q1 ?? q2;

  let sp = new URLSearchParams(query || "");

  try {
    const o = JSON.parse(query);

    if (Array.isArray(o.color_dots)) o.color_dots = o.color_dots.join(",");

    sp = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError)) throw err;
  }

  const drawOptions: DrawOptions = {
    sizeDotBorderRadius: 2,
    sizeCell: 16,
    sizeDot: 12,
    ...palettes["default"],
  };
  const animationOptions: AnimationOptions = {
    stepDurationMs: 100,
  };

  {
    const palette = palettes[sp.get("palette") as keyof typeof palettes];
    if (palette) {
      Object.assign(drawOptions, palette);
    }
  }

  if (sp.has("color_dots")) {
    const colors = sp.get("color_dots")!.split(/[,;]/);
    drawOptions.colorDots = colors;
    drawOptions.colorEmpty = colors[0];
  }
  if (sp.has("color_ship")) drawOptions.colorShip = sp.get("color_ship")!;
  if (sp.has("color_dot_border"))
    drawOptions.colorDotBorder = sp.get("color_dot_border")!;

  return {
    filename,
    format: format as "svg",
    drawOptions,
    animationOptions,
  };
};
