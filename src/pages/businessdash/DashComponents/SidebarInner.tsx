import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosAddCircleOutline,
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosStarOutline,
} from "react-icons/io";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineDashboard,
  MdWallet,
  MdOutlineBookmarkAdded,
  MdOutlineBackpack,
  MdOutlineAddBusiness,
} from "react-icons/md";
import { RiListView } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";
import { PiHouse } from "react-icons/pi";
import { TbUserSquare } from "react-icons/tb";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { FaRegCircle } from "react-icons/fa";
import ReferralCard from "./ReferralCard";

const baseBtn =
  "flex items-center rounded px-3 py-2 md:px-8 md:py-2 gap-2 md:gap-3 transition w-full text-left border-l-[3px]";
const baseIcon = "h-4 w-4 md:h-8 md:w-8";
const activeClass = "text-[#FFA1A1] border-[#FFA1A1]";
const inactiveClass = "text-white border-black";

export default function SidebarInner({
  activeTab,
  setActiveTab,
  openSection,
  toggleSection,
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
  const handleAddBusiness = () => {
    // Get the current session data
    const loginData = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    // Update verification to 0
    const updatedData = { ...loginData, verification: 0 };

    // Save it back to sessionStorage
    sessionStorage.setItem("login_data", JSON.stringify(updatedData));

    // Navigate to onboarding page
    navigate("/businessonboarding");
  };

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
            action: "getSidebarDataMerchant",
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

  const showAgentSection = !!sidebarData?.agent_email;
  const showLandlordSection = !!sidebarData?.landlord_email;
  const showAddButton = !showAgentSection || !showLandlordSection;

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

  const agentSection = {
    title: "AGENT",
    rating: "5.0 (0)",
    icon: <HiOutlineUserCircle className={baseIcon} />,
    items: [
      {
        label: "Business Overview",
        icon: <MdOutlineAddBusiness className={baseIcon} />,
        tab: "bizoverview",
      },
      {
        label: "Listings",
        icon: <RiListView className={baseIcon} />,
        tab: "listings",
      },
      {
        label: "Bookings & Requests",
        icon: <MdOutlineBookmarkAdded className={baseIcon} />,
        tab: "bookingsagent",
      },
    ],
  };

  const landlordSection = {
    title: "LANDLORD",
    rating: "5.0 (0)",
    icon: <TbUserSquare className={baseIcon} />,
    items: [
      {
        label: "Hostel Overview",
        icon: <PiHouse className={baseIcon} />,
        tab: "hosteloverview",
      },
      {
        label: "Listings",
        icon: <RiListView className={baseIcon} />,
        tab: "listingslandlord",
      },
      {
        label: "Bookings",
        icon: <MdOutlineBookmarkAdded className={baseIcon} />,
        tab: "bookingslandlord",
      },
    ],
  };

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

            {/* === FOR BUSINESS DIVIDER === */}
            <div className="flex items-center justify-between my-3 md:my-4 rounded px-2 md:px-4 py-1 md:py-2 w-full">
              <span className="text-[10px] md:text-sm text-white">
                --
                <small className="mx-1 md:mx-2 text-[#FFA1A1]">
                  FOR BUSINESS
                </small>
                --
              </span>
              {showAddButton && (
                <button
                  onClick={handleAddBusiness}
                  className="flex items-center font-semibold gap-1 rounded-lg bg-white px-2 md:px-3 py-[3px] md:py-2 text-[9px] md:text-xs text-black shadow"
                >
                  ADD{" "}
                  <IoIosAddCircleOutline className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
            </div>

            {/* === BUSINESS SECTIONS === */}
            <div className="flex flex-col gap-2 md:gap-4 w-full">
              {showAgentSection && (
                <Section
                  section={agentSection}
                  openSection={openSection}
                  toggleSection={toggleSection}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
              {showLandlordSection && (
                <Section
                  section={landlordSection}
                  openSection={openSection}
                  toggleSection={toggleSection}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>

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
                  <div className="w-9 h-9 md:w-16 md:h-16 rounded-sm shrink-0 overflow-hidden bg-gray-400">
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
                  <button className="flex items-center gap-1 text-[9px] md:text-md text-white hover:text-gray-300">
                    <MdOutlineBackpack className="text-lg md:text-3xl" />
                    <span className="underline">SWITCH TO STUDENTS</span>
                    <span className="ml-1">&gt;&gt;</span>
                  </button>
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

function Section({
  section,
  openSection,
  toggleSection,
  activeTab,
  setActiveTab,
}: any) {
  return (
    <div className="w-full">
      <div className="flex items-center rounded gap-1 pr-2 md:pr-4 w-full">
        <button
          className="flex items-center flex-grow border p-2 md:p-3 rounded-lg md:rounded-xl gap-2 md:gap-3 transition text-left"
          onClick={() => toggleSection(section.title)}
        >
          {section.icon}
          <span className="truncate text-[12px] md:text-xl">
            {section.title}
          </span>
          {openSection === section.title ? (
            <IoIosArrowUp className="h-3 w-3 md:h-4 md:w-4 ml-auto" />
          ) : (
            <IoIosArrowDown className="h-3 w-3 md:h-4 md:w-4 ml-auto" />
          )}
        </button>
        <IoIosStarOutline className="h-4 w-4 md:h-6 md:w-6 text-amber-300" />
        <span className="font-semibold rounded-lg bg-white px-2 py-[2px] text-[9px] md:text-sm text-black shadow whitespace-nowrap">
          {section.rating}
        </span>
      </div>

      {openSection === section.title && (
        <div className="flex flex-col rounded my-2 md:my-5 gap-1 md:gap-2 pl-3 md:pl-6">
          {section.items.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.tab)}
              className={`${baseBtn} ${
                activeTab === item.tab ? activeClass : inactiveClass
              } !px-2 md:!px-6`}
            >
              {item.icon}
              <span className="truncate text-[11px] md:text-xl">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
