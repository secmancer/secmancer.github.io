"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Home } from "lucide-react";

const links = [
  {
    name: "Experience",
    href: "/experience",
  },
  {
    name: "Skills",
    href: "/skills",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Certificates",
    href: "/certs",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            <Home className="inline-block mr-2 " size={36} />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
              >
                {link.name}
              </Link>
            ))}
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-gray-700 dark:text-gray-200"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
