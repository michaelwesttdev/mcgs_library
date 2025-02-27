"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { StudentForm } from "./student-form";
import { CSVImport } from "./csv-import";
import type { Student, StudentFormData } from "./types";

// This would typically come from your database
const initialStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    grade: "10",
    enrollmentDate: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    grade: "11",
    enrollmentDate: "2024-02-01T00:00:00.000Z",
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = async (data: StudentFormData) => {
    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleEditStudent = async (data: StudentFormData) => {
    if (!editingStudent) return;
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingStudent.id ? { ...data, id: student.id } : student
      )
    );
    setEditingStudent(null);
  };

  const handleImportCSV = async (importedStudents: StudentFormData[]) => {
    const newStudents: Student[] = importedStudents.map((student) => ({
      ...student,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setStudents((prev) => [...prev, ...newStudents]);
  };

  return (
    <div className='container mx-auto py-10 px-10'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Students</h1>
        <div className='flex items-center gap-4'>
          <CSVImport onImport={handleImportCSV} />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm onSubmit={handleAddStudent} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>Grade {student.grade}</TableCell>
                <TableCell>
                  {new Date(student.enrollmentDate).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setEditingStudent(student)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                      </DialogHeader>
                      <StudentForm
                        initialData={editingStudent ?? undefined}
                        onSubmit={handleEditStudent}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
