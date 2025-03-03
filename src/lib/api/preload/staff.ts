import { Staff } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";
export async function addStaff(staff: Staff) {
  return await ipcRenderer.invoke("staff:create", staff);
}
export async function updateStaff(staff: Staff) {
  return await ipcRenderer.invoke("staff:update", staff);
}
export async function deleteStaff(args: { id: string }) {
  return await ipcRenderer.invoke("staff:delete", args);
}
export async function getAllStaff() {
  return await ipcRenderer.invoke("staff:get-all");
}
export async function getAStaff(args: { id: string }) {
  return await ipcRenderer.invoke("staff:get-one", args);
}
