import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Vektor from "../../../public/images/DaftarKolabolatorVektor.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || 16);
  }, [center, zoom, map]);
  return null;
};

// MapTracker: Mencatat titik tengah saat peta digeser & memicu Reverse Geocoding
const MapTracker = ({ onPositionChange }) => {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      onPositionChange([center.lat, center.lng]);
    },
  });
  return null;
};

const RegisterKolaborator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // STATE PETA & LOKASI
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([1.4748, 124.8421]); // Default Manado
  const [mapZoom, setMapZoom] = useState(14);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // State untuk menyimpan nama jalan/alamat dari titik pin saat ini (Reverse Geocoding)
  const [pinAddressName, setPinAddressName] = useState("Mengambil detail lokasi...");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const [formData, setFormData] = useState({
    nama_organisasi: "",
    jenis_kolaborator: "",
    deskripsi: "",
    logo_url: "",
    kabupaten_kota: "",
    alamat_lengkap: "",
    latitude: 1.4748,
    longitude: 124.8421,
    nama_pic: "",
    no_whatsapp: "",
    email: "",
  });

  // 1. FORWARD GEOCODING (Mencari koordinat dari teks ketikan)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 3) {
        setIsSearching(true);
        try {
          const areaFilter = formData.kabupaten_kota || "Sulawesi Utara";
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}, ${areaFilter}&limit=5`
          );
          const data = await response.json();
          setSearchResults(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Autocomplete error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };
    const timerId = setTimeout(fetchSuggestions, 800);
    return () => clearTimeout(timerId);
  }, [searchQuery, formData.kabupaten_kota]);

  // 2. REVERSE GEOCODING (Menerjemahkan koordinat Pin menjadi Teks Alamat)
  const fetchAddressFromCoords = async (lat, lon) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        // Mengambil nama jalan atau patokan terdekat
        const shortAddress = data.address.road || data.address.neighbourhood || data.address.suburb || data.display_name.split(",")[0];
        setPinAddressName(data.display_name); // Alamat lengkap untuk info di modal
        
        // Opsional: Langsung update state form dengan nama jalan yang didapat
        setFormData(prev => ({ 
          ...prev, 
          latitude: lat, 
          longitude: lon,
          alamat_lengkap: prev.alamat_lengkap ? prev.alamat_lengkap : shortAddress // Isi jika masih kosong
        }));
      } else {
        setPinAddressName("Alamat tidak terdeteksi di area ini.");
      }
    } catch (error) {
      setPinAddressName("Gagal mengambil detail lokasi.");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Trigger pencarian alamat ketika pin bergeser (Debounce agar API tidak kena block)
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isMapModalOpen) {
        fetchAddressFromCoords(formData.latitude, formData.longitude);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [formData.latitude, formData.longitude, isMapModalOpen]);

  // 3. FITUR "GUNAKAN LOKASI SAAT INI" (GPS DEVICE)
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi GPS.");
      return;
    }
    
    setPinAddressName("Mencari sinyal GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setMapCenter([lat, lon]);
        setMapZoom(18); // Zoom paling dekat
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
        // Reverse geocode akan otomatis tertrigger oleh useEffect di atas
      },
      (error) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin GPS (Location) browser diaktifkan.");
        setPinAddressName("Geser peta untuk menentukan titik.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setMapCenter([lat, lon]);
    setMapZoom(18);
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
    setSearchQuery(place.display_name.split(",")[0]);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenMapModal = () => {
    if (!formData.kabupaten_kota) {
      alert("Pilih Kota/Kabupaten terlebih dahulu agar peta lebih presisi.");
      return;
    }
    setMapCenter([formData.latitude, formData.longitude]);
    setIsMapModalOpen(true);
  };

  const handleConfirmLocation = () => {
    // Saat user konfirmasi, timpa kolom alamat lengkap dengan hasil reverse geocode (jika belum diubah manual)
    if (!formData.alamat_lengkap || formData.alamat_lengkap.length < 5) {
      const shortAddr = pinAddressName.split(",").slice(0, 2).join(", ");
      setFormData(prev => ({ ...prev, alamat_lengkap: shortAddr }));
    }
    setIsMapModalOpen(false);
  };

  // Validasi Step
  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.nama_organisasi || !formData.jenis_kolaborator || !formData.deskripsi) {
        return alert("Mohon lengkapi semua bidang pada Profil Organisasi.");
      }
    }
    if (currentStep === 2) {
      if (!formData.kabupaten_kota || !formData.alamat_lengkap) {
        return alert("Mohon lengkapi Kota/Kabupaten dan Alamat Lengkap.");
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_pic || !formData.no_whatsapp || !formData.email) {
      return alert("Mohon lengkapi semua bidang kontak.");
    }
    alert("Pendaftaran Berhasil dikirim!");
    navigate("/kolaborator");
  };

  const steps = [
    { num: 1, title: "Profil Organisasi" },
    { num: 2, title: "Lokasi & Operasional" },
    { num: 3, title: "Kontak & Verifikasi" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] p-4 sm:p-8 font-sans relative">
      
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900">
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Batal Daftar
      </button>

      <div className="flex w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:flex-row h-[600px] mt-10 md:mt-0 relative z-10">
        
        {/* SIDEBAR KIRI */}
        <div className="relative flex w-full flex-col bg-[#1e1f78] p-10 text-white md:w-[35%] shrink-0 overflow-hidden">
          <div className="relative z-10 flex flex-col gap-10 mt-6">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div className={`flex size-[42px] shrink-0 items-center justify-center rounded-full border border-white text-sm font-bold transition-all ${currentStep === step.num ? "bg-white text-[#1e1f78]" : "bg-transparent text-white opacity-80"}`}>
                  {step.num}
                </div>
                <div className={`flex flex-col transition-opacity ${currentStep === step.num ? "opacity-100" : "opacity-80"}`}>
                  <span className="text-[13px] tracking-wide">Step {step.num}</span>
                  <span className="text-base font-semibold">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
          <img src={Vektor} alt="Ornamen" className="absolute bottom-0 left-0 w-full object-cover pointer-events-none opacity-80" />
        </div>

        {/* FORM KANAN */}
        <div className="flex w-full flex-col md:w-[65%] relative">
          <div className="flex-1 overflow-y-auto p-10 md:px-16 md:pt-12 pb-6">
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-[22px] font-bold text-gray-900 mb-8">Profil Kolabolator</h2>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Apa nama resmi organisasi atau komunitas Anda?</label>
                  <input type="text" name="nama_organisasi" value={formData.nama_organisasi} onChange={handleChange} placeholder="Cth: Trash Hero Manado" className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Termasuk dalam kategori apakah gerakan Anda?</label>
                  <select name="jenis_kolaborator" value={formData.jenis_kolaborator} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none text-gray-600" required>
                    <option value="" disabled>-- Kategori --</option>
                    <option value="Komunitas">Komunitas</option>
                    <option value="LSM">LSM</option>
                    <option value="Sekolah">Sekolah / Universitas</option>
                    <option value="Instansi">Instansi Pemerintah</option>
                    <option value="CSR">CSR Perusahaan</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Ceritakan singkat fokus utama gerakan persampahan Anda.</label>
                  <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" className="w-full resize-none rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required></textarea>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Unggah logo</label>
                  <button type="button" className="flex items-center justify-center gap-2 rounded border border-gray-300 px-6 py-2.5 text-sm font-semibold text-[#1e1f78] hover:bg-gray-50">
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload File
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-[22px] font-bold text-gray-900 mb-8">Lokasi & Operasional</h2>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Pilih Kota/Kabupaten operasional Anda.</label>
                  <select name="kabupaten_kota" value={formData.kabupaten_kota} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none text-gray-600" required>
                    <option value="" disabled>-- Kota/Kabupaten --</option>
                    <option value="Kota Manado">Kota Manado</option>
                    <option value="Kota Bitung">Kota Bitung</option>
                    <option value="Kota Tomohon">Kota Tomohon</option>
                    <option value="Kabupaten Minahasa">Kabupaten Minahasa</option>
                    <option value="Kabupaten Minahasa Utara">Kabupaten Minahasa Utara</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Tuliskan alamat lengkap lokasi Anda.</label>
                  <input type="text" name="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} placeholder="Jalan / Tempat" className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required />
                </div>
                
                <div className="relative h-[160px] w-full overflow-hidden rounded border border-gray-300 z-0 bg-gray-100">
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                    <button type="button" onClick={handleOpenMapModal} className="flex items-center gap-2 rounded bg-[#1e1f78] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#16175e] transition-colors">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Atur Pin Lokasi Peta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-[22px] font-bold text-gray-900 mb-8">Kontak & Verifikasi</h2>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Nama Penanggung Jawab?</label>
                  <input type="text" name="nama_pic" value={formData.nama_pic} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Nomor WhatsApp?</label>
                  <input type="tel" name="no_whatsapp" value={formData.no_whatsapp} onChange={handleChange} placeholder="+62" className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-800">Email ?</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1e1f78] focus:outline-none" required />
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between px-10 md:px-16 py-8 border-t border-gray-100 bg-white">
            <button type="button" onClick={currentStep === 1 ? () => navigate(-1) : handlePrev} className="text-sm font-bold text-gray-900 hover:text-[#1e1f78]">Kembali</button>
            <button type="button" onClick={currentStep === 3 ? handleSubmit : handleNext} className="rounded bg-[#1e1f78] px-10 py-2.5 text-sm font-bold text-white hover:bg-[#16175e] transition-colors">{currentStep === 3 ? "Daftar" : "Lanjut"}</button>
          </div>
        </div>
      </div>

      {/* ================= MODAL MAP (SHOPEE UX DEWA) ================= */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleConfirmLocation}></div>
          
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            <div className="border-b px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Tentukan Titik Akurat</h3>
                <button onClick={handleConfirmLocation} className="text-gray-400 hover:text-red-500">
                  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {/* KOLOM PENCARIAN & TOMBOL GPS */}
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Cari alamat di ${formData.kabupaten_kota}...`} 
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-10 py-2.5 text-sm focus:border-[#1e1f78] focus:ring-1 focus:ring-[#1e1f78] outline-none" 
                  />
                  {isSearching && (
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-[#1e1f78]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  )}
                </div>
                
                <button onClick={handleUseMyLocation} title="Gunakan Lokasi Saat Ini (GPS)" className="flex items-center justify-center shrink-0 w-11 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>

                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto rounded-lg bg-white shadow-xl border border-gray-200 z-[999]">
                    <ul className="py-1">
                      {searchResults.map((place, idx) => (
                        <li key={idx} onClick={() => handleSelectSuggestion(place)} className="flex cursor-pointer items-start gap-3 px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                          <svg className="mt-0.5 size-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{place.display_name.split(",")[0]}</span>
                            <span className="text-[11px] text-gray-500 line-clamp-1">{place.display_name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* AREA PETA */}
            <div className="relative h-[350px] w-full bg-gray-200 z-0">
              <MapContainer center={mapCenter} zoom={mapZoom} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapTracker onPositionChange={(pos) => setFormData(prev => ({...prev, latitude: pos[0], longitude: pos[1]}))} />
              </MapContainer>
              
              {/* PIN TENGAH PETA */}
              <div className="absolute top-1/2 left-1/2 z-[400] -translate-x-1/2 -translate-y-full pointer-events-none drop-shadow-xl">
                <div className="relative">
                  <svg className="size-11 text-red-600 animate-bounce" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s9.75 11.25 9.75 11.25 9.75-5.865 9.75-11.25S17.385 2.25 12 2.25zM12 15a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/30 rounded-[100%] blur-[1px]"></div>
                </div>
              </div>
            </div>

            {/* INFO ALAMAT & FOOTER MODAL */}
            <div className="bg-white px-5 py-4 border-t z-10">
              <div className="mb-4 flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <svg className="mt-0.5 size-5 shrink-0 text-[#1e1f78]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#1e1f78] uppercase tracking-wider mb-0.5">Lokasi Terdeteksi</span>
                  <span className="text-sm text-gray-700 leading-snug font-medium line-clamp-2">
                    {isFetchingAddress ? "Mencari alamat..." : pinAddressName}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleConfirmLocation} className="rounded bg-[#1e1f78] px-8 py-2.5 text-sm font-bold text-white hover:bg-[#16175e] shadow-md transition-colors w-full sm:w-auto">
                  Gunakan Titik Ini
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterKolaborator;