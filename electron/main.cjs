const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const { parse } = require("url");
const { app, BrowserWindow, dialog, shell } = require("electron");
const next = require("next");

const HOST = "localhost";
const PORT = 3210;
const BASE_PATH = "/sislabs/";
const isDev = process.argv.includes("--dev") || !app.isPackaged;

function loadRuntimeEnvFiles() {
  const envCandidates = [
    path.resolve(__dirname, "..", ".env.production"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const envPath of envCandidates) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const raw = fs.readFileSync(envPath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function applyInsecureTlsOverrideIfEnabled() {
  const allowInsecureTls =
    String(process.env.API_PROXY_ALLOW_INSECURE_TLS || "").toLowerCase() ===
    "true";

  if (allowInsecureTls && process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.warn(
      "[SisLabs] API_PROXY_ALLOW_INSECURE_TLS=true: TLS certificate verification disabled for proxy requests.",
    );
  }
}

function isInsecureTlsAllowed() {
  return (
    String(process.env.API_PROXY_ALLOW_INSECURE_TLS || "").toLowerCase() ===
    "true"
  );
}

function getApiProxyTarget() {
  return process.env.API_PROXY_TARGET || "";
}

function shouldProxyApiRequest(urlPath) {
  return typeof urlPath === "string" && urlPath.startsWith(`${BASE_PATH}api/`);
}

function joinPath(basePath, suffixPath) {
  const left = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const right = suffixPath.startsWith("/") ? suffixPath : `/${suffixPath}`;
  return `${left}${right}`;
}

function proxyApiRequest(req, res) {
  const rawTarget = getApiProxyTarget();

  if (!rawTarget) {
    res.statusCode = 500;
    res.end("API_PROXY_TARGET is not configured.");
    return;
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawTarget);
  } catch {
    res.statusCode = 500;
    res.end("API_PROXY_TARGET is invalid.");
    return;
  }

  const incomingUrl = new URL(req.url, `http://${HOST}:${PORT}`);
  const suffixPath = incomingUrl.pathname.replace(`${BASE_PATH}api`, "");
  const targetPath = `${joinPath(targetUrl.pathname, suffixPath)}${incomingUrl.search}`;

  const headers = { ...req.headers };
  delete headers.host;
  delete headers.origin;
  delete headers.referer;

  const requestOptions = {
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
    path: targetPath,
    method: req.method,
    headers,
    rejectUnauthorized: !isInsecureTlsAllowed(),
  };

  const transport = targetUrl.protocol === "https:" ? https : http;
  const upstreamReq = transport.request(requestOptions, (upstreamRes) => {
    res.writeHead(upstreamRes.statusCode || 500, upstreamRes.headers);
    upstreamRes.pipe(res);
  });

  upstreamReq.on("error", (error) => {
    console.error("[SisLabs] API proxy error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  });

  req.pipe(upstreamReq);
}

let mainWindow = null;
let nodeServer = null;
let nextApp = null;

async function startNextServer() {
  const appDir = path.resolve(__dirname, "..");

  loadRuntimeEnvFiles();

  // Applies when env vars are provided by shell.
  applyInsecureTlsOverrideIfEnabled();

  nextApp = next({
    dev: isDev,
    dir: appDir,
    hostname: HOST,
    port: PORT,
  });

  await nextApp.prepare();

  // Re-applies after Next loads .env into process.env.
  applyInsecureTlsOverrideIfEnabled();

  const handler = nextApp.getRequestHandler();

  nodeServer = http.createServer((req, res) => {
    if (shouldProxyApiRequest(req.url)) {
      proxyApiRequest(req, res);
      return;
    }

    const parsedUrl = parse(req.url, true);
    handler(req, res, parsedUrl);
  });

  await new Promise((resolve, reject) => {
    nodeServer.once("error", reject);
    nodeServer.listen(PORT, HOST, () => resolve());
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`http://${HOST}:${PORT}${BASE_PATH}`);
}

async function stopNextServer() {
  if (nodeServer) {
    await new Promise((resolve) => nodeServer.close(() => resolve()));
    nodeServer = null;
  }
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    dialog.showErrorBox("SisLabs Electron Startup Error", message);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", async (event) => {
  event.preventDefault();
  await stopNextServer();
  app.exit();
});
