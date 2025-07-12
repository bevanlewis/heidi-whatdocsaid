import Header from "../components/header";
import Sidebar from "../components/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header/>
      <Sidebar/>
      <main className="flex-grow">
        {/* Main content goes here */}
      </main>
    </div>
  );
}
