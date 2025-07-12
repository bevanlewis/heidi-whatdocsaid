"use client";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Summary from "../components/summary";

export default function Home() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-hidden px-12 py-10 bg-[#F3F3F3]">
                    <Summary />
                </div>
            </div>
        </div>
    );
}
