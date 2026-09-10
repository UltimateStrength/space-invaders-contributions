import * as fs from "node:fs";
import * as path from "node:path";
import { generateAnimation } from "space-invaders-contributions/generateAnimation";
import { parseOutputsOption } from "space-invaders-contributions/outputsOptions";
import * as githubAction from "./github-action";

(async () => {
  try {
    const userName = githubAction.getInput("github_user_name");
    const githubToken =
      process.env.GITHUB_TOKEN ?? githubAction.getInput("github_token");

    const outputsRaw = [
      ...githubAction.getInput("outputs").split("\n"),
      //
      // legacy
      githubAction.getInput("svg_out_path"),
    ]
      .map((x) => x.trim())
      .filter(Boolean);

    const outputs = parseOutputsOption(outputsRaw);

    const results = await generateAnimation(
      { platform: "github", username: userName, githubToken },
      outputs,
    );

    outputs.forEach((out, i) => {
      const result = results[i];
      if (out?.filename && result) {
        console.log(`💾 writing to ${out?.filename}`);
        fs.mkdirSync(path.dirname(out?.filename), { recursive: true });
        fs.writeFileSync(out?.filename, result);
      }
    });
  } catch (e: any) {
    githubAction.setFailed(`Action failed with "${e.message}"`);
  }
})();
