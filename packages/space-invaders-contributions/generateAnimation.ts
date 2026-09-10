import { getForgejoUserContribution } from "@space-invaders-contributions/forgejo-user-contribution";
import { getGithubUserContribution } from "@space-invaders-contributions/github-user-contribution";
import { getGitlabUserContribution } from "@space-invaders-contributions/gitlab-user-contribution";
import { getBestRoute } from "@space-invaders-contributions/solver/getBestRoute";
import { getPathToPose } from "@space-invaders-contributions/solver/getPathToPose";
import type { DrawOptions } from "@space-invaders-contributions/svg-creator";
import { snake4 } from "@space-invaders-contributions/types/__fixtures__/snake";
import { cellsToGrid } from "./cellsToGrid";

export { basePalettes, palettes } from "./palettes";

export type Source =
  | {
      platform: "github";
      username: string;
      githubToken: string;
      baseUrl?: string;
    }
  | { platform: "gitlab"; username: string; baseUrl?: string }
  | { platform: "forgejo"; username: string; baseUrl: string };

export type AnimationOptions = { stepDurationMs: number };

export type Output = {
  format: "svg";
  drawOptions: DrawOptions;
  animationOptions: AnimationOptions;
};

export const getUserContribution = async (source: Source) => {
  switch (source.platform) {
    case "github":
      return getGithubUserContribution(source.username, {
        githubToken: source.githubToken,
        baseUrl: source.baseUrl,
      });
    case "gitlab":
      return getGitlabUserContribution(source.username, {
        baseUrl: source.baseUrl,
      });
    case "forgejo":
      return getForgejoUserContribution(source.username, {
        baseUrl: source.baseUrl,
      });
  }
};

export const generateAnimation = async (
  source: Source,
  outputs: (Output | null)[],
) => {
  console.log(`🎣 fetching user contribution from ${source.platform}`);
  const cells = await getUserContribution(source);
  const grid = cellsToGrid(cells);
  const snake = snake4;

  console.log("📡 computing best route");
  const chain = getBestRoute(grid, snake)!;
  chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

  return Promise.all(
    outputs.map(async (out, i) => {
      if (!out) return;
      const { format, drawOptions, animationOptions } = out;
      switch (format) {
        case "svg": {
          console.log(`🖌 creating svg (outputs[${i}])`);
          const { createSvg } = await import(
            "@space-invaders-contributions/svg-creator"
          );
          return createSvg(grid, cells, chain, drawOptions, animationOptions);
        }
      }
    }),
  );
};
