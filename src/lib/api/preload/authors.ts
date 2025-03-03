import { Author } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";

export async function addAuthor(author: Author) {
  return await ipcRenderer.invoke("author:create", author);
}
export async function getAllAuthors() {
  return await ipcRenderer.invoke("author:get-all");
}
