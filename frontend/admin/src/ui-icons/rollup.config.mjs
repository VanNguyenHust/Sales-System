import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { babel } from "@rollup/plugin-babel";
import virtual from "@rollup/plugin-virtual";
import { createFilter } from "@rollup/pluginutils";
import { transform } from "@svgr/core";
import { globbySync } from "globby";
import { optimize } from "svgo";
import jsYaml from "js-yaml";

const iconBasePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "icons");

const toPosixPath = (p) => p.split(path.sep).join(path.posix.sep);
const iconExports = [];
const iconTypes = [];
const iconMetadata = {};

const iconPaths = globbySync([toPosixPath(path.join(iconBasePath, "*.yml"))]);

iconPaths.forEach((filename) => {
  const iconData = jsYaml.load(fs.readFileSync(filename), {
    schema: jsYaml.JSON_SCHEMA,
  });
  const exportName = path.relative(iconBasePath, filename).replace(".yml", "");
  iconMetadata[exportName] = {
    id: exportName,
    ...iconData,
  };
  iconExports.push(`export {default as ${exportName}} from '../icons/${exportName}.svg';`);
  iconTypes.push(`export declare const ${exportName}: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;`);
});

const metadataContent = `
const metadata = ${JSON.stringify(iconMetadata, null, 2)};
export default metadata;
`.trim();
const metadataTypes = `export interface Icon {
  id: string;
  name: string;
  color?: boolean;
  set: "basic" | "menu" | "arrow" | "brand" | "Misc-Attention-User-Systems" | "Chart-Noti";
}

declare const metadata: {
  [iconId: string]: Icon;
};

export default metadata;
`.trim();

function customSvgoRollupPlugin() {
  const filter = createFilter("**/*.svg");

  let counter = 0;
  const optimizedSvgs = [];
  /**
   * @type {import('rollup').Plugin}
   * */
  return {
    name: "custom-svgo",
    async transform(code, id) {
      if (!filter(id)) {
        return;
      }
      const iconName = path.relative(iconBasePath, id).replace(".svg", "");
      const metadata = iconMetadata[iconName];

      /** @type {import('svgo').OptimizeOptions} */
      const svgoConfig = {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                /**
                 * viewBox is needed in order to produce 20px by 20px containers
                 * with smaller (minor) icons inside.
                 */
                removeViewBox: false,

                /**
                 * The following 2 settings are disabled to reduce rendering inconsistency
                 * on Android. Android uses a subset of the SVG spec called SVG Tiny:
                 * https://developer.android.com/studio/write/vector-asset-studio#svg-support
                 */

                /**
                 * Merging mutliple detached paths into a single path can lead to
                 * rendering issues on some platforms where detatched paths are joined
                 * by hairlines. Not merging paths results in greater compatibility
                 * with minimal additional overhead.
                 */
                mergePaths: false,

                convertPathData: {
                  /**
                   * Mixing absolute and relative path commands can lead to rendering
                   * issues on some platforms. This disables converting some path data to
                   * absolute if it is shorter, keeping all path data relative. Using
                   * relative paths means that data points are relative  to the current
                   * point at the start of the path command, which does not greatly
                   * increase the quantity of path data.
                   */
                  utilizeAbsolute: false,
                },
              },
            },
          },
          {
            name: "removeDimensions",
          },
          {
            name: "prefixIds",
            params: {
              // Use that ID here.
              // Do NOT generate the ID itself in the "prefix" function
              // because that will result in each ID being unique,
              // breaking the gradient references within a single SVG.
              // see issue: https://github.com/svg/svgo/issues/674
              prefix: `${++counter}`,
            },
          },
        ],
      };
      if (metadata.color !== true) {
        svgoConfig.plugins.push({
          name: "convertColors",
          params: {
            currentColor: true,
          },
        });
      }
      const rawSvg = fs.readFileSync(id, "utf-8");
      const { data: optimizedSvg } = await optimize(rawSvg, {
        ...svgoConfig,
        path: id,
      });
      optimizedSvgs.push({ id, optimizedSvg });
      /**
       * @type {import('@svgr/core').Config}
       * */
      const svgrConfig = {
        typescript: true,
        prettier: true,
        plugins: ["@svgr/plugin-jsx"],
      };

      const jsCode = await transform(optimizedSvg, svgrConfig, { componentName: iconName });
      return {
        code: jsCode,
      };
    },
    buildEnd() {
      optimizedSvgs.forEach(({ id, optimizedSvg }) => {
        this.emitFile({
          type: "asset",
          fileName: `svg/${path.basename(id)}`,
          source: optimizedSvg,
        });
      });
    },
  };
}

function customTypesRollupPlugin({ fileName, source }) {
  return {
    name: "custom-types",
    buildEnd() {
      if (source.length === 0) {
        this.warn("source content is empty");
      }

      this.emitFile({ type: "asset", fileName, source });
    },
  };
}

const manualChunks = (id) => {
  if (id.startsWith(iconBasePath)) {
    return id.replace(iconBasePath, "icons/");
  }
};

const interop = (id) => {
  return id === "react" ? "esModule" : "auto";
};

/**
 * @type {import('rollup').RollupOptions}
 * */
const config = [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        manualChunks,
        interop,
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name].mjs",
        manualChunks,
        interop,
      },
    ],
    external: ["react"],
    plugins: [
      virtual({ "src/index.ts": iconExports.join("\n") }),
      customSvgoRollupPlugin(),
      babel({
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env",
          [
            "@babel/preset-react",
            {
              useBuiltIns: true,
            },
          ],
          [
            "@babel/preset-typescript",
            {
              isTSX: true,
              allExtensions: true,
            },
          ],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
        babelHelpers: "bundled",
      }),
      customTypesRollupPlugin({ fileName: "index.d.ts", source: iconTypes.join("\n") }),
    ],
  },
  {
    input: "src/metadata.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "[name].js",
        exports: "default",
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].mjs",
      },
    ],
    plugins: [
      virtual({
        "src/metadata.ts": metadataContent,
      }),
      customTypesRollupPlugin({ fileName: `metadata.d.ts`, source: metadataTypes }),
    ],
  },
];
export default config;
