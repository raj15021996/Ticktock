"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ROUTES_PATH, storageKeys } from "@/utils/constant";
import Cookies from "js-cookie";
import { forSuccess } from "@/utils/commonServices";
// import { useAuth } from "@/context/AuthContext";

export default function Header() {
  // const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = Cookies.get(storageKeys.userData) ? JSON.parse(Cookies.get(storageKeys.userData) as string) : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    // logout();
    Cookies.remove(storageKeys.userData);
    Cookies.remove(storageKeys.accessToken);
    forSuccess("Logged out successfully!");
    router.replace("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href={ROUTES_PATH.DASHBOARD} className="text-2xl font-bold text-gray-900">
            ticktock
          </Link>
          <span
            className="text-sm font-medium text-gray-700"
          >
            Timesheets
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            {user?.name ?? "John Doe"}
            <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              <div className="px-3 py-2 text-sm font-medium text-gray-900">
                {user?.name ?? "John Doe"}
              </div>
              <button
                role="menuitem"
                type="button"
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
