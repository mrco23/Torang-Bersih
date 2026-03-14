// components/features/admin/artikel/AdminArtikelSearchBar.jsx
import React, { useState, useRef } from "react";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

/**
 * AdminArtikelSearchBar adalah search/filter bar lengkap untuk Admin Artikel.
 * Komponen ini akan trigger pencarian dengan debounce per kata:
 * - Ketika user mengetik, pencarian tidak langsung dilakukan
 * - Pencarian dilakukan ketika user berhenti mengetik selama 300ms ATAU setelah mengetik spasi (per kata)
 *
 * Props:
 *   - search: nilai string input pencarian
 *   - onSearchChange: fn(string) -> void, dipanggil setiap input berubah (debounced per kata)
 *   - filters: {jenis, status, sort}
 *   - onFilterChange: fn(field, value)
 */
function useDebouncePerWordEffect(callback, value, delay) {
  // Reference untuk timer debounce
  const handler = useRef();
  // Reference untuk value terakhir yang di-firing (supaya tidak trigger jika sama)
  const lastFiredValue = useRef(undefined);

  React.useEffect(() => {
    if (handler.current) clearTimeout(handler.current);

    // Pencarian langsung jika ada spasi di akhir (user menekan spasi = selesai mengetik kata)
    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed !== lastFiredValue.current) {
        callback(trimmed);
        lastFiredValue.current = trimmed;
      }
      return; // Tidak perlu debounce jika per kata
    }

    // Debounce: jika user masih mengetik, tunggu interval baru trigger pencarian
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
}) => {
  const [searchDraft, setSearchDraft] = useState(search ?? "");

  // Sync ke input jika props search berubah (reset)
  React.useEffect(() => {
    setSearchDraft(search ?? "");
  }, [search]);

  // Debounce pencarian: trigger per spasi (per kata) atau 300ms setelah user berhenti mengetik
  useDebouncePerWordEffect(
    (val) => {
      if (val !== (search ?? "").trim()) {
        onSearchChange?.(val);
      }
    },
    searchDraft,
    300
  );

  // Submit via tombol/enter langsung pakai nilai terkini (tidak debounce)
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchDraft.trim();
    // Selalu trigger handler agar ada feedback
    if (trimmed !== (search ?? "").trim()) {
      onSearchChange?.(trimmed);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
      {/* Search Bar */}
      <form className="relative mb-4" onSubmit={handleSubmit} autoComplete="off">
        <RiSearchLine
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari judul artikel atau penulis..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 
                     text-sm outline-none transition-all
                     focus:border-[#1e1f78] focus:ring-4 focus:ring-[#1e1f78]/10"
          style={{ color: "var(--dark-text)" }}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 
                     bg-[#1e1f78] text-white px-6 py-2.5 
                     rounded-lg text-sm font-semibold
                     hover:bg-[#1a1b65] transition-colors"
          disabled={searchDraft.trim() === ""}
          tabIndex={0}
        >
          Cari
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Semua Jenis"
          value={filters?.jenis ?? ""}
          onChange={(val) => onFilterChange?.("jenis", val)}
          options={[
            { value: "", label: "Semua Jenis" },
            { value: "edukasi", label: "Edukasi" },
            { value: "berita", label: "Berita" },
            { value: "event", label: "Event" },
          ]}
        />

        <FilterDropdown
          label="Semua Status"
          value={filters?.status ?? ""}
          onChange={(val) => onFilterChange?.("status", val)}
          options={[
            { value: "", label: "Semua Status" },
            { value: "published", label: "Terbit" },
            { value: "draft", label: "Draft" },
          ]}
        />

        <FilterDropdown
          label="Terbaru"
          value={filters?.sort ?? "terbaru"}
          onChange={(val) => onFilterChange?.("sort", val)}
          options={[
            { value: "terbaru", label: "Terbaru" },
            { value: "terlama", label: "Terlama" },
            { value: "terpopuler", label: "Terpopuler" },
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
  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  // Supaya dropdown nutup kalau user klik di luar
  React.useEffect(() => {
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl 
                   border border-gray-300 bg-white
                   text-sm font-medium text-gray-700
                   hover:border-[#1e1f78] hover:bg-gray-50
                   transition-all"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        {selectedLabel}
        <RiArrowDownSLine size={16} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white 
                        rounded-xl border border-gray-200 shadow-lg 
                        py-2 z-20 max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`w-full text-left px-4 py-2 text-sm
                          hover:bg-gray-50 transition-colors
                          ${opt.value === value ? "bg-[#f8f9ff] text-[#1e1f78] font-semibold" : "text-gray-700"}`}
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