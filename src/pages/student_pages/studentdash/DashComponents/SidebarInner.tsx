import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineDashboard,
  MdWallet,
} from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { FiSettings, FiHome } from "react-icons/fi";
import { FaRegCircle, FaToggleOff } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import ReferralCard from "./ReferralCard";

const baseBtn =
  "flex items-center rounded px-3 py-1 md:py-2 md:px-8 md:py-2 gap-2 md:gap-3 transition w-full text-left border-l-[3px]";
const baseIcon = "h-4 w-4 md:h-8 md:w-8";
const activeClass = "text-[#FFA1A1] border-[#FFA1A1]";
const inactiveClass = "text-white border-black";

export default function SidebarInner({
  activeTab,
  setActiveTab,
}: {
  onToggle?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
}) {
  const [sidebarData, setSidebarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const handleLogout = () => {
    // ✅ Clear all saved user session data
    sessionStorage.clear();
    localStorage.clear();

    // ✅ Redirect to login
    navigate("/login", { replace: true });
  };
  const navigate = useNavigate(); // ✅ initialize router navigation

  // ✅ Fetch sidebar data
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const session = JSON.parse(
          sessionStorage.getItem("login_data") || "{}"
        );
        if (!session?.user) return;
        const res = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getSidebarStudent",
            whats: session.user,
          }),
        });
        const data = await res.json();
        if (data.success) setSidebarData(data);
      } catch (err) {
        console.error("Sidebar data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSidebarData();
  }, []);

  const divider = (title: string) => (
    <div className="flex items-center my-2 md:my-4 rounded pl-2 pr-2 md:pl-5 md:pr-4 py-1 md:py-2 gap-1 w-full text-left">
      <span className="flex items-center text-[10px] md:text-sm whitespace-nowrap">
        --<small className="mx-1 md:mx-2 text-[#FFA1A1]">{title}</small>
        -------------------
      </span>
    </div>
  );

  const mainMenu = [
    {
      label: "Overview",
      icon: <MdOutlineDashboard className={baseIcon} />,
      tab: "overview",
    },
    {
      label: "Payments",
      icon: <MdOutlineAccountBalanceWallet className={baseIcon} />,
      tab: "payments",
    },
    {
      label: "Subscriptions",
      icon: <MdWallet className={baseIcon} />,
      tab: "subscriptions",
    },
  ];

  return (
    <aside className="md:w-[420px] h-full bg-black flex flex-col relative overflow-hidden">
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 md:px-6 py-2 md:py-4 space-y-3 mt-4 md:mt-10">
            {/* === MAIN MENU === */}
            {mainMenu.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`${baseBtn} ${
                  activeTab === item.tab ? activeClass : inactiveClass
                }`}
              >
                {item.icon}
                <span className="truncate text-[11px] md:text-xl">
                  {item.label}
                </span>
                <FaRegCircle className="h-2 w-2 md:h-3 md:w-3 ml-auto" />
              </button>
            ))}

            {/* === FOR STUDENTS === */}
            {divider("FOR STUDENTS")}
            <button
              onClick={() => setActiveTab("roommates")}
              className={`${baseBtn} ${
                activeTab === "roommates" ? activeClass : inactiveClass
              }`}
            >
              <HiOutlineUsers className={baseIcon} />
              <span className="truncate text-[12px] md:text-xl">Rommates</span>
              <>
                <FaToggleOff className="w-6 ml-auto text-white" />
                <span className="text-xs text-white">HIDDEN</span>
              </>
            </button>

            <button
              onClick={() => setActiveTab("rent")}
              className={`${baseBtn} ${
                activeTab === "rent" ? activeClass : inactiveClass
              }`}
            >
              <FiHome className={baseIcon} />
              <span className="truncate text-[12px] md:text-xl">Rent</span>
              <span className="text-xs px-4 py-1 font-bold rounded-lg ml-auto bg-white  text-black">
                NEW
              </span>
            </button>

           

            {/* === REFERRAL CARD === */}
            {divider("CRIBB INFLUENCERS")}
            <div className="flex justify-center">
              <div className="w-full max-w-[280px] md:max-w-sm">
                {loading ? (
                  <div className="text-center text-white text-sm">
                    Loading...
                  </div>
                ) : (
                  <ReferralCard
                    balance={sidebarData?.ref_balance}
                    referral={sidebarData?.ref_user}
                    total={sidebarData?.ref_balance}
                    code={sidebarData?.ref_name}
                  />
                )}
              </div>
            </div>

            {/* === ACCOUNT === */}
            {divider("ACCOUNT MANAGEMENT")}
            <button
              onClick={() => setActiveTab("settings")}
              className={`${baseBtn} ${
                activeTab === "settings" ? activeClass : inactiveClass
              }`}
            >
              <FiSettings className={baseIcon} />
              <span className="truncate text-[12px] md:text-xl">Settings</span>
              <FaRegCircle className="h-2 w-2 md:h-3 md:w-3 ml-auto" />
            </button>

            {/* === PROFILE === */}
            {divider("PROFILE")}
            {sidebarData ? (
              <div className="bg-black text-white p-3 md:p-4 rounded-md w-full mb-20 border border-white/10">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-11 h-11 md:w-16 md:h-16 rounded-sm shrink-0 overflow-hidden bg-gray-400">
                    {sidebarData?.profile_image ? (
                      <img
                        src={sidebarData.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] md:text-sm text-gray-700 bg-gray-200">
                        No Img
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-[12px] md:text-lg">
                      {sidebarData.name}
                    </span>
                    <span className="text-[9px] md:text-sm opacity-80">
                      {sidebarData.email}
                    </span>
                    <span className="text-[9px] md:text-sm opacity-80">
                      {sidebarData.whats}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 md:mt-4 w-full">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-600 font-semibold text-[10px] md:text-md"
                  >
                    <LuLogOut className="text-lg md:text-3xl" /> LOG OUT
                  </button>
                  {/*<button className="flex items-center gap-1 text-[9px] md:text-md text-white hover:text-gray-300">
                    <MdOutlineBackpack className="text-lg md:text-3xl" />
                    <span className="underline">SWITCH TO STUDENTS</span>
                    <span className="ml-1">&gt;&gt;</span>
                  </button>*/}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-xs text-center mb-20">
                No profile data
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
