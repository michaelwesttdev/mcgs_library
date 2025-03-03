import type React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CSVStudent } from "./Students";

interface CSVImportProps {
  onImport: (students: CSVStudent[]) => Promise<void>;
  onDone: () => Promise<void>;
}

export function CSVImport({ onImport, onDone }: Readonly<CSVImportProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState<CSVStudent[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv") return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = text.split("\n");

      const parsedStudents: CSVStudent[] = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(",");
          return {
            firstName: values[0]?.trim() ?? "",
            lastName: values[1]?.trim() ?? "",
            className: values[2]?.trim().split("")[0] ?? "",
            academicLevel: values[3]?.trim() ?? "",
          };
        });

      setStudents(parsedStudents);
      event.target.value = "";
    } catch (error) {
      console.error("Error parsing CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setUploadProgress(0);
    for (let i = 0; i < students.length; i++) {
      await onImport([students[i]]);
      setUploadProgress(((i + 1) / students.length) * 100);
    }
    setIsLoading(false);
    setStudents([]);
    setUploadProgress(0);
    await onDone();
    setIsDialogOpen(false);
  };

  const updateStudent = (
    index: number,
    key: keyof CSVStudent,
    value: string
  ) => {
    const updatedStudents = [...students];
    updatedStudents[index][key] = value;
    setStudents(updatedStudents);
  };

  return (
    <div className='flex items-center gap-4'>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={isLoading}
        variant='outline'>
        Import CSV
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSV Import Instructions</DialogTitle>
          </DialogHeader>
          <ul className='list-disc pl-5 text-sm'>
            <li>Ensure the file is in CSV format.</li>
            <li>
              The CSV should have the following columns: firstName, lastName,
              className, academicLevel.
            </li>
            <li>className should be a single letter (e.g., A, B, C).</li>
            <li>academicLevel should be a single digit (e.g., 1, 2, 3).</li>
          </ul>
          <Input
            type='file'
            accept='.csv'
            onChange={handleFileUpload}
            disabled={isLoading}
            id='file-upload'
          />
          {students.length > 0 && (
            <div className='overflow-auto max-h-60'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Academic Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.firstName + index}>
                      <TableCell>
                        <Input
                          value={student.firstName}
                          onChange={(e) =>
                            updateStudent(index, "firstName", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.lastName}
                          onChange={(e) =>
                            updateStudent(index, "lastName", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.className}
                          onChange={(e) =>
                            updateStudent(index, "className", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.academicLevel}
                          onChange={(e) =>
                            updateStudent(
                              index,
                              "academicLevel",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {students.length > 0 && (
            <div className='w-full bg-gray-200 rounded-full h-2.5'>
              <div
                className='bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              disabled={isLoading || students.length === 0}
              variant='outline'
              onClick={handleUpload}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
