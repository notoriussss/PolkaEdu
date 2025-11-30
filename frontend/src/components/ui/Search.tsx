'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function Search({ 
  placeholder = "Buscar cursos...", 
  onSearch,
  className = "" 
}: SearchProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative rounded-2xl px-5 outline outline-1 outline-offset-[-1px] outline-zinc-500 overflow-hidden text-neutral-50/75 bg-transparent flex items-center gap-2 ${className}`}>
      <MagnifyingGlassIcon className="w-4 h-4 text-neutral-50/75" />
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-neutral-50/75 placeholder:text-neutral-50/75"
      />
    </div>
  );
}

