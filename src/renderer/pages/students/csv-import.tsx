import type React from "react";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { StudentFormData } from "./types";

interface CSVImportProps {
  onImport: (students: StudentFormData[]) => Promise<void>;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv") return;

    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result as string;
      console.log("CSV Data:", csvData);
      // Parse CSV data and create StudentFormData array here
      // Example:
      // const students: StudentFormData[] = csvData.split('\n').map((row) => {
      //   const values = row.split(',');
      //   return {
      //     name: values[0],
      //     email: values[1],
      //     grade: values[2],
      //     enrollmentDate: new Date(values[3]).toISOString(),
      //   };
      // });
      // await onImport(students);
      // event.target.value = '';
    };
    reader.readAsText(file);

    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = text.split("\n");
      const headers = rows[0].split(",");

      const students: StudentFormData[] = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(",");
          return {
            name: values[0]?.trim() ?? "",
            email: values[1]?.trim() ?? "",
            grade: values[2]?.trim() ?? "",
            enrollmentDate: values[3]?.trim() ?? new Date().toISOString(),
          };
        });

      await onImport(students);
      event.target.value = "";
    } catch (error) {
      console.error("Error importing CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-4'>
      <Input
        type='file'
        accept='.csv'
        onChange={handleFileUpload}
        disabled={isLoading}
        className='max-w-xs'
      />
      <Button disabled={isLoading} variant='outline' size='icon'>
        <Upload className='h-4 w-4' />
      </Button>
    </div>
  );
}
