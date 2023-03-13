import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [{ input: "src/", outDir: "dist/" }],
  declaration: true,
});
