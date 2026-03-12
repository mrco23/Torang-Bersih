import React, { useRef, useState, useCallback } from "react";
import { RiImageAddLine, RiAddLine, RiDraggable, RiCloseLine } from "react-icons/ri";
import { MAX_FOTO } from "../../barangbekas/InputBarang/Constant";

export const StepFoto = ({ fotos, setFotos }) => {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dragTarget = useRef(null);

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    const slots = MAX_FOTO - fotos.length;
    setFotos(prev => [
      ...prev,
      ...valid.slice(0, slots).map(f => ({
        file: f,
        url: URL.createObjectURL(f),
        id: Math.random().toString(36).slice(2),
      })),
    ]);
  }, [fotos.length, setFotos]);

  const remove = id => setFotos(prev => {
    const p = prev.find(x => x.id === id);
    if (p) URL.revokeObjectURL(p.url);
    return prev.filter(x => x.id !== id);
  });

  const onDrop = e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); };

  return (
    <div className="flex h-full gap-6">
      <div className="flex w-56 shrink-0 flex-col">
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all ${
            drag ? "border-[#1e1f78] bg-[#eef0ff]" : "border-gray-200 bg-gray-50 hover:border-[#1e1f78]/50 hover:bg-gray-100"
          }`}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <RiImageAddLine size={26} className="text-[#1e1f78]" />
          </div>
          <div className="text-center px-3">
            <p className="text-[13px] font-bold text-gray-700">{drag ? "Lepaskan di sini" : "Seret foto ke sini"}</p>
            <p className="mt-1 text-[11px] text-gray-400">atau klik untuk pilih</p>
            <p className="mt-2 text-[10px] text-gray-400">JPG · PNG · WEBP · Maks {MAX_FOTO} foto</p>
          </div>
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-[#1e1f78] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#16175e] transition-colors">
            <RiAddLine size={13} /> Pilih Foto
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold text-gray-700">Preview Foto</p>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500">
            {fotos.length}/{MAX_FOTO}
          </span>
        </div>

        {fotos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
            <p className="text-[12px] text-gray-400">Foto yang dipilih akan muncul di sini</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {fotos.map((foto, idx) => (
              <div key={foto.id} draggable onDragStart={() => setDraggingIdx(idx)} onDragEnter={() => { dragTarget.current = idx; }}
                onDragEnd={() => {
                  if (draggingIdx !== null && dragTarget.current !== null && draggingIdx !== dragTarget.current) {
                    setFotos(prev => {
                      const n = [...prev]; const [m] = n.splice(draggingIdx, 1); n.splice(dragTarget.current, 0, m); return n;
                    });
                  }
                  setDraggingIdx(null); dragTarget.current = null;
                }}
                className={`group relative aspect-square cursor-grab overflow-hidden rounded-xl border-2 transition-all active:cursor-grabbing ${
                  idx === 0 ? "border-[#1e1f78] ring-2 ring-[#1e1f78]/20" : "border-gray-200"
                } ${draggingIdx === idx ? "opacity-40 scale-95" : ""}`}
              >
                <img src={foto.url} alt="" className="h-full w-full object-cover" draggable={false} />
                {idx === 0 && <div className="absolute bottom-0 inset-x-0 bg-[#1e1f78] py-0.5 text-center text-[9px] font-bold text-white">Cover</div>}
                <div className="absolute left-1 top-1 hidden rounded bg-black/40 p-0.5 group-hover:flex"><RiDraggable size={10} className="text-white" /></div>
                <button type="button" onClick={e => { e.stopPropagation(); remove(foto.id); }} className="absolute right-1 top-1 hidden size-5 items-center justify-center rounded-full bg-red-500 text-white shadow group-hover:flex"><RiCloseLine size={12} /></button>
              </div>
            ))}
            {fotos.length < MAX_FOTO && (
              <button type="button" onClick={() => inputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#1e1f78]/50 hover:bg-gray-100 transition-all">
                <RiAddLine size={22} className="text-gray-300" />
              </button>
            )}
          </div>
        )}
        <p className="text-[11px] text-gray-400">Foto pertama jadi cover. Seret untuk mengubah urutan.</p>
      </div>
    </div>
  );
};