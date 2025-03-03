import { useBook } from "~/hooks/use-book";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";

interface BookDetailsProps {
  bookId: string;
}

export function BookDetails({ bookId }: Readonly<BookDetailsProps>) {
  const { book, bookCopies, borrowings, isLoading, error } = useBook(bookId);

  if (isLoading) return <BookDetailsSkeleton />;
  if (error) return <div>Error loading book details: {error.message}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>Book Information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className='grid grid-cols-2 gap-2 text-sm'>
              <dt className='font-medium'>Author:</dt>
              <dd>{book.author}</dd>

              <dt className='font-medium'>ISBN:</dt>
              <dd>{book.isbn}</dd>

              <dt className='font-medium'>Publisher:</dt>
              <dd>{book.publisher || "N/A"}</dd>

              <dt className='font-medium'>Published Year:</dt>
              <dd>{book.publishedYear || "N/A"}</dd>

              <dt className='font-medium'>Category:</dt>
              <dd>{book.category}</dd>

              <dt className='font-medium'>Language:</dt>
              <dd>{book.language || "N/A"}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Book Copies Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <p className='text-sm font-medium'>Total Copies</p>
                  <p className='text-2xl font-bold'>
                    {bookCopies?.length || 0}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium'>Available</p>
                  <p className='text-2xl font-bold'>
                    {bookCopies?.filter((copy) => copy.status === "available")
                      .length || 0}
                  </p>
                </div>
              </div>

              {bookCopies && bookCopies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Copy #</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookCopies.map((copy) => (
                      <TableRow key={copy.copyId}>
                        <TableCell>{copy.copyNumber}</TableCell>
                        <TableCell>
                          <CopyStatusBadge status={copy.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No copies available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='current'>
        <TabsList>
          <TabsTrigger value='current'>Current Borrowings</TabsTrigger>
          <TabsTrigger value='history'>Borrowing History</TabsTrigger>
        </TabsList>
        <TabsContent value='current'>
          <Card>
            <CardHeader>
              <CardTitle>Current Borrowings</CardTitle>
            </CardHeader>
            <CardContent>
              {borrowings &&
              borrowings.filter((b) => !b.isReturned).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Copy #</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowings
                      .filter((b) => !b.isReturned)
                      .map((borrowing) => (
                        <TableRow key={borrowing.borrowingId}>
                          <TableCell>
                            {bookCopies?.find(
                              (c) => c.copyId === borrowing.bookCopyId
                            )?.copyNumber || "N/A"}
                          </TableCell>
                          <TableCell>{borrowing.borrowerName}</TableCell>
                          <TableCell>
                            {new Date(
                              borrowing.borrowDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(borrowing.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <BorrowingStatusBadge dueDate={borrowing.dueDate} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No current borrowings
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='history'>
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
            </CardHeader>
            <CardContent>
              {borrowings &&
              borrowings.filter((b) => b.isReturned).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Copy #</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Return Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowings
                      .filter((b) => b.isReturned)
                      .map((borrowing) => (
                        <TableRow key={borrowing.borrowingId}>
                          <TableCell>
                            {bookCopies?.find(
                              (c) => c.copyId === borrowing.bookCopyId
                            )?.copyNumber || "N/A"}
                          </TableCell>
                          <TableCell>{borrowing.borrowerName}</TableCell>
                          <TableCell>
                            {new Date(
                              borrowing.borrowDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {borrowing.returnDate
                              ? new Date(
                                  borrowing.returnDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No borrowing history
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CopyStatusBadge({ status }: Readonly<{ status: string }>) {
  switch (status) {
    case "available":
      return <Badge variant='default'>Available</Badge>;
    case "borrowed":
      return <Badge variant='secondary'>Borrowed</Badge>;
    case "reserved":
      return <Badge>Reserved</Badge>;
    case "damaged":
      return <Badge variant='destructive'>Damaged</Badge>;
    default:
      return <Badge variant='outline'>{status}</Badge>;
  }
}

function BorrowingStatusBadge({ dueDate }: Readonly<{ dueDate: string }>) {
  const today = new Date();
  const due = new Date(dueDate);

  if (today > due) {
    return <Badge variant='destructive'>Overdue</Badge>;
  }

  const daysUntilDue = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 3) {
    return <Badge variant='default'>Due soon</Badge>;
  }

  return <Badge variant='outline'>On time</Badge>;
}

function BookDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Skeleton className='h-[200px] w-full' />
        <Skeleton className='h-[200px] w-full' />
      </div>
      <Skeleton className='h-[300px] w-full' />
    </div>
  );
}
