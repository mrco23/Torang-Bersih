import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiH1,
  RiH2,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiLinkM,
  RiImageAddLine,
  RiSeparator,
  RiQuestionLine,
  RiLightbulbFlashLine,
  RiLeafLine,
  RiMegaphoneLine,
  RiText,
} from "react-icons/ri";
import { ProseStyles } from "../../../../ui/ProsesStyles";

/* ==============================
   Toolbar Definition
============================== */

const makeToolbar = (insertLink, clearFormatBlock) => [
  {
    group: "Teks",
    items: [
      { icon: <RiBold />, cmd: "bold", label: "Tebal" },
      { icon: <RiItalic />, cmd: "italic", label: "Miring" },
      { icon: <RiUnderline />, cmd: "underline", label: "Garis Bawah" },
    ],
  },
  {
    group: "Judul",
    items: [
      { icon: <RiH1 />, cmd: "formatBlock", val: "H2", label: "Judul Besar" },
      { icon: <RiH2 />, cmd: "formatBlock", val: "H3", label: "Judul Kecil" },
      { icon: <RiText />, fn: clearFormatBlock, label: "Teks Biasa" },
    ],
  },
  {
    group: "Daftar",
    items: [
      {
        icon: <RiListUnordered />,
        cmd: "insertUnorderedList",
        label: "• Poin",
      },
      {
        icon: <RiListOrdered />,
        cmd: "insertOrderedList",
        label: "1. Nomor",
      },
    ],
  },
  {
    group: "Lainnya",
    items: [
      {
        icon: <RiDoubleQuotesL />,
        cmd: "formatBlock",
        val: "BLOCKQUOTE",
        label: "Kutipan",
      },
      { icon: <RiLinkM />, fn: insertLink, label: "Link" },
      { icon: <RiImageAddLine />, fn: "img", label: "Gambar" },
      { icon: <RiSeparator />, fn: "hr", label: "Pemisah" },
    ],
  },
];

/* ==============================
   Help Panel
============================== */

const HELP_ITEMS = [
  { label: "Tebal", key: "Ctrl + B", desc: "Buat teks jadi tebal" },
  { label: "Miring", key: "Ctrl + I", desc: "Buat teks jadi miring" },
  { label: "Garis Bawah", key: "Ctrl + U", desc: "Beri garis bawah" },
  { label: "Judul Besar", key: "Klik H1", desc: "Sub judul utama" },
  { label: "Judul Kecil", key: "Klik H2", desc: "Sub judul kecil" },
  { label: "Teks Biasa", key: "Klik T", desc: "Kembali ke teks biasa" },
  { label: "Kutipan", key: "Klik Quote", desc: "Menampilkan kutipan" },
  { label: "Poin", key: "Klik • Poin", desc: "Daftar berpoin (tekan Enter 2x untuk keluar)" },
  { label: "Nomor", key: "Klik 1. Nomor", desc: "Daftar bernomor (tekan Enter 2x untuk keluar)" },
  { label: "Kutipan", key: "Klik Kutipan", desc: "Kutipan (tekan Enter 2x untuk keluar)" },
];

/* ==============================
   Prompt Questions
============================== */

const PROMPT_QUESTIONS = [
  {
    icon: <RiLightbulbFlashLine />,
    text: "Apa yang ingin kamu ceritakan hari ini?",
  },
  {
    icon: <RiLeafLine />,
    text: "Masalah lingkungan apa yang kamu lihat di sekitarmu?",
  },
  {
    icon: <RiMegaphoneLine />,
    text: "Ada tips menarik soal daur ulang atau sampah?",
  },
];

/* ==============================
   Editor Component
============================== */

