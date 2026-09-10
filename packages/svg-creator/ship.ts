import { getHeadX } from "@space-invaders-contributions/types/snake";
import type { Snake } from "@space-invaders-contributions/types/snake";
import { h } from "./xml-utils";
import { createAnimation } from "./css-utils";

export type Options = {
  sizeCell: number;
  sizeDot: number;
};

export type Hit = { x: number; y: number; t: number; i: number };

// how many rows below the grid the ship flies on (see shipRowY in index.ts)
export const SHIP_ROW_OFFSET = 2;

// how many cells (in grid units) a laser bolt crosses per animation step,
// so bolts fired from farther away actually take longer to land
const BULLET_SPEED_CELLS_PER_STEP = 3;

// fraction of the total loop a laser bolt takes to travel from the ship to its target
export const getTravelFraction = (
  startX: number,
  targetX: number,
  targetY: number,
  gridHeight: number,
  chainLength: number,
) => {
  const dx = targetX - startX;
  const dy = gridHeight + SHIP_ROW_OFFSET - targetY;
  const distanceCells = Math.hypot(dx, dy);

  return Math.min(
    0.5,
    distanceCells / BULLET_SPEED_CELLS_PER_STEP / chainLength,
  );
};

// sprite authored on a 0..512 viewBox, fill inherited from --cs
// (see assets/nave.svg)
const SHIP_PATH =
  "M236,0 L231,105 L194,111 L194,317 L175,317 L171,212 L123,217 L123,352 L91,354 L86,388 L69,387 L68,286 L21,283 L17,436 L86,441 L93,476 L157,476 L163,511 L208,510 L212,476 L229,477 L234,511 L279,510 L283,476 L300,477 L303,510 L348,511 L354,476 L418,476 L425,441 L493,438 L494,287 L443,286 L442,387 L425,388 L420,354 L388,352 L388,217 L340,212 L336,317 L317,317 L317,111 L283,105 L283,4 Z";
const SPRITE_VIEWBOX = 512;

// bala.svg is a rounded square centered in its viewBox
const BULLET_RECT_RATIO = { size: 312 / 512, radius: 48 / 512 };

const removeInterpolatedPositions = <T extends { x: number; y: number }>(
  arr: T[],
) =>
  arr.filter((u, i, arr) => {
    if (i - 1 < 0 || i + 1 >= arr.length) return true;

    const a = arr[i - 1];
    const b = arr[i + 1];

    const ex = (a.x + b.x) / 2;
    const ey = (a.y + b.y) / 2;

    return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
  });

/**
 * draw the ship moving along the row below the contribution grid, and one
 * laser bolt per invader (colored cell) it shoots down, in the same
 * chronological order the snake used to eat cells in
 */
export const createShip = (
  chain: Snake[],
  hits: Hit[],
  { sizeCell, sizeDot }: Options,
  rowY: number,
  duration: number,
) => {
  const shipSize = sizeCell * 1.6;
  const shipScale = shipSize / SPRITE_VIEWBOX;
  const shipCy = rowY + sizeCell / 2 - shipSize / 2;

  const shipTransform = (x: number) =>
    `translate(${(x * sizeCell + sizeCell / 2 - shipSize / 2).toFixed(1)}px,${shipCy.toFixed(1)}px) scale(${shipScale.toFixed(4)})`;

  const shipPositions = removeInterpolatedPositions(
    chain.map((snake, i, { length }) => ({
      x: getHeadX(snake),
      y: 0,
      t: i / length,
    })),
  );

  const shipKeyframes = shipPositions.map(({ x, t }) => ({
    t,
    style: `transform:${shipTransform(x)}`,
  }));

  const bulletSize = sizeDot * BULLET_RECT_RATIO.size * 0.7;
  const bulletRadius =
    bulletSize * (BULLET_RECT_RATIO.radius / BULLET_RECT_RATIO.size);
  const gridHeight = rowY / sizeCell - SHIP_ROW_OFFSET;
  const eps = 0.0001;

  const bulletStyles: string[] = [];
  const bulletElements: string[] = [];

  hits.forEach((hit, i) => {
    const id = "b" + i.toString(36);

    const startX = getHeadX(chain[hit.i]);
    const startCx = startX * sizeCell + sizeCell / 2 - bulletSize / 2;
    const startCy = shipCy + shipSize / 2 - bulletSize / 2;

    const endCx = hit.x * sizeCell + sizeCell / 2 - bulletSize / 2;
    const endCy = hit.y * sizeCell + sizeCell / 2 - bulletSize / 2;

    const startTransform = `translate(${startCx.toFixed(1)}px,${startCy.toFixed(1)}px)`;
    const endTransform = `translate(${endCx.toFixed(1)}px,${endCy.toFixed(1)}px)`;

    const travel = getTravelFraction(
      startX,
      hit.x,
      hit.y,
      gridHeight,
      chain.length,
    );
    const t0 = Math.max(0, hit.t - eps);
    const t1 = Math.min(1, hit.t + travel);

    bulletStyles.push(
      createAnimation(id, [
        { t: t0, style: `opacity:0;transform:${startTransform}` },
        { t: hit.t, style: `opacity:1;transform:${startTransform}` },
        { t: t1, style: `opacity:1;transform:${endTransform}` },
        {
          t: Math.min(1, t1 + eps),
          style: `opacity:0;transform:${endTransform}`,
        },
        { t: 1, style: `opacity:0;transform:${endTransform}` },
      ]),

      `.b.${id}{ animation-name: ${id} }`,
    );

    bulletElements.push(
      h("rect", {
        class: `b ${id}`,
        width: bulletSize.toFixed(1),
        height: bulletSize.toFixed(1),
        rx: bulletRadius.toFixed(1),
        ry: bulletRadius.toFixed(1),
      }),
    );
  });

  const styles = [
    `.p{
      shape-rendering: geometricPrecision;
      fill: var(--cs);
      animation: none linear ${duration}ms infinite;
      animation-name: ship;
      transform: ${shipTransform(shipPositions[0]?.x ?? 0)};
    }`,
    `.b{
      shape-rendering: geometricPrecision;
      fill: var(--cs);
      opacity: 0;
      animation: none linear ${duration}ms infinite;
    }`,
    createAnimation("ship", shipKeyframes),
    ...bulletStyles,
  ];

  const svgElements = [
    h("path", { class: "p", d: SHIP_PATH }),
    ...bulletElements,
  ];

  return { svgElements, styles };
};
