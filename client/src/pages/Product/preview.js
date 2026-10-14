// Tiny in-browser bundler for the generated project: compiles every JS/JSX file
// with Babel (ES modules -> CommonJS), then runs them inside a sandboxed iframe
// with React loaded from a CDN. No third-party bundler service involved.

const REACT_CDN = "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js";
const REACT_DOM_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js";

const SKIP = new Set(["/index.js", "/package.json", "/index.html", "/public/index.html"]);

let babelPromise;
const loadBabel = () => (babelPromise ??= import("@babel/standalone"));

// "</script" inside a script body would end the tag early
const safe = (code) => code.replace(/<\/(script)/gi, "<\\/$1");

export async function buildPreviewDoc(files) {
  const mod = await loadBabel();
  const Babel = mod.default?.transform ? mod.default : mod;
  const entries = Object.entries(files).filter(([path]) => !SKIP.has(path));

  const defs = [];
  const css = [];
  const paths = [];

  for (const [path, file] of entries) {
    const code = typeof file === "string" ? file : file.code;
    if (path.endsWith(".css")) {
      css.push(code);
    } else if (path.endsWith(".js") || path.endsWith(".jsx")) {
      let out;
      try {
        out = Babel.transform(code, {
          filename: path,
          sourceType: "module",
          presets: [["react", { runtime: "classic" }]],
          plugins: ["transform-modules-commonjs"],
        }).code;
      } catch (error) {
        throw new Error(`${path}\n${error.message}`);
      }
      paths.push(path);
      defs.push(
        `${JSON.stringify(path)}: function (module, exports, require, React) {\n${out}\n}`,
      );
    } else if (path.endsWith(".json")) {
      paths.push(path);
      defs.push(`${JSON.stringify(path)}: function (module) { module.exports = ${code}; }`);
    }
  }

  if (!paths.includes("/App.js") && !paths.includes("/App.jsx")) {
    throw new Error("Project has no /App.js yet");
  }

  const runtime = `
    var defs = {\n${defs.join(",\n")}\n};
    var cache = {};
    var show = function (msg) {
      var el = document.getElementById("__err");
      el.style.display = "block";
      el.textContent = msg;
    };
    window.addEventListener("error", function (e) { show(String(e.message)); });
    function resolve(from, name) {
      var base = from.slice(0, from.lastIndexOf("/")) || "";
      var parts = (name.charAt(0) === "/" ? name : base + "/" + name).split("/");
      var out = [];
      parts.forEach(function (p) {
        if (p === "..") out.pop(); else if (p && p !== ".") out.push(p);
      });
      var full = "/" + out.join("/");
      var tries = [full, full + ".js", full + ".jsx", full + "/index.js", full + "/index.jsx"];
      for (var i = 0; i < tries.length; i++) if (defs[tries[i]]) return tries[i];
      return null;
    }
    function load(path) {
      if (cache[path]) return cache[path].exports;
      var m = (cache[path] = { exports: {} });
      defs[path](m, m.exports, function (name) { return req(path, name); }, React);
      return m.exports;
    }
    function req(from, name) {
      if (name === "react") return React;
      if (name === "react-dom" || name === "react-dom/client") return ReactDOM;
      if (/\\.(css|svg|png|jpe?g|gif|webp)$/.test(name)) return {};
      var p = resolve(from, name);
      if (!p) throw new Error('Cannot find module "' + name + '" imported from ' + from);
      return load(p);
    }
    try {
      var entry = defs["/App.js"] ? "/App.js" : "/App.jsx";
      var mod = load(entry);
      var App = mod.default || mod;
      ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
    } catch (e) {
      show(e && e.stack ? e.stack : String(e));
    }
  `;

  return `<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>html,body{margin:0}*,*::before,*::after{box-sizing:border-box}</style>
<style>${safe(css.join("\n"))}</style>
<style>#__err{display:none;position:fixed;inset:0;z-index:99999;margin:0;padding:20px;overflow:auto;background:#1a0f12;color:#ffb4a8;font:13px/1.55 ui-monospace,Consolas,monospace;white-space:pre-wrap}</style>
</head>
<body>
<div id="root"></div>
<pre id="__err"></pre>
<script src="${REACT_CDN}"></script>
<script src="${REACT_DOM_CDN}"></script>
<script>
${safe(runtime)}
</script>
</body>
</html>`;
}
