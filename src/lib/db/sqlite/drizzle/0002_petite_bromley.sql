ALTER TABLE `staff` RENAME COLUMN "name" TO "firstName";--> statement-breakpoint
ALTER TABLE `staff` ADD `lastName` text(255) NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_borrowings` (
	`borrowing_id` text PRIMARY KEY NOT NULL,
	`book_copy_id` text NOT NULL,
	`borrower_id` text NOT NULL,
	`borrow_date` text DEFAULT '2025-03-02',
	`return_date` text,
	`due_date` text DEFAULT '2025-03-02',
	`is_returned` integer DEFAULT 0,
	FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies`(`copy_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`borrower_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_borrowings`("borrowing_id", "book_copy_id", "borrower_id", "borrow_date", "return_date", "due_date", "is_returned") SELECT "borrowing_id", "book_copy_id", "borrower_id", "borrow_date", "return_date", "due_date", "is_returned" FROM `borrowings`;--> statement-breakpoint
DROP TABLE `borrowings`;--> statement-breakpoint
ALTER TABLE `__new_borrowings` RENAME TO `borrowings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `borrowings_borrowing_id_unique` ON `borrowings` (`borrowing_id`);