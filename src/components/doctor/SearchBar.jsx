// SearchBar.jsx
// Experiment 1a & 1d: SearchBar component using useRef to automatically focus doctor search field

import React, { useRef, useEffect } from "react";
import { Search, X, Target } from "lucide-react";

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search doctors by name, specialty, or qualification...",
  autoFocus = true
}) => {
  // Experiment 1d: Use the useRef hook to automatically focus search input & demonstrate DOM element referencing
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleManualFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      // Visual pulse indicator to demonstrate DOM referencing
      searchInputRef.current.classList.add("dom-highlight");
      setTimeout(() => {
        searchInputRef.current?.classList.remove("dom-highlight");
      }, 1000);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-box">
        <span className="search-icon-slot">
          <Search size={20} />
        </span>
        <input
          ref={searchInputRef}
          id="doctor-search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search doctors"
          className="search-bar-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleManualFocus}
        className="ref-demo-btn"
        title="Demonstrate DOM referencing using useRef hook"
      >
        <Target size={14} />
        <span>Focus (useRef Demo)</span>
      </button>
    </div>
  );
};

export default SearchBar;
