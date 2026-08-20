"use client";

import { useEffect, useRef } from "react";

interface EntryMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function EntryMenu({ onEdit, onDelete, onClose }: EntryMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute right-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
    >
      <button
        role="menuitem"
        type="button"
        onClick={onEdit}
        className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
      >
        Edit
      </button>
      <button
        role="menuitem"
        type="button"
        onClick={onDelete}
        className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
      >
        Delete
      </button>
    </div>
  );
}
