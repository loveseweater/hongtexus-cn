"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.contactWhatsapp) {
          setWhatsapp(data.contactWhatsapp.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  // Initialize position: bottom-right on desktop, bottom-center on mobile
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Bottom center on mobile
      setPosition({ x: window.innerWidth / 2 - 28, y: window.innerHeight - 80 });
    } else {
      // Bottom right on desktop
      setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: rect.left,
      elY: rect.top,
    };
    setIsDragging(true);
    setHasMoved(false);
    btn.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasMoved(true);
    }

    let newX = dragRef.current.elX + dx;
    let newY = dragRef.current.elY + dy;

    // Keep within viewport
    const btn = btnRef.current;
    if (btn) {
      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      newX = Math.max(0, Math.min(window.innerWidth - w, newX));
      newY = Math.max(0, Math.min(window.innerHeight - h, newY));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    const btn = btnRef.current;
    if (btn) {
      btn.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }, []);

  const handleClick = () => {
    // Only open WhatsApp if user didn't drag
    if (hasMoved) return;
    const url = `https://wa.me/${whatsapp}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!whatsapp) return null;

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      aria-label="Chat on WhatsApp"
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-shadow hover:shadow-xl active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        fill="white"
        width="28"
        height="28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </button>
  );
}
