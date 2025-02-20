import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HabitTracker from './components/HabitTracker';
import CountdownTimer from './components/CountdownTimer';
import DarkModeToggle from './components/DarkModeToggle'; // Import the new component


function App() {
  return (
    <Router basename="/habittracker">
      <div className="min-h-screen bg-gray-50">
        <nav className="p-4 bg-white shadow">
          <div className="max-w-2xl mx-auto flex justify-between">
           <div className="flex space-x-4"> 
            <Link to="/" className="text-blue-500 hover:text-blue-600">Habits</Link>
            <Link to="/timer" className="text-blue-500 hover:text-blue-600">Timer</Link>
          </div>
          <DarkModeToggle /> 
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HabitTracker />} />
          <Route path="/timer" element={<CountdownTimer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;