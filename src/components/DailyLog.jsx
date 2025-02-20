import React, { useState, useEffect } from 'react';

const DailyLog = () => {
  const [formData, setFormData] = useState({
    sleep: 7,
    energy: 3,
    alc: 0
  });
  const [sleepValue, setSleepValue] = useState(7);
  const [energyValue, setEnergyValue] = useState(3);
  const [stats, setStats] = useState({
    avgSleep: '-',
    avgEnergy: '-',
    totalAlc: '-'
  });
  const [recentEntries, setRecentEntries] = useState([]);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxIEillZ24Lg2L_8neq7vRkYwVYT0W-ScwZhS4BFFv69zCDAdwBwJ9Zc-1hHjxwHAN5/exec';

  const handleSliderChange = (e, type) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [type]: value }));
    if (type === 'sleep') setSleepValue(value);
    if (type === 'energy') setEnergyValue(value);
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
        totalAlc: data.totalAlc
      });
      
      setRecentEntries(data.recentEntries);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ avgSleep: '-', avgEnergy: '-', totalAlc: '-' });
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
          <label className="block mb-2 font-semibold dark:text-white">Sleep</label>
          <div className="space-y-2">
            <input 
              type="range" 
              min="3" 
              max="10" 
              step="0.5" 
              value={formData.sleep}
              onChange={(e) => handleSliderChange(e, 'sleep')}
              className="w-full"
            />
            <div className="flex justify-between text-sm dark:text-gray-300">
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <div className="text-center dark:text-white">
              Selected value: {sleepValue}
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold dark:text-white">Energy</label>
          <div className="space-y-2">
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={formData.energy}
              onChange={(e) => handleSliderChange(e, 'energy')}
              className="w-full"
            />
            <div className="flex justify-between text-sm dark:text-gray-300">
              {[1, 2, 3, 4, 5].map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <div className="text-center dark:text-white">
              Selected value: {energyValue}
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold dark:text-white">Alcohol</label>
          <input 
            type="number" 
            value={formData.alc}
            onChange={(e) => setFormData(prev => ({ ...prev, alc: e.target.value }))}
            min="0" 
            className="w-20 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
        <h2 className="text-xl font-bold mb-4 dark:text-white">Last 7 Days Summary</h2>
        
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