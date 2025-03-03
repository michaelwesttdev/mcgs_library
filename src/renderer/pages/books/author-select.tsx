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
import type { Author } from "@/lib/types/db_entities";
import { useState } from "react";

interface AuthorSelectProps {
  value: string;
  onChange: (value: string) => void;
  authors: Author[];
  onAddAuthor: (newauthor: Omit<Author, "authorId">) => Promise<Author>;
}

export function AuthorSelect({
  value,
  onChange,
  authors,
  onAddAuthor,
}: Readonly<AuthorSelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // Form for adding a new class
  const form = useForm<Omit<Author, "authorId">>({
    defaultValues: {
      name: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter classes based on search
  const filteredAuthors = authors.filter((author) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    const authorNameStr = author.name.toString();

    return authorNameStr.includes(searchLower);
  });

  // Handle adding a new class
  const handleAddAuthor = async (data: Omit<Author, "authorId">) => {
    try {
      setIsSubmitting(true);
      const newauthor = await onAddAuthor(data);
      onChange(newauthor.authorId);
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getDisplayName = (authorId: string) => {
    const author = authors.find((c) => c.authorId === authorId);
    if (!author) return "Select Class";

    return author.name;
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
            {value ? getDisplayName(value) : "Select Author"}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput
              placeholder='Search authors...'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                <p className='py-2 px-4 text-sm text-muted-foreground'>
                  No Author found.
                </p>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2 text-sm'
                  onClick={() => {
                    setDialogOpen(true);
                    setOpen(false);
                  }}>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add new author
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {filteredAuthors.map((author) => (
                  <CommandItem
                    key={author.authorId}
                    value={author.authorId}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === author.authorId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {author.name}
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
                  Add new author
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New author</DialogTitle>
            <DialogDescription>
              Create a new author that will be available for selection.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author's Name</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='authors name'
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
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
                    handleAddAuthor(form.getValues());
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
