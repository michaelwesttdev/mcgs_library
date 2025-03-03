import { Category } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";

export async function getAllCategories() {
  return await ipcRenderer.invoke("category:get-all");
}
export async function addCategory(category: Category) {
  return await ipcRenderer.invoke("category:create", category);
}
