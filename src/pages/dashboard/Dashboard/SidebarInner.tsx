import logo from "../../../assets/logo2.png";
import { FaRegBell, FaRegCircle } from "react-icons/fa";
import { IoIosAddCircleOutline, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp, IoIosStarOutline } from "react-icons/io";
import { MdOutlineAccountBalanceWallet, MdOutlineDashboard, MdWallet, MdOutlineBookmarkAdded, MdOutlineBackpack, MdOutlineAddBusiness } from "react-icons/md";
import { RiListView } from "react-icons/ri";
import { BiWorld } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { LuFileText, LuLogOut } from "react-icons/lu";
import { PiHouse } from "react-icons/pi";
import { TbUserSquare } from "react-icons/tb";
import ReferralCard from "./ReferralCard";
import { HiOutlineUserCircle } from "react-icons/hi";

export default function SidebarInner({
  onToggle,
  activeTab,
  setActiveTab,
  openSection,
  toggleSection,
}: {
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
}) {
  const sections = [
    {
      title: "AGENT",
      rating: "1.2 (85)",
      icon: <HiOutlineUserCircle className="h-8 w-8" />,
      items: [
        { label: "Business Overview", icon: <MdOutlineAddBusiness className="h-8 w-8" />, tab: "bizoverview" },
        { label: "Listings", icon: <RiListView className="h-8 w-8" /> },
        { label: "Bookings", icon: <MdOutlineBookmarkAdded className="h-8 w-8" /> },
        { label: "Verify Tenants", icon: <BsShieldCheck className="h-8 w-8" /> },
        { label: "Legal & Documents", icon: <LuFileText className="h-8 w-8" /> },
        { label: "Website Page", icon: <BiWorld className="h-8 w-8" /> },
      ],
    },
    {
      title: "LANDLORD",
      rating: "1.2 (85)",
      icon: <TbUserSquare className="h-8 w-8" />,
      items: [
        { label: "Hostel Overview", icon: <PiHouse className="h-8 w-8" /> },
        { label: "Listings", icon: <RiListView className="h-8 w-8" /> },
        { label: "Bookings", icon: <MdOutlineBookmarkAdded className="h-8 w-8" /> },
        { label: "Verify Tenants", icon: <BsShieldCheck className="h-8 w-8" /> },
        { label: "Legal & Documents", icon: <LuFileText className="h-8 w-8" /> },
      ],
    },
  ];

  return (
    <aside className="w-[420px] max-w-[480px] h-full bg-black flex flex-col relative">
      <div
        className="flex-1 overflow-y-auto h-full scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Header */}
        <div className="grid grid-cols-2 p-8 items-baseline">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Cribb.Africa Logo" className="h-14" />
            <div className="flex flex-col items-end">
              <h1 className="text-3xl font-extrabold">Cribb</h1>
              <span className="text-sm text-[#FFFFFF]">for Business</span>
            </div>
          </div>

          <div className="flex justify-end items-center space-x-3">
            <button className="p-3 rounded-full bg-neutral-800">
              <FaRegBell className="h-6 w-6 text-white" />
            </button>
            <button onClick={onToggle} className="p-3 rounded-full bg-neutral-800">
              <IoIosArrowBack className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Menu */}
        <div className="pl-8 py-4 pr-4 space-y-2">
          {/* Overview */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${activeTab === "overview"
                ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <MdOutlineDashboard className="h-8 w-8" />
            <span className="truncate text-xl">Overview</span>
            <FaRegCircle className="h-3 w-3 ml-auto" />
          </button>

          {/* Payments */}
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${activeTab === "payments"
                ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <MdOutlineAccountBalanceWallet className="h-8 w-8" />
            <span className="truncate text-xl">Payments</span>
            <FaRegCircle className="h-3 w-3 ml-auto" />
          </button>

          {/* Subscriptions */}
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${activeTab === "subscriptions"
                ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <MdWallet className="h-8 w-8" />
            <span className="truncate text-xl">Subscriptions</span>
            <FaRegCircle className="h-3 w-3 ml-auto" />
          </button>

          {/* Divider */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">FOR BUSINESS</small>----------
            </span>
            <button className="ml-auto flex items-center font-semibold gap-1 rounded-lg bg-white px-3 py-2 text-xs text-black shadow">
              ADD <IoIosAddCircleOutline className="h-5 w-5" />
            </button>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4 w-full">
            {sections.map((section) => (
              <div key={section.title} className="w-full">
                <div className="flex items-center rounded gap-1 pr-4 w-full">
                  <button
                    className="flex items-center border-3 p-3 rounded-xl gap-3 transition flex-grow text-left"
                    onClick={() => toggleSection(section.title)}
                  >
                    {section.icon}
                    <span className="truncate text-xl">{section.title}</span>
                    {openSection === section.title ? (
                      <IoIosArrowUp className="h-4 w-4 ml-auto" />
                    ) : (
                      <IoIosArrowDown className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                  <IoIosStarOutline className="h-6 w-6 text-amber-300" />
                  <span className="flex items-center font-semibold gap-1 rounded-lg bg-white px-2 py-1 text-sm text-black shadow whitespace-nowrap">
                    {section.rating}
                  </span>
                </div>

                {openSection === section.title && (
                  <div className="flex flex-col rounded my-5 gap-1 pr-8 w-full">
                    {section.items.map((item, idx) => (
                      <button
                        onClick={() => item.tab && setActiveTab(item.tab)}
                        key={idx}
                        className={`flex items-center rounded mx-5 px-5 py-2 gap-3 transition w-full text-left 
                          ${activeTab === item.tab
                            ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                            : "text-[white] border-l-[3px] border-[black]"
                          }`}
                      >
                        {item.icon}
                        <span className="truncate text-xl">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Influencers Divider */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">CRIBB INFLUENCERS</small>-----------------------
            </span>
          </div>

          <div className="flex items-center justify-center">
            <ReferralCard balance={100000} referral={245} total={250000} code="ZARK25" />
          </div>

          {/* Account Divider */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">ACCOUNT MANAGEMENT</small>-------------------
            </span>
          </div>

          {/* Settings */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${activeTab === "settings"
                ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg">
              <LuFileText className="h-8 w-8" />
            </span>
            <span className="truncate text-xl">Settings</span>
            <FaRegCircle className="h-3 w-3 ml-auto" />
          </button>

          {/* Profile */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">PROFILE</small>-------------------------------
            </span>
          </div>

          <div className="bg-black text-white p-4 rounded-md w-full max-w-md">
            {/* Profile Info */}
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gray-400 rounded-sm shrink-0"></div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Kenneth Uche</span>
                <span className="text-sm">iamzarken14@gmail.com</span>
                <span className="text-sm">08156165537</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4 w-full">
              <button className="flex items-center gap-1 text-red-600 font-semibold text-md">
                <LuLogOut className="text-3xl" /> LOG OUT
              </button>

              <button className="flex items-center gap-1 text-md text-white hover:text-gray-300">
                <MdOutlineBackpack className="text-3xl" />
                <span className="underline">SWITCH TO STUDENTS</span>
                <span className="ml-1">&gt;&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
