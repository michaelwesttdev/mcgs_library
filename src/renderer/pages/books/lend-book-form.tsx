import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBook } from "~/hooks/use-book";
import { useStudents } from "~/hooks/use-students";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { useBooks } from "@/renderer/hooks/use-books";
import SearchableSelect from "./lend/searchable-select";
import { useSearchParams } from "react-router";

const lendFormSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  copyId: z.string().min(1, "Book copy is required"),
  borrowerId: z.string().min(1, "Borrower is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

type LendFormValues = z.infer<typeof lendFormSchema>;

interface LendBookFormProps {
  selectedBookId?: string | null;
}

export function LendBookForm() {
  const { books, isLoading: isLoadingBooks } = useBooks();
  const { students, isLoading: isLoadingStudents } = useStudents();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const {
    book,
    bookCopies,
    isLoading: isLoadingBook,
  } = useBook(selectedBook || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const form = useForm<LendFormValues>({
    resolver: zodResolver(lendFormSchema),
    defaultValues: {
      bookId: searchParams.get("bookId") || "",
      copyId: "",
      borrowerId: "",
      dueDate: addDays(new Date(), 14), // Default to 2 weeks from today
    },
  });
  // Update form when selectedBookId changes

  // Handle book selection change
  const onBookChange = (bookId: string) => {
    form.setValue("bookId", bookId);
    form.setValue("copyId", ""); // Reset copy selection
    setSelectedBook(bookId);
  };

  async function onSubmit(data: LendFormValues) {
    setIsSubmitting(true);
    try {
      await window.api.books.lendBook({
        bookId: data.bookId,
        copyId: data.copyId,
        status: "",
        copyNumber: 0,
        borrowerId: data.borrowerId,
        dueDate: data.dueDate, // Default to 2 weeks from today
      });
      toast.success("Book lent successfully");
      form.reset({
        bookId: "",
        copyId: "",
        borrowerId: "",
        dueDate: addDays(new Date(), 14),
      });
      setSelectedBook(null);
    } catch (error) {
      toast.error("Failed to lend book");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  useEffect(() => {
    if (searchParams.get("bookId")) {
      form.setValue("bookId", searchParams.get("bookId"));
      setSelectedBook(searchParams.get("bookId"));
    }
  }, [searchParams, form]);

  const availableCopies =
    bookCopies?.filter((copy) => copy.status === "available") || [];

  return (
    <div className='max-w-2xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Lend a Book</CardTitle>
          <CardDescription>Record a new book borrowing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='bookId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book</FormLabel>
                    <Select
                      onValueChange={(value) => onBookChange(value)}
                      defaultValue={field.value}
                      disabled={isLoadingBooks}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a book' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {books?.map((book) => (
                          <SelectItem key={book.bookId} value={book.bookId}>
                            {book.title} ({book.isbn})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedBook && (
                <>
                  {isLoadingBook ? (
                    <div className='flex items-center justify-center p-4'>
                      <Loader2 className='h-6 w-6 animate-spin' />
                    </div>
                  ) : (
                    <>
                      {book && (
                        <div className='rounded-md border p-4 bg-muted/50'>
                          <div className='font-medium'>{book.title}</div>
                          <div className='text-sm text-muted-foreground'>
                            By {book.author} • ISBN: {book.isbn}
                          </div>
                          <div className='mt-2 flex items-center'>
                            <Badge
                              variant={
                                availableCopies.length > 0
                                  ? "default"
                                  : "destructive"
                              }>
                              {availableCopies.length}{" "}
                              {availableCopies.length === 1 ? "copy" : "copies"}{" "}
                              available
                            </Badge>
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name='copyId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Book Copy</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={availableCopies.length === 0}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a copy' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableCopies.map((copy) => (
                                  <SelectItem
                                    key={copy.copyId}
                                    value={copy.copyId}>
                                    Copy #{copy.copyNumber}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </>
              )}

              <SearchableSelect
                students={students}
                form={form}
                isLoadingStudents={isLoadingStudents}
              />

              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className='w-full pl-3 text-left font-normal'>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date by which the book should be returned
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end pt-4'>
                <Button
                  type='submit'
                  disabled={
                    isSubmitting ||
                    !selectedBook ||
                    availableCopies.length === 0
                  }>
                  {isSubmitting && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Lend Book
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
