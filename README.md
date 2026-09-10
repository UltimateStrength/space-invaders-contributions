# space-invaders-contributions

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

Turns a GitHub user's contribution graph into a space invaders animation.

Every contribution square becomes an invader. A ship flies along the row below the grid and blasts each invader with a laser, in the same order the contributions were made — oldest first. When a cell is hit, it fades out.

<!--
  TODO: replace with your own generated preview once the "main" workflow has
  run and pushed to the `output` branch (see .github/workflows/main.yml).
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/<owner>/<repo>/output/space-invaders-contributions-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/<owner>/<repo>/output/space-invaders-contributions.svg" />
    <img alt="space invaders contribution grid animation" src="https://raw.githubusercontent.com/<owner>/<repo>/output/space-invaders-contributions.svg" />
  </picture>
-->

Generates an animated SVG. Colors can be customized via a color palette or individual query string options.

Available as a GitHub Action. It can automatically regenerate the image every day, which makes for a nice [GitHub profile readme](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme).

## Usage

### **github action**

```yaml
- uses: <owner>/space-invaders-contributions@v1
  with:
    # github user name to read the contribution graph from (**required**)
    # using action context var `github.repository_owner` or specified user
    github_user_name: ${{ github.repository_owner }}

    # list of files to generate.
    # one file per line. Each output can be customized with options as query string.
    #
    #  supported options:
    #  - palette:     A preset of color, one of [github, github-dark, github-light]
    #  - color_ship:  Color of the ship and its lasers
    #  - color_dots:  Coma separated list of dots color.
    #                 The first one is 0 contribution, then it goes from the low contribution to the highest.
    #                 Exactly 5 colors are expected.
    outputs: |
      dist/invaders.svg
      dist/invaders-dark.svg?palette=github-dark
      dist/invaders-ocean.svg?color_ship=orange&color_dots=#bfd6f6,#8dbdff,#64a1f4,#4b91f1,#3c7dd9
```

### **dark mode**

For **dark mode** support on github, use this [special syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to) in your readme.

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="invaders-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="invaders.svg" />
  <img alt="space invaders contribution grid" src="invaders.svg" />
</picture>
```

### **npm package**

```ts
import { generateAnimation } from "space-invaders-contributions";

const outputs = [
  {
    format: "svg",
    drawOptions: {
      // ..
    },
  },
];

const results = await generateAnimation(
  {
    platform: "github", // supports github, gitlab and forgejo (codeberg)
    username: "octocat",
    githubToken: process.env.GITHUB_TOKEN,
  },
  outputs,
);

fs.writeFileSync("invaders.svg", results[0]);
```

or with npx

```sh
npx space-invaders-contributions@1 --forgejo_user codeberg.org/JasterV --output invaders.svg?palette=codeberg
```

## Implementation

The GitHub Action, contribution-grid fetching, theming, and SVG/CSS animation pipeline all work the same way as they did before this became a space invaders animation. The one thing that's genuinely new is what gets drawn: a ship and its lasers instead of a snake body.

The order invaders get destroyed in is still computed by a pathfinding [solver](./packages/solver/README.md) that plans a route for a virtual snake eating every cell without colliding with itself — that route is never rendered, it's only used as the chronological firing order for the ship.

## Contribution Policy

Issues and PRs are welcome.
