import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { Student } from "@/lib/types/db_entities";

export default function SearchableSelect({
  form,
  students,
  isLoadingStudents,
}: Readonly<{
  form: UseFormReturn;
  students: Student[];
  isLoadingStudents: boolean;
}>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name='borrowerId'
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>Borrower</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoadingStudents}>
                  {field.value
                    ? students?.find(
                        (student) => student.studentId === field.value
                      )
                      ? `${
                          students.find(
                            (student) => student.studentId === field.value
                          ).firstName
                        } ${
                          students.find(
                            (student) => student.studentId === field.value
                          ).lastName
                        }`
                      : "Select a borrower"
                    : "Select a borrower"}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder='Search borrower...' />
                <CommandList>
                  <CommandEmpty>No borrower found.</CommandEmpty>
                  <CommandGroup>
                    {students?.map((student) => (
                      <CommandItem
                        key={student.studentId}
                        value={`${student.firstName} ${student.lastName}`}
                        onSelect={() => {
                          form.setValue("borrowerId", student.studentId);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            student.studentId === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {student.firstName} {student.lastName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
