import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

function Homepage() {
  return (
    <div className='bg-blue-600'>
      <h1 className='text-white'>Hello react in electron</h1>
      <h1>Homepage</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
      </Routes>
    </Router>
  );
}
