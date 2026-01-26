interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  className = ""
}: CategoryTabsProps) {
  return (
    <div className={`flex justify-center gap-2 flex-wrap ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeCategory === category 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-105" 
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}