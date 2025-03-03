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
import { Class, Staff } from "@/lib/types/db_entities";
import { ClassSelect } from "./class-select";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";

interface StaffFormProps {
  initialData?: Staff;
  type: "update" | "create";
  onDone?: () => Promise<void>;
}

export function StaffForm({
  initialData,
  type,
  onDone,
}: Readonly<StaffFormProps>) {
  const [classes, setClasses] = useState<Class[]>([]);
  const form = useForm<Staff>({
    defaultValues: initialData || {
      staffId: "",
      firstName: "",
      lastName: "",
      prefix: "Mr",
      classId: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const onAddClass = async (newClass: Omit<Class, "classId">) => {
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

  async function newStaff(data: Staff) {
    try {
      setIsLoading(true);
      const ok = await window.api.staff.addStaff(data);
      if (!ok) {
        throw new Error("Something went wrong");
      }
      toast("Staff Member added successfully");
      await onDone();
      form.reset();
    } catch (error) {
      toast("something went wrong");
      console.log(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function updateStaff(data: Staff) {
    try {
      setIsLoading(true);
      await window.api.staff.updateStaff(data);
      await onDone();
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSubmit(data: Staff) {
    switch (type) {
      case "create":
        newStaff(data);
        break;
      case "update":
        updateStaff(data);
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
          name='prefix'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Prefix' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Mr'>Mr</SelectItem>
                    <SelectItem value='Mrs'>Mrs</SelectItem>
                    <SelectItem value='Ms'>Ms</SelectItem>
                    <SelectItem value='Miss'>Miss</SelectItem>
                    <SelectItem value='Dr'>Dr</SelectItem>
                  </SelectContent>
                </Select>
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
          {isLoading ? "Saving..." : "Save Staff Member"}
        </Button>
      </form>
    </Form>
  );
}
