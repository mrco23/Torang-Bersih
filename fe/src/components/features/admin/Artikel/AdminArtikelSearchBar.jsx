// components/features/admin/artikel/AdminArtikelSearchBar.jsx
import React, { useEffect } from "react";
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiSettings4Line,
} from "react-icons/ri";

const AdminArtikelSearchBar = ({
  query,
  setQuery,
  handleSearch,
  categories,
  onManageRef,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Search Bar */}
      <form
        className="relative mb-4"
        onSubmit={handleSearch}
        autoComplete="off"
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Cari judul artikel atau penulis..."
            value={query.search}
            onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
            className="flex-1 rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
            style={{ color: "var(--dark-text)" }}
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
            tabIndex={0}
          >
            Cari
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Semua Kategori"
          value={query.kategori_id ?? ""}
          onChange={(val) => setQuery((q) => ({ ...q, kategori_id: val }))}
          options={[
            { value: "", label: "Semua Kategori" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.nama,
            })),
          ]}
        />
        <button
          onClick={onManageRef}
          className="flex items-center justify-center rounded-xl border border-gray-300 bg-white p-2.5 text-gray-500 transition-all hover:border-[#1e1f78] hover:bg-indigo-50 hover:text-[#1e1f78]"
          title="Kelola Daftar Kategori"
        >
          <RiSettings4Line size={20} />
        </button>

        <FilterDropdown
          label="Semua Status"
          value={query.status_publikasi ?? ""}
          onChange={(val) => setQuery((q) => ({ ...q, status_publikasi: val }))}
          options={[
            { value: "", label: "Semua Status" },
            { value: "published", label: "Terbit" },
            { value: "draft", label: "Draft" },
          ]}
        />

        <FilterDropdown
          label="Terbaru"
          value={query.sort_order ?? "desc"}
          onChange={(val) => setQuery((q) => ({ ...q, sort_order: val }))}
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
