import { BookDetailBorrowing } from "@/lib/db";
import { BookCopy, MainBook } from "@/lib/types/db_entities";
import { useState, useEffect } from "react";

export function useBook(bookId: string) {
  const [book, setBook] = useState<MainBook | null>(null);
  const [bookCopies, setBookCopies] = useState<BookCopy[] | null>(null);
  const [borrowings, setBorrowings] = useState<BookDetailBorrowing[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBookDetails() {
      if (!bookId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await window.api.books.getABook({ bookId });
        setBook(data.book);
        setBookCopies(data.copies);
        setBorrowings(data.borrowings);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch book details")
        );
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    fetchBookDetails();
  }, [bookId]);

  return { book, bookCopies, borrowings, isLoading, error };
}
