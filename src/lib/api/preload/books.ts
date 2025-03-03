import { BookCopy, MainBook } from "@/lib/types/db_entities";
import { ipcRenderer } from "electron";
export async function addBook(book: MainBook & { copies: number }) {
  return await ipcRenderer.invoke("book:create", book);
}
export async function updateBook(book: MainBook) {
  return await ipcRenderer.invoke("book:update", book);
}
export async function deleteBook(args: { id: string }) {
  return await ipcRenderer.invoke("book:delete", args);
}
export async function lendBook(
  args: BookCopy & { borrowerId: string; dueDate: Date }
) {
  return await ipcRenderer.invoke("book:lend", args);
}
export async function returnBook(args: string) {
  return await ipcRenderer.invoke("book:return", args);
}
export async function getAllBooks() {
  return await ipcRenderer.invoke("book:get-all");
}
export async function getOverdueBooks(args?: string) {
  return await ipcRenderer.invoke("book:get-overdue", args);
}
export async function getABook(args: { bookId: string }) {
  return await ipcRenderer.invoke("book:get-one", args);
}
