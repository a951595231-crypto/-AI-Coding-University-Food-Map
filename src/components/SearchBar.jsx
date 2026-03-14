import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = '搜索餐厅、菜品...' }) {
  const [query, setQuery] = useState('');

  const handleSearch = (val) => {
    setQuery(val);
    onSearch?.(val);
  };

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 bg-gray-50 rounded-xl text-sm text-gray-700 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-brand-200 transition-all"
      />
      {query && (
        <button
          onClick={() => handleSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
