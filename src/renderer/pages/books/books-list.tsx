import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { EditBookForm } from "./edit-book-form";
import { BookDetails } from "./book-details";
import {
  MoreHorizontal,
  Search,
  Edit,
  Info,
  BookOpen,
  Filter,
} from "lucide-react";
import { useBooks } from "~/hooks/use-books";
import { useNavigate } from "react-router";

interface BooksListProps {
  onSelectBook: (bookId: string | null) => void;
  onNavigate: (page: string) => void;
}

export function BooksList({
  onSelectBook,
  onNavigate,
}: Readonly<BooksListProps>) {
  const { books, isLoading, error } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<string | null>(
    null
  );
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<
    string | null
  >(null);

  if (isLoading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books: {error.message}</div>;

  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='relative w-full max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search books...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant='outline' size='sm'>
          <Filter className='mr-2 h-4 w-4' />
          Filter
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[80px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks && filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <TableRow key={book.bookId}>
                  <TableCell className='font-medium'>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.publishedYear}</TableCell>
                  <TableCell>
                    <BookStatusBadge bookId={book.bookId} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <Dialog
                          open={selectedBookForDetails === book.bookId}
                          onOpenChange={(open) =>
                            !open && setSelectedBookForDetails(null)
                          }>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedBookForDetails(book.bookId);
                              }}>
                              <Info className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className='sm:max-w-[625px]'>
                            <DialogHeader>
                              <DialogTitle>Book Details</DialogTitle>
                            </DialogHeader>
                            {selectedBookForDetails && (
                              <BookDetails bookId={selectedBookForDetails} />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={selectedBookForEdit === book.bookId}
                          onOpenChange={(open) =>
                            !open && setSelectedBookForEdit(null)
                          }>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedBookForEdit(book.bookId);
                              }}>
                              <Edit className='mr-2 h-4 w-4' />
                              Edit Book
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className='sm:max-w-[625px]'>
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                            </DialogHeader>
                            {selectedBookForEdit && (
                              <EditBookForm
                                book={book}
                                onSuccess={() => setSelectedBookForEdit(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem
                          onClick={() => {
                            navigate("/books/lend?bookId=" + book.bookId);
                            onNavigate("lend");
                          }}>
                          <BookOpen className='mr-2 h-4 w-4' />
                          Lend Book
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function BookStatusBadge({ bookId }: Readonly<{ bookId: string }>) {
  const { bookCopies, isLoading } = useBookCopies(bookId);

  if (isLoading) return <Badge variant='outline'>Loading...</Badge>;

  const totalCopies = bookCopies?.length || 0;
  const availableCopies =
    bookCopies?.filter((copy) => copy.status === "available").length || 0;

  if (totalCopies === 0) {
    return <Badge variant='outline'>No copies</Badge>;
  }

  if (availableCopies === 0) {
    return <Badge variant='destructive'>All borrowed</Badge>;
  }

  if (availableCopies < totalCopies) {
    return (
      <Badge variant='secondary'>
        {availableCopies}/{totalCopies} Available
      </Badge>
    );
  }

  return <Badge variant='default'>Available</Badge>;
}

// This is a mock hook - implement actual data fetching
function useBookCopies(bookId: string) {
  // In a real implementation, this would fetch data from your API
  return {
    bookCopies: [
      { copyId: "1", status: "available" },
      { copyId: "2", status: "borrowed" },
    ],
    isLoading: false,
  };
}
