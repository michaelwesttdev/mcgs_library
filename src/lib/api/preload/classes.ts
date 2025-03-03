import { Class } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";
export async function addClass(cl: Class) {
  return await ipcRenderer.invoke("class:create", cl);
}
export async function updateClass(classItem: Class) {
  return await ipcRenderer.invoke("class:update", classItem);
}
export async function deleteClass(args: { id: string }) {
  return await ipcRenderer.invoke("class:delete", args);
}
export async function getAllClasses() {
  return await ipcRenderer.invoke("class:get-all");
}
export async function getAClass(args: { id: string }) {
  return await ipcRenderer.invoke("class:get-one", args);
}
