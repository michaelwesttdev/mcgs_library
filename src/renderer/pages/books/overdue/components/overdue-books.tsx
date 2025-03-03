import { useState } from "react";
import {
  ArrowUpDown,
  Calendar,
  Clock,
  Download,
  Filter,
  Mail,
  Search,
  UserRound,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { useBooks } from "@/renderer/hooks/use-books";

export function OverdueBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [daysOverdue, setDaysOverdue] = useState<string>("all");
  const {
    overdueBooks: books,
    fetchOverdueBooks,
    isLoading,
    error,
  } = useBooks();

  const filteredBooks =
    books?.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.studentName as string)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        book.copyId.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getOverdueStatus = (dueDate: string) => {
    const days = getDaysOverdue(dueDate);
    if (days > 30) return { label: "Critical", class: "bg-red-500" };
    if (days > 14) return { label: "Severe", class: "bg-orange-500" };
    if (days > 7) return { label: "Moderate", class: "bg-yellow-500" };
    return { label: "Mild", class: "bg-blue-500" };
  };

  const handleSendReminder = (borrowingId: string, studentId: string) => {
    // Implementation for sending reminder
    console.log(
      `Sending reminder for borrowing ${borrowingId} to student ${studentId}`
    );
  };

  const handleExportData = () => {
    // Implementation for exporting data
    console.log("Exporting overdue books data");
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row gap-4 justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by title, student, or copy ID...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <Select value={daysOverdue} onValueChange={setDaysOverdue}>
            <SelectTrigger className='w-[180px]'>
              <Filter className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Filter by days' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Overdue</SelectItem>
              <SelectItem value='7'>Over 7 days</SelectItem>
              <SelectItem value='14'>Over 14 days</SelectItem>
              <SelectItem value='30'>Over 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={handleExportData}>
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='p-6 space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center space-x-4'>
                  <Skeleton className='h-12 w-full' />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className='p-6 text-center text-red-500'>
              Error loading overdue books. Please try again.
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className='p-6 text-center text-muted-foreground'>
              No overdue books found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[250px]'>
                    <div className='flex items-center'>
                      Book Title
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </div>
                  </TableHead>
                  <TableHead>Copy ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.borrowingId}>
                    <TableCell className='font-medium'>{book.title}</TableCell>
                    <TableCell>{book.copyId}</TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <UserRound className='mr-2 h-4 w-4 text-muted-foreground' />
                        {book.studentName as string}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                        {new Date(book.borrowDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                        {new Date(book.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
                        {getDaysOverdue(book.dueDate)} days
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOverdueStatus(book.dueDate).class}>
                        {getOverdueStatus(book.dueDate).label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSendReminder(
                                book.borrowingId,
                                book.studentId
                              )
                            }>
                            <Mail className='mr-2 h-4 w-4' />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserRound className='mr-2 h-4 w-4' />
                            View Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
