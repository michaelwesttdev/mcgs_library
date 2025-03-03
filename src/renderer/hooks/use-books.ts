import { overdueBook } from "@/lib/db";
import { MainBook } from "@/lib/types/db_entities";
import { useState, useEffect } from "react";

export function useBooks() {
  const [books, setBooks] = useState<MainBook[] | null>(null);
  const [overdueBooks, setOverdueBooks] = useState<overdueBook[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchBooks() {
    try {
      const data = await window.api.books.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch books"));
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchOverdueBooks() {
    try {
      const data = await window.api.books.getOverdueBooks();
      setOverdueBooks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch overdue books")
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
    fetchOverdueBooks();
  }, []);

  return {
    books,
    totalBooks: books?.length ?? 0,
    isLoading,
    error,
    overdueBooks,
    totalOverdue: overdueBooks?.length ?? 0,
    fetchOverdueBooks,
    fetchBooks,
  };
}
