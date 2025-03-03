import { Student } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";
export async function addStudent(student: Student) {
  return await ipcRenderer.invoke("student:create", student);
}
export async function updateStudent(student: Student) {
  return await ipcRenderer.invoke("student:update", student);
}
export async function deleteStudent(args: { id: string }) {
  return await ipcRenderer.invoke("student:delete", args);
}
export async function getAllStudents() {
  return await ipcRenderer.invoke("student:get-all");
}
export async function getAStudent(args: { id: string }) {
  return await ipcRenderer.invoke("student:get-one", args);
}
