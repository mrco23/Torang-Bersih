// components/features/admin/artikel/AdminArtikelSearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

function useDebouncePerWordEffect(callback, value, delay) {
  const handler = useRef();
  const lastFiredValue = useRef(undefined);

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed !== lastFiredValue.current) {
        callback(trimmed);
        lastFiredValue.current = trimmed;
      }
      return;
    }

    handler.current = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed !== lastFiredValue.current) {
        callback(trimmed);
        lastFiredValue.current = trimmed;
      }
    }, delay);

    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, [value, callback, delay]);
}

const AdminArtikelSearchBar = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  categories,
}) => {
  const [searchDraft, setSearchDraft] = useState(search ?? "");

  React.useEffect(() => {
    setSearchDraft(search ?? "");
  }, [search]);
  useDebouncePerWordEffect(
    (val) => {
      if (val !== (search ?? "").trim()) {
        onSearchChange?.(val);
      }
    },
    searchDraft,
    300,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchDraft.trim();
    if (trimmed !== (search ?? "").trim()) {
      onSearchChange?.(trimmed);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Search Bar */}
      <form
        className="relative mb-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <RiSearchLine
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari judul artikel atau penulis..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-12 text-sm transition-all outline-none focus:border-[#1e1f78] focus:ring-4 focus:ring-[#1e1f78]/10"
          style={{ color: "var(--dark-text)" }}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-[#1e1f78] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a1b65]"
          disabled={searchDraft.trim() === ""}
          tabIndex={0}
        >
          Cari
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Semua Kategori"
          value={filters?.kategori_id ?? ""}
          onChange={(val) => onFilterChange?.("kategori_id", val)}
          options={[
            { value: "", label: "Semua Kategori" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.nama,
            })),
          ]}
        />

        <FilterDropdown
          label="Semua Status"
          value={filters?.status_publikasi ?? ""}
          onChange={(val) => onFilterChange?.("status_publikasi", val)}
          options={[
            { value: "", label: "Semua Status" },
            { value: "published", label: "Terbit" },
            { value: "draft", label: "Draft" },
          ]}
        />

        <FilterDropdown
          label="Terbaru"
          value={filters?.sort_order ?? "desc"}
          onChange={(val) => onFilterChange?.("sort_order", val)}
          options={[
            { value: "desc", label: "Terbaru" },
            { value: "asc", label: "Terlama" },
          ]}
        />
      </div>
    </div>
  );
};

// Sub-komponen dropdown filter
const FilterDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label;

  // Supaya dropdown nutup kalau user klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-[#1e1f78] hover:bg-gray-50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        {selectedLabel}
        <RiArrowDownSLine size={16} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 max-h-60 w-48 overflow-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${opt.value === value ? "bg-[#f8f9ff] font-semibold text-[#1e1f78]" : "text-gray-700"}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              tabIndex={0}
              role="option"
              aria-selected={opt.value === value}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminArtikelSearchBar;
