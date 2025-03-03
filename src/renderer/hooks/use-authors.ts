import { Author } from "@/lib/types/db_entities";
import { useState, useEffect } from "react";

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchAuthors() {
    try {
      const data = await window.api.authors.getAllAuthors();
      setAuthors(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch authors")
      );
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchAuthors();
  }, []);

  return { authors, isLoading, error, getAuthors: fetchAuthors };
}
