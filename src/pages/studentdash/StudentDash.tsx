import { useEffect, useState } from "react";
import Overview from "./Overview";
import Payment from "./Payment";
import Subscriptions from "./Subscriptions";
import Roommates from "./Roommates";
import Hostels from "./Hostels";
import SettingsPage from "./Settings";
import IconRail from "./DashComponents/IconRail";
import SidebarInner from "./DashComponents/SidebarInner";

export default function StudentDash() {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Sidebar open/close persistence
  useEffect(() => {
    const v = localStorage.getItem("sidebar:open");
    if (v !== null) setOpen(v === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar:open", open ? "1" : "0");
  }, [open]);

  // Persist last active tab
  useEffect(() => {
    const v = localStorage.getItem("dashboard:tab");
    if (v) setActiveTab(v);
  }, []);
  useEffect(() => {
    localStorage.setItem("dashboard:tab", activeTab);
  }, [activeTab]);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "payments":
        return <Payment />;
      case "subscriptions":
        return <Subscriptions />
      case "roommates":
        return <Roommates />;
      case "hostels":
        return <Hostels />;
      case "settings":
        return <SettingsPage />;
      default:
        return <div className="text-neutral-400">STUDENTS Page not found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="flex h-full relative">
        {open ? (
          <SidebarInner
            onToggle={() => setOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openSection={openSection}
            toggleSection={toggleSection}
          />
        ) : (
          // IMPORTANT: pass openSection & toggleSection so IconRail stays in sync
          <IconRail
            onToggle={() => setOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openSection={openSection}
            toggleSection={toggleSection}
            referralCode="ZARK25"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-auto bg-[#FFFFFF]">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
