import { Student } from "@/lib/types/db_entities";
import { useState, useEffect } from "react";

export function useStudents() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await window.api.students.getAllStudents();
        setStudents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch students")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return { students, isLoading, error };
}
