import {
  FiChevronRight,
  FiGrid,
  FiCreditCard,
  FiSettings,
  FiHome,
} from "react-icons/fi";
import { MdWallet, MdOutlineBackpack } from "react-icons/md";
import { BsQrCode } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import logo from "../../../assets/logo2.png";
import { FaRegBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi";

export default function IconRail({
  onToggle,
  activeTab,
  setActiveTab,
  referralCode,
}: {
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
  referralCode: string;
}) {
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
      <div className="pt-5 pb-6 flex flex-col items-center gap-3">
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
      <div className="flex flex-col items-center gap-3 mt-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`grid h-12 w-12 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "overview"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Overview"
        >
          <FiGrid className="h-12 w-12 px-3" />
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`grid h-12 w-12 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "payments"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Payments"
        >
          <FiCreditCard className="h-12 w-12 px-3" />
        </button>

        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`grid h-12 w-14 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "subscriptions"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Subscriptions"
        >
          <MdWallet className="h-12 w-12 px-3" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* Core Pages */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button
          onClick={() => setActiveTab("roommates")}
          className={`grid h-12 w-12 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "roommates"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Roommates"
        >
          <HiOutlineUsers className="h-12 w-12 px-3" />
        </button>

        <button
          onClick={() => setActiveTab("hostels")}
          className={`grid h-12 w-12 place-items-center rounded-xl transition border-l-[3px]
            ${
              activeTab === "hostels"
                ? "text-[#FFA1A1] border-[#FFA1A1]"
                : "text-white border-transparent"
            }`}
          title="Hostels"
        >
          <FiHome className="h-12 w-12 px-3" />
        </button>
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
        className={`grid h-12 w-12 place-items-center rounded-xl mb-4 transition border-l-[3px]
          ${
            activeTab === "settings"
              ? "text-[#FFA1A1] border-[#FFA1A1]"
              : "text-white border-transparent"
          }`}
        title="Settings"
      >
        <FiSettings className="h-12 w-12 px-3" />
      </button>

      {/* Spacer */}
      <div className="flex-1 my-6">---</div>

      {/* Profile */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-14 h-14 bg-gray-400 rounded-full mb-5 shrink-0" />
        <div className="flex flex-col items-center gap-3">
          <button type="button" className="" title="Log out">
            <LuLogOut className="h-8 w-8 text-white my-2" />
          </button>
          <button type="button" className="" title="Switch">
            <MdOutlineBackpack className="h-8 w-8 text-white my-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
