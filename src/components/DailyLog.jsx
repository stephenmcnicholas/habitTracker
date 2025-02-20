import React, { useState, useEffect } from 'react';
//import { GradientEnergySlider} from './EnergySliders';
import { SegmentedEnergySlider} from './EnergySliders';
//import { CustomThumbEnergySlider} from './EnergySliders';
import { CircularSleepSlider } from './EnergySliders';




const DailyLog = () => {
  const [formData, setFormData] = useState({
    sleep: 8,
    energy: 3,
    alc: 0
  });
  const [sleepValue, setSleepValue] = useState(7);
  const [energyValue, setEnergyValue] = useState(3);
  const [stats, setStats] = useState({
    avgSleep: '-',
    avgEnergy: '-',
    totalAlc: '-',
    stepStreak: '-',
    dryStreak: '-'
  });
  const [recentEntries, setRecentEntries] = useState([]);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbynd1P4XhEhxsO_G2cgYRm2XZQt6-iTWyuk27YVVfTsXWyWFjHnSXPIWoinDLlv2rgB/exec';

  const handleSleepSliderChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, sleep: value }));
    setSleepValue(value);
  };

  const handleEnergySliderChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, energy: value }));
    setEnergyValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      alert('Form submitted successfully!');
      // Reset form
      setFormData({ sleep: 7, energy: 3, alc: 0 });
      setSleepValue(7);
      setEnergyValue(3);
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(scriptURL);
      const data = await response.json();
      
      setStats({
        avgSleep: data.averageSleep,
        avgEnergy: data.averageEnergy,
        totalAlc: data.totalAlc,
        stepStreak: data.stepStreak,
        dryStreak: data.dryStreak
      });
      
      setRecentEntries(data.recentEntries);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ 
        avgSleep: '-', 
        avgEnergy: '-', 
        totalAlc: '-',
        stepStreak: '-',
        dryStreak: '-'
      });
      setRecentEntries([]);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">How are you today?</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <CircularSleepSlider 
            value={formData.sleep}
            onChange={(hours) => {
              setFormData(prev => ({ ...prev, sleep: hours }));
              setSleepValue(hours);
            }}
          />
        </div>

        <div>
  {/*<label className="block mb-2 font-semibold dark:text-white">Energy</label> */}
  <div className="space-y-2">
    <SegmentedEnergySlider 
      value={formData.energy}
      onChange={(e) => {
        const value = Number(e.target.value);
        setFormData(prev => ({ ...prev, energy: value }));
        setEnergyValue(value);
      }}
    />
  </div>    
    </div>

        <div className="flex items-center space-x-3">
          <label className="font-semibold dark:text-white text-lg">Alcohol</label>
            <input 
              type="number" 
              value={formData.alc}
              onChange={(e) => setFormData(prev => ({ ...prev, alc: e.target.value }))}
              min="0" 
              className="w-20 p-2 border items-center rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
        <div className="stats-grid grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <h3 className="text-gray-600 dark:text-gray-300">Step Streak</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.stepStreak}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">days</div>
          </div>
          <div className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <h3 className="text-gray-600 dark:text-gray-300">Dry Streak</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.dryStreak}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">days</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 dark:text-white">Last 7 Days</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <h3 className="text-gray-600 dark:text-gray-300">Average Sleep</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.avgSleep}</div>
          </div>
          <div className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <h3 className="text-gray-600 dark:text-gray-300">Average Energy</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.avgEnergy}</div>
          </div>
          <div className="bg-white p-4 rounded shadow dark:bg-gray-700">
            <h3 className="text-gray-600 dark:text-gray-300">Total Alcohol</h3>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalAlc}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Entries</h3>
          <table className="w-full border-collapse dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-2 dark:border-gray-600 dark:text-white">Date</th>
                <th className="border p-2 dark:border-gray-600 dark:text-white">Sleep</th>
                <th className="border p-2 dark:border-gray-600 dark:text-white">Energy</th>
                <th className="border p-2 dark:border-gray-600 dark:text-white">Alcohol</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 dark:border-gray-600 dark:text-white">{entry.date}</td>
                  <td className="border p-2 dark:border-gray-600 dark:text-white">{entry.sleep}</td>
                  <td className="border p-2 dark:border-gray-600 dark:text-white">{entry.energy}</td>
                  <td className="border p-2 dark:border-gray-600 dark:text-white">{entry.alc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;