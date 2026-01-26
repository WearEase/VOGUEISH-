import { X } from "lucide-react";

export interface FilterState {
  category: string;
  brand: string[];
  priceRange: string;
  gender: string[];
  sortBy: string;
  searchQuery: string;
}

interface FilterOptions {
  brand: string[];
  priceRange: { label: string; value: string }[];
  gender: string[];
  sortBy: { label: string; value: string }[];
}

interface ProductFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function ProductFilters({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  isMobile = false,
  onClose,
}: ProductFiltersProps) {
  const handleMultiSelectFilter = (filterType: 'brand' | 'gender', value: string) => {
    const currentValues = filters[filterType];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    onFilterChange({ ...filters, [filterType]: newValues });
  };

  const handleSingleSelectFilter = (filterType: 'priceRange', value: string) => {
    const newValue = filters[filterType] === value ? '' : value;
    onFilterChange({ ...filters, [filterType]: newValue });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {isMobile && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="p-6">
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>
        )}

        <div className="space-y-8">
          {/* Brand Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Brand</h4>
            <div className="space-y-3">
              {filterOptions.brand.map((brand) => (
                <label key={brand} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleMultiSelectFilter('brand', brand)}
                      className="w-5 h-5 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    />
                  </div>
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Price Range</h4>
            <div className="space-y-3">
              {filterOptions.priceRange.map((range) => (
                <label key={range.value} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === range.value}
                      onChange={() => handleSingleSelectFilter('priceRange', range.value)}
                      className="w-5 h-5 border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    />
                  </div>
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Gender</h4>
            <div className="space-y-3">
              {filterOptions.gender.map((gender) => (
                <label key={gender} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.gender.includes(gender)}
                      onChange={() => handleMultiSelectFilter('gender', gender)}
                      className="w-5 h-5 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    />
                  </div>
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                    {gender}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <button
              onClick={onClearFilters}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium transition-all"
            >
              Clear All Filters
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}