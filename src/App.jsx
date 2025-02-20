import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HabitTracker from './components/HabitTracker';
import CountdownTimer from './components/CountdownTimer';
import DarkModeToggle from './components/DarkModeToggle'; 
import DailyLog from './components/DailyLog'; 



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <nav className="p-4 bg-white shadow dark:bg-gray-800 dark:shadow-lg">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
           <div className="flex space-x-4"> 
            <Link to="/" className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">Habits</Link>
            <Link to="/timer" className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">Timer</Link>
            <Link to="/dailylog" className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">Daily Log</Link>
            <a href="https://stephenmcnicholas.github.io/mealtracker/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">
              Meals
            </a>
          </div>
          <DarkModeToggle /> 
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HabitTracker />} />
          <Route path="/timer" element={<CountdownTimer />} />
          <Route path="/dailylog" element={<DailyLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;