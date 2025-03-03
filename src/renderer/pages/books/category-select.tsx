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
import type { Category } from "@/lib/types/db_entities";
import { useState } from "react";
import { Textarea } from "@/renderer/components/ui/textarea";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  onAddCategory: (newauthor: Omit<Category, "id">) => Promise<Category>;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  onAddCategory,
}: Readonly<CategorySelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // Form for adding a new class
  const form = useForm<Omit<Category, "id">>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter classes based on search
  const filteredCategories = categories.filter((cat) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    const CategoryNameStr = cat.name.toString();

    return CategoryNameStr.includes(searchLower);
  });

  // Handle adding a new class
  const handleAddCategory = async (data: Omit<Category, "id">) => {
    try {
      setIsSubmitting(true);
      const newCat = await onAddCategory(data);
      onChange(newCat.id);
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getDisplayName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return "Select Class";

    return cat.name;
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
              placeholder='Search categories...'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                <p className='py-2 px-4 text-sm text-muted-foreground'>
                  No Category found.
                </p>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2 text-sm'
                  onClick={() => {
                    setDialogOpen(true);
                    setOpen(false);
                  }}>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add new category
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {filteredCategories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cat.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cat.name}
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
                  Add new Category
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New category</DialogTitle>
            <DialogDescription>
              Create a new category that will be available for selection.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='category name'
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={20}
                        placeholder='category description'
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
                    handleAddCategory(form.getValues());
                  }}
                  type='button'
                  disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
