import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.png";
import Overview from "./Overview";
import Payment from "./Payment";
import Subscriptions from "./Subscriptions";
import Bizoverview from "./Bizoverview";
import SettingsPage from "./Settings";
import Listings from "./Listings";
import Bookingsagent from "./Bookingsagent";
import Bookingslandlord from "./Bookingslandlord";
import Hosteloverview from "./Hosteloverview";
import Listingslandlord from "./Listingslandlord";
import SidebarInner from "./DashComponents/SidebarInner";
import { DashboardTabContext } from "./DashComponents/DashboardTabContext";
import { FiMenu, FiX } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";

export default function BusinessDash() {
  const navigate = useNavigate(); // ✅ initialize router navigation

  useEffect(() => {
    const loginData = sessionStorage.getItem("login_data");

    if (!loginData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(loginData);

      // ✅ Allow only merchant mode
      if (!parsed.mode || parsed.mode !== "merchant") {
        sessionStorage.removeItem("login_data");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      sessionStorage.removeItem("login_data");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [open, setOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [isLarge, setIsLarge] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [openSection, setOpenSection] = useState<string | null>(null);

  // handle screen size changes
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      setIsLarge(e.matches);
      setOpen(e.matches);
    };
    setIsLarge(mq.matches);
    setOpen(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (isLarge) localStorage.setItem("sidebar:open", open ? "1" : "0");
  }, [open, isLarge]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pref = localStorage.getItem("sidebar:open");
    if (pref !== null && window.innerWidth >= 1024) setOpen(pref === "1");
  }, []);

  useEffect(() => {
    const v = localStorage.getItem("dashboard:tab");
    if (v) setActiveTab(v);
  }, []);
  useEffect(() => {
    localStorage.setItem("dashboard:tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!isLarge) document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isLarge]);

  const toggleSection = (title: string) =>
    setOpenSection(openSection === title ? null : title);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "payments":
        return <Payment />;
      case "subscriptions":
        return <Subscriptions />;
      case "bizoverview":
        return <Bizoverview />;
      case "listings":
        return <Listings />;
      case "listingslandlord":
        return <Listingslandlord />;
      case "bookingsagent":
        return <Bookingsagent />;
      case "bookingslandlord":
        return <Bookingslandlord />;
      case "hosteloverview":
        return <Hosteloverview />;
      case "settings":
        return <SettingsPage />;
      default:
        return <div className="text-neutral-400">Page not found</div>;
    }
  };

  return (
    <DashboardTabContext.Provider value={{ activeTab, setActiveTab }}>
    <div className="h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-3 bg-black border-b border-neutral-800 sticky top-0 z-50">
        {/* Left side: menu (mobile) + logo (desktop) */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="lg:hidden p-2 rounded hover:bg-white/5 transition"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <FiX className="w-6 h-6 text-white" />
            ) : (
              <FiMenu className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Desktop Logo */}
          <div className="hidden lg:flex justify-start items-center gap-3 my-3">
            <img
              src={logo}
              alt="Cribb logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white leading-none">
                Cribb
              </span>
              <span className="text-md text-neutral-400">for Business</span>
            </div>
          </div>
        </div>

        {/* Mobile Center Logo (hidden on lg) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden my-3">
          <div className="flex justify-start items-start gap-2">
            <img
              src={logo}
              alt="Cribb logo"
              className="h-6 w-6 object-contain"
            />
            <div className="flex flex-col items-end">
              <span className="text-xl font-semibold text-white leading-none">
                Cribb
              </span>
              <span className="text-[8px] text-neutral-400">for Business</span>
            </div>
          </div>
        </div>

        {/* Bell icon */}
        <div className="ml-auto">
          <button
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
            aria-label="Notifications"
          >
            <FaRegBell className="w-5 h-5 text-white" />
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div className="flex h-[calc(100vh-56px)] relative">
        {/* Desktop Sidebar (compact, aligned width) */}
        <div className="hidden lg:block lg:w-56 lg:flex-shrink-0">
          <div className="h-full bg-[#0F0F0F] border-r border-neutral-800">
            <SidebarInner
              onToggle={() => setOpen((s) => !s)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              openSection={openSection}
              toggleSection={toggleSection}
            />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-[#0F0F0F] border-r border-neutral-800 lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-3 h-14 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Cribb logo"
                className="h-7 w-7 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white leading-none">
                  Cribb
                </span>
                <span className="text-[11px] text-neutral-400">
                  for Business
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded hover:bg-white/5"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="h-full overflow-y-auto">
            <SidebarInner
              onToggle={() => setOpen(false)}
              activeTab={activeTab}
              setActiveTab={(t) => {
                setActiveTab(t);
                if (!isLarge) setOpen(false);
              }}
              openSection={openSection}
              toggleSection={toggleSection}
            />
          </div>
        </aside>

        {/* Mobile backdrop */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 pb-20 min-w-0 h-full overflow-auto bg-white text-black lg:ml-56 transition-all duration-300">
          {renderTab()}
        </main>
      </div>
    </div>
    </DashboardTabContext.Provider>
  );
}
