var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __esm = (fn, res, err) => () => {
  if (fn)
    try {
      res = fn(fn = 0);
    } catch (e) {
      err = [e];
    }
  if (err)
    throw err[0];
  return res;
};

// ../types/grid.ts
var isInside = (grid, x, y) => x >= 0 && y >= 0 && x < grid.width && y < grid.height, isInsideLarge = (grid, m, x, y) => x >= -m && y >= -m && x < grid.width + m && y < grid.height + m, copyGrid = ({ width, height, data }) => ({
  width,
  height,
  data: Uint8Array.from(data)
}), getIndex = (grid, x, y) => x * grid.height + y, getColor = (grid, x, y) => grid.data[getIndex(grid, x, y)], isEmpty = (color) => color === 0, setColor = (grid, x, y, color) => {
  grid.data[getIndex(grid, x, y)] = color || 0;
}, setColorEmpty = (grid, x, y) => {
  setColor(grid, x, y, 0);
}, createEmptyGrid = (width, height) => ({
  width,
  height,
  data: new Uint8Array(width * height)
});

// ../types/snake.ts
var getHeadX = (snake) => snake[0] - 2, getHeadY = (snake) => snake[1] - 2, getSnakeLength = (snake) => snake.length / 2, snakeEquals = (a, b) => {
  for (let i = 0;i < a.length; i++)
    if (a[i] !== b[i])
      return false;
  return true;
}, nextSnake = (snake, dx, dy) => {
  const copy = new Uint8Array(snake.length);
  for (let i = 2;i < snake.length; i++)
    copy[i] = snake[i - 2];
  copy[0] = snake[0] + dx;
  copy[1] = snake[1] + dy;
  return copy;
}, snakeWillSelfCollide = (snake, dx, dy) => {
  const nx = snake[0] + dx;
  const ny = snake[1] + dy;
  for (let i = 2;i < snake.length - 2; i += 2)
    if (snake[i + 0] === nx && snake[i + 1] === ny)
      return true;
  return false;
}, snakeToCells = (snake) => Array.from({ length: snake.length / 2 }, (_, i) => ({
  x: snake[i * 2 + 0] - 2,
  y: snake[i * 2 + 1] - 2
})), createSnakeFromCells = (points) => {
  const snake = new Uint8Array(points.length * 2);
  for (let i = points.length;i--; ) {
    snake[i * 2 + 0] = points[i].x + 2;
    snake[i * 2 + 1] = points[i].y + 2;
  }
  return snake;
};

// ../svg-creator/xml-utils.ts
var h = (element, attributes) => `<${element} ${toAttribute(attributes)}/>`, toAttribute = (o) => Object.entries(o).filter(([, value]) => value !== null).map(([name, value]) => `${name}="${value}"`).join(" ");

// ../svg-creator/css-utils.ts
var percent = (x) => parseFloat((x * 100).toFixed(2)).toString() + "%", mergeKeyFrames = (keyframes) => {
  const s = new Map;
  for (const { t, style } of keyframes) {
    s.set(style, [...s.get(style) ?? [], t]);
  }
  return Array.from(s.entries()).map(([style, ts]) => ({ style, ts })).sort((a, b) => a.ts[0] - b.ts[0]);
}, createAnimation = (name, keyframes) => `@keyframes ${name}{` + mergeKeyFrames(keyframes).map(({ style, ts }) => ts.map(percent).join(",") + `{${style}}`).join("") + "}", minifyCss = (css) => css.replace(/\s+/g, " ").replace(/.\s+[,;:{}()]/g, (a) => a.replace(/\s+/g, "")).replace(/[,;:{}()]\s+./g, (a) => a.replace(/\s+/g, "")).replace(/.\s+[,;:{}()]/g, (a) => a.replace(/\s+/g, "")).replace(/[,;:{}()]\s+./g, (a) => a.replace(/\s+/g, "")).replace(/\;\s*\}/g, "}").trim();

