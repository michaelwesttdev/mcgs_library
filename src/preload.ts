// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {
  authorApi,
  bookApi,
  categoryApi,
  classApi,
  staffApi,
  studentApi,
} from "./lib/api/preload";
import { contextBridge } from "electron";

const AppApi = {
  students: studentApi,
  classes: classApi,
  staff: staffApi,
  books: bookApi,
  authors: authorApi,
  categories: categoryApi,
};

contextBridge.exposeInMainWorld("api", AppApi);

export type IAppApi = typeof AppApi;
