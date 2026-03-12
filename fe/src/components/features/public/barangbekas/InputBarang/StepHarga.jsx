import React from "react";
import { RiPriceTag3Line, RiGiftLine, RiWeightLine, RiImageAddLine } from "react-icons/ri";
import { inputCls } from "../../barangbekas/InputBarang/Constant";

const Label = ({ children, req }) => (
  <p className="mb-1.5 text-[12px] font-bold text-gray-700">
    {children}{req && <span className="ml-0.5 text-red-400">*</span>}
  </p>
);

export const StepHarga = ({ form, setForm }) => {
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  
  return (
    <div className="flex h-full gap-6">
      <div className="flex w-1/2 flex-col gap-5">
        <div>
          <Label>Mode Penawaran</Label>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5">
            <button type="button" onClick={() => setForm(p => ({ ...p, isDonasi: false }))}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold transition-all ${
                !form.isDonasi ? "bg-[#1e1f78] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}><RiPriceTag3Line size={15} /> Jual</button>
            <button type="button" onClick={() => setForm(p => ({ ...p, isDonasi: true, harga: "0" }))}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold transition-all ${
                form.isDonasi ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}><RiGiftLine size={15} /> Donasi Gratis</button>
          </div>
        </div>

        {!form.isDonasi ? (
          <div>
            <Label req>Harga Jual (Rp)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">Rp</span>
              <input type="number" min={0} placeholder="50.000" value={form.harga} onChange={set("harga")} className={`${inputCls} pl-10`} />
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400">Masukkan 0 jika ingin memberikan secara gratis</p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <RiGiftLine size={20} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-[13px] font-bold text-emerald-800">Barang Donasi Gratis</p>
              <p className="mt-0.5 text-[12px] text-emerald-600">Barang ini akan ditawarkan tanpa biaya kepada yang membutuhkan.</p>
            </div>
          </div>
        )}

        <div>
          <Label>Estimasi Berat</Label>
          <div className="relative">
            <RiWeightLine size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" step="0.1" min={0} placeholder="2.5" value={form.berat_estimasi_kg} onChange={set("berat_estimasi_kg")} className={`${inputCls} pl-9 pr-10`} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400">kg</span>
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">Opsional — membantu pembeli memperkirakan biaya pengiriman</p>
        </div>
      </div>

      <div className="flex w-1/2 flex-col">
        <Label>Pratinjau Harga</Label>
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
          <div className="w-full max-w-[220px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#eef0ff] to-[#e5f9fd]">
              <RiImageAddLine size={32} className="text-gray-300" />
            </div>
            <div className="p-3">
              <p className="truncate text-[12px] font-bold text-gray-800">{form.nama_barang || "Nama Barang"}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{form.kondisi || "Kondisi"} · {form.kategori_barang || "Kategori"}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[15px] font-black ${form.isDonasi ? "text-emerald-600" : "text-[#1e1f78]"}`}>
                  {form.isDonasi ? "Gratis" : form.harga ? `Rp ${parseInt(form.harga).toLocaleString("id-ID")}` : "Rp —"}
                </span>
                {form.berat_estimasi_kg && <span className="text-[10px] text-gray-400">{form.berat_estimasi_kg} kg</span>}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">Tampilan kartu di marketplace</p>
        </div>
      </div>
    </div>
  );
};