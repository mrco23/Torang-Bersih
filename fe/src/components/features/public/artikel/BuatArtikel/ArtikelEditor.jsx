import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useLocation } from "react-router-dom";
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
  RiDeleteBinLine,
  RiArrowLeftRightLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import { ProseStyles } from "../../../../ui/ProsesStyles";
// --- Remove unresolved import ---
// import PromptModal from "../../../../common/PromptModal";

/** ========================================
 * Simple Fallback Modal for Prompt Input (no external file)
 * ========================================
 */
function PromptModal({
  open,
  title,
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setValue("");
  }, [open]);
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(30,31,120,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "2.1rem 1.3rem 1.3rem 1.3rem",
          minWidth: 300,
          boxShadow: "0 8px 32px 0 #9992",
          position: "relative",
          maxWidth: 380,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            background: "none",
            border: "none",
            fontWeight: 600,
            fontSize: 19,
            color: "#1e1f78",
            cursor: "pointer",
            zIndex: 2,
            padding: 2,
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Tutup"
        >
          ×
        </button>
        {title && (
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 15,
              color: "#1e1f78",
            }}
          >
            {title}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value);
          }}
        >
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem",
              border: "1.5px solid #e0e7ff",
              borderRadius: 7,
              marginBottom: 14,
              fontSize: 15.5,
              outline: "none",
              background: "#f8f9ff",
              fontWeight: 500,
              color: "#222",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#1e1f78",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              minWidth: 94,
              fontWeight: 700,
              padding: "8px 0",
              fontSize: 14,
              cursor: "pointer",
              marginRight: 7,
            }}
          >
            {submitLabel || "Simpan"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              color: "#787878",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              minWidth: 68,
              fontWeight: 500,
              padding: "8px 0",
              fontSize: 13.6,
              marginLeft: 2,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}

/** ========================================
 * Image Toolbar Overlay: Responsive, Delete on Left
 * ========================================
 */
const ImageToolbarOverlay = ({
  targetImg,
  onAlignChange,
  onClose,
  onRemove,
  onWidthChange,
}) => {
  const overlayRef = useRef();
  const [rect, setRect] = useState(null);
  const [align, setAlign] = useState(
    targetImg?.getAttribute("data-imgalign") || "center",
  );
  const [widthPct, setWidthPct] = useState(
    parseInt(
      targetImg?.style?.width && targetImg.style.width.includes("%")
        ? targetImg.style.width.replace("%", "")
        : 100,
      10,
    ),
  );

  useEffect(() => {
    if (!targetImg) return;
    const updateRect = () => {
      const currentRect = targetImg.getBoundingClientRect();
      setRect({
        width: currentRect.width,
        height: currentRect.height,
        left: targetImg.offsetLeft,
        top: targetImg.offsetTop,
      });
      setAlign(targetImg.getAttribute("data-imgalign") || "center");
      setWidthPct(
        parseInt(
          targetImg.style.width && targetImg.style.width.includes("%")
            ? targetImg.style.width.replace("%", "")
            : 100,
          10,
        ),
      );
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    let observer;
    if ("ResizeObserver" in window) {
      observer = new window.ResizeObserver(updateRect);
      observer.observe(targetImg);
    } else {
      const interval = setInterval(updateRect, 120);
      overlayRef.current && (overlayRef.current._interval = interval);
    }

    return () => {
      window.removeEventListener("resize", updateRect);
      if (observer) observer.disconnect();
      if (overlayRef.current && overlayRef.current._interval) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearInterval(overlayRef.current._interval);
      }
    };
  }, [targetImg]);

  if (!targetImg || !rect) return null;

  const overlayStyle = {
    position: "absolute",
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    zIndex: 50,
    pointerEvents: "none",
    userSelect: "none",
    transition: "left 0.12s, top 0.12s, width 0.09s, height 0.09s",
  };
  const toolbarStyle = {
    position: "absolute",
    left: "50%",
    bottom: "-62px",
    transform: "translateX(-50%)",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "7px 12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0px 2px 10px 0px #9992",
    pointerEvents: "auto",
    alignItems: "center",
    minWidth: 180,
    maxWidth: "95vw",
    zIndex: 51,
  };
  const removeBtnStyle = {
    position: "absolute",
    top: 4,
    left: 4,
    zIndex: 52,
    color: "#fff",
    background: "#e24f5e",
    border: 0,
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    boxShadow: "0px 1px 8px 0px #4444",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
    transition: "background 0.13s",
  };
  const closeBtnStyle = {
    position: "absolute",
    top: "-36px",
    right: 0,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    color: "#1e1f78",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
    boxShadow: "0px 2px 8px 0 #2221",
    fontSize: "17px",
    zIndex: 52,
  };

  return (
    <div ref={overlayRef} style={overlayStyle}>
      <button style={removeBtnStyle} title="Hapus gambar" onClick={onRemove}>
        <RiDeleteBinLine />
      </button>
      <div
        style={{
          borderRadius: "9px",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          boxSizing: "border-box",
          border: "2px solid #1e1f7822",
          transition: "border 0.12s",
        }}
      />
      <div style={toolbarStyle} className="image-toolbar-overlay-toolbar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: 80,
            gap: 7,
            flex: "1 1 80px",
          }}
        >
          <RiArrowLeftRightLine style={{ fontSize: 16, opacity: 0.77 }} />
          <input
            type="range"
            min={20}
            max={100}
            value={widthPct}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setWidthPct(val);
              if (onWidthChange) onWidthChange(val);
            }}
            style={{ width: 60, flex: "0 0 60px" }}
          />
          <span style={{ fontSize: 13, color: "#222", minWidth: 38 }}>
            {widthPct}%
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[
            { key: "left", label: "Kiri" },
            { key: "center", label: "Tengah" },
            { key: "right", label: "Kanan" },
          ].map((a) => (
            <button
              key={a.key}
              onClick={() => {
                setAlign(a.key);
                if (onAlignChange) onAlignChange(a.key);
              }}
              style={{
                background: align === a.key ? "#1e1f78" : "#fff",
                color: align === a.key ? "#fff" : "#1e1f78",
                border: "1px solid #1e1f78",
                borderRadius: "5px",
                fontSize: "13px",
                padding: "3px 9px",
                cursor: "pointer",
                fontWeight: 600,
                margin: "0 2px",
                pointerEvents: "auto",
                minWidth: 36,
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button style={closeBtnStyle} title="Selesai" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

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
      { icon: <RiListOrdered />, cmd: "insertOrderedList", label: "1. Nomor" },
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
      { icon: <RiLinkM />, fn: insertLink, label: "Tautan" },
      { icon: <RiImageAddLine />, fn: "img", label: "Gambar" },
      { icon: <RiSeparator />, fn: "hr", label: "Pemisah" },
    ],
  },
];

const HELP_ITEMS = [
  { label: "Tebal", key: "Ctrl + B", desc: "Buat teks jadi tebal" },
  { label: "Miring", key: "Ctrl + I", desc: "Buat teks jadi miring" },
  { label: "Garis Bawah", key: "Ctrl + U", desc: "Beri garis bawah" },
  { label: "Judul Besar", key: "Klik H1", desc: "Sub judul utama" },
  { label: "Judul Kecil", key: "Klik H2", desc: "Sub judul kecil" },
  { label: "Teks Biasa", key: "Klik T", desc: "Kembali ke teks biasa" },
  { label: "Kutipan", key: "Klik Quote", desc: "Menampilkan kutipan" },
  {
    label: "Keluar Kutipan",
    key: "Shift + Enter",
    desc: "Keluar dari kotak kutipan",
  },
  {
    label: "Poin",
    key: "Klik • Poin",
    desc: "Daftar berpoin (tekan Enter 2x untuk keluar)",
  },
  {
    label: "Nomor",
    key: "Klik 1. Nomor",
    desc: "Daftar bernomor (tekan Enter 2x untuk keluar)",
  },
  {
    label: "Setel gambar",
    key: "Klik gambar",
    desc: "Atur/hapus/resize gambar",
  },
  {
    label: "Tautan",
    key: "Pilih teks + Klik Tautan",
    desc: "Menyisipkan tautan ke teks",
  },
];

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
  ref,
) {
  // eslint-disable-next-line no-unused-vars
  const [toolbarVisible, setToolbarVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const [activePrompt, setActivePrompt] = useState(0);

  const [promptModal, setPromptModal] = useState(null);
  const [savedRange, setSavedRange] = useState(null);

  const [imgAligning, setImgAligning] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const location = useLocation();
  const isPopup = location.pathname.includes("/admin/artikel");

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

  const execCmd = useCallback(
    (cmd, value = null) => {
      document.execCommand(cmd, false, value);
      editorRef.current?.focus();
      if (editorRef.current) {
        onKontenChange(editorRef.current.innerHTML);
      }
    },
    [onKontenChange],
  );

  const insertLink = useCallback(() => {
    const sel = window.getSelection();
    if (
      !sel ||
      sel.isCollapsed ||
      !sel.toString().trim() ||
      !editorRef.current ||
      !editorRef.current.contains(sel.anchorNode)
    ) {
      toast.error(
        "Pilih (blok) kata atau kalimat yang ingin diberi tautan terlebih dahulu.",
        {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        },
      );
      return;
    }
    setSavedRange(sel.getRangeAt(0).cloneRange());
    setPromptModal({ type: "link" });
  }, []);

  const handlePromptSubmit = useCallback(
    (value) => {
      if (!value || !promptModal) return;
      if (promptModal.type === "link" && savedRange) {
        const MAX_URL = 2000;
        if (value.length > MAX_URL) {
          toast.error(
            "Tautan terlalu panjang. Mohon masukkan tautan dengan panjang maksimal 2000 karakter.",
            {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            },
          );
          return;
        }
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRange);

        const url = value.startsWith("http") ? value : `https://${value}`;
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        a.textContent = savedRange.toString();

        savedRange.deleteContents();
        savedRange.insertNode(a);

        savedRange.setStartAfter(a);
        savedRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(savedRange);

        if (editorRef.current) {
          onKontenChange(editorRef.current.innerHTML);
        }
        setSavedRange(null);
      }
      setPromptModal(null);
    },
    [promptModal, savedRange, onKontenChange],
  );

  const insertImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, []);

  const insertHTMLAtCursor = (html) => {
    let sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        const el = document.createElement("div");
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.deleteContents();
        range.insertNode(frag);

        setTimeout(() => {
          if (lastNode) {
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
      }
    }
  };

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Mohon pilih file gambar!", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = function (ev) {
        const html = `
          <img src="${ev.target.result}" style="width:100%;max-width:100%;border-radius:8px;margin:16px 0;display:block;object-fit:contain;cursor:pointer;" data-imgalign="center"/>
          <p><br/></p>
        `.trim();
        insertHTMLAtCursor(html);
        setTimeout(() => {
          if (editorRef.current) {
            onKontenChange(editorRef.current.innerHTML);
          }
        }, 0);
      };
      reader.readAsDataURL(file);
    },
    [onKontenChange],
  );

  const insertDivider = useCallback(() => {
    execCmd("insertHTML", "<hr/><p><br/></p>");
  }, [execCmd]);

  const clearFormatBlock = useCallback(() => {
    execCmd("formatBlock", "P");
  }, [execCmd]);

  // --- MODIFIKASI UX UNTUK TOMBOL ENTER & SHIFT+ENTER ---
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
        while (anchorNode && anchorNode.nodeType !== 1) {
          anchorNode = anchorNode.parentNode;
        }
        if (!anchorNode) return;

        // CEK APAKAH KITA SEDANG DI DALAM BLOCKQUOTE (KUTIPAN)
        let blockquoteNode =
          anchorNode.tagName === "BLOCKQUOTE"
            ? anchorNode
            : anchorNode.closest && anchorNode.closest("blockquote");

        // === LOGIKA UX BLOCKQUOTE: SHIFT + ENTER ===
        if (blockquoteNode) {
          if (e.shiftKey) {
            // Jika user menekan SHIFT + ENTER, kita PAKSA keluar dari blockquote
            e.preventDefault();

            // Buat paragraf normal baru di luar blockquote (di bawahnya)
            const brPara = document.createElement("p");
            brPara.innerHTML = "<br/>";

            if (blockquoteNode.nextSibling) {
              blockquoteNode.parentNode.insertBefore(
                brPara,
                blockquoteNode.nextSibling,
              );
            } else {
              blockquoteNode.parentNode.appendChild(brPara);
            }

            // Pindahkan kursor ke paragraf baru tersebut
            const range = document.createRange();
            range.setStart(brPara, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            // Simpan perubahan state editor
            setTimeout(() => {
              if (editorRef.current) {
                onKontenChange(editorRef.current.innerHTML);
              }
            }, 0);
            return;
          }

          // Jika ENTER saja (tanpa shift), biarkan browser membuat baris baru di dalam blockquote.
          // Tapi jika barisnya sudah kosong, kita cegah perilaku aneh browser
          if (
            anchorNode.textContent === "" ||
            /^\s*$/.test(anchorNode.textContent)
          ) {
            // Dibiarkan berjalan normal (baris baru di dalam kutipan)
            return;
          }
        }

        // === LOGIKA LIST (UL/OL) ===
        let liNode =
          anchorNode.tagName === "LI"
            ? anchorNode
            : anchorNode.closest && anchorNode.closest("li");
        let listNode =
          liNode &&
          (liNode.parentNode.tagName === "UL" ||
            liNode.parentNode.tagName === "OL")
            ? liNode.parentNode
            : null;

        if (liNode && listNode) {
          if (liNode.textContent === "" || /^\s*$/.test(liNode.textContent)) {
            e.preventDefault();
            if (
              liNode.previousSibling?.textContent === "" ||
              liNode.nextSibling?.textContent === ""
            ) {
              return;
            }
            const brPara = document.createElement("p");
            brPara.innerHTML = "<br/>";
            if (listNode.parentNode) {
              if (listNode.nextSibling) {
                listNode.parentNode.insertBefore(brPara, listNode.nextSibling);
              } else {
                listNode.parentNode.appendChild(brPara);
              }
            }
            const range = document.createRange();
            range.setStart(brPara, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            liNode.parentNode.removeChild(liNode);
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
      }
    },
    [onKontenChange],
  );
  // ----------------------------------------------------

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

  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setToolbarVisible(false);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const wrapRect = editorRef.current
      ?.closest(".editor-wrap")
      ?.getBoundingClientRect() ?? {
      top: 0,
      left: 0,
    };
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

  const isEmpty =
    !konten ||
    konten.trim() === "" ||
    konten === "<br>" ||
    konten === "<p><br/></p>";

  useEffect(() => {
    const container = editorRef.current;
    if (!container) return;
    let active = false;

    function handleElementClick(e) {
      if (e.target.tagName && e.target.tagName === "IMG") {
        setImgAligning(e.target);
        active = true;
      } else if (!active) {
        setImgAligning(null);
      }

      if (e.target.tagName && e.target.tagName === "A") {
        e.preventDefault();
        window.open(e.target.href, "_blank", "noopener,noreferrer");
      }
      active = false;
    }

    container.addEventListener("click", handleElementClick);
    return () => {
      container.removeEventListener("click", handleElementClick);
    };
  }, []);

  const handleAlignChangePS = (align) => {
    if (!imgAligning) return;
    imgAligning.setAttribute("data-imgalign", align);
    // eslint-disable-next-line react-hooks/immutability
    imgAligning.style.float = "";
    imgAligning.style.marginLeft = "";
    imgAligning.style.marginRight = "";
    imgAligning.style.marginTop = "16px";
    imgAligning.style.marginBottom = "16px";
    imgAligning.style.display = "block";
    imgAligning.style.objectFit = "contain";
    imgAligning.style.cursor = "pointer";
    imgAligning.style.maxWidth = "100%";
    imgAligning.style.borderRadius = "8px";
    if (align === "left") {
      imgAligning.style.float = "left";
      imgAligning.style.marginLeft = "0";
      imgAligning.style.marginRight = "16px";
    } else if (align === "right") {
      imgAligning.style.float = "right";
      imgAligning.style.marginRight = "0";
      imgAligning.style.marginLeft = "16px";
    } else {
      imgAligning.style.marginLeft = "auto";
      imgAligning.style.marginRight = "auto";
    }
    imgAligning.style.border = "";
    setTimeout(() => {
      if (editorRef.current) {
        onKontenChange(editorRef.current.innerHTML);
      }
    }, 0);
  };

  const handleImageWidthChange = (val) => {
    if (!imgAligning) return;
    // eslint-disable-next-line react-hooks/immutability
    imgAligning.style.width = val + "%";
    setTimeout(() => {
      if (editorRef.current) {
        onKontenChange(editorRef.current.innerHTML);
      }
    }, 0);
  };

  const handleRemoveImage = () => {
    if (!imgAligning) return;
    const img = imgAligning;
    const after = img.nextSibling;
    if (after && after.tagName === "P" && after.textContent.trim() === "") {
      after.parentNode.removeChild(after);
    }
    img.parentNode.removeChild(img);
    setImgAligning(null);
    setTimeout(() => {
      if (editorRef.current) {
        onKontenChange(editorRef.current.innerHTML);
      }
    }, 0);
  };

  return (
    <div className="editor-wrap relative rounded-sm">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <ProseStyles />

      <style>
        {`
          .prose a {
            color: #2563eb !important;
            text-decoration: underline !important;
            text-underline-offset: 3px !important;
            font-weight: 600 !important;
            background-color: #eff6ff !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }
          .prose a:hover {
            background-color: #dbeafe !important;
            color: #1e1f78 !important;
          }
        `}
      </style>

      <div className="mb-2">
        <label className="mb-2 block text-xs font-semibold tracking-widest text-gray-400 uppercase">
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
      <div
        className={`sticky ${isPopup ? "top-0" : "top-5"} z-20 mb-4 rounded-xl border border-gray-100 bg-white shadow-sm`}
      >
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
        {imgAligning && (
          <ImageToolbarOverlay
            targetImg={imgAligning}
            onAlignChange={handleAlignChangePS}
            onClose={() => setImgAligning(null)}
            onRemove={handleRemoveImage}
            onWidthChange={handleImageWidthChange}
          />
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-400">
        Pilih teks untuk membuka menu format cepat.{" "}
        <span className="inline font-semibold text-[#1e1f78]">
          Gunakan Shift + Enter untuk keluar dari Kutipan.
        </span>
      </p>
      <PromptModal
        open={!!promptModal}
        title={promptModal?.type === "link" ? "Sisipkan Tautan" : ""}
        placeholder={
          promptModal?.type === "link"
            ? "Tempelkan atau ketikkan tautan (https://...)"
            : ""
        }
        submitLabel="Sisipkan"
        onSubmit={handlePromptSubmit}
        onCancel={() => setPromptModal(null)}
      />
    </div>
  );
});

export default ArtikelEditor;
