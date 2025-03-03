"use client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useForm } from "react-hook-form";
import type { Class } from "@/lib/types/db_entities";
import { useState } from "react";

interface ClassSelectProps {
  value: string;
  onChange: (value: string) => void;
  classes: Class[];
  onAddClass: (newClass: Omit<Class, "classId">) => Promise<Class>;
}

export function ClassSelect({
  value,
  onChange,
  classes,
  onAddClass,
}: Readonly<ClassSelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // Form for adding a new class
  const form = useForm<Omit<Class, "classId">>({
    defaultValues: {
      academicLevel: 1,
      class: "A",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter classes based on search
  const filteredClasses = classes.filter((cls) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    const academicLevelStr = cls.academicLevel.toString();
    const classStr = cls.class?.toLowerCase() || "";

    return (
      academicLevelStr.includes(searchLower) ||
      `grade ${academicLevelStr}`.includes(searchLower) ||
      classStr.includes(searchLower)
    );
  });

  // Handle adding a new class
  const handleAddClass = async (data: Omit<Class, "classId">) => {
    try {
      setIsSubmitting(true);
      const newClass = await onAddClass(data);
      onChange(newClass.classId);
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get display name for a class
  const getClassDisplayName = (classId: string) => {
    const cls = classes.find((c) => c.classId === classId);
    if (!cls) return "Select Class";

    return cls.class
      ? `Grade ${cls.academicLevel} - ${cls.class}`
      : `Grade ${cls.academicLevel}`;
  };

  return (
    <div className='relative'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'>
            {value ? getClassDisplayName(value) : "Select Class"}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput
              placeholder='Search classes...'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                <p className='py-2 px-4 text-sm text-muted-foreground'>
                  No class found.
                </p>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2 text-sm'
                  onClick={() => {
                    setDialogOpen(true);
                    setOpen(false);
                  }}>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add new class
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {filteredClasses.map((cls) => (
                  <CommandItem
                    key={cls.classId}
                    value={cls.classId}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cls.classId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cls.class
                      ? `Grade ${cls.academicLevel} - ${cls.class}`
                      : `Grade ${cls.academicLevel}`}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setDialogOpen(true);
                    setOpen(false);
                  }}>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add new class
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Create a new class that will be available for selection.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className='space-y-4'>
              <FormField
                control={form.control}
                name='academicLevel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={12}
                        placeholder='9'
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='class'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. Science, A, Red Group'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleAddClass(form.getValues());
                  }}
                  type='button'
                  disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Class"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
