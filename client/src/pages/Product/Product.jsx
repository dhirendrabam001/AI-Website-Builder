import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import JSZip from "jszip";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackFileExplorer,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ClipboardList,
  Code2,
  Download,
  Eye,
  Monitor,
  RefreshCw,
  Rocket,
  Save,
  ShieldCheck,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
} from "lucide-react";
import { PROJECT_API_END_POINT } from "../../apis/apis";
import { setUser } from "../../redux/authSlice";
import { buildPreviewDoc } from "./preview";
import "./Product.css";

// the agents the server runs, in order (ids match the events it streams)
const AGENTS = [
  { id: "planner", label: "Planner", working: "Planning design & files", Icon: ClipboardList },
  { id: "builder", label: "Builder", working: "Writing React code", Icon: Code2 },
  { id: "reviewer", label: "Reviewer", working: "Checking for errors", Icon: ShieldCheck },
];
const AI_TIMEOUT = 240000;
const MAX_MESSAGE = 20000;

const DEVICES = [
  { id: "desktop", label: "Desktop", Icon: Monitor },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "mobile", label: "Mobile", Icon: Smartphone },
];

// files the Sandpack template owns — never saved or exported as project files
const RUNTIME_FILES = new Set([
  "/index.js",
  "/package.json",
  "/index.html",
  "/public/index.html",
]);

const api = axios.create({
  baseURL: PROJECT_API_END_POINT,
  withCredentials: true,
  timeout: AI_TIMEOUT,
});

// POST that reads the server's event stream: agent steps arrive live, then the
// final result. Errors are shaped like axios errors so `call` handles both alike.
async function streamPost(path, body, onAgent) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT);
  const fail = (status, message, code) =>
    Object.assign(new Error(message), { code, response: { status, data: { message } } });

  try {
    let res;
    try {
      res = await fetch(`${PROJECT_API_END_POINT}${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      throw fail(0, "", err.name === "AbortError" ? "ECONNABORTED" : "ERR_NETWORK");
    }

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      throw fail(res.status, data.message);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let outcome = null;

    while (!outcome) {
      const { value, done } = await reader.read().catch(() => ({ done: true }));
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop();
      for (const frame of frames) {
        const event = /^event: (.+)$/m.exec(frame)?.[1];
        const data = /^data: (.+)$/m.exec(frame)?.[1];
        if (!event || !data) continue;
        const payload = JSON.parse(data);
        if (event === "agent") onAgent?.(payload);
        else outcome = { event, payload };
      }
    }

    if (!outcome) throw fail(0, "The connection was interrupted. Please try again.");
    if (outcome.event === "failure") {
      throw fail(outcome.payload.status, outcome.payload.message);
    }
    return { data: { data: outcome.payload.data } };
  } finally {
    clearTimeout(timer);
  }
}

const slugOf = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "mysite";

const byPath = (a, b) => a.path.localeCompare(b.path);

const toSandpackFiles = (files) =>
  Object.fromEntries(files.map((f) => [f.path, { code: f.content }]));

// A runnable Vite project, so "Export" gives code you can `npm install && npm run dev`.
async function buildZip(files, name) {
  const zip = new JSZip();
  const root = zip.folder(name);
  root.file(
    "package.json",
    JSON.stringify(
      {
        name,
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
        dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" },
        devDependencies: { "@vitejs/plugin-react": "^4.3.4", vite: "^5.4.11" },
      },
      null,
      2,
    ),
  );
  root.file(
    "vite.config.js",
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// components are written as .js files that contain JSX
export default defineConfig({
  plugins: [react({ include: /\\.(js|jsx)$/ })],
  esbuild: { loader: "jsx", include: /src\\/.*\\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { ".js": "jsx" } } },
});
`,
  );
  root.file(
    "index.html",
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
  );
  root.file(
    "src/main.jsx",
    `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
`,
  );
  for (const f of files) root.file(`src${f.path}`, f.content);
  if (!files.some((f) => f.path === "/styles.css")) root.file("src/styles.css", "");
  return zip.generateAsync({ type: "blob" });
}

export default function Product() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [project, setProject] = useState(null);
  const [prompt, setPrompt] = useState(state?.prompt?.trim() || "");
  const [pending, setPending] = useState(""); // user message while the AI works
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]); // live steps from the server
  const [tab, setTab] = useState("preview");
  const [device, setDevice] = useState("desktop");
  const [dirty, setDirty] = useState(false);
  const [rev, setRev] = useState(0); // bump to remount the editor with new files

  const started = useRef(false);
  const chatEnd = useRef(null);
  const editorFiles = useRef(null); // set by <EditorBridge/>

  const hasInput = Boolean(state?.prompt?.trim() || state?.projectId);
  const ready = Boolean(project) && !busy;
  const canUndo = ready && (project?.versions?.length ?? 0) > 1;

  const applyProject = useCallback((p) => {
    setProject(p);
    setPrompt(p.prompt);
    setDirty(false);
    setRev((r) => r + 1);
  }, []);

  const syncCredits = useCallback(
    (aiCredits) => {
      if (user && typeof aiCredits === "number") {
        dispatch(setUser({ ...user, aiCredits }));
      }
    },
    [user, dispatch],
  );

  // One place for every API call: busy state, 401 -> login, no credits, errors.
  const call = useCallback(
    async (request, { onSuccess, quiet = false } = {}) => {
      setBusy(true);
      setError("");
      setAgents([]);
      try {
        const res = await request();
        onSuccess?.(res.data.data);
        return true;
      } catch (err) {
        const status = err.response?.status;
        const message =
          err.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "The AI took too long. Please try again."
            : "Something went wrong. Please try again.");
        if (status === 401) {
          toast.info("Please sign in to build your website");
          navigate("/login", { replace: true, state: { from: "/product", prompt } });
          return false;
        }
        if (quiet) toast.error(message);
        else setError(message);
        return false;
      } finally {
        setBusy(false);
        setPending("");
      }
    },
    [navigate, prompt],
  );

  const onAgent = useCallback((event) => {
    setAgents((list) => {
      const next = list.filter((a) => a.agent !== event.agent);
      next.push(event);
      return next;
    });
  }, []);

  const generate = useCallback(
    (promptText) => {
      setPending(promptText);
      return call(() => streamPost("/generate", { prompt: promptText }, onAgent), {
        onSuccess: ({ project: p, aiCredits }) => {
          applyProject(p);
          syncCredits(aiCredits);
          // a refresh now reopens this project instead of spending another credit
          navigate(".", { replace: true, state: { projectId: p.id } });
        },
      });
    },
    [call, applyProject, syncCredits, navigate, onAgent],
  );

  // First load: open a saved project, or build from the home-page prompt.
  useEffect(() => {
    if (started.current || !hasInput) return;
    started.current = true;
    if (state.projectId) {
      call(() => api.get(`/${state.projectId}`), {
        onSuccess: ({ project: p }) => applyProject(p),
      });
    } else {
      generate(state.prompt.trim());
    }
  }, [hasInput, state, call, generate, applyProject]);

  const messages = useMemo(() => {
    const list = project ? [...project.messages] : [];
    if (pending) list.push({ role: "user", content: pending });
    return list;
  }, [project, pending]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, busy]);

  if (!hasInput) return <Navigate to="/" replace />;

  const send = async (e) => {
    e?.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    if (!project) {
      toast.error("Wait for the first version to finish");
      return;
    }
    if (dirty) {
      toast.info("Save or undo your manual edits first");
      return;
    }
    setText("");
    setPending(message);
    const ok = await call(() => streamPost(`/${project.id}/chat`, { message }, onAgent), {
      quiet: true,
      onSuccess: ({ project: p, aiCredits }) => {
        applyProject(p);
        syncCredits(aiCredits);
      },
    });
    if (!ok) setText(message);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) send(e);
  };

  const undo = () => {
    const index = project.versions.length - 2;
    call(() => api.post(`/${project.id}/revert`, { index }), {
      quiet: true,
      onSuccess: ({ project: p }) => applyProject(p),
    });
  };

  const saveEdits = () => {
    const files = editorFiles.current?.() || [];
    call(() => api.put(`/${project.id}/files`, { files }), {
      quiet: true,
      onSuccess: ({ project: p }) => {
        applyProject(p);
        toast.success("Changes saved");
      },
    });
  };

  const exportZip = async () => {
    try {
      const files = editorFiles.current?.() || project.files;
      const name = slugOf(project.title);
      const blob = await buildZip(files, name);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not export the project");
    }
  };

  const current = agents.find((a) => a.status === "running");
  const activityLabel = current
    ? AGENTS.find((a) => a.id === current.agent)?.working
    : "Starting the agents";
  const sandpackFiles = project ? toSandpackFiles(project.files) : null;

  return (
    <section className="product">
      <div className="glow glow-blue pd-glow-a" />
      <div className="glow glow-violet pd-glow-b" />
      <div className="grid-bg" />

      <div className="shell pd-shell">
        <motion.div
          className="pd-top"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="pd-back">
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="badge-pill">
            <Sparkles size={14} />
            {error && !project
              ? "Something went wrong"
              : busy
                ? "AI is working"
                : "Your project is ready"}
          </span>
        </motion.div>

        <div className="pd-grid">
          {/* ---------- left: agent chat ---------- */}
          <motion.aside
            className="pd-side pd-chat card-ai"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div className="pd-chat-head">
              <span className="eyebrow">AI Agent</span>
              {typeof user?.aiCredits === "number" && (
                <span className="pd-credits mono">{user.aiCredits} credits</span>
              )}
            </div>

            <div className="pd-msgs" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`pd-msg is-${m.role}`}>
                  {m.role === "assistant" && (
                    <span className="pd-avatar">
                      <Sparkles size={13} />
                    </span>
                  )}
                  <p>{m.content}</p>
                </div>
              ))}

              {busy && <AgentTimeline agents={agents} />}

              {error && (
                <div className="pd-msg is-error">
                  <AlertTriangle size={15} />
                  <p>{error}</p>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            <form className="pd-compose" onSubmit={send}>
              <div className="pd-refine-box">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    ready
                      ? "Ask for a change, or paste code to convert…"
                      : "Waiting for the first version…"
                  }
                  aria-label="Message the AI agent"
                  maxLength={MAX_MESSAGE}
                  rows={2}
                  disabled={!ready}
                />
                <button type="submit" disabled={!ready || !text.trim()} aria-label="Send">
                  <Send size={16} />
                </button>
              </div>
              <span className="pd-hint">Enter to send · Shift+Enter for a new line</span>
            </form>
          </motion.aside>

          {/* ---------- right: preview / code ---------- */}
          <motion.div
            className="pd-stage card-ai"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <div className="pd-toolbar">
              <div className="pd-seg" role="tablist" aria-label="View">
                <button
                  role="tab"
                  aria-selected={tab === "preview"}
                  className={tab === "preview" ? "is-on" : ""}
                  onClick={() => setTab("preview")}
                >
                  <Eye size={15} /> <span>Preview</span>
                </button>
                <button
                  role="tab"
                  aria-selected={tab === "code"}
                  className={tab === "code" ? "is-on" : ""}
                  onClick={() => setTab("code")}
                >
                  <Code2 size={15} /> <span>Code</span>
                </button>
              </div>

              {tab === "preview" && (
                <div className="pd-devices pd-hide-xs" role="tablist" aria-label="Preview size">
                  {DEVICES.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={device === id}
                      aria-label={label}
                      className={device === id ? "is-on" : ""}
                      onClick={() => setDevice(id)}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              )}

              <div className="pd-tools">
                {dirty && (
                  <button
                    className="btn-ai btn-primary-ai btn-sm-ai"
                    disabled={busy}
                    onClick={saveEdits}
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                )}
                <button
                  className="btn-ai btn-ghost-ai btn-sm-ai"
                  disabled={!canUndo}
                  onClick={undo}
                >
                  <Undo2 size={14} />
                  <span>Undo</span>
                </button>
                <button
                  className="btn-ai btn-ghost-ai btn-sm-ai"
                  disabled={!ready}
                  onClick={exportZip}
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
                <button
                  className="btn-ai btn-ghost-ai btn-sm-ai pd-hide-sm"
                  disabled={!ready}
                  onClick={() => toast.info("Publishing is coming soon")}
                >
                  <Rocket size={14} />
                  <span>Publish</span>
                </button>
              </div>
            </div>

            <div className="pd-canvas">
              <div
                className={`pd-device ${tab === "preview" ? `dev-${device}` : "dev-code"}`}
              >
                <div className="dash-bar">
                  <span className="dot dot-r" />
                  <span className="dot dot-y" />
                  <span className="dot dot-g" />
                  <span className="dash-url pd-url">
                    {slugOf(project?.title || prompt)}.aibuilder.app
                  </span>
                </div>

                <div className={`pd-view show-${tab}`}>
                  {sandpackFiles && (
                    <SandpackProvider
                      key={rev}
                      template="react"
                      theme="dark"
                      files={sandpackFiles}
                      options={{ activeFile: "/App.js", recompileMode: "delayed", recompileDelay: 600 }}
                    >
                      <EditorBridge
                        baseline={project.files}
                        filesRef={editorFiles}
                        onDirty={setDirty}
                      />
                      <div className="pd-pane pd-pane-preview">
                        <LivePreview />
                      </div>
                      <div className="pd-pane pd-pane-code">
                        <SandpackFileExplorer
                          style={{ height: "100%", width: 190, flex: "none" }}
                        />
                        <SandpackCodeEditor
                          showTabs
                          showLineNumbers
                          wrapContent
                          style={{ height: "100%", flex: 1, minWidth: 0 }}
                        />
                      </div>
                    </SandpackProvider>
                  )}

                  <AnimatePresence>
                    {busy && (
                      <motion.div
                        key="loading"
                        className={`pd-loading ${project ? "is-overlay" : ""}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="pd-orb">
                          <Sparkles size={26} />
                        </div>
                        <strong>{activityLabel}…</strong>
                        <span className="muted-3">This can take up to a minute</span>
                        {!project && (
                          <div className="pd-ghost">
                            <i className="sk" style={{ width: "42%", height: 10 }} />
                            <i className="sk sk-grad" style={{ width: "78%", height: 26 }} />
                            <i className="sk" style={{ width: "60%", height: 10 }} />
                            <div className="pd-ghost-row">
                              <i className="sk" />
                              <i className="sk" />
                              <i className="sk" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && !busy && !project && (
                    <div className="pd-loading pd-error">
                      <div className="pd-orb pd-orb-err">
                        <AlertTriangle size={26} />
                      </div>
                      <strong>{error}</strong>
                      <button
                        className="btn-ai btn-primary-ai btn-sm-ai"
                        onClick={() => generate(prompt)}
                      >
                        <RefreshCw size={14} /> Try again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Lives inside <SandpackProvider>: compiles the editor's current files and
// shows them in a sandboxed iframe (no allow-same-origin: the generated code
// can't reach our cookies or storage). Re-runs shortly after every edit.
function LivePreview() {
  const { sandpack } = useSandpack();
  const [doc, setDoc] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let stale = false;
    const t = setTimeout(async () => {
      try {
        const html = await buildPreviewDoc(sandpack.files);
        if (!stale) {
          setDoc(html);
          setProblem("");
        }
      } catch (error) {
        if (!stale) setProblem(error.message);
      }
    }, 400);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [sandpack.files]);

  return (
    <div className="pd-live">
      {doc && (
        <iframe
          className="pd-frame"
          title="Website preview"
          sandbox="allow-scripts"
          srcDoc={doc}
        />
      )}
      {problem && <pre className="pd-live-err">{problem}</pre>}
    </div>
  );
}

// Lives inside <SandpackProvider>: exposes the editor's current files to the
// page (for Save / Export) and reports whether they differ from what's saved.
function EditorBridge({ baseline, filesRef, onDirty }) {
  const { sandpack } = useSandpack();

  const current = useMemo(
    () =>
      Object.entries(sandpack.files)
        .filter(([path]) => !RUNTIME_FILES.has(path))
        .map(([path, f]) => ({ path, content: f.code }))
        .sort(byPath),
    [sandpack.files],
  );

  const dirty = useMemo(() => {
    const saved = [...baseline].sort(byPath);
    // template defaults (e.g. /styles.css) may exist only in the editor
    const extra = current.filter((c) => !saved.some((s) => s.path === c.path));
    const changed = saved.some(
      (s) => current.find((c) => c.path === s.path)?.content !== s.content,
    );
    return changed || extra.some((e) => e.content.trim() !== "" && !isTemplateFile(e));
  }, [current, baseline]);

  useEffect(() => {
    filesRef.current = () => current;
  }, [current, filesRef]);

  useEffect(() => {
    onDirty(dirty);
  }, [dirty, onDirty]);

  return null;
}

// files Sandpack's react template adds on its own, which the AI may not have written
const isTemplateFile = (f) => f.path === "/styles.css";

// Live "who is doing what" list — one row per agent, filled in by server events.
function AgentTimeline({ agents }) {
  return (
    <div className="pd-agents" aria-live="polite">
      {AGENTS.map(({ id, label, working, Icon }) => {
        const event = agents.find((a) => a.agent === id);
        const status = event?.status || "waiting";
        return (
          <div key={id} className={`pd-agent is-${status}`}>
            <span className="pd-agent-icon">
              {status === "running" ? (
                <span className="pd-spin" />
              ) : status === "done" ? (
                <Check size={14} />
              ) : (
                <Icon size={14} />
              )}
            </span>
            <div className="pd-agent-body">
              <strong>{label}</strong>
              <span>
                {status === "running"
                  ? `${working}…`
                  : status === "waiting"
                    ? "Waiting"
                    : event.detail}
              </span>
              {status === "done" && event.items?.length > 0 && (
                <ul>
                  {event.items.slice(0, 6).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
