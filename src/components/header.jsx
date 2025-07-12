import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="inline-flex items-end justify-center w-full h-[3rem] border-2 border-gray-500">
      <Image
        src="/logo.svg"
        alt="Heidi Icon"
        width={24}
        height={36}
        className="ml-[50px]"
      />
      {/* Right: Icon + 'heidi' text */}
      <div className="flex items-center gap-2 mr-[50px] ml-auto">
        <Image src="/Heidilogo.svg" alt="Heidi Icon" width={74} height={31} />
      </div>
    </header>
  );
};

export default Header;