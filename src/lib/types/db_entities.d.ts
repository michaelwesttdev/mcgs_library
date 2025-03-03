// main_books table
export type MainBook = {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishedYear?: number;
  category: string;
  language?: string;
};

// authors table
export type Author = {
  authorId: string;
  name: string;
};

// categories table
export type Category = {
  id: string;
  name: string;
  description?: string;
};

// book_copies table
export type BookCopy = {
  copyId: string;
  bookId: string;
  status: string;
  copyNumber: number;
};

// borrowings table
export type Borrowing = {
  borrowingId: string;
  bookCopyId: string;
  borrowerId: string;
  borrowDate: string;
  returnDate?: string;
  dueDate: string;
  isReturned: number;
};

// students table
export type Student = {
  studentId: string;
  firstName: string;
  lastName: string;
  classId: string;
};

// teachers table
export type Staff = {
  staffId: string;
  firstName: string;
  lastName: string;
  prefix?: string;
  classId?: string;
};

// class_teacher_assignment table
export type Class = {
  classId: string;
  academicLevel: number;
  class?: string;
};

export type MainBookWithAuthorAndCategory = MainBook & {
  authorDetails: Author;
  categoryDetails: Category;
};

export type BookCopyWithBook = BookCopy & {
  bookDetails: MainBook;
};

export type BorrowingWithDetails = Borrowing & {
  bookCopyDetails: BookCopy & {
    bookDetails: MainBook & {
      authorDetails: Author;
      categoryDetails: Category;
    };
  };
  borrowerDetails: Student;
};

export type ClassWithTeacherAndStudents = Class & {
  assignedTeacher?: Teacher;
  students: Student[];
};

export type StudentWithClass = Student & {
  class: Class;
};
export type StaffWithClass = Staff & {
  class: Class;
};
