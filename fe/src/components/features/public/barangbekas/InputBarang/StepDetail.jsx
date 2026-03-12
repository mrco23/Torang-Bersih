import React, { useState, useEffect } from "react";
import { RiCheckLine, RiRecycleLine } from "react-icons/ri";
import { KONDISI, inputCls } from "./Constant";
import { referensiAPI } from "../../../../../services/api/routes/referensi.route";

const Label = ({ children, req }) => (
  <p className="mb-1.5 text-[12px] font-bold text-gray-700">
    {children}
    {req && <span className="ml-0.5 text-red-400">*</span>}
  </p>
);

export const StepDetail = ({ form, setForm }) => {
  const [kategoriOptions, setKategoriOptions] = useState([]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await referensiAPI.getAll("kategori-barang");
        setKategoriOptions(res.data.data || []);
      } catch {
        /* ignore */
      }
    };
    fetchKategori();
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="flex h-full gap-6">
      <div className="flex w-1/2 flex-col gap-4">
        <div>
          <Label req>Nama Barang</Label>
          <input
            type="text"
            maxLength={150}
            placeholder="Cth: Botol Kaca Sirup Bekas"
            value={form.nama_barang}
            onChange={set("nama_barang")}
            className={inputCls}
          />
          <p className="mt-1 text-right text-[10px] text-gray-400">
            {form.nama_barang.length}/150
          </p>
        </div>

        <div>
          <Label req>Kategori Barang</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {kategoriOptions.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, kategori_barang_id: k.id }))
                }
                className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-center transition-all ${
                  form.kategori_barang_id === k.id
                    ? "border-[#1e1f78] bg-[#eef0ff]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <RiRecycleLine
                  size={16}
                  className={
                    form.kategori_barang_id === k.id
                      ? "text-[#1e1f78]"
                      : "text-gray-400"
                  }
                />
                <span
                  className={`text-[10px] font-bold ${form.kategori_barang_id === k.id ? "text-[#1e1f78]" : "text-gray-500"}`}
                >
                  {k.nama}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label req>Kondisi Barang</Label>
          <div className="space-y-1.5">
            {KONDISI.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, kondisi: k.value }))}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left transition-all ${
                  form.kondisi === k.value
                    ? k.active
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`size-2.5 shrink-0 rounded-full ${form.kondisi === k.value ? k.dot : "bg-gray-300"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-tight font-bold">
                    {k.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{k.desc}</p>
                </div>
                {form.kondisi === k.value && <RiCheckLine size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-1/2 flex-col">
        <div className="flex h-full flex-1 flex-col">
          <Label>Deskripsi Barang</Label>
          <textarea
            maxLength={1000}
            placeholder="Jelaskan kondisi barang, ukuran, bahan, dan informasi penting lainnya..."
            value={form.deskripsi_barang}
            onChange={set("deskripsi_barang")}
            className={`${inputCls} h-full flex-1 resize-none`}
          />
          <p className="mt-1.5 text-right text-[10px] text-gray-400">
            {form.deskripsi_barang.length}/1000
          </p>
        </div>
      </div>
    </div>
  );
};