const ArtikelEditor = forwardRef(function ArtikelEditor(
  { judul, konten, onJudulChange, onKontenChange },
  ref
) {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const [activePrompt, setActivePrompt] = useState(0);
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => editorRef.current);

  useEffect(() => {
    if (editorRef.current && konten !== undefined) {
      if (
        editorRef.current.innerHTML !== konten &&
        document.activeElement !== editorRef.current
      ) {
        editorRef.current.innerHTML = konten || "";
      }
    }
  }, [konten]);

  /* ==============================
     Commands
  ============================== */

  const execCmd = useCallback(
    (cmd, value = null) => {
      document.execCommand(cmd, false, value);
      editorRef.current?.focus();
      if (editorRef.current) {
        onKontenChange(editorRef.current.innerHTML);
      }
    },
    [onKontenChange]
  );

  const insertLink = useCallback(() => {
    const url = prompt("Masukkan URL\nContoh: https://google.com");
    if (url) execCmd("createLink", url);
  }, [execCmd]);

  const insertImage = useCallback(() => {
    const url = prompt("Masukkan URL gambar");
    if (url) {
      execCmd(
        "insertHTML",
        `<img src="${url}" style="max-width:100%;border-radius:8px;margin:16px 0;" /><p><br/></p>`
      );
    }
  }, [execCmd]);

  const insertDivider = useCallback(() => {
    execCmd("insertHTML", "<hr/><p><br/></p>");
  }, [execCmd]);

  // Untuk kembali ke format teks biasa dari heading/blockquote
  const clearFormatBlock = useCallback(() => {
    execCmd("formatBlock", "P");
  }, [execCmd]);

  // Fungsi untuk keluar dari list UL/OL atau blok kutipan dengan 2x Enter pada baris kosong
  const handleKeyDown = useCallback(
    (e) => {
      if (
        (e.key === "Enter" || e.keyCode === 13) &&
        editorRef.current &&
        window.getSelection
      ) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let anchorNode = sel.anchorNode;
        // Naik ke element node (bukan text node)
        while (anchorNode && anchorNode.nodeType !== 1) {
          anchorNode = anchorNode.parentNode;
        }
        if (!anchorNode) return;

        // --- Handling keluar dari LIST (ul/ol) ---
        let liNode =
          anchorNode.tagName === "LI"
            ? anchorNode
            : anchorNode.closest && anchorNode.closest("li");
        let listNode =
          liNode &&
          (liNode.parentNode.tagName === "UL" || liNode.parentNode.tagName === "OL")
            ? liNode.parentNode
            : null;

        if (liNode && listNode) {
          // Jika di li kosong, keluar dari ul/ol
          if (liNode.textContent === "" || /^\s*$/.test(liNode.textContent)) {
            e.preventDefault();

            // Sisipkan <p><br/></p> setelah list
            const brPara = document.createElement("p");
            brPara.innerHTML = "<br/>";
            if (listNode.parentNode) {
              if (listNode.nextSibling) {
                listNode.parentNode.insertBefore(brPara, listNode.nextSibling);
              } else {
                listNode.parentNode.appendChild(brPara);
              }
            }
            // Tempatkan kursor di <p>
            const range = document.createRange();
            range.setStart(brPara, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            // Hapus LI kosong
            liNode.parentNode.removeChild(liNode);

            // Kalau list kosong, hapus list-nya juga
            if (listNode.childNodes.length === 0) {
              listNode.parentNode.removeChild(listNode);
            }

            setTimeout(() => {
              if (editorRef.current) {
                onKontenChange(editorRef.current.innerHTML);
              }
            }, 0);
            return;
          }
        }

        // --- Handling keluar dari blockquote ---
        let blockquoteNode =
          anchorNode.tagName === "BLOCKQUOTE"
            ? anchorNode
            : anchorNode.closest && anchorNode.closest("blockquote");
        if (blockquoteNode) {
          // Pastikan hanya trigger kalau baris sekarang kosong
          if (
            anchorNode.textContent === "" ||
            /^\s*$/.test(anchorNode.textContent)
          ) {
            e.preventDefault();

            // Sisipkan <p><br/></p> setelah blockquote
            const brPara = document.createElement("p");
            brPara.innerHTML = "<br/>";
            if (blockquoteNode.parentNode) {
              if (blockquoteNode.nextSibling) {
                blockquoteNode.parentNode.insertBefore(
                  brPara,
                  blockquoteNode.nextSibling
                );
              } else {
                blockquoteNode.parentNode.appendChild(brPara);
              }
            }
            // Tempatkan kursor di <p>
            const range = document.createRange();
            range.setStart(brPara, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            // Hapus P kosong di blockquote (current node)
            if (
              anchorNode.parentNode === blockquoteNode &&
              anchorNode.tagName === "P"
            ) {
              anchorNode.parentNode.removeChild(anchorNode);
            }

            setTimeout(() => {
              if (editorRef.current) {
                onKontenChange(editorRef.current.innerHTML);
              }
            }, 0);
            return;
          }
        }
      }
    },
    [onKontenChange]
  );

  const TOOLBAR = makeToolbar(insertLink, clearFormatBlock);

  const handleToolbarClick = (item) => {
    if (item.fn === "img") {
      insertImage();
      return;
    }
    if (item.fn === "hr") {
      insertDivider();
      return;
    }
    if (item.fn) {
      item.fn();
      return;
    }
    execCmd(item.cmd, item.val ?? null);
  };

  /* ==============================
     Floating Toolbar (Seleksi Teks)
  ============================== */
  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setToolbarVisible(false);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const wrapRect =
      editorRef.current
        ?.closest(".editor-wrap")
        ?.getBoundingClientRect() ?? { top: 0, left: 0 };

    setToolbarPos({
      top: rect.top - wrapRect.top - 56,
      left: rect.left - wrapRect.left + rect.width / 2,
    });

    setToolbarVisible(true);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onKontenChange(editorRef.current.innerHTML);
    }
  };

  // Logika pengecekan kosong yang disempurnakan
  const isEmpty =
    !konten ||
    konten.trim() === "" ||
    konten === "<br>" ||
    konten === "<p><br></p>";

  return (
    <div className="editor-wrap relative rounded-sm">
      {/* =========================
         JUDUL
      ========================= */}
      <ProseStyles />

      <div className="mb-2">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
          Judul Artikel
        </label>

        <textarea
          value={judul}
          onChange={(e) => onJudulChange(e.target.value)}
          placeholder="Contoh: Cara Mudah Daur Ulang Sampah"
          rows={2}
          maxLength={150}
          className="w-full resize-none rounded-xl border-2 border-gray-100 px-4 py-3 text-2xl font-bold outline-none focus:border-[#1e1f78]"
        />

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>Judul harus jelas dan singkat</span>
          <span>{judul.length}/150</span>
        </div>
      </div>

      {/* =========================
         TOOLBAR
      ========================= */}

      <div className="sticky top-[64px] z-20 mb-4 rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-1 p-2">
          {TOOLBAR.map((group, gi) => (
            <div
              key={gi}
              className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/40 px-2 py-1"
            >
              {group.items.map((item, ii) => (
                <button
                  key={ii}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleToolbarClick(item);
                  }}
                  className="flex min-w-[42px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-gray-600 hover:bg-[#1e1f78]/5 hover:text-[#1e1f78]"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden text-[9px] sm:block">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {/* Help Button */}
          <div className="ml-auto">
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-400 hover:border-[#1e1f78] hover:text-[#1e1f78]"
            >
              <RiQuestionLine />
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="border-t border-gray-100 bg-[#f8f9ff] p-4">
            <p className="mb-3 text-xs font-bold text-[#1e1f78]">
              Cara Format Teks
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {HELP_ITEMS.map((h, i) => (
                <div key={i} className="rounded-lg border bg-white p-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold">{h.label}</span>
                    <kbd className="rounded bg-gray-100 px-1 text-[10px]">
                      {h.key}
                    </kbd>
                  </div>
                  <p className="text-[11px] text-gray-400">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================
         EDITOR
      ========================= */}

      <div className="relative rounded-xl border-2 border-gray-100 bg-white shadow-sm">
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 px-6 pt-6">
            <div className="mb-4 flex items-center gap-2 text-gray-300">
              <span className="text-lg">
                {PROMPT_QUESTIONS[activePrompt].icon}
              </span>
              <span>{PROMPT_QUESTIONS[activePrompt].text}</span>
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={handleSelect}
          onClick={() =>
            setActivePrompt((p) => (p + 1) % PROMPT_QUESTIONS.length)
          }
          className="prose min-h-[420px] max-w-none cursor-text px-6 py-6 outline-none"
          style={{ lineHeight: "1.9", fontSize: "1.05rem" }}
        />
      </div>

      <p className="mt-2 text-center text-[11px] text-gray-400">
        Pilih teks untuk membuka menu format cepat
      </p>

    </div>
  );
});

export default ArtikelEditor;