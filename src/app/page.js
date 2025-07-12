"use client";
import { Suspense } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Summary from "../components/summary";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="h-screen flex flex-col overflow-hidden">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 px-12 py-10 bg-[#F3F3F3] overflow-hidden">
                        <Summary />
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
