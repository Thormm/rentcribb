import {
  FiChevronRight,
  FiGrid,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  MdWallet,
  MdOutlineAddBusiness,
  MdOutlineBookmarkAdded,
  MdOutlineBackpack,
} from "react-icons/md";
import { RiListView } from "react-icons/ri";
import { BsShieldCheck, BsQrCode } from "react-icons/bs";
import { LuFileText } from "react-icons/lu";
import { BiWorld } from "react-icons/bi";
import { PiHouse } from "react-icons/pi";
import { TbUserSquare } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import logo from "../../../assets/logo2.png";
import { FaRegBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { HiOutlineUserCircle } from "react-icons/hi";

export default function IconRail({
  onToggle,
  activeTab,
  setActiveTab,
  openSection,
  toggleSection,
  referralCode,
}: {
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
  referralCode: string;
}) {
  const sections = [
    {
      title: "AGENT",
      icon: <HiOutlineUserCircle className="h-14 w-14 px-3" />,
      items: [
        {
          label: "Business Overview",
          tab: "bizoverview",
          icon: <MdOutlineAddBusiness className="h-14 w-14 px-3" />,
        },
        {
          label: "Listings",
          tab: "agent_listings",
          icon: <RiListView className="h-14 w-14 px-3" />,
        },
        {
          label: "Bookings",
          tab: "agent_bookings",
          icon: <MdOutlineBookmarkAdded className="h-14 w-14 px-3" />,
        },
        {
          label: "Verify Tenants",
          tab: "agent_verify",
          icon: <BsShieldCheck className="h-14 w-14 px-3" />,
        },
        {
          label: "Legal & Documents",
          tab: "agent_legal",
          icon: <LuFileText className="h-14 w-14 px-3" />,
        },
        {
          label: "Website Page",
          tab: "agent_website",
          icon: <BiWorld className="h-14 w-14 px-3" />,
        },
      ],
    },
    {
      title: "LANDLORD",
      icon: <TbUserSquare className="h-14 w-14 px-3" />,
      items: [
        {
          label: "Hostel Overview",
          tab: "landlord_overview",
          icon: <PiHouse className="h-14 w-14 px-3" />,
        },
        {
          label: "Listings",
          tab: "landlord_listings",
          icon: <RiListView className="h-14 w-14 px-3" />,
        },
        {
          label: "Bookings",
          tab: "landlord_bookings",
          icon: <MdOutlineBookmarkAdded className="h-14 w-14 px-3" />,
        },
        {
          label: "Verify Tenants",
          tab: "landlord_verify",
          icon: <BsShieldCheck className="h-14 w-14 px-3" />,
        },
        {
          label: "Legal & Documents",
          tab: "landlord_legal",
          icon: <LuFileText className="h-14 w-14 px-3" />,
        },
      ],
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div
      className="flex h-full w-[120px] flex-col items-center bg-black/95 border-r border-neutral-800 relative overflow-y-auto scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Logo */}
      <div className="pt-4 pb-6 flex flex-col items-center gap-3">
        <img src={logo} alt="Cribb.Africa Logo" className="h-9" />

        <button className="p-3 rounded-full bg-neutral-800 my-3">
          <FaRegBell className="h-6 w-6 text-white" />
        </button>

        {/* Expand handle */}
        <button
          onClick={onToggle}
          className="p-3 rounded-full bg-neutral-800"
          title="Expand sidebar"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Core Pages */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`grid h-14 w-14 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "overview"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Overview"
        >
          <FiGrid className="h-14 w-14 px-3" />
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`grid h-14 w-14 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "payments"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Payments"
        >
          <FiCreditCard className="h-14 w-14 px-3" />
        </button>

        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`grid h-14 w-14 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "subscriptions"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Subscriptions"
        >
          <MdWallet className="h-14 w-14 px-3" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* Sections (Agent + Landlord) */}
      <div className="flex flex-col items-center gap-4">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col items-center gap-1">
            {/* Icon + Arrow side by side */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleSection(section.title)}
                className={`grid h-14 w-14 place-items-center rounded-xl transition border-l-[3px]
                  ${
                    openSection === section.title
                      ? "text-[#FFA1A1] border-[#FFA1A1]"
                      : "text-white border-transparent"
                  }`}
                title={section.title}
              >
                {section.icon}
              </button>
              <button
                onClick={() => toggleSection(section.title)}
                className="text-white"
              >
                {openSection === section.title ? (
                  <IoIosArrowUp className="h-4 w-4" />
                ) : (
                  <IoIosArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Sub-items */}
            {openSection === section.title && (
              <div className="flex flex-col items-center gap-2 mt-2">
                {section.items.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`grid h-14 w-14 place-items-center rounded-lg transition border-l-[3px]
                      ${
                        activeTab === item.tab
                          ? "text-[#FFA1A1] border-[#FFA1A1]"
                          : "text-white border-transparent"
                      }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* QR / Copy block */}
      <div className="flex flex-col items-center">
        <span className="text-white text-[10px] font-bold">COPY</span>
        <button
          type="button"
          onClick={handleCopy}
          className="w-14 h-14 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg"
        >
          <BsQrCode className="text-white text-2xl" />
        </button>
        <div className="flex items-center gap-1 text-white text-[10px] font-semibold mt-1">
          <span>{referralCode}</span>
          <IoCopyOutline className="text-white text-sm" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* Settings at bottom */}
      <button
        onClick={() => setActiveTab("settings")}
        className={`grid h-14 w-14 place-items-center rounded-xl mb-4 transition border-l-[3px]
          ${
            activeTab === "settings"
              ? "text-[#FFA1A1] border-[#FFA1A1]"
              : "text-white border-transparent"
          }`}
        title="Settings"
      >
        <FiSettings className="h-14 w-14 px-3" />
      </button>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* Profile */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-14 h-14 bg-gray-400 rounded-full mb-5 shrink-0" />
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className=""
            title="Log out"
          >
            <LuLogOut className="h-8 w-8 text-white my-2" />
          </button>
          <button
            type="button"
            className=""
            title="Switch"
          >
            <MdOutlineBackpack className="h-8 w-8 text-white my-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
