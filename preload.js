const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("appMeta", {
  version: "0.1.0"
});
