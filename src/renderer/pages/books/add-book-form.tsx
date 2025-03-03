import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthors } from "~/hooks/use-authors";
import { useCategories } from "~/hooks/use-categories";
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
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Author, Category } from "@/lib/types/db_entities";
import { nanoid } from "nanoid";
import { AuthorSelect } from "./author-select";
import { CategorySelect } from "./category-select";

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publisher: z.string().optional(),
  publishedYear: z.coerce.number().int().positive().optional(),
  category: z.string().min(1, "Category is required"),
  language: z.string().optional(),
  copies: z.coerce.number().int().min(1, "At least one copy is required"),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

export function AddBookForm() {
  const { authors, isLoading: isLoadingAuthors, getAuthors } = useAuthors();
  const {
    categories,
    isLoading: isLoadingCategories,
    getCategories,
  } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      publishedYear: undefined,
      category: "",
      language: "",
      copies: 1,
    },
  });

  async function onSubmit(data: BookFormValues) {
    setIsSubmitting(true);
    try {
      await window.api.books.addBook({
        bookId: "",
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        publisher: data.publisher,
        publishedYear: data.publishedYear,
        category: data.category,
        language: data.language,
        copies: 1,
      });
      toast.success("Book added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add book");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const onAddAuthor = async (newAuthor: Omit<Author, "classId">) => {
    // In a real app, you would save this to your database and get back the ID
    const authorId = nanoid();
    const createdAuthor: Author = {
      ...newAuthor,
      authorId,
    };

    try {
      const ok = await window.api.authors.addAuthor(createdAuthor);
      if (!ok) {
        throw new Error();
      }
      await getAuthors();
      form.setValue("author", authorId);
      return createdAuthor;
    } catch (error) {
      console.log(error);
      toast("Could Not Create Author");
    }
  };
  const onAddCategory = async (newCategory: Omit<Category, "id">) => {
    const id = nanoid();
    const createdCategory: Category = {
      ...newCategory,
      id,
    };

    try {
      const ok = await window.api.categories.addCategory(createdCategory);
      if (!ok) {
        throw new Error();
      }
      await getCategories();
      form.setValue("category", id);
      return createdCategory;
    } catch (error) {
      console.log(error);
      toast("Could Not Create Category");
    }
  };

  if (isLoadingAuthors || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Book Information</h3>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter book title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='author'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <AuthorSelect
                      onAddAuthor={onAddAuthor}
                      value={field.value}
                      onChange={field.onChange}
                      authors={authors}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isbn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter ISBN' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Additional Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='publisher'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder='Publisher name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='publishedYear'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Published Year</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='YYYY'
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <CategorySelect
                      onChange={field.onChange}
                      onAddCategory={onAddCategory}
                      value={field.value}
                      categories={categories}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. English' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Inventory</h3>
            <FormField
              control={form.control}
              name='copies'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Copies</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the number of physical copies to add to inventory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              <Plus className='mr-2 h-4 w-4' />
              Add Book
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
