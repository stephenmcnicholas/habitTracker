import React, { useState, useRef, useEffect } from 'react';

{/*}
export const GradientEnergySlider = ({ value, onChange }) => {
  const energyColors = [
    'bg-red-500',     // 1 - Red
    'bg-orange-500',  // 2 - Orange
    'bg-yellow-500',  // 3 - Yellow
    'bg-green-300',   // 4 - Pale Green
    'bg-green-600'    // 5 - Bright Green
  ];

  return (
    <div className="w-full">
      <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${energyColors[value - 1]}`}
          style={{ width: `${(value / 5) * 100}%`, transition: 'width 0.3s ease' }}
        ></div>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={value}
          onChange={onChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between mt-2 text-sm dark:text-white">
        {[1, 2, 3, 4, 5].map(num => (
          <span key={num} className={value === num ? 'font-bold' : ''}>
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};
*/}


export const SegmentedEnergySlider = ({ value, onChange }) => {
  const energyColors = [
    "bg-red-500", // 1 - Red
    "bg-orange-500", // 2 - Orange
    "bg-yellow-500", // 3 - Yellow
    "bg-green-300", // 4 - Pale Green
    "bg-green-600", // 5 - Bright Green
  ];

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Function to handle value updates
  const updateValue = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const newValue = Math.min(5, Math.max(1, Math.round(percent * 5))); // Snap to 1-5
    onChange({ target: { value: newValue } });
  };

  // Mouse and touch event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) updateValue(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) updateValue(e.touches[0].clientX);
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="w-full relative">
      <div
        ref={sliderRef}
        className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden flex items-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Label - Positioned absolutely */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-700 dark:text-white bg-red-500 px-2 rounded z-50">
          Energy
        </span>

        {/* Slider segments */}
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={`flex-1 h-full relative transition-colors
              ${value >= num ? energyColors[num - 1] : "bg-gray-200"} 
              ${value === num ? "z-10" : ""}`}
          ></div>
        ))}
        
        {/* Hidden input slider */}
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={onChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};



{/*
export const CustomThumbEnergySlider = ({ value, onChange }) => {
  const energyColors = [
    'bg-red-500',     // 1 - Red
    'bg-orange-500',  // 2 - Orange
    'bg-yellow-500',  // 3 - Yellow
    'bg-green-300',   // 4 - Pale Green
    'bg-green-600'    // 5 - Bright Green
  ];

  return (
    <div className="w-full relative">
      <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${energyColors[value - 1]}`}
          style={{ width: `${(value / 5) * 100}%`, transition: 'width 0.3s ease' }}
        >
          <div 
            className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 
              w-8 h-8 rounded-full bg-white shadow-lg"
          ></div>
        </div>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={value}
          onChange={onChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between mt-2 text-sm dark:text-white">
        {[1, 2, 3, 4, 5].map(num => (
          <span key={num} className={value === num ? 'font-bold' : ''}>
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};
*/}

export const CircularSleepSlider = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;
  const svgSize = 280;
  const MAX_HOURS = 12; // Maximum hours set to exactly 12

  const hoursToAngle = (hours) => {
    // Map 0-12 hours to 0-360 degrees, starting from top (12 o'clock)
    return ((hours / MAX_HOURS) * 360) - 90;
  };

  const angleToHours = (angle) => {
    // Adjust angle to convert to hours
    let adjustedAngle = angle + 90;
    adjustedAngle = adjustedAngle < 0 ? adjustedAngle + 360 : adjustedAngle;
    return (adjustedAngle / 360) * MAX_HOURS;
  };

  const calculateHours = (clientX, clientY) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;

    // Calculate angle from the vertical axis (12 o'clock position)
    const angle = Math.atan2(svgP.y - centerY, svgP.x - centerX) * (180 / Math.PI);
    
    const hours = Math.min(MAX_HOURS, Math.max(0, angleToHours(angle)));

    return Math.round(hours * 4) / 4; // Round to nearest 0.25
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const hours = calculateHours(e.clientX, e.clientY);
    onChange(hours);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const hours = calculateHours(touch.clientX, touch.clientY);
    onChange(hours);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const angle = hoursToAngle(value);

  return (
    <div className="w-full flex justify-center items-center">
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
        className="touch-none select-none"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="#4CAF50"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (Math.abs(angle + 90) / 360) * circumference}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        />

        {/* Slider handle */}
        <circle
          cx={svgSize / 2 + radius * Math.cos(angle * (Math.PI / 180))}
          cy={svgSize / 2 + radius * Math.sin(angle * (Math.PI / 180))}
          r={strokeWidth / 2}
          fill="#4CAF50"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="cursor-pointer"
        />

        {/* "Sleep" label */}
        <text 
          x={svgSize / 2} 
          y={svgSize / 2 - 40} 
          textAnchor="middle" 
          className="text-xl font-semibold fill-current text-gray-700 dark:text-white"
        >
          Sleep
        </text>

        {/* Sleep hours text */}
        <text 
          x={svgSize / 2} 
          y={svgSize / 2} 
          textAnchor="middle" 
          dy=".3em"
          className="text-2xl font-bold fill-current text-gray-700 dark:text-white"
        >
          {`${Math.floor(value)}h ${Math.round((value % 1) * 60)}m`}
        </text>
      </svg>
    </div>
  );
};

