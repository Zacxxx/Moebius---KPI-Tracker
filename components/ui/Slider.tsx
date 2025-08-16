
import React from 'react';

interface SliderProps {
  id?: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, onValueChange, min, max, step, ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onValueChange([newValue]);
  };
  
  const progress = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-2 flex items-center group">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="absolute w-full h-2 appearance-none bg-transparent"
        style={{
          '--progress': `${progress}%`,
        } as React.CSSProperties}
        {...props}
      />
      <div className="absolute h-1 w-full bg-zinc-700/50 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500" style={{ width: `${progress}%` }}></div>
      </div>
      <div 
        className="absolute h-4 w-4 bg-white rounded-full border-2 border-violet-500 shadow transition-transform group-hover:scale-110" 
        style={{ left: `calc(${progress}% - 8px)` }}
      ></div>
    </div>
  );
};

// Add some styles to the head for the slider thumb and track
const sliderStyles = `
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: white;
    cursor: pointer;
    border: 2px solid #8b5cf6;
    margin-top: -6px; /* (track-height - thumb-height) / 2 */
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: white;
    cursor: pointer;
    border: 2px solid #8b5cf6;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = sliderStyles;
document.head.appendChild(styleSheet);