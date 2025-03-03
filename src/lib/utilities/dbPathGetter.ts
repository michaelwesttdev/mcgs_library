import { app } from "electron";
import path from "path";
import fs from "fs";

export function getDBUrl() {
  const isProduction = process.env.NODE_ENV === "production";
  const docPath = app.getPath("documents");
  /* docPath = "C:/users/mike/documents" */
  const appDataPath = path.join(docPath, "mcs", "mcsLibrary");
  /* appDataPath = "C:/users/mike/documents/mcs/mcslibrary" */
  const dbFilePath = path.join(appDataPath, "mcsLibrary.db");
  /* appDataPath = "C:/users/mike/documents/mcs/mcslibrary/mcsLibrary.db" */
  if (!fs.existsSync(dbFilePath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }
  return isProduction ? dbFilePath : "./testDb.db";
}
