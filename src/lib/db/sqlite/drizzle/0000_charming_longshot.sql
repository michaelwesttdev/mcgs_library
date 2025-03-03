CREATE TABLE `authors` (
	`authorId` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_authorId_unique` ON `authors` (`authorId`);--> statement-breakpoint
CREATE TABLE `book_copies` (
	`copy_id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`status` text(50) DEFAULT 'available',
	`copy_number` integer,
	FOREIGN KEY (`book_id`) REFERENCES `main_books`(`bookId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_copies_copy_id_unique` ON `book_copies` (`copy_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_copies_copy_number_unique` ON `book_copies` (`copy_number`);--> statement-breakpoint
CREATE TABLE `borrowings` (
	`borrowing_id` text PRIMARY KEY NOT NULL,
	`book_copy_id` text NOT NULL,
	`borrower_id` text NOT NULL,
	`borrow_date` text DEFAULT '2025-02-28',
	`return_date` text,
	`due_date` text DEFAULT '2025-02-28',
	`is_returned` integer DEFAULT 0,
	FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies`(`copy_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`borrower_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `borrowings_borrowing_id_unique` ON `borrowings` (`borrowing_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text(255)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unique` ON `categories` (`id`);--> statement-breakpoint
CREATE TABLE `class_teacher_assignment` (
	`class_id` text PRIMARY KEY NOT NULL,
	`academic_level` integer DEFAULT 1,
	`class` text(50)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `class_teacher_assignment_class_id_unique` ON `class_teacher_assignment` (`class_id`);--> statement-breakpoint
CREATE TABLE `main_books` (
	`bookId` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`author` text NOT NULL,
	`isbn` text(13) NOT NULL,
	`publisher` text(255),
	`published_year` integer,
	`category` text(100) NOT NULL,
	`language` text(50),
	FOREIGN KEY (`author`) REFERENCES `authors`(`authorId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `main_books_bookId_unique` ON `main_books` (`bookId`);--> statement-breakpoint
CREATE UNIQUE INDEX `main_books_isbn_unique` ON `main_books` (`isbn`);--> statement-breakpoint
CREATE TABLE `students` (
	`student_id` text PRIMARY KEY NOT NULL,
	`firstName` text(255) NOT NULL,
	`lastName` text(255) NOT NULL,
	`class_id` text DEFAULT 'null',
	FOREIGN KEY (`class_id`) REFERENCES `class_teacher_assignment`(`class_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `teachers` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`prefix` text(50) DEFAULT 'Mr.',
	`class_id` text,
	FOREIGN KEY (`class_id`) REFERENCES `class_teacher_assignment`(`class_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_teacher_id_unique` ON `teachers` (`teacher_id`);