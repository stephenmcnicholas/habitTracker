// HabitTracker.jsx (Part 1 of 2)
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const HabitTracker = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitMinutes, setNewHabitMinutes] = useState('5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const habitsCollection = collection(db, 'habits');
        const habitSnapshot = await getDocs(habitsCollection);
        const habitList = habitSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          entries: doc.data().entries || {}
        }));
        setHabits(habitList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching habits:', error);
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const getWeekDates = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + 1;
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(curr);
      day.setDate(first + i);
      return day;
    });
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDisplayYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isFuture = (date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  const weekDates = getWeekDates(currentDate);

  const calculateStats = (entries) => {
    const dates = Object.keys(entries).sort();
    const total = dates.length;
    if (total === 0) return { total: 0, totalDays: 1, currentStreak: 0, longestStreak: 0 };

    const firstDate = new Date(Math.min(...dates.map(d => new Date(d))));
    const today = new Date();
    const totalDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    const hasYesterday = dates.includes(yesterdayStr);

    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const nextDate = i < dates.length - 1 ? new Date(dates[i + 1]) : null;

      tempStreak++;

      if (nextDate) {
        const daysDiff = Math.floor((nextDate - currentDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    if (hasYesterday) {
      currentStreak = 1;
      let checkDate = new Date(yesterday);

      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkDateStr = formatDate(checkDate);
        if (dates.includes(checkDateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return { total, totalDays, currentStreak, longestStreak };
  };

// HabitTracker.jsx (Part 2 of 2)

  const toggleHabitForDate = async (habitId, date) => {
    if (!isFuture(date)) {
      try {
        const habitRef = doc(db, 'habits', habitId);
        const habit = habits.find(h => h.id === habitId);
        const dateStr = formatDate(date);
        const newEntries = { ...habit.entries };

        if (newEntries[dateStr]) {
          delete newEntries[dateStr];
        } else {
          newEntries[dateStr] = true;
          
          // Check if this is today's date
          const today = new Date();
          const clickedDate = new Date(date);
          if (formatDate(today) === formatDate(clickedDate)) {
            // If it's today, navigate to timer with the habit's minutes
            await updateDoc(habitRef, { entries: newEntries });
            navigate(`/timer?minutes=${habit.minutes || 5}`);
            return;
          }
        }

        await updateDoc(habitRef, { entries: newEntries });
        setHabits(prevHabits =>
          prevHabits.map(h =>
            h.id === habitId
              ? { ...h, entries: newEntries }
              : h
          )
        );
      } catch (error) {
        console.error('Error updating habit:', error);
      }
    }
  };

  const addNewHabit = async () => {
    if (newHabitName.trim()) {
      try {
        const habitsCollection = collection(db, 'habits');
        const newHabitData = {
          name: newHabitName.trim(),
          minutes: parseInt(newHabitMinutes) || 5,
          entries: {},
          createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(habitsCollection, newHabitData);
        const newHabit = {
          id: docRef.id,
          ...newHabitData
        };

        setHabits(prev => [...prev, newHabit]);
        setNewHabitName('');
        setNewHabitMinutes('5');
        setShowAddHabit(false);
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(newDate);
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">
          {formatDisplayDate(weekDates[0])} - {formatDisplayYear(weekDates[6])}
        </h2>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(newDate);
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {habits.map(habit => {
          const stats = calculateStats(habit.entries);
          return (
            <div key={habit.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{habit.name}</h3>
                <div className="text-sm text-gray-500 text-right">
                  <span className="mr-4">Total: {stats.total}/{stats.totalDays}</span>
                  <span>Streak: {stats.currentStreak}/{stats.longestStreak}</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map(date => {
                  const dateStr = formatDate(date);
                  const isCompleted = habit.entries[dateStr];
                  const disabled = isFuture(date);
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleHabitForDate(habit.id, date)}
                      disabled={disabled}
                      className={`
                        p-2 rounded-full w-10 h-10 flex items-center justify-center
                        ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showAddHabit ? (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <div className="space-y-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="New habit name"
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Minutes of practice:</label>
              <input
                type="number"
                value={newHabitMinutes}
                onChange={(e) => setNewHabitMinutes(e.target.value)}
                min="1"
                max="60"
                className="w-20 p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddHabit(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addNewHabit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddHabit(true)}
          className="mt-4 w-full p-4 flex items-center justify-center space-x-2 bg-white rounded-lg shadow hover:bg-gray-50"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </button>
      )}
    </div>
  );
};

export default HabitTracker;
