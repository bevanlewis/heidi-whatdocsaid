"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", icon: "/house.svg", href: "/" },
  { name: "Referrals", icon: "/ref.svg", href: "/" },
  { name: "Treatments", icon: "/pill.svg", href: "/" },
  { name: "Appointments", icon: "/cal.svg", href: "/" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 h-screen bg-white py-8 px-4">
      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.href === pathname;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Image src={item.icon} alt="" width={24} height={24} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;