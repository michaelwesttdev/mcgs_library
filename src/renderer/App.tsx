import { Routes, Route } from "react-router";
import Dashboard from "./pages/DashBoard";
import RootLayout from "./Layout";
import Students from "./pages/students/Students";
import Staff from "./pages/staff/Staff";
import Books from "./pages/books/Books";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='students' element={<Students />} />
        <Route path='staff' element={<Staff />} />
        <Route path='books/:page' element={<Books />} />
      </Route>
    </Routes>
  );
}
