import uglifyjs from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import jsx from "rollup-plugin-jsx";
import fs from "fs";
import path from "path";

const themes = JSON.parse(fs.readFileSync("./src/themes/themes.json", "utf8"));

const index = path.join(__dirname, "src/index.js");
const plugin = cur => ({
  name: "themeImporter",
  resolveId: (importee, importer) =>
    importer === index && importee === "./themes/default"
      ? path.join(__dirname, "src/themes", cur + ".js")
      : null
});

export default themes.reduce((arr, cur) => {
  console.log(cur);

  const cfg = {
    input: "src/index.js",
    output: {
      name: "easyIO",
      format: "umd",
      file: `build/easy-io-${cur}.js`,
      intro: `/* @legume @preserve
 * @name easyIO
 * @author coolreader18
 */`
    },
    plugins: [
      plugin(cur),
      resolve(),
      jsx({ factory: "jsx", arrayChildren: false })
    ]
  };
  return arr.concat([
    cfg,
    {
      ...cfg,
      output: {
        ...cfg.output,
        file: `build/easy-io-${cur}.min.js`
      },
      plugins: [
        ...cfg.plugins,
        uglifyjs({
          output: {
            comments: "some"
          }
        })
      ]
    }
  ]);
}, []);
