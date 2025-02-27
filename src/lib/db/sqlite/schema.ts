import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

//book table
export const mainBooks = sqliteTable("main_books", {
  bookId: text().primaryKey().unique(),
  title: text("title", { length: 255 }).notNull(),
  author: text("author")
    .notNull()
    .references(() => authors.authorId),
  isbn: text("isbn", { length: 13 }).notNull().unique(),
  publisher: text("publisher", { length: 255 }),
  publishedYear: int("published_year"),
  category: text("category", { length: 100 })
    .notNull()
    .references(() => categories.id),
  language: text("language", { length: 50 }),
});

//authors table
export const authors = sqliteTable("authors", {
  authorId: text().primaryKey().unique(),
  name: text("name", { length: 255 }).notNull(),
});
//categories table
export const categories = sqliteTable("categories", {
  id: text().primaryKey().unique(),
  name: text("title", { length: 255 }).notNull(),
  description: text("description", { length: 255 }),
});

//book_copies table
export const bookCopies = sqliteTable("book_copies", {
  copyId: text("copy_id").primaryKey().unique(),
  bookId: text("book_id")
    .notNull()
    .references(() => mainBooks.bookId),
  status: text("status", { length: 50 }).default("available"),
  copyNumber: int("copy_number").unique(),
});

//borrowings table
export const borrowings = sqliteTable("borrowings", {
  borrowingId: text("borrowing_id").primaryKey().unique(),
  bookCopyId: text("book_copy_id")
    .notNull()
    .references(() => bookCopies.copyId),
  borrowerId: text("borrower_id")
    .notNull()
    .references(() => students.studentId),
  borrowDate: text("borrow_date").default(
    new Date().toISOString().slice(0, 10)
  ),
  returnDate: text("return_date"),
  dueDate: text("due_date").default(new Date().toISOString().slice(0, 10)),
  isReturned: int("is_returned").default(0),
});

//students table
export const students = sqliteTable("students", {
  studentId: text("student_id").primaryKey().unique(),
  firstName: text("name", { length: 255 }).notNull(),
  lastName: text("name", { length: 255 }).notNull(),
  classId: text("class_id")
    .notNull()
    .references(() => classes.classId),
});

//teachers table

export const teachers = sqliteTable("teachers", {
  teacherId: text("teacher_id").primaryKey().unique(),
  firstName: text("name", { length: 255 }).notNull(),
  lastName: text("name", { length: 255 }).notNull(),
  prefix: text("prefix", { length: 50 }).default("Mr."),
  classId: text("class_id").references(() => classes.classId),
});

//class_teachers table
export const classes = sqliteTable("class_teacher_assignment", {
  classId: text("class_id").notNull().unique().primaryKey(),
  academicLevel: int("academic_level").default(1),
  class: text("class", { length: 50 }),
});
