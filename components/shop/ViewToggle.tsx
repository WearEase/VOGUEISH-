import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

export default function ViewToggle({ 
  viewMode, 
  onViewChange,
  className = ""
}: ViewToggleProps) {
  return (
    <div className={`flex bg-gray-100 rounded-xl p-1 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`p-3 rounded-lg transition-all ${
          viewMode === 'grid' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Grid View"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-3 rounded-lg transition-all ${
          viewMode === 'list' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}