// ../svg-creator/ship.ts
var SHIP_ROW_OFFSET = 2, BULLET_SPEED_CELLS_PER_STEP = 3, getTravelFraction = (startX, targetX, targetY, gridHeight, chainLength) => {
  const dx = targetX - startX;
  const dy = gridHeight + SHIP_ROW_OFFSET - targetY;
  const distanceCells = Math.hypot(dx, dy);
  return Math.min(0.5, distanceCells / BULLET_SPEED_CELLS_PER_STEP / chainLength);
}, SHIP_PATH = "M236,0 L231,105 L194,111 L194,317 L175,317 L171,212 L123,217 L123,352 L91,354 L86,388 L69,387 L68,286 L21,283 L17,436 L86,441 L93,476 L157,476 L163,511 L208,510 L212,476 L229,477 L234,511 L279,510 L283,476 L300,477 L303,510 L348,511 L354,476 L418,476 L425,441 L493,438 L494,287 L443,286 L442,387 L425,388 L420,354 L388,352 L388,217 L340,212 L336,317 L317,317 L317,111 L283,105 L283,4 Z", SPRITE_VIEWBOX = 512, BULLET_RECT_RATIO, removeInterpolatedPositions = (arr) => arr.filter((u, i, arr) => {
  if (i - 1 < 0 || i + 1 >= arr.length)
    return true;
  const a = arr[i - 1];
  const b = arr[i + 1];
  const ex = (a.x + b.x) / 2;
  const ey = (a.y + b.y) / 2;
  return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
}), createShip = (chain, hits, { sizeCell, sizeDot }, rowY, duration) => {
  const shipSize = sizeCell * 1.6;
  const shipScale = shipSize / SPRITE_VIEWBOX;
  const shipCy = rowY + sizeCell / 2 - shipSize / 2;
  const shipTransform = (x) => `translate(${(x * sizeCell + sizeCell / 2 - shipSize / 2).toFixed(1)}px,${shipCy.toFixed(1)}px) scale(${shipScale.toFixed(4)})`;
  const shipPositions = removeInterpolatedPositions(chain.map((snake, i, { length }) => ({
    x: getHeadX(snake),
    y: 0,
    t: i / length
  })));
  const shipKeyframes = shipPositions.map(({ x, t }) => ({
    t,
    style: `transform:${shipTransform(x)}`
  }));
  const bulletSize = sizeDot * BULLET_RECT_RATIO.size * 0.7;
  const bulletRadius = bulletSize * (BULLET_RECT_RATIO.radius / BULLET_RECT_RATIO.size);
  const gridHeight = rowY / sizeCell - SHIP_ROW_OFFSET;
  const eps = 0.0001;
  const bulletStyles = [];
  const bulletElements = [];
  hits.forEach((hit, i) => {
    const id = "b" + i.toString(36);
    const startX = getHeadX(chain[hit.i]);
    const startCx = startX * sizeCell + sizeCell / 2 - bulletSize / 2;
    const startCy = shipCy + shipSize / 2 - bulletSize / 2;
    const endCx = hit.x * sizeCell + sizeCell / 2 - bulletSize / 2;
    const endCy = hit.y * sizeCell + sizeCell / 2 - bulletSize / 2;
    const startTransform = `translate(${startCx.toFixed(1)}px,${startCy.toFixed(1)}px)`;
    const endTransform = `translate(${endCx.toFixed(1)}px,${endCy.toFixed(1)}px)`;
    const travel = getTravelFraction(startX, hit.x, hit.y, gridHeight, chain.length);
    const t0 = Math.max(0, hit.t - eps);
    const t1 = Math.min(1, hit.t + travel);
    bulletStyles.push(createAnimation(id, [
      { t: t0, style: `opacity:0;transform:${startTransform}` },
      { t: hit.t, style: `opacity:1;transform:${startTransform}` },
      { t: t1, style: `opacity:1;transform:${endTransform}` },
      {
        t: Math.min(1, t1 + eps),
        style: `opacity:0;transform:${endTransform}`
      },
      { t: 1, style: `opacity:0;transform:${endTransform}` }
    ]), `.b.${id}{ animation-name: ${id} }`);
    bulletElements.push(h("rect", {
      class: `b ${id}`,
      width: bulletSize.toFixed(1),
      height: bulletSize.toFixed(1),
      rx: bulletRadius.toFixed(1),
      ry: bulletRadius.toFixed(1)
    }));
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
    ...bulletStyles
  ];
  const svgElements = [
    h("path", { class: "p", d: SHIP_PATH }),
    ...bulletElements
  ];
  return { svgElements, styles };
};
var init_ship = __esm(() => {
  BULLET_RECT_RATIO = { size: 312 / 512, radius: 48 / 512 };
});

// ../svg-creator/grid.ts
var createGrid = (cells, { sizeDotBorderRadius, sizeDot, sizeCell }, duration) => {
  const svgElements = [];
  const styles = [
    `.c{
      shape-rendering: geometricPrecision;
      fill: var(--ce);
      stroke-width: 1px;
      stroke: var(--cb);
      animation: none ${duration}ms linear infinite;
      width: ${sizeDot}px;
      height: ${sizeDot}px;
    }`
  ];
  let i = 0;
  for (const { x, y, color, t } of cells) {
    const id = t && "c" + (i++).toString(36);
    const m = (sizeCell - sizeDot) / 2;
    if (t !== null && id) {
      const animationName = id;
      styles.push(createAnimation(animationName, [
        { t: t - 0.0001, style: `fill:var(--c${color})` },
        { t: t + 0.0001, style: `fill:var(--ce)` },
        { t: 1, style: `fill:var(--ce)` }
      ]), `.c.${id}{
          fill: var(--c${color});
          animation-name: ${animationName}
        }`);
    }
    svgElements.push(h("rect", {
      class: ["c", id].filter(Boolean).join(" "),
      x: x * sizeCell + m,
      y: y * sizeCell + m,
      rx: sizeDotBorderRadius,
      ry: sizeDotBorderRadius
    }));
  }
  return { svgElements, styles };
};
var init_grid = () => {};

// ../svg-creator/index.ts
var getCellsFromGrid = ({ width, height }) => Array.from({ length: width }, (_, x) => Array.from({ length: height }, (_, y) => ({ x, y }))).flat(), createLivingCells = (grid0, chain, cells) => {
  const livingCells = (cells ?? getCellsFromGrid(grid0)).map(({ x, y }) => ({
    x,
    y,
    t: null,
    step: null,
    color: getColor(grid0, x, y)
  }));
  const grid = copyGrid(grid0);
  for (let i = 0;i < chain.length; i++) {
    const snake = chain[i];
    const x = getHeadX(snake);
    const y = getHeadY(snake);
    if (isInside(grid, x, y) && !isEmpty(getColor(grid, x, y))) {
      setColorEmpty(grid, x, y);
      const cell = livingCells.find((c) => c.x === x && c.y === y);
      const travel = getTravelFraction(x, x, y, grid.height, chain.length);
      cell.t = Math.min(1, i / chain.length + travel);
      cell.step = i;
    }
  }
  return livingCells;
}, createSvg = (grid, cells, chain, drawOptions, animationOptions) => {
  const width = (grid.width + 2) * drawOptions.sizeCell;
  const height = (grid.height + 5) * drawOptions.sizeCell;
  const duration = animationOptions.stepDurationMs * chain.length;
  const livingCells = createLivingCells(grid, chain, cells);
  const hits = livingCells.filter((c) => c.step !== null).map(({ x, y, step }) => ({ x, y, t: step / chain.length, i: step }));
  const shipRowY = (grid.height + 2) * drawOptions.sizeCell;
  const elements = [
    createGrid(livingCells, drawOptions, duration),
    createShip(chain, hits, drawOptions, shipRowY, duration)
  ];
  const viewBox = [
    -drawOptions.sizeCell,
    -drawOptions.sizeCell * 2,
    width,
    height
  ].join(" ");
  const style = generateColorVar(drawOptions) + elements.map((e) => e.styles).flat().join(`
`);
  const svg = [
    h("svg", {
      viewBox,
      width,
      height,
      xmlns: "http://www.w3.org/2000/svg"
    }).replace("/>", ">"),
    "<desc>",
    "Generated with space-invaders-contributions",
    "</desc>",
    "<style>",
    optimizeCss(style),
    "</style>",
    ...elements.map((e) => e.svgElements).flat(),
    "</svg>"
  ].join("");
  return optimizeSvg(svg);
}, optimizeCss = (css) => minifyCss(css), optimizeSvg = (svg) => svg, generateColorVar = (drawOptions) => `
    :root {
    --cb: ${drawOptions.colorDotBorder};
    --cs: ${drawOptions.colorShip};
    --ce: ${drawOptions.colorEmpty};
    ${Object.entries(drawOptions.colorDots).map(([i, color]) => `--c${i}:${color};`).join("")}
    }
    ` + (drawOptions.dark ? `
    @media (prefers-color-scheme: dark) {
      :root {
        --cb: ${drawOptions.dark.colorDotBorder || drawOptions.colorDotBorder};
        --cs: ${drawOptions.dark.colorShip || drawOptions.colorShip};
        --ce: ${drawOptions.dark.colorEmpty};
        ${Object.entries(drawOptions.dark.colorDots).map(([i, color]) => `--c${i}:${color};`).join("")}
      }
    }
` : "");
var init_svg_creator = __esm(() => {
  init_ship();
  init_grid();
});

// index.ts
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));

// ../forgejo-user-contribution/index.ts
var getForgejoUserContribution = async (userName, o = {}) => {
  const baseUrl = o.baseUrl ?? "https://codeberg.org";
  const res = await fetch(`${baseUrl}/api/v1/users/${userName}/heatmap`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const heatmapData = await res.json();
  const countsByDate = new Map;
  for (const { timestamp, contributions } of heatmapData) {
    const date = new Date(timestamp * 1000).toLocaleDateString("en-CA");
    countsByDate.set(date, (countsByDate.get(date) ?? 0) + contributions);
  }
  const max = Math.max(0, ...countsByDate.values());
  const levelForCount = (count) => count <= 0 || max === 0 ? 0 : count >= max ? 4 : Math.ceil(count / max * 3);
  const today = new Date;
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 365);
  start.setDate(start.getDate() - start.getDay());
  const cells = [];
  const cursor = new Date(start);
  let x = 0;
  while (cursor <= today) {
    const y = cursor.getDay();
    const date = cursor.toLocaleDateString("en-CA");
    const count = countsByDate.get(date) ?? 0;
    cells.push({ x, y, date, count, level: levelForCount(count) });
    cursor.setDate(cursor.getDate() + 1);
    if (y === 6)
      x++;
  }
  return cells;
};

// ../github-user-contribution/index.ts
var getGithubUserContribution = async (userName, o) => {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                weekday
                date
              }
            }
          }
        }
      }
    }
  `;
  const variables = { login: userName };
  const apiUrl = o.baseUrl ? `${o.baseUrl}/api/graphql` : "https://api.github.com/graphql";
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `bearer ${o.githubToken}`,
      "Content-Type": "application/json",
      "User-Agent": "space-invaders-contributions"
    },
    method: "POST",
    body: JSON.stringify({ variables, query })
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const { data, errors } = await res.json();
  if (errors?.[0])
    throw errors[0];
  return data.user.contributionsCollection.contributionCalendar.weeks.flatMap(({ contributionDays }, x) => contributionDays.map((d) => ({
    x,
    y: d.weekday,
    date: d.date,
    count: d.contributionCount,
    level: d.contributionLevel === "FOURTH_QUARTILE" && 4 || d.contributionLevel === "THIRD_QUARTILE" && 3 || d.contributionLevel === "SECOND_QUARTILE" && 2 || d.contributionLevel === "FIRST_QUARTILE" && 1 || 0
  })));
};

// ../gitlab-user-contribution/index.ts
var getGitlabUserContribution = async (userName, o = {}) => {
  const baseUrl = o.baseUrl ?? "https://gitlab.com";
  const res = await fetch(`${baseUrl}/users/${userName}/calendar.json`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const countsByDate = await res.json();
  const max = Math.max(0, ...Object.values(countsByDate));
  const levelForCount = (count) => count <= 0 || max === 0 ? 0 : count >= max ? 4 : Math.ceil(count / max * 3);
  const today = new Date;
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 365);
  start.setDate(start.getDate() - start.getDay());
  const cells = [];
  const cursor = new Date(start);
  let x = 0;
  while (cursor <= today) {
    const y = cursor.getDay();
    const date = cursor.toLocaleDateString("en-CA");
    const count = countsByDate[date] ?? 0;
    cells.push({ x, y, date, count, level: levelForCount(count) });
    cursor.setDate(cursor.getDate() + 1);
    if (y === 6)
      x++;
  }
  return cells;
};
// ../types/point.ts
var around4 = [
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 }
];

// ../solver/outside.ts
var createOutside = (grid, color = 0) => {
  const outside = createEmptyGrid(grid.width, grid.height);
  for (let x = outside.width;x--; )
    for (let y = outside.height;y--; )
      setColor(outside, x, y, 1);
  fillOutside(outside, grid, color);
  return outside;
};
var fillOutside = (outside, grid, color = 0) => {
  let changed = true;
  while (changed) {
    changed = false;
    for (let x = outside.width;x--; )
      for (let y = outside.height;y--; )
        if (getColor(grid, x, y) <= color && !isOutside(outside, x, y) && around4.some((a) => isOutside(outside, x + a.x, y + a.y))) {
          changed = true;
          setColorEmpty(outside, x, y);
        }
  }
  return outside;
};
var isOutside = (outside, x, y) => !isInside(outside, x, y) || isEmpty(getColor(outside, x, y));
// ../solver/utils/sortPush.ts
var sortPush = (arr, x, sortFn) => {
  let a = 0;
  let b = arr.length;
  if (arr.length === 0 || sortFn(x, arr[a]) <= 0) {
    arr.unshift(x);
    return;
  }
  while (b - a > 1) {
    const e = Math.ceil((a + b) / 2);
    const s = sortFn(x, arr[e]);
    if (s === 0)
      a = b = e;
    else if (s > 0)
      a = e;
    else
      b = e;
  }
  const e = Math.ceil((a + b) / 2);
  arr.splice(e, 0, x);
};
// ../solver/tunnel.ts
var getTunnelPath = (snake0, tunnel) => {
  const chain = [];
  let snake = snake0;
  for (let i = 1;i < tunnel.length; i++) {
    const dx = tunnel[i].x - getHeadX(snake);
    const dy = tunnel[i].y - getHeadY(snake);
    snake = nextSnake(snake, dx, dy);
    chain.unshift(snake);
  }
  return chain;
};
var isEmptySafe = (grid, x, y) => !isInside(grid, x, y) || isEmpty(getColor(grid, x, y));
var trimTunnelStart = (grid, tunnel) => {
  while (tunnel.length) {
    const { x, y } = tunnel[0];
    if (isEmptySafe(grid, x, y))
      tunnel.shift();
    else
      break;
  }
};
var trimTunnelEnd = (grid, tunnel) => {
  while (tunnel.length) {
    const i = tunnel.length - 1;
    const { x, y } = tunnel[i];
    if (isEmptySafe(grid, x, y) || tunnel.findIndex((p) => p.x === x && p.y === y) < i)
      tunnel.pop();
    else
      break;
  }
};

// ../solver/getBestTunnel.ts
var getColorSafe = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
var unwrap = (m) => !m ? [] : [...unwrap(m.parent), { x: getHeadX(m.snake), y: getHeadY(m.snake) }];
var getSnakeEscapePath = (grid, outside, snake0, color) => {
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList[0]) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    if (isOutside(outside, x, y))
      return unwrap(o);
    for (const a of around4) {
      const c = getColorSafe(grid, x + a.x, y + a.y);
      if (c <= color && !snakeWillSelfCollide(o.snake, a.x, a.y)) {
        const snake = nextSnake(o.snake, a.x, a.y);
        if (!closeList.some((s0) => snakeEquals(s0, snake))) {
          const w = o.w + 1 + +(c === color) * 1000;
          sortPush(openList, { snake, w, parent: o }, (a, b) => a.w - b.w);
          closeList.push(snake);
        }
      }
    }
  }
  return null;
};
var getBestTunnel = (grid, outside, x, y, color, snakeN) => {
  const c = { x, y };
  const snake0 = createSnakeFromCells(Array.from({ length: snakeN }, () => c));
  const one = getSnakeEscapePath(grid, outside, snake0, color);
  if (!one)
    return null;
  const snakeICells = one.slice(0, snakeN);
  while (snakeICells.length < snakeN)
    snakeICells.push(snakeICells[snakeICells.length - 1]);
  const snakeI = createSnakeFromCells(snakeICells);
  const gridI = copyGrid(grid);
  for (const { x, y } of one)
    setEmptySafe(gridI, x, y);
  const two = getSnakeEscapePath(gridI, outside, snakeI, color);
  if (!two)
    return null;
  one.shift();
  one.reverse();
  one.push(...two);
  trimTunnelStart(grid, one);
  trimTunnelEnd(grid, one);
  return one;
};
// ../solver/getPathTo.ts
var getPathTo = (grid, snake0, x, y) => {
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList.length) {
    const c = openList.shift();
    const cx = getHeadX(c.snake);
    const cy = getHeadY(c.snake);
    for (let i = 0;i < around4.length; i++) {
      const { x: dx, y: dy } = around4[i];
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx === x && ny === y) {
        const path = [nextSnake(c.snake, dx, dy)];
        let e = c;
        while (e.parent) {
          path.push(e.snake);
          e = e.parent;
        }
        return path;
      }
      if (isInsideLarge(grid, 2, nx, ny) && !snakeWillSelfCollide(c.snake, dx, dy) && (!isInside(grid, nx, ny) || isEmpty(getColor(grid, nx, ny)))) {
        const nsnake = nextSnake(c.snake, dx, dy);
        if (!closeList.some((s) => snakeEquals(nsnake, s))) {
          const w = c.w + 1;
          const h = Math.abs(nx - x) + Math.abs(ny - y);
          const f = w + h;
          const o = { snake: nsnake, parent: c, w, h, f };
          sortPush(openList, o, (a, b) => a.f - b.f);
          closeList.push(nsnake);
        }
      }
    }
  }
};

// ../solver/clearResidualColoredLayer.ts
var clearResidualColoredLayer = (grid, outside, snake0, color) => {
  const snakeN = getSnakeLength(snake0);
  const tunnels = getTunnellablePoints(grid, outside, snakeN, color);
  tunnels.sort((a, b) => b.priority - a.priority);
  const chain = [snake0];
  while (tunnels.length) {
    let t = getNextTunnel(tunnels, chain[0]);
    chain.unshift(...getPathTo(grid, chain[0], t[0].x, t[0].y));
    chain.unshift(...getTunnelPath(chain[0], t));
    for (const { x, y } of t)
      setEmptySafe2(grid, x, y);
    fillOutside(outside, grid);
    for (let i = tunnels.length;i--; )
      if (isEmpty(getColor(grid, tunnels[i].x, tunnels[i].y)))
        tunnels.splice(i, 1);
      else {
        const t = tunnels[i];
        const tunnel = getBestTunnel(grid, outside, t.x, t.y, color, snakeN);
        if (!tunnel)
          tunnels.splice(i, 1);
        else {
          t.tunnel = tunnel;
          t.priority = getPriority(grid, color, tunnel);
        }
      }
    tunnels.sort((a, b) => b.priority - a.priority);
  }
  chain.pop();
  return chain;
};
var getNextTunnel = (ts, snake) => {
  let minDistance = Infinity;
  let closestTunnel = null;
  const x = getHeadX(snake);
  const y = getHeadY(snake);
  const priority = ts[0].priority;
  for (let i = 0;ts[i] && ts[i].priority === priority; i++) {
    const t = ts[i].tunnel;
    const d = distanceSq(t[0].x, t[0].y, x, y);
    if (d < minDistance) {
      minDistance = d;
      closestTunnel = t;
    }
  }
  return closestTunnel;
};
var getTunnellablePoints = (grid, outside, snakeN, color) => {
  const points = [];
  for (let x = grid.width;x--; )
    for (let y = grid.height;y--; ) {
      const c = getColor(grid, x, y);
      if (!isEmpty(c) && c < color) {
        const tunnel = getBestTunnel(grid, outside, x, y, color, snakeN);
        if (tunnel) {
          const priority = getPriority(grid, color, tunnel);
          points.push({ x, y, priority, tunnel });
        }
      }
    }
  return points;
};
var getPriority = (grid, color, tunnel) => {
  let nColor = 0;
  let nLess = 0;
  for (let i = 0;i < tunnel.length; i++) {
    const { x, y } = tunnel[i];
    const c = getColorSafe2(grid, x, y);
    if (!isEmpty(c) && i === tunnel.findIndex((p) => p.x === x && p.y === y)) {
      if (c === color)
        nColor += 1;
      else
        nLess += color - c;
    }
  }
  if (nColor === 0)
    return 99999;
  return nLess / nColor;
};
var distanceSq = (ax, ay, bx, by) => (ax - bx) ** 2 + (ay - by) ** 2;
var getColorSafe2 = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe2 = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
// ../solver/clearCleanColoredLayer.ts
var clearCleanColoredLayer = (grid, outside, snake0, color) => {
  const snakeN = getSnakeLength(snake0);
  const points = getTunnellablePoints2(grid, outside, snakeN, color);
  const chain = [snake0];
  while (points.length) {
    const path = getPathToNextPoint(grid, chain[0], color, points);
    path.pop();
    for (const snake of path)
      setEmptySafe3(grid, getHeadX(snake), getHeadY(snake));
    chain.unshift(...path);
  }
  fillOutside(outside, grid);
  chain.pop();
  return chain;
};
var unwrap2 = (m) => !m ? [] : [m.snake, ...unwrap2(m.parent)];
var getPathToNextPoint = (grid, snake0, color, points) => {
  const closeList = [];
  const openList = [{ snake: snake0 }];
  while (openList.length) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    const i = points.findIndex((p) => p.x === x && p.y === y);
    if (i >= 0) {
      points.splice(i, 1);
      return unwrap2(o);
    }
    for (const { x: dx, y: dy } of around4) {
      if (isInsideLarge(grid, 2, x + dx, y + dy) && !snakeWillSelfCollide(o.snake, dx, dy) && getColorSafe3(grid, x + dx, y + dy) <= color) {
        const snake = nextSnake(o.snake, dx, dy);
        if (!closeList.some((s0) => snakeEquals(s0, snake))) {
          closeList.push(snake);
          openList.push({ snake, parent: o });
        }
      }
    }
  }
};
var getTunnellablePoints2 = (grid, outside, snakeN, color) => {
  const points = [];
  for (let x = grid.width;x--; )
    for (let y = grid.height;y--; ) {
      const c = getColor(grid, x, y);
      if (!isEmpty(c) && c <= color && !points.some((p) => p.x === x && p.y === y)) {
        const tunnel = getBestTunnel(grid, outside, x, y, color, snakeN);
        if (tunnel) {
          for (const p of tunnel)
            if (!isEmptySafe2(grid, p.x, p.y))
              points.push(p);
        }
      }
    }
  return points;
};
var getColorSafe3 = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe3 = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
var isEmptySafe2 = (grid, x, y) => !isInside(grid, x, y) && isEmpty(getColor(grid, x, y));

// ../solver/getBestRoute.ts
var getBestRoute = (grid0, snake0) => {
  const grid = copyGrid(grid0);
  const outside = createOutside(grid);
  const chain = [snake0];
  for (const color of extractColors(grid)) {
    if (color > 1)
      chain.unshift(...clearResidualColoredLayer(grid, outside, chain[0], color));
    chain.unshift(...clearCleanColoredLayer(grid, outside, chain[0], color));
  }
  return chain.reverse();
};
var extractColors = (grid) => {
  let maxColor = Math.max(...grid.data);
  return Array.from({ length: maxColor }, (_, i) => i + 1);
};
// ../solver/getPathToPose.ts
var isEmptySafe3 = (grid, x, y) => !isInside(grid, x, y) || isEmpty(getColor(grid, x, y));
var getPathToPose = (snake0, target, grid) => {
  if (snakeEquals(snake0, target))
    return [];
  const targetCells = snakeToCells(target).reverse();
  const snakeN = getSnakeLength(snake0);
  const box = {
    min: {
      x: Math.min(getHeadX(snake0), getHeadX(target)) - snakeN - 1,
      y: Math.min(getHeadY(snake0), getHeadY(target)) - snakeN - 1
    },
    max: {
      x: Math.max(getHeadX(snake0), getHeadX(target)) + snakeN + 1,
      y: Math.max(getHeadY(snake0), getHeadY(target)) + snakeN + 1
    }
  };
  const [t0, ...forbidden] = targetCells;
  forbidden.slice(0, 3);
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList.length) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    if (x === t0.x && y === t0.y) {
      const path = [];
      let e = o;
      while (e) {
        path.push(e.snake);
        e = e.parent;
      }
      path.unshift(...getTunnelPath(path[0], targetCells));
      path.pop();
      path.reverse();
      return path;
    }
    for (let i = 0;i < around4.length; i++) {
      const { x: dx, y: dy } = around4[i];
      const nx = x + dx;
      const ny = y + dy;
      if (!snakeWillSelfCollide(o.snake, dx, dy) && (!grid || isEmptySafe3(grid, nx, ny)) && (grid ? isInsideLarge(grid, 2, nx, ny) : box.min.x <= nx && nx <= box.max.x && box.min.y <= ny && ny <= box.max.y) && !forbidden.some((p) => p.x === nx && p.y === ny)) {
        const snake = nextSnake(o.snake, dx, dy);
        if (!closeList.some((s) => snakeEquals(snake, s))) {
          const w = o.w + 1;
          const h = Math.abs(nx - x) + Math.abs(ny - y);
          const f = w + h;
          sortPush(openList, { f, w, snake, parent: o }, (a, b) => a.f - b.f);
          closeList.push(snake);
        }
      }
    }
  }
};

// ../types/__fixtures__/snake.ts
var create = (length) => createSnakeFromCells(Array.from({ length }, (_, i) => ({ x: i, y: -1 })));
var snake1 = create(1);
var snake3 = create(3);
var snake4 = create(4);
var snake5 = create(5);
var snake9 = create(9);

// ../space-invaders-contributions/cellsToGrid.ts
var cellsToGrid = (cells) => {
  const width = Math.max(0, ...cells.map((c) => c.x)) + 1;
  const height = Math.max(0, ...cells.map((c) => c.y)) + 1;
  const grid = createEmptyGrid(width, height);
  for (const c of cells) {
    if (c.level > 0)
      setColor(grid, c.x, c.y, c.level);
    else
      setColorEmpty(grid, c.x, c.y);
  }
  return grid;
};

// ../space-invaders-contributions/palettes.ts
var basePalettes = {
  "github-light": {
    colorDotBorder: "#1b1f230a",
    colorDots: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    colorEmpty: "#ebedf0",
    colorShip: "purple"
  },
  "github-dark": {
    colorDotBorder: "#1b1f230a",
    colorEmpty: "#161b22",
    colorDots: ["#161b22", "#01311f", "#034525", "#0f6d31", "#00c647"],
    colorShip: "purple"
  },
  "forgejo-light": {
    colorDotBorder: "#00000010",
    colorEmpty: "#d4d4d8",
    colorDots: ["#d4d4d8", "#fdba74", "#f97316", "#c2410c", "#7c2d12"],
    colorShip: "#7c2d12"
  },
  "forgejo-dark": {
    colorDotBorder: "#ffffff10",
    colorEmpty: "#2b3642",
    colorDots: ["#2b3642", "#9a3412", "#ea580c", "#fb923c", "#fed7aa"],
    colorShip: "#fed7aa"
  },
  "codeberg-light": {
    colorDotBorder: "#00000010",
    colorEmpty: "#d0d7de",
    colorDots: ["#d0d7de", "#8db5dc", "#679cd0", "#4183c4", "#254f77"],
    colorShip: "#254f77"
  },
  "codeberg-dark": {
    colorDotBorder: "#ffffff10",
    colorEmpty: "#3b444a",
    colorDots: ["#3b444a", "#254f77", "#31699f", "#4183c4", "#8db5dc"],
    colorShip: "#8db5dc"
  },
  "gitlab-light": {
    colorDotBorder: "#00000010",
    colorEmpty: "#edebe6",
    colorDots: ["#edebe6", "#9dc7f1", "#428fdc", "#2f68b4", "#284779"],
    colorShip: "#284779"
  },
  "gitlab-dark": {
    colorDotBorder: "#ffffff10",
    colorEmpty: "#2a2a36",
    colorDots: ["#2a2a36", "#284779", "#2f68b4", "#428fdc", "#9dc7f1"],
    colorShip: "#9dc7f1"
  }
};
var palettes = {
  ...basePalettes,
  github: basePalettes["github-light"],
  forgejo: basePalettes["forgejo-light"],
  codeberg: basePalettes["codeberg-light"],
  gitlab: basePalettes["gitlab-light"],
  default: basePalettes["github-light"]
};

// ../space-invaders-contributions/generateAnimation.ts
var getUserContribution = async (source) => {
  switch (source.platform) {
    case "github":
      return getGithubUserContribution(source.username, {
        githubToken: source.githubToken,
        baseUrl: source.baseUrl
      });
    case "gitlab":
      return getGitlabUserContribution(source.username, {
        baseUrl: source.baseUrl
      });
    case "forgejo":
      return getForgejoUserContribution(source.username, {
        baseUrl: source.baseUrl
      });
  }
};
var generateAnimation = async (source, outputs) => {
  console.log(`\uD83C\uDFA3 fetching user contribution from ${source.platform}`);
  const cells = await getUserContribution(source);
  const grid = cellsToGrid(cells);
  const snake = snake4;
  console.log("\uD83D\uDCE1 computing best route");
  const chain = getBestRoute(grid, snake);
  chain.push(...getPathToPose(chain.slice(-1)[0], snake));
  return Promise.all(outputs.map(async (out, i) => {
    if (!out)
      return;
    const { format, drawOptions, animationOptions } = out;
    switch (format) {
      case "svg": {
        console.log(`\uD83D\uDD8C creating svg (outputs[${i}])`);
        await Promise.resolve().then(() => init_svg_creator());
        return createSvg(grid, cells, chain, drawOptions, animationOptions);
      }
    }
  }));
};

// ../space-invaders-contributions/outputsOptions.ts
var parseOutputsOption = (lines) => lines.map(parseEntry);
var parseEntry = (entry) => {
  const m = entry.trim().match(/^(.+\.(svg))(\?(.*)|\s*({.*}))?$/);
  if (!m)
    return null;
  const [, filename, format, _, q1, q2] = m;
  const query = q1 ?? q2;
  let sp = new URLSearchParams(query || "");
  try {
    const o = JSON.parse(query);
    if (Array.isArray(o.color_dots))
      o.color_dots = o.color_dots.join(",");
    sp = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError))
      throw err;
  }
  const drawOptions = {
    sizeDotBorderRadius: 2,
    sizeCell: 16,
    sizeDot: 12,
    ...palettes["default"]
  };
  const animationOptions = {
    stepDurationMs: 100
  };
  {
    const palette = palettes[sp.get("palette")];
    if (palette) {
      Object.assign(drawOptions, palette);
    }
  }
  if (sp.has("color_dots")) {
    const colors = sp.get("color_dots").split(/[,;]/);
    drawOptions.colorDots = colors;
    drawOptions.colorEmpty = colors[0];
  }
  if (sp.has("color_ship"))
    drawOptions.colorShip = sp.get("color_ship");
  if (sp.has("color_dot_border"))
    drawOptions.colorDotBorder = sp.get("color_dot_border");
  return {
    filename,
    format,
    drawOptions,
    animationOptions
  };
};

// github-action.ts
var os = __toESM(require("node:os"));
var getInput = (name) => process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
var setFailed = (message) => {
  process.exitCode = 1;
  process.stdout.write(`::error::${escapeData(message)}::${os.EOL}`);
};
function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

// index.ts
(async () => {
  try {
    const userName = getInput("github_user_name");
    const githubToken = process.env.GITHUB_TOKEN ?? getInput("github_token");
    const outputsRaw = [
      ...getInput("outputs").split(`
`),
      getInput("svg_out_path")
    ].map((x) => x.trim()).filter(Boolean);
    const outputs = parseOutputsOption(outputsRaw);
    const results = await generateAnimation({ platform: "github", username: userName, githubToken }, outputs);
    outputs.forEach((out, i) => {
      const result = results[i];
      if (out?.filename && result) {
        console.log(`\uD83D\uDCBE writing to ${out?.filename}`);
        fs.mkdirSync(path.dirname(out?.filename), { recursive: true });
        fs.writeFileSync(out?.filename, result);
      }
    });
  } catch (e) {
    setFailed(`Action failed with "${e.message}"`);
  }
})();
