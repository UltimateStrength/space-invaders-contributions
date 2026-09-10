import {
  copyGrid,
  getColor,
  isEmpty,
  isInside,
  setColorEmpty,
} from "@space-invaders-contributions/types/grid";
import { getHeadX, getHeadY } from "@space-invaders-contributions/types/snake";
import type { Snake } from "@space-invaders-contributions/types/snake";
import type {
  Grid,
  Color,
  Empty,
} from "@space-invaders-contributions/types/grid";
import type { Point } from "@space-invaders-contributions/types/point";
import { createShip, getTravelFraction } from "./ship";
import { createGrid } from "./grid";
import { h } from "./xml-utils";
import { minifyCss } from "./css-utils";

export type DrawOptions = {
  colorDots: Record<Color, string>;
  colorEmpty: string;
  colorDotBorder: string;
  colorShip: string;
  sizeCell: number;
  sizeDot: number;
  sizeDotBorderRadius: number;
  dark?: {
    colorDots: Record<Color, string>;
    colorEmpty: string;
    colorDotBorder?: string;
    colorShip?: string;
  };
};

const getCellsFromGrid = ({ width, height }: Grid) =>
  Array.from({ length: width }, (_, x) =>
    Array.from({ length: height }, (_, y) => ({ x, y })),
  ).flat();

const createLivingCells = (
  grid0: Grid,
  chain: Snake[],
  cells: Point[] | null,
) => {
  const livingCells: (Point & {
    t: number | null;
    step: number | null;
    color: Color | Empty;
  })[] = (cells ?? getCellsFromGrid(grid0)).map(({ x, y }) => ({
    x,
    y,
    t: null,
    step: null,
    color: getColor(grid0, x, y),
  }));

  const grid = copyGrid(grid0);
  for (let i = 0; i < chain.length; i++) {
    const snake = chain[i];
    const x = getHeadX(snake);
    const y = getHeadY(snake);

    if (isInside(grid, x, y) && !isEmpty(getColor(grid, x, y))) {
      setColorEmpty(grid, x, y);
      const cell = livingCells.find((c) => c.x === x && c.y === y)!;
      // the cell dies when the laser actually reaches it, not when it's
      // fired: travel time depends on how far the target is from the ship
      const travel = getTravelFraction(x, x, y, grid.height, chain.length);
      cell.t = Math.min(1, i / chain.length + travel);
      cell.step = i;
    }
  }

  return livingCells;
};

export const createSvg = (
  grid: Grid,
  cells: Point[] | null,
  chain: Snake[],
  drawOptions: DrawOptions,
  animationOptions: { stepDurationMs: number },
) => {
  const width = (grid.width + 2) * drawOptions.sizeCell;
  const height = (grid.height + 5) * drawOptions.sizeCell;

  const duration = animationOptions.stepDurationMs * chain.length;

  const livingCells = createLivingCells(grid, chain, cells);

  const hits = livingCells
    .filter((c): c is typeof c & { t: number; step: number } => c.step !== null)
    .map(({ x, y, step }) => ({ x, y, t: step / chain.length, i: step }));

  const shipRowY = (grid.height + 2) * drawOptions.sizeCell;

  const elements = [
    createGrid(livingCells, drawOptions, duration),
    createShip(chain, hits, drawOptions, shipRowY, duration),
  ];

  const viewBox = [
    -drawOptions.sizeCell,
    -drawOptions.sizeCell * 2,
    width,
    height,
  ].join(" ");

  const style =
    generateColorVar(drawOptions) +
    elements
      .map((e) => e.styles)
      .flat()
      .join("\n");

  const svg = [
    h("svg", {
      viewBox,
      width,
      height,
      xmlns: "http://www.w3.org/2000/svg",
    }).replace("/>", ">"),

    "<desc>",
    "Generated with space-invaders-contributions",
    "</desc>",

    "<style>",
    optimizeCss(style),
    "</style>",

    ...elements.map((e) => e.svgElements).flat(),

    "</svg>",
  ].join("");

  return optimizeSvg(svg);
};

const optimizeCss = (css: string) => minifyCss(css);
const optimizeSvg = (svg: string) => svg;

const generateColorVar = (drawOptions: DrawOptions) =>
  `
    :root {
    --cb: ${drawOptions.colorDotBorder};
    --cs: ${drawOptions.colorShip};
    --ce: ${drawOptions.colorEmpty};
    ${Object.entries(drawOptions.colorDots)
      .map(([i, color]) => `--c${i}:${color};`)
      .join("")}
    }
    ` +
  (drawOptions.dark
    ? `
    @media (prefers-color-scheme: dark) {
      :root {
        --cb: ${drawOptions.dark.colorDotBorder || drawOptions.colorDotBorder};
        --cs: ${drawOptions.dark.colorShip || drawOptions.colorShip};
        --ce: ${drawOptions.dark.colorEmpty};
        ${Object.entries(drawOptions.dark.colorDots)
          .map(([i, color]) => `--c${i}:${color};`)
          .join("")}
      }
    }
`
    : "");
