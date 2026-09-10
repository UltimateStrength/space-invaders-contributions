import { rmSync } from "fs";
import { join } from "path";

const outdir = join(import.meta.dir, "dist");
rmSync(outdir, { recursive: true, force: true });

const demoBuild = await Bun.build({
  entrypoints: Array.from(
    new Bun.Glob("*/index.html").scanSync(import.meta.dir),
  )
    .filter((f) => !f.startsWith("dist/"))
    .map((f) => join(import.meta.dir, f)),
  outdir,
  target: "browser",
});

if (!demoBuild.success) {
  console.error(demoBuild.logs);
  process.exit(1);
}
