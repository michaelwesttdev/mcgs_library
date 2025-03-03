import { Category } from "@/lib/types/db_entities";
import { useState, useEffect } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  async function fetchCategories() {
    try {
      const data = await window.api.categories.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, isLoading, error, getCategories: fetchCategories };
}
