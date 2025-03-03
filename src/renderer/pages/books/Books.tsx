import { Suspense } from "react";
import BooksManagement from "./books-management";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "react-router";

export default function BooksPage() {
  const { page } = useParams();
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Library Books Management</h1>
      <Suspense fallback={<BooksSkeleton />}>
        <BooksManagement page={page} />
      </Suspense>
    </div>
  );
}

function BooksSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-10 w-[250px]' />
        <Skeleton className='h-10 w-[100px]' />
      </div>
      <Skeleton className='h-[500px] w-full' />
    </div>
  );
}
