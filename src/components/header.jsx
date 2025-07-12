"use client";
import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex items-center justify-between w-full h-[6rem] shadow-md px-[50px]">
      {/* Left: Icon only */}
      <Image
        src="/logo.svg"
        alt="Heidi Icon"
        width={24}
        height={36}
      />
      {/* Right: Icon + 'heidi' text */}
      <div className="flex items-center gap-2">
        <Image src="/Heidilogo.svg" alt="Heidi Icon" width={74} height={31} />
      </div>
    </header>
  );
};

export default Header;