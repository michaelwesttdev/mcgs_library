"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash, Search, X } from "lucide-react";

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
import type { Class, Student, StudentWithClass } from "@/lib/types/db_entities";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";

// This would typically come from your database
export type CSVStudent = {
  firstName: string;
  lastName: string;
  className: string;
  academicLevel: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    classId: "",
  });
  const [uniqueClasses, setUniqueClasses] = useState<
    { id: string; name: string }[]
  >([]);
  const applyFilters = useCallback(
    (studentList: Student[], currentFilters: typeof filters) => {
      let result = [...studentList];

      if (currentFilters.firstName) {
        result = result.filter((student) =>
          student.firstName
            .toLowerCase()
            .includes(currentFilters.firstName.toLowerCase())
        );
      }

      if (currentFilters.lastName) {
        result = result.filter((student) =>
          student.lastName
            .toLowerCase()
            .includes(currentFilters.lastName.toLowerCase())
        );
      }

      if (currentFilters.classId) {
        result = result.filter((student) =>
          currentFilters.classId === "all"
            ? student
            : student.classId === currentFilters.classId
        );
      }

      setFilteredStudents(result);
    },
    []
  );
  const addClass = async (newClass: Omit<Class, "classId">) => {
    const classId = nanoid();
    const createdClass: Class = {
      ...newClass,
      classId,
    };

    try {
      const cl = await window.api.classes.addClass(createdClass);
      if (!cl.classId) {
        throw new Error();
      }
      return cl;
    } catch (error) {
      console.log(error);
      toast("Could Not Create Class");
    }
  };

  const handleImportCSV = async (importedStudents: CSVStudent[]) => {
    const newStudents: Student[] = await Promise.all(
      importedStudents.map(async (student) => {
        const classKey =
          `${student.academicLevel}${student.className}`.toLowerCase();
        let classEntry = uniqueClasses.find(
          (cl) => cl.name.toLowerCase() === classKey
        );

        if (!classEntry) {
          const newClassCreated = await addClass({
            class: student.className,
            academicLevel: parseInt(student.academicLevel),
          });

          if (!newClassCreated) {
            toast("Could Not Create Class");
            return null;
          }

          classEntry = {
            id: newClassCreated.classId,
            name: `${student.academicLevel}${student.className}`,
          };
        }

        const newStudent = await window.api.students.addStudent({
          studentId: nanoid(),
          firstName: student.firstName,
          lastName: student.lastName,
          classId: classEntry.id,
        });

        if (!newStudent) {
          toast("Could Not Create Student");
          return null;
        }

        return newStudent;
      })
    );

    const validStudents = newStudents.filter(Boolean); // Remove null values
    setStudents((prev) => [...prev, ...validStudents]);
    applyFilters([...students, ...validStudents], filters);
  };

  const getAllStudents = useCallback(async () => {
    try {
      const students = await window.api.students.getAllStudents();
      setStudents(students);
      applyFilters(students, filters);

      // Extract unique classes for the filter dropdown
      const classes = Array.from(
        new Set(
          students
            .filter(
              (student: StudentWithClass) => student.classId && student.class
            )
            .map((student: StudentWithClass) => student.classId)
        )
      ).map((classId) => {
        const studentWithClass = students.find(
          (student: StudentWithClass) => student.classId === classId
        );
        return {
          id: classId,
          name: `${studentWithClass.class.academicLevel}${studentWithClass.class.class}`,
        };
      });

      setUniqueClasses(classes as { id: string; name: string }[]);

      toast("Found all students");
    } catch (error) {
      console.error(error);
      setStudents([]);
      setFilteredStudents([]);
      toast("Failed to get students");
    }
  }, [applyFilters, filters]);

  async function deleteStudent(studentId: string) {
    try {
      await window.api.students.deleteStudent({ id: studentId });
      const updatedStudents = students.filter((s) => s.studentId !== studentId);
      setStudents(updatedStudents);
      applyFilters(updatedStudents, filters);
      toast("Deleted student");
    } catch (error) {
      console.error(error);
      toast("Failed to delete student");
    }
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(students, newFilters);
  };

  const clearFilters = () => {
    setFilters({ firstName: "", lastName: "", classId: "" });
    setFilteredStudents(students);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  return (
    <div className='container mx-auto py-10 px-10'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Students</h1>
        <div className='flex items-center gap-4'>
          <CSVImport onDone={getAllStudents} onImport={handleImportCSV} />
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
              <StudentForm onDone={getAllStudents} type='create' />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Section */}
      <div className='mb-6 p-4 border rounded-lg bg-gray-50'>
        <div className='flex items-center gap-2 mb-2'>
          <Search className='h-4 w-4 text-gray-500' />
          <h2 className='font-medium'>Filter Students</h2>
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='ml-auto text-xs'>
              <X className='h-3 w-3 mr-1' /> Clear Filters
            </Button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-2'>
          <div>
            <label
              htmlFor='firstName'
              className='text-sm font-medium block mb-1'>
              First Name
            </label>
            <Input
              id='firstName'
              placeholder='Filter by first name'
              value={filters.firstName}
              onChange={(e) => handleFilterChange("firstName", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label
              htmlFor='lastName'
              className='text-sm font-medium block mb-1'>
              Last Name
            </label>
            <Input
              id='lastName'
              placeholder='Filter by last name'
              value={filters.lastName}
              onChange={(e) => handleFilterChange("lastName", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label htmlFor='class' className='text-sm font-medium block mb-1'>
              Class
            </label>
            <Select
              value={filters.classId}
              onValueChange={(value) => handleFilterChange("classId", value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select class' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Classes</SelectItem>
                {uniqueClasses
                  .sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                  })
                  .map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mt-4'>
            {filters.firstName && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                First Name: {filters.firstName}
                <button
                  onClick={() => handleFilterChange("firstName", "")}
                  className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
            {filters.lastName && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Last Name: {filters.lastName}
                <button
                  onClick={() => handleFilterChange("lastName", "")}
                  className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
            {filters.classId && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Class:{" "}
                {uniqueClasses.find((c) => c.id === filters.classId)?.name ||
                  filters.classId}
                <button
                  onClick={() => handleFilterChange("classId", "")}
                  className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-8 text-gray-500'>
                  {students.length === 0
                    ? "No students found. Add some students to get started."
                    : "No students match your filters. Try adjusting your search criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student: StudentWithClass) => (
                <TableRow key={student.studentId}>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>
                    {student.class?.academicLevel}
                    {student.class?.class}
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
                          onDone={getAllStudents}
                          initialData={editingStudent ?? undefined}
                          type='update'
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='destructive'
                          size='icon'
                          className='ml-2'>
                          <Trash className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you Sure?</DialogTitle>
                        </DialogHeader>
                        <section className='flex items-center justify-center flex-col gap-4'>
                          <p className='text-red-500'>
                            This action cannot be undone.
                          </p>

                          <p className='text-gray-500 mt-4'>
                            This will permanently delete {student.firstName}{" "}
                            {student.lastName} from the database.
                          </p>
                          <section className='flex items-center justify-center gap-4'>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => deleteStudent(student.studentId)}>
                              Delete
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setEditingStudent(null)}>
                              Cancel
                            </Button>
                          </section>
                        </section>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
