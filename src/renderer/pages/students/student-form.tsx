import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { Class, Student } from "@/lib/types/db_entities";
import { ClassSelect } from "./class-select";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface StudentFormProps {
  initialData?: Student;
  type: "update" | "create";
  onDone?: () => void;
}

export function StudentForm({ initialData, type }: StudentFormProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const form = useForm<Student>({
    defaultValues: initialData || {
      studentId: "",
      firstName: "",
      lastName: "",
      classId: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const onAddClass = async (newClass: Omit<Class, "classId">) => {
    // In a real app, you would save this to your database and get back the ID
    const classId = nanoid();
    const createdClass: Class = {
      ...newClass,
      classId,
    };

    try {
      const ok = await window.api.classes.addClass(createdClass);
      if (!ok) {
        throw new Error();
      }
      await getClasses();
      form.setValue("classId", classId);
      return createdClass;
    } catch (error) {
      console.log(error);
      toast("Could Not Create Class");
    }
  };

  async function newStudent(data: Student) {
    try {
      setIsLoading(true);
      const ok = await window.api.students.addStudent(data);
      if (!ok) {
        throw new Error("Something went wrong");
      }
      toast("Student added successfully");
      form.reset();
    } catch (error) {
      toast("something went wrong");
      console.log(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function updateStudent(data: Student) {
    try {
      setIsLoading(true);
      await window.api.students.updateStudent(data);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSubmit(data: Student) {
    switch (type) {
      case "create":
        newStudent(data);
        break;
      case "update":
        updateStudent(data);
        break;
    }
  }
  async function getClasses() {
    try {
      const res = await window.api.classes.getAllClasses();
      setClasses(res);
    } catch (error) {
      console.log(error);
      toast("error fetching classes");
    }
  }
  useEffect(() => {
    getClasses();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='classId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <ClassSelect
                  value={field.value}
                  onChange={field.onChange}
                  classes={classes}
                  onAddClass={onAddClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Student"}
        </Button>
      </form>
    </Form>
  );
}
