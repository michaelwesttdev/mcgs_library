ALTER TABLE `teachers` RENAME TO `staff`;--> statement-breakpoint
ALTER TABLE `staff` RENAME COLUMN "teacher_id" TO "staff_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staff` (
	`staff_id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`prefix` text(50) DEFAULT 'Mr.',
	`class_id` text,
	FOREIGN KEY (`class_id`) REFERENCES `class_teacher_assignment`(`class_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_staff`("staff_id", "name", "prefix", "class_id") SELECT "staff_id", "name", "prefix", "class_id" FROM `staff`;--> statement-breakpoint
DROP TABLE `staff`;--> statement-breakpoint
ALTER TABLE `__new_staff` RENAME TO `staff`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `staff_staff_id_unique` ON `staff` (`staff_id`);--> statement-breakpoint
CREATE TABLE `__new_borrowings` (
	`borrowing_id` text PRIMARY KEY NOT NULL,
	`book_copy_id` text NOT NULL,
	`borrower_id` text NOT NULL,
	`borrow_date` text DEFAULT '2025-03-01',
	`return_date` text,
	`due_date` text DEFAULT '2025-03-01',
	`is_returned` integer DEFAULT 0,
	FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies`(`copy_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`borrower_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_borrowings`("borrowing_id", "book_copy_id", "borrower_id", "borrow_date", "return_date", "due_date", "is_returned") SELECT "borrowing_id", "book_copy_id", "borrower_id", "borrow_date", "return_date", "due_date", "is_returned" FROM `borrowings`;--> statement-breakpoint
DROP TABLE `borrowings`;--> statement-breakpoint
ALTER TABLE `__new_borrowings` RENAME TO `borrowings`;--> statement-breakpoint
CREATE UNIQUE INDEX `borrowings_borrowing_id_unique` ON `borrowings` (`borrowing_id`);