import { SQLiteDBOperations } from "@/lib/db";
import { db as instance } from "@/lib/db/sqlite/db";
import {
  Author,
  BookCopy,
  Category,
  Class,
  MainBook,
  Staff,
  Student,
} from "@/lib/types/db_entities";
import { ipcMain } from "electron";

const db = new SQLiteDBOperations(instance);
function students() {
  ipcMain.handle("student:create", async (event, args: Student) => {
    try {
      if (await db.addStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("student:update", async (event, args: Student) => {
    try {
      if (await db.updateStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("student:delete", async (event, args: { id: string }) => {
    try {
      if (await db.deleteStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("student:get-all", async (event, args: Student) => {
    try {
      return await db.getAllStudents();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("student:get-one", async (event, args: { id: string }) => {
    try {
      return await db.getAStudent(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
function categories() {
  ipcMain.handle("category:create", async (event, args: Category) => {
    try {
      if (await db.addCategory(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("category:update", async (event, args: Student) => {
    try {
      if (await db.updateStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("category:delete", async (event, args: { id: string }) => {
    try {
      if (await db.deleteStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("category:get-all", async (event, args: Category) => {
    try {
      return await db.getCategories();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("category:get-one", async (event, args: { id: string }) => {
    try {
      return await db.getAStudent(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
function authors() {
  ipcMain.handle("author:create", async (event, args: Author) => {
    try {
      if (await db.addAuthor(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("author:update", async (event, args: Student) => {
    try {
      if (await db.updateStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("author:delete", async (event, args: { id: string }) => {
    try {
      if (await db.deleteStudent(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("author:get-all", async (event, args: Author) => {
    try {
      return await db.getAuthors();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("author:get-one", async (event, args: { id: string }) => {
    try {
      return await db.getAStudent(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
function staff() {
  ipcMain.handle("staff:create", async (event, args: Staff) => {
    try {
      if (await db.createStaff(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("staff:update", async (event, args: Staff) => {
    try {
      if (await db.updateStaff(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("staff:delete", async (event, args: { id: string }) => {
    try {
      if (await db.deleteStaff(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("staff:get-all", async (event, args: Staff) => {
    try {
      return await db.getAllStaff();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("staff:get-one", async (event, args: { id: string }) => {
    try {
      return await db.getAStaff(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
function books() {
  ipcMain.handle(
    "book:create",
    async (event, args: MainBook & { copies: number }) => {
      try {
        if (await db.addBook(args)) return true;
        else return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  ipcMain.handle("book:update", async (event, args: MainBook) => {
    try {
      if (await db.updateBook(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle(
    "book:lend",
    async (event, args: BookCopy & { borrowerId: string; dueDate: Date }) => {
      try {
        if (await db.lendBook(args)) return true;
        else return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  );
  ipcMain.handle("book:return", async (event, args: string) => {
    try {
      if (await db.returnBook(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("book:get-all", async (event, args: Student) => {
    try {
      return await db.getBooks();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("book:get-overdue", async (event, args?: string) => {
    try {
      return await db.getOverdueBooks(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("book:get-one", async (event, args: { bookId: string }) => {
    try {
      return await db.getBookDetails(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
function classes() {
  ipcMain.handle("class:create", async (event, args: Class) => {
    try {
      const cl = await db.addClass(args);
      if (cl.classId) return cl;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("class:update", async (event, args: Class) => {
    try {
      if (await db.updateClass(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("class:delete", async (event, args: { id: string }) => {
    try {
      if (await db.deleteClass(args)) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  ipcMain.handle("class:get-all", async (event, args: any) => {
    try {
      return await db.getAllClasses();
    } catch (error) {
      console.log(error);
      return null;
    }
  });
  ipcMain.handle("class:get-one", async (event, args: { id: string }) => {
    try {
      return await db.getAClass(args);
    } catch (error) {
      console.log(error);
      return null;
    }
  });
}
export function registerMainApi() {
  students();
  books();
  classes();
  staff();
  categories();
  authors();
}
