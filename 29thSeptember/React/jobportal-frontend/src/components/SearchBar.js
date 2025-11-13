import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // 🔁 Pass the search query up to parent (ViewJobs, ViewApplicants, etc.)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center mb-6"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-80 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600"
      >
        🔍
      </button>
    </form>
  );
}
