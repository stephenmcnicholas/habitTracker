import React, { useState, useRef, useEffect } from 'react';

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

export const SegmentedEnergySlider = ({ value, onChange }) => {
  const energyColors = [
    'bg-red-500',     // 1 - Red
    'bg-orange-500',  // 2 - Orange
    'bg-yellow-500',  // 3 - Yellow
    'bg-green-300',   // 4 - Pale Green
    'bg-green-600'    // 5 - Bright Green
  ];

  return (
    <div className="w-full">
      <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden flex">
        {[1, 2, 3, 4, 5].map(num => (
          <div 
            key={num} 
            className={`flex-1 h-full relative 
              ${value >= num ? energyColors[num - 1] : 'bg-gray-200'}
              ${value === num ? 'z-10' : ''}`}
          ></div>
        ))}
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



export const CircularSleepSlider = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;
  const svgSize = 280; // Increased SVG size to prevent cropping

  // Convert hours to angle (0-12.75 hours maps to 0-360 degrees)
  const hoursToAngle = (hours) => {
    return (hours / 12.75) * 360;
  };

  // Convert angle to hours
  const angleToHours = (angle) => {
    return (angle / 360) * 12.75;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;

    const angle = Math.atan2(svgP.y - centerY, svgP.x - centerX) * (180 / Math.PI);
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    const hours = Math.min(12.75, Math.max(0, angleToHours(normalizedAngle)));

    onChange(Math.round(hours * 4) / 4); // Round to nearest 0.25
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const angle = hoursToAngle(value);
  const dashOffset = circumference - (angle / 360) * circumference;

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
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        />

        {/* Slider handle */}
        <circle
          cx={svgSize / 2 + radius * Math.cos((angle - 90) * (Math.PI / 180))}
          cy={svgSize / 2 + radius * Math.sin((angle - 90) * (Math.PI / 180))}
          r={strokeWidth / 2}
          fill="#4CAF50"
          onMouseDown={handleMouseDown}
          className="cursor-pointer"
        />

        {/* "Sleep" label */}
        <text 
          x={svgSize / 2} 
          y={svgSize / 2 - 40} 
          textAnchor="middle" 
          className="text-lg font-semibold fill-current text-gray-700 dark:text-white"
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