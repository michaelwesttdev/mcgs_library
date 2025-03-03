import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BooksList } from "./books-list";
import { AddBookForm } from "./add-book-form";
import { LendBookForm } from "./lend-book-form";
import OverdueBooksPage from "./overdue/Overdue";

export default function BooksManagement({ page }: Readonly<{ page: string }>) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(page ?? "main");

  useEffect(() => {
    if (page) setActiveTab(page);
  }, [page]);
  return (
    <Tabs
      onValueChange={(v) => setActiveTab(v)}
      value={activeTab}
      className='w-full'>
      <TabsList className='grid w-full max-w-md grid-cols-4 mb-6'>
        <TabsTrigger value='main'>Books List</TabsTrigger>
        <TabsTrigger value='add'>Add Book</TabsTrigger>
        <TabsTrigger value='lend'>Lend Book</TabsTrigger>
        <TabsTrigger value='overdue'>Overdue Books</TabsTrigger>
      </TabsList>

      <TabsContent value='main' className='space-y-4'>
        <BooksList onNavigate={setActiveTab} onSelectBook={setSelectedBook} />
      </TabsContent>

      <TabsContent value='add'>
        <AddBookForm />
      </TabsContent>

      <TabsContent value='lend'>
        <LendBookForm />
      </TabsContent>
      <TabsContent value='overdue'>
        <OverdueBooksPage />
      </TabsContent>
    </Tabs>
  );
}
