"use client";
import { Suspense } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Summary from "../components/summary";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 px-12 py-10 bg-[#F3F3F3]">
            <Summary />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
