"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
    { name: "Home", icon: "/house.svg", href: "/" },
    { name: "Referrals", icon: "/ref.svg", href: "/" },
    { name: "Treatments", icon: "/pill.svg", href: "/" },
    { name: "Appointments", icon: "/cal.svg", href: "/" },
  ];

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState(null);
    const router = useRouter();
    const pathname = router.pathname;

    useEffect(() => {
        const currentItem = navItems.find((item) => item.href === pathname);
        setActiveItem(currentItem);
    }, [pathname]);


  return (
    <aside className="flex flex-col w-[220px] min-h-screen bg-white py-6">
      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeItem?.name === item.name;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Image src={item.icon} alt="" width={20} height={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;