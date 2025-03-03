import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./sqlite/schema";
import {
  Author,
  BookCopy,
  Category,
  Class,
  MainBook,
  Staff,
  Student,
} from "../types/db_entities";
import { nanoid } from "nanoid";
import { and, eq, lt, sql } from "drizzle-orm";

const {
  mainBooks,
  staff,
  students,
  categories,
  classes,
  bookCopies,
  borrowings,
  authors,
} = schema;
export class SQLiteDBOperations {
  private db: BetterSQLite3Database<typeof schema>;

  constructor(db: BetterSQLite3Database<typeof schema>) {
    this.db = db;
  }
  //DB Operations
  //student operations
  async addStudent(student: Student) {
    try {
      student.studentId = nanoid();
      if (!student.classId) student.classId = null;
      const stud = await this.db.insert(schema.students).values(student);
      console.log(stud);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updateStudent(student: Student) {
    await this.db
      .update(schema.students)
      .set(student)
      .where(eq(schema.students.studentId, student.studentId));
    return true;
  }
  async deleteStudent(args: { id: string }) {
    await this.db
      .delete(schema.students)
      .where(eq(schema.students.studentId, args.id));
    return true;
  }
  async getAllStudents() {
    const students = await this.db
      .select({
        studentId: schema.students.studentId,
        firstName: schema.students.firstName,
        lastName: schema.students.lastName,
        classId: schema.students.classId,
        class: schema.classes,
      })
      .from(schema.students)
      .leftJoin(
        schema.classes,
        eq(schema.students.classId, schema.classes.classId)
      );
    console.log(students);
    return students;
  }
  async getAStudent(args: { id: string }) {
    const student = await this.db.query.students.findFirst({
      where: eq(schema.students.studentId, args.id),
    });
    console.log(student);
    return student;
  }
  /* book operations */
  async getBooks() {
    try {
      const books = await this.db
        .select()
        .from(mainBooks)
        .leftJoin(authors, eq(mainBooks.author, authors.authorId))
        .leftJoin(categories, eq(mainBooks.category, categories.id));

      return books.map((book) => ({
        bookId: book.main_books.bookId,
        title: book.main_books.title,
        author: book.authors?.name || book.main_books.author,
        isbn: book.main_books.isbn,
        publisher: book.main_books.publisher,
        publishedYear: book.main_books.publishedYear,
        category: book.categories?.name || book.main_books.category,
        language: book.main_books.language,
      }));
    } catch (error) {
      console.error("Failed to fetch books:", error);
      throw new Error("Failed to fetch books");
    }
  }

  // Get book details including copies and borrowing history
  async getBookDetails(args: { bookId: string }) {
    try {
      const book = await this.db
        .select()
        .from(mainBooks)
        .where(eq(mainBooks.bookId, args.bookId))
        .leftJoin(authors, eq(mainBooks.author, authors.authorId))
        .leftJoin(categories, eq(mainBooks.category, categories.id))
        .then((rows) => rows[0]);

      if (!book) {
        throw new Error("Book not found");
      }

      const copies = await this.db
        .select()
        .from(bookCopies)
        .where(eq(bookCopies.bookId, args.bookId));

      const borrowingRecords = await this.db
        .select()
        .from(borrowings)
        .innerJoin(bookCopies, eq(borrowings.bookCopyId, bookCopies.copyId))
        .innerJoin(students, eq(borrowings.borrowerId, students.studentId))
        .where(eq(bookCopies.bookId, args.bookId));

      return {
        book: {
          bookId: book.main_books.bookId,
          title: book.main_books.title,
          author: book.authors?.name || book.main_books.author,
          isbn: book.main_books.isbn,
          publisher: book.main_books.publisher,
          publishedYear: book.main_books.publishedYear,
          category: book.categories?.name || book.main_books.category,
          language: book.main_books.language,
        },
        copies: copies.map((copy) => ({
          copyId: copy.copyId,
          bookId: copy.bookId,
          status: copy.status,
          copyNumber: copy.copyNumber,
        })),
        borrowings: borrowingRecords.map((record) => ({
          borrowingId: record.borrowings.borrowingId,
          bookCopyId: record.borrowings.bookCopyId,
          borrowerId: record.borrowings.borrowerId,
          borrowerName: `${record.students.firstName} ${record.students.lastName}`,
          borrowDate: record.borrowings.borrowDate,
          returnDate: record.borrowings.returnDate,
          dueDate: record.borrowings.dueDate,
          isReturned: record.borrowings.isReturned,
        })),
      };
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      throw new Error("Failed to fetch book details");
    }
  }

  // Add a new book
  async addBook(bookData: MainBook & { copies: number }) {
    try {
      const bookId = nanoid();

      const book = {
        bookId,
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        publishedYear: bookData.publishedYear,
        category: bookData.category,
        language: bookData.language,
      };
      // Insert book
      await this.db.insert(mainBooks).values(book);

      // Insert copies
      const copies = Array.from({ length: bookData.copies }, (_, i) => ({
        copyId: nanoid(),
        bookId,
        status: "available",
        copyNumber: i + 1,
      }));

      await this.db.insert(bookCopies).values(copies);
      return true;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw new Error("Failed to add book");
    }
  }

  // Update book details
  async updateBook(bookData: MainBook) {
    const data = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      publisher: bookData.publisher,
      publishedYear: bookData.publishedYear,
      category: bookData.category,
      language: bookData.language,
    };
    try {
      await this.db
        .update(mainBooks)
        .set(data)
        .where(eq(mainBooks.bookId, bookData.bookId));
      return { success: true };
    } catch (error) {
      console.error("Failed to update book:", error);
      throw new Error("Failed to update book");
    }
  }

  // Lend a book
  async lendBook(lendData: BookCopy & { borrowerId: string; dueDate: Date }) {
    try {
      // Check if copy is available
      const copy = await this.db
        .select()
        .from(bookCopies)
        .where(
          and(
            eq(bookCopies.copyId, lendData.copyId),
            eq(bookCopies.status, "available")
          )
        )
        .then((rows) => rows[0]);

      if (!copy) {
        throw new Error("Book copy is not available");
      }
      const bookData = {
        copyId: copy.copyId,
        bookId: lendData.bookId,
        status: "borrowed",
        copyNumber: copy.copyNumber,
      };
      // Update copy status
      await this.db
        .update(bookCopies)
        .set(bookData)
        .where(eq(bookCopies.copyId, lendData.copyId));

      // Create borrowing record
      const bRec = {
        borrowingId: nanoid(),
        bookCopyId: lendData.copyId,
        borrowerId: lendData.borrowerId,
        borrowDate: new Date().toISOString().slice(0, 10),
        dueDate: lendData.dueDate.toISOString().slice(0, 10),
        isReturned: 0,
      };
      await this.db.insert(borrowings).values(bRec);
      return true;
    } catch (error) {
      console.error("Failed to lend book:", error);
      throw new Error("Failed to lend book");
    }
  }
  async getOverdueBooks(daysFilter: string = "all") {
    const today = new Date();

    // Calculate the date threshold based on the filter
    let dateThreshold = new Date();
    if (daysFilter !== "all") {
      const daysAgo = Number.parseInt(daysFilter);
      dateThreshold = new Date(today);
      dateThreshold.setDate(today.getDate() - daysAgo);
    }
    const overdueBooks = await this.db
      .select({
        borrowingId: borrowings.borrowingId,
        copyId: bookCopies.copyId,
        bookId: mainBooks.bookId,
        title: mainBooks.title,
        author: mainBooks.author,
        borrowDate: borrowings.borrowDate,
        dueDate: borrowings.dueDate,
        studentId: students.studentId,
        studentName: sql`${students.firstName} || ' ' || ${students.lastName}`,
      })
      .from(borrowings)
      .innerJoin(bookCopies, eq(borrowings.bookCopyId, bookCopies.copyId))
      .innerJoin(mainBooks, eq(bookCopies.bookId, mainBooks.bookId))
      .innerJoin(students, eq(borrowings.borrowerId, students.studentId))
      .where(
        and(
          eq(borrowings.isReturned, 0),
          lt(borrowings.dueDate, today.toISOString().slice(0, 10)),
          daysFilter !== "all"
            ? lt(borrowings.dueDate, dateThreshold.toISOString().slice(0, 10))
            : undefined
        )
      )
      .orderBy(borrowings.dueDate);

    return overdueBooks;
  }

  // Return a book
  async returnBook(borrowingId: string) {
    try {
      // Get borrowing record
      const borrowing = await this.db
        .select()
        .from(borrowings)
        .where(eq(borrowings.borrowingId, borrowingId))
        .then((rows) => rows[0]);

      if (!borrowing) {
        throw new Error("Borrowing record not found");
      }

      // Update borrowing record
      const update = {
        isReturned: 1,
        returnDate: new Date().toISOString().slice(0, 10),
      };
      await this.db
        .update(borrowings)
        .set(update as any)
        .where(eq(borrowings.borrowingId, borrowingId));

      // Update copy status
      const st = { status: "available" };
      await this.db
        .update(bookCopies)
        .set(st as any)
        .where(eq(bookCopies.copyId, borrowing.bookCopyId));
      return { success: true };
    } catch (error) {
      console.error("Failed to return book:", error);
      throw new Error("Failed to return book");
    }
  }

  //borrow operations
  //class operations
  async getAllClasses() {
    const classes = await this.db
      .select({
        classId: schema.classes.classId,
        academicLevel: schema.classes.academicLevel,
        class: schema.classes.class,
      })
      .from(schema.classes)
      .execute();
    console.log(classes);
    return classes;
  }
  async getAClass(args: { id: string }) {
    const classItem = await this.db.query.classes.findFirst({
      where: eq(schema.classes.classId, args.id),
    });
    console.log(classItem);
    return classItem;
  }
  async addClass(classItem: Class) {
    try {
      const exists = await this.db
        .select({
          classId: classes.classId,
          class: classes.class,
          academicLevel: classes.academicLevel,
        })
        .from(classes)
        .where(
          and(
            eq(classes.class, classItem.class),
            eq(classes.academicLevel, classItem.academicLevel)
          )
        );
      if (exists[0]) {
        const classKey =
          `${exists[0].academicLevel}${exists[0].class}`.toLowerCase();
        const neededKey =
          `${classItem.academicLevel}${classItem.class}`.toLowerCase();
        if (classKey === neededKey) {
          return exists[0];
        }
      }

      if (!classItem.classId) classItem.classId = nanoid();
      const cl = await this.db.insert(schema.classes).values(classItem);
      console.log(cl);
      return classItem;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateClass(classItem: Class) {
    await this.db
      .update(schema.classes)
      .set(classItem)
      .where(eq(schema.classes.classId, classItem.classId));
    return true;
  }
  async deleteClass(args: { id: string }) {
    await this.db
      .delete(schema.classes)
      .where(eq(schema.classes.classId, args.id));
    return true;
  }

  //staff operations

  async createStaff(staff: Staff) {
    try {
      staff.staffId = nanoid();
      if (!staff.classId) staff.classId = null;
      const stf = await this.db.insert(schema.staff).values(staff);
      console.log(stf);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAllStaff() {
    try {
      return await this.db
        .select({
          staffId: schema.staff.staffId,
          firstName: schema.staff.firstName,
          lastName: schema.staff.lastName,
          prefix: schema.staff.prefix,
          classId: schema.staff.classId,
          class: schema.classes,
        })
        .from(schema.staff)
        .leftJoin(
          schema.classes,
          eq(schema.staff.classId, schema.classes.classId)
        );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAStaff(args: { id: string }) {
    const staff = await this.db.query.staff.findFirst({
      where: eq(schema.staff.staffId, args.id),
    });
    console.log(staff);
    return staff;
  }
  async updateStaff(staff: Staff) {
    await this.db
      .update(schema.staff)
      .set(staff)
      .where(eq(schema.staff.staffId, staff.staffId));
    return true;
  }
  async deleteStaff(args: { id: string }) {
    await this.db.delete(schema.staff).where(eq(schema.staff.staffId, args.id));
    return true;
  }

  /* authors functions */
  async getAuthors() {
    try {
      const authorsList = await this.db.select().from(authors);
      return authorsList;
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      throw new Error("Failed to fetch authors");
    }
  }
  async addAuthor(data: Author) {
    try {
      data.authorId = data.authorId ?? nanoid();
      const newAuthor = await this.db.insert(authors).values(data);
      console.log(newAuthor);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /* categories functions */
  async getCategories() {
    try {
      const categoriesList = await this.db.select().from(categories);
      return categoriesList;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }
  async addCategory(data: Category) {
    try {
      data.id = data.id ?? nanoid();
      const newCategory = await this.db.insert(categories).values(data);
      console.log(newCategory);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export type BookDetailBorrowing = {
  borrowingId: string;
  bookCopyId: string;
  borrowerId: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
  dueDate: string;
  isReturned: number;
};
export type overdueBook = {
  borrowingId: string;
  copyId: string;
  bookId: string;
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  studentId: string;
  studentName: unknown;
};
