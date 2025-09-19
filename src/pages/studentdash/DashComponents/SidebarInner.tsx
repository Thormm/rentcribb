import logo from "../../../assets/logo2.png";
import { FaRegBell, FaRegCircle, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineDashboard,
  MdWallet,
  MdOutlineBackpack,
} from "react-icons/md";

import { LuLogOut } from "react-icons/lu";
import ReferralCard from "./ReferralCard";
import { FiHome, FiSettings } from "react-icons/fi";
import { useState } from "react";
import { HiOutlineUsers } from "react-icons/hi";

export default function SidebarInner({
  onToggle,
  activeTab,
  setActiveTab,
}: {
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSection: string | null;
  toggleSection: (title: string) => void;
}) {

  const [visible, setVisible] = useState(true); // local stat
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
            <button
              onClick={onToggle}
              className="p-3 rounded-full bg-neutral-800"
            >
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
              ${
                activeTab === "overview"
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
              ${
                activeTab === "payments"
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
              ${
                activeTab === "subscriptions"
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
              --<small className="mx-2 text-[#FFA1A1]">FOR STUDENTS</small>
              --------------------------
            </span>
          </div>

   {/* Roommates */}
      <button
        onClick={() => {
          setActiveTab("roommates");
          setVisible(!visible); // toggle ON/OFF
        }}
        className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
          ${
            activeTab === "roommates"
              ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
              : "text-[white] border-l-[3px] border-[black]"
          }`}
      >
        <HiOutlineUsers className="h-8 w-8" />
        <span className="truncate text-xl">Roommates</span>

        {/* Toggle + Label */}
        {visible ? (
          <>
            <FaToggleOn className="w-6 ml-auto text-white" />
            <span className="text-xs text-white">VISIBLE</span>
          </>
        ) : (
          <>
            <FaToggleOff className="w-6 ml-auto text-white" />
            <span className="text-xs text-white">HIDDEN</span>
          </>
        )}
      </button>


          {/* Subscriptions */}
          <button
            onClick={() => setActiveTab("hostels")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${
                activeTab === "hostels"
                  ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                  : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <FiHome className="h-8 w-8" />
            <span className="truncate text-xl">Hostels</span>
            <span className="text-xs px-4 py-1 font-bold rounded-lg ml-auto bg-white  text-black">
              NEW
            </span>
          </button>

          {/* Influencers Divider */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">CRIBB INFLUENCERS</small>
              -----------------------
            </span>
          </div>

          <div className="flex items-center justify-center">
            <ReferralCard
              balance={100000}
              referral={245}
              total={250000}
              code="ZARK25"
            />
          </div>

          {/* Account Divider */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --
              <small className="mx-2 text-[#FFA1A1]">ACCOUNT MANAGEMENT</small>
              -------------------
            </span>
          </div>

          {/* Settings */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center rounded px-8 py-2 gap-3 transition w-full text-left 
              ${
                activeTab === "settings"
                  ? "text-[#FFA1A1] border-l-[3px] border-[#FFA1A1]"
                  : "text-[white] border-l-[3px] border-[black]"
              }`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg">
              <FiSettings className="h-8 w-8" />
            </span>
            <span className="truncate text-xl">Settings</span>
            <FaRegCircle className="h-3 w-3 ml-auto" />
          </button>

          {/* Profile */}
          <div className="flex items-center my-4 rounded pl-5 pr-4 py-2 gap-3 w-full text-left">
            <span className="flex items-center text-sm">
              --<small className="mx-2 text-[#FFA1A1]">PROFILE</small>
              -------------------------------
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
