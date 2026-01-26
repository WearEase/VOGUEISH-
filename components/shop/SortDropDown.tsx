import { useState } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SortDropdown({ 
  options, 
  value, 
  onChange,
  className = ""
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 min-w-[200px]"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="flex-1 text-left">
          Sort: {selectedOption?.label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}