const path = require("path");
const http = require("http");
const { parse } = require("url");
const { app, BrowserWindow, dialog, shell } = require("electron");
const next = require("next");

const HOST = "127.0.0.1";
const PORT = 3210;
const BASE_PATH = "/sislabs/";
const isDev = process.argv.includes("--dev") || !app.isPackaged;

let mainWindow = null;
let nodeServer = null;
let nextApp = null;

async function startNextServer() {
  const appDir = path.resolve(__dirname, "..");

  nextApp = next({
    dev: isDev,
    dir: appDir,
    hostname: HOST,
    port: PORT,
  });

  await nextApp.prepare();
  const handler = nextApp.getRequestHandler();

  nodeServer = http.createServer((req, res) => {
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
