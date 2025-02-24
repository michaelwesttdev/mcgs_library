import { Routes, Route } from "react-router";
import Dashboard from "./pages/DashBoard";
import RootLayout from "./Layout";
import Students from "./pages/students/Students";
import Staff from "./pages/staff/Staff";
import Books from "./pages/books/Books";
import BooksLayout from "./pages/books/BooksLayout";
import Lend from "./pages/books/lend/Lend";
import Overdue from "./pages/books/overdue/Overdue";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='students' element={<Students />} />
        <Route path='staff' element={<Staff />} />
        <Route path='books' element={<BooksLayout />}>
          <Route index element={<Books />} />
          <Route path='lend' element={<Lend />} />
          <Route path='overdue' element={<Overdue />} />
        </Route>
      </Route>
    </Routes>
  );
}
