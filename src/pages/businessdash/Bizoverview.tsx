import React, { useState, useMemo, useEffect } from "react";
import { FiCamera, FiCheckCircle, FiChevronDown, FiMail } from "react-icons/fi";
import clsx from "clsx";
import InfoPill from "../../components/Pill"; // pill component
import { BsQuestionCircle } from "react-icons/bs";
import {
  MdOutlineBookmarkAdded,
  MdOutlinePending,
  MdOutlineSupervisedUserCircle,
  MdVerified,
} from "react-icons/md";
import { RiInformationLine, RiListView } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { PiHouse } from "react-icons/pi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx("text-sm md:text-lg pl-5 md:pl-8 md:my-3 font-semibold text-black", className)}
    >
      {children}
    </div>
  );
}

type Review = {
  id: number;
  date: string;
  name: string;
  type: "home" | "user";
  rating?: number;
  text?: string;
};

const reviews: Review[] = [
  {
    id: 1,
    date: "6th Jan, 2025",
    name: "Zarken Christian",
    type: "user",
    rating: 1,
    text: "",
  },
  {
    id: 2,
    date: "6th Jan, 2025",
    name: "Zarken Christian",
    type: "user",
    rating: 5,
    text: "This is a very good customer, pays well and speaks kindly.",
  },
  {
    id: 3,
    date: "7th Jan, 2025",
    name: "Amelia Johnson",
    type: "home",
    rating: 4,
    text: "Polite and easy to communicate with.",
  },
  {
    id: 4,
    date: "7th Jan, 2025",
    name: "Brian Cole",
    type: "user",
    rating: 2,
    text: "A bit difficult to reach at times.",
  },
  {
    id: 5,
    date: "8th Jan, 2025",
    name: "Sophia Miller",
    type: "user",
    rating: 5,
    text: "Excellent experience, very professional.",
  },
  {
    id: 6,
    date: "8th Jan, 2025",
    name: "David Wilson",
    type: "home",
    rating: 3,
    text: "Average interaction, nothing special.",
  },
  {
    id: 7,
    date: "9th Jan, 2025",
    name: "Emily Davis",
    type: "user",
    rating: 5,
    text: "Always pays on time and very respectful.",
  },
  {
    id: 8,
    date: "9th Jan, 2025",
    name: "Michael Brown",
    type: "user",
    rating: 4,
    text: "Good overall, but can improve communication.",
  },
  {
    id: 9,
    date: "10th Jan, 2025",
    name: "Olivia Taylor",
    type: "home",
    rating: 2,
    text: "Not very responsive to messages.",
  },
  {
    id: 10,
    date: "10th Jan, 2025",
    name: "James Anderson",
    type: "user",
    rating: 5,
    text: "Reliable and cooperative.",
  },
  {
    id: 11,
    date: "11th Jan, 2025",
    name: "Grace Thompson",
    type: "user",
    rating: 3,
    text: "Neutral experience.",
  },
  {
    id: 12,
    date: "11th Jan, 2025",
    name: "Ethan Martinez",
    type: "home",
    rating: 4,
    text: "Helpful and friendly.",
  },
  {
    id: 13,
    date: "12th Jan, 2025",
    name: "Isabella Moore",
    type: "user",
    rating: 5,
    text: "Wonderful personality, very kind.",
  },
  {
    id: 14,
    date: "12th Jan, 2025",
    name: "William Lee",
    type: "user",
    rating: 1,
    text: "Poor behavior, not recommended.",
  },
  {
    id: 15,
    date: "13th Jan, 2025",
    name: "Charlotte Harris",
    type: "home",
    rating: 4,
    text: "Smooth transaction, pleasant to work with.",
  },
  {
    id: 16,
    date: "13th Jan, 2025",
    name: "Benjamin Clark",
    type: "user",
    rating: 5,
    text: "Always respectful and trustworthy.",
  },
  {
    id: 17,
    date: "14th Jan, 2025",
    name: "Mia Lewis",
    type: "user",
    rating: 2,
    text: "Had some issues with delays.",
  },
  {
    id: 18,
    date: "14th Jan, 2025",
    name: "Lucas Young",
    type: "home",
    rating: 3,
    text: "Interaction was fine but could improve punctuality.",
  },
  {
    id: 19,
    date: "15th Jan, 2025",
    name: "Harper Walker",
    type: "user",
    rating: 5,
    text: "Fantastic person, always cooperative.",
  },
  {
    id: 20,
    date: "15th Jan, 2025",
    name: "Daniel Hall",
    type: "user",
    rating: 4,
    text: "Good communication and reliable.",
  },
];

type Plan = {
  tag: string;
  features1: string[][];
  features2?: string[][];
};

// Mock plan data
const plans: Record<string, Plan> = {
  TIER1: {
    tag: "TIER1 : Post Up to 3 Listings",
    features1: [
      ["Verify Business Email", ""],
      ["Verify Business Phone", "Pending"],
      ["Business Address", "Pending"],
      ["Business Description", "Pending"],
      ["Attestation", "Pending"],
    ],
    features2: [
      ["Email Verification", ""],
      ["Call no. Verification", "Pending"],
      ["Next of Kin", "Pending"],
      ["Residential Address", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
  TIER2: {
    tag: "TIER2 : Post Up to 15 Listings",
    features1: [
      ["ID Verificaiton", "Pending"],
      ["Face Verificaiton", "Pending"],
      ["Address Verificaiton", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
  TIER3: {
    tag: "TIER3 : Post Unlimited Listings",
    features1: [
      ["CAC Verification", "Pending"],
      ["Supporting Doc.", "Pending"],
      ["Review Name", "Pending"],
      ["Posting Request", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
};

// Header with help icon
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">Hola, {title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        Our goal is for your{" "}
        <span className="text-[#FFA1A1] font-semibold">SCHOOL LIFE</span> to be{" "}
        <span className="text-[#FFA1A1] font-semibold">MADE SOFT</span>
      </p>

      <div
        className="mt-2 w-full border-t-4"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

// Tabs component
const tabs = ["Profile", "Verify Business", "Operations", "Reviews"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex mt-5 border-2 py-4 rounded-xl relative overflow-hidden"
      style={{
        borderStyle: "dashed",
        borderColor: "#0000004D",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
                      "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
                      active === tab
                        ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
                        : ""
                    )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

type FilterValue = "all" | 1 | 2 | 3 | 4 | 5;

const Bizoverview: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Profile");
  const [activePlan, setActivePlan] = useState<keyof typeof plans>("TIER1");
  const current = plans[activePlan];
  const [whatsapp, setWhatsapp] = useState<string>("08078436972");
  const [stateValue, setStateValue] = useState<string>(""); // store state code/name
  const [address, setAddress] = useState<string>("");

  // Filters + pagination
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // derived values
  const filterCounts = useMemo(() => {
    const byStar: Record<number, number> = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
    return {
      total: reviews.length,
      byStar,
    };
  }, []);

  const filtered = useMemo<Review[]>(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === selectedFilter);
  }, [selectedFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / itemsPerPage)),
    [filtered.length]
  );

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // ensure currentPage does not exceed totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const states = [
    { value: "", label: "Select State" },
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "rivers", label: "Rivers" },
    // add more as needed
  ];

  const handleSave = () => {
    const payload = {
      whatsapp,
      state: stateValue,
      address,
    };
    console.log("Save profile:", payload);
  };

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title="Zarken" />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Content */}
            {activeTab === "Profile" && (
  <div className="p-5 md:p-5 md:w-2/3 mt-5">
    {/* Avatar Upload - left aligned */}
    <div>
      <Label>LOGO</Label>
    </div>
    <div className="flex justify-start mb-10 pl-5">
      <div className="h-24 w-24 rounded-full border border-black bg-white flex items-center justify-center">
        <FiCamera className="text-black" size={35} />
      </div>
    </div>

    {/* Info grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Row - Business Name */}
      <div className="md:col-span-2">
        <Label>BUSINESS NAME</Label>
        <InfoPill className="px-5 md:px-8">
          <span className="w-full text-xs md:text-sm py-1 rounded-md text-black">
            {address || "—"}
          </span>
        </InfoPill>
      </div>

      {/* Row - About */}
      <div className="md:col-span-2">
        <Label>ABOUT</Label>
        <InfoPill className="px-5 md:px-8 bg-white">
          <span className="w-full text-xs md:text-sm py-1 rounded-md text-black">
            
          </span>
        </InfoPill>
      </div>

      {/* Row - Call Number */}
      <div>
        <Label>CALL NUMBER</Label>
        <InfoPill className="px-5 md:px-8">
          <div className="inline-flex items-center justify-between w-full">
            <span className="text-xs md:text-sm py-1"></span>
            <RiInformationLine size={14} className="ml-auto" />
          </div>
        </InfoPill>
      </div>

      {/* Row - WhatsApp Number */}
      <div>
        <Label>WHATSAPP NO</Label>
        <InfoPill className="px-5 md:px-8 flex items-center justify-between">
          <span className="flex-1 text-xs md:text-sm py-1 rounded-md text-black">
            {whatsapp || "—"}
          </span>
          <FiCheckCircle className="text-gray-400 ml-2" size={20} />
        </InfoPill>
      </div>

      {/* Row - Email */}
      <div className="md:col-span-2">
        <Label>BUSINESS EMAIL</Label>
        <InfoPill className="px-5 md:px-8">
          <div className="inline-flex items-center justify-between w-full">
            <span className="text-xs md:text-sm py-1">
              
            </span>
            <RiInformationLine size={14} className="ml-auto" />
          </div>
        </InfoPill>
      </div>

      {/* Row - Address */}
      <div className="md:col-span-2">
        <Label>BUSINESS ADDRESS</Label>
        <InfoPill className="px-5 md:px-8 bg-white">
          <span className="w-full text-xs md:text-sm py-1 rounded-md text-black">
            {address || "—"}
          </span>
        </InfoPill>
      </div>

      {/* Row - State */}
      <div className="md:col-span-2">
        <Label>STATE</Label>
        <InfoPill className="px-5 md:px-8 relative flex items-center bg-white">
          <span className="w-full text-xs md:text-sm py-1 text-black">
            {states.find((s) => s.value === stateValue)?.label || "—"}
          </span>
          <FiChevronDown className="text-xs md:text-sm pointer-events-none absolute right-5 text-gray-500" />
        </InfoPill>
      </div>
    </div>

    {/* Save Button */}
    <div className="mt-10 flex justify-center">
      <button
        onClick={handleSave}
        className="py-3 text-white text-md px-4 font-medium bg-black shadow-lg rounded-lg"
      >
        SAVE CHANGES
      </button>
    </div>
  </div>
)}


            {/* Verify Business Tab */}
            {activeTab === "Verify Business" && (
              <div className="p-5 w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  {/* Current Verification Level */}
                  <div className="md:col-span-2">
                    <Label>CURRENT VERIFICATION LEVEL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">{current.tag}</span>
                        <RiInformationLine size={25} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* KYC Tiers */}
                  <div className="md:col-span-2">
                    <Label>KYC TIERS</Label>
                    <div
                      className="grid grid-cols-3 gap-4 mt-5 bg-white p-3 rounded-lg"
                      style={{
                        borderStyle: "dashed",
                        borderColor: "#0000004D",
                        borderWidth: "1px",
                      }}
                    >
                      {(
                        ["TIER1", "TIER2", "TIER3"] as (keyof typeof plans)[]
                      ).map((tier, i) => {
                        const isActive = activePlan === tier;
                        return (
                          <button
                            key={tier}
                            onClick={() => setActivePlan(tier)}
                            className={clsx(
                              "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors duration-200 border",
                              isActive
                                ? "bg-black text-[#D6FFC3] border-black shadow-md"
                                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                            )}
                          >
                            <MdVerified />
                            <span className="text-lg">{`TIER ${i + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Features 1 */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 mt-10 mb-5">
                    <span className="text-md font-semibold text-black tracking-wide">
                      --- REQUIREMENTS ----------------------------
                    </span>
                  </div>

                  {/* Features 2 (only for TIER1) */}
                  {current.features2 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                        <div className="md:col-span-2">
                          <div className="rounded-2xl bg-white text-black mx-1 border p-3 shadow-sm">
                            {current.features2.map(([label2, value2]) => (
                              <div
                                key={label2}
                                className="flex items-center justify-between py-2 px-4 text-md"
                              >
                                <span>{label2}</span>
                                <span className="inline-flex items-center gap-2">
                                  {value2} <RiInformationLine size={20} />
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 flex justify-center">
                        <button
                          onClick={handleSave}
                          className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                        >
                          UPDATE
                        </button>
                      </div>
                    </>
                  )}

                  <div className="rounded-2xl bg-white text-black mx-1 mt-10 border p-3 shadow-sm">
                    {current.features1.map(([label1, value1]) => (
                      <div
                        key={label1}
                        className="flex items-center justify-between py-2 px-4 text-md"
                      >
                        <span>{label1}</span>
                        <span className="inline-flex items-center gap-2">
                          {value1} <RiInformationLine size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update button */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleSave}
                    className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                  >
                    UPGRADE
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Operations" && (
              <div className="p-5 w-2/3 mt-5">
                {/* Inputs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>INSPECTION DAYS</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select
                        value={stateValue}
                        className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                      ></select>
                      <FiChevronDown className="pointer-events-none absolute right-5 text-gray-500" />
                    </InfoPill>
                  </div>
                  {/* Row 2 */}
                  <div>
                    <Label>INSPECTION</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select
                        value={stateValue}
                        className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                      ></select>
                      <FiChevronDown className="pointer-events-none absolute right-5 text-gray-500" />
                    </InfoPill>
                  </div>
                  <div>
                    <Label>PRICE</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <input className="appearance-none w-full bg-transparent outline-none py-1 text-black" />
                      <FaPlus className="pointer-events-none absolute right-5 text-black" />
                    </InfoPill>
                  </div>
                </div>

                {/* Save Changes */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleSave}
                    className="py-3 text-md px-4 font-medium bg-black shadow-lg rounded-lg"
                  >
                    SAVE CHANGES
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-md font-semibold text-black tracking-wide">
                    --- ANALYTICS ----------------------------
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-5 border border-dashed border-gray-40 bg-white p-3 rounded-lg">
                  <button className="flex items-center border-2 justify-center gap-2 p-3 rounded-lg bg-transparent text-black">
                    <RiListView className="text-black" size={30} />
                    <span className="text-lg font-semibold">LISTINGS</span>
                  </button>
                  <button className="flex items-center border-2 justify-center gap-2 p-3 rounded-lg bg-transparent text-black">
                    <MdOutlineBookmarkAdded className="text-black" size={30} />
                    <span className="text-lg font-semibold">SORTED</span>
                  </button>

                  <button className="flex border-2 items-center justify-center gap-2 p-3 rounded-lg bg-transparent text-black">
                    <MdOutlineSupervisedUserCircle
                      className="text-black"
                      size={30}
                    />
                    <span className="text-lg font-semibold">SORTED</span>
                  </button>
                </div>

                <div className="my-10">
                  <div className="flex flex-col p-5 gap-8 bg-transparent">
                    {/* Coming Soon */}
                    <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                      <MdOutlinePending className="w-8 h-8" />
                      Coming Soon ...
                    </button>

                    {/* Join Waitlist */}
                    <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                      <FiMail className="w-8 h-8" />
                      Join Waitlist &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="p-5 mt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  {/* --- STATS ROW (TOTAL + TOP BOOKINGS) --- */}
                  <div className="col-span-2">
                    {/* Row 1: Labels */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Label>RATINGS</Label>
                    </div>

                    {/* Row 2: Circle + Bars */}
                    <div className="flex items-center ml-8">
                      {/* TOTAL Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-medium text-black">
                            4.8
                          </span>
                        </div>
                      </div>

                      {/* TOP BOOKINGS */}
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((count, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {/* Stars right aligned */}
                            <div className="w-28 flex justify-end">
                              <div className="flex justify-end w-full">
                                {Array.from({ length: count }).map((_, j) => (
                                  <AiFillStar
                                    key={j}
                                    className="text-yellow-500 text-md"
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Progress bar stays untouched */}
                            <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-black"
                                style={{ width: `${count * 20}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- FILTER BUTTONS --- */}
                <div>
                  <div className="md:col-span-2 overflow-x-auto scrollbar-hide">
                    <div
                      className="flex gap-4 mt-5 bg-white p-3 rounded-lg w-max"
                      style={{
                        borderStyle: "dashed",
                        borderColor: "#0000004D",
                        borderWidth: "1px",
                      }}
                    >
                      {[
                        { label: "ALL", value: "all" as FilterValue },
                        { label: "5 STAR", value: 5 as FilterValue },
                        { label: "4 STAR", value: 4 as FilterValue },
                        { label: "3 STAR", value: 3 as FilterValue },
                        { label: "2 STAR", value: 2 as FilterValue },
                        { label: "1 STAR", value: 1 as FilterValue },
                      ].map((f) => (
                        <button
                          key={String(f.value)}
                          onClick={() => {
                            setSelectedFilter(f.value);
                            setCurrentPage(1); // reset page when filter changes
                          }}
                          className={clsx(
                            "flex items-center w-35 justify-center border-3 gap-2 rounded-lg px-4 py-2 font-semibold shadow-sm whitespace-nowrap",
                            selectedFilter === f.value
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-black"
                          )}
                        >
                          <span className="text-lg">
                            {f.label} (
                            {f.value === "all"
                              ? filterCounts.total
                              : filterCounts.byStar[f.value as number]}
                            )
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Header with dashed line */}
                <div className="flex items-center gap-3 my-8 w-2/3">
                  <span className="text-md font-semibold text-black tracking-wide">
                    --- REVIEWS --------------------------
                  </span>
                </div>

                {/* --- REVIEWS LIST + PAGINATION --- */}
                <div>
                  {/* Reviews container (pagination-controlled) */}
                  <div
                    className="space-y-8 max-h-[350px] overflow-y-auto pr-2"
                    style={{
                      scrollbarColor: "#FFA1A1 transparent",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {currentItems.map((r) => {
                      const isExpanded = expanded === r.id;
                      return (
                        <div
                          key={r.id}
                          className="border-black w-2/3 rounded-4xl border px-6 py-4 shadow-sm bg-white"
                        >
                          {/* Row 1 */}
                          <div className="flex items-center">
                            {/* Left icon */}
                            <div className="w-6 h-6 flex items-center justify-center text-black">
                              <PiHouse className="w-6 h-6" />
                            </div>

                            {/* Date + name */}
                            <div className="flex flex-grow items-center gap-5 px-4">
                              <span className="text-md font-normal text-black whitespace-nowrap">
                                {r.date}
                              </span>
                              <span className="text-md text-black font-normal truncate">
                                {r.name}
                              </span>
                            </div>

                            {/* Dropdown toggle */}
                            <div
                              className="w-6 h-6 flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                setExpanded(isExpanded ? null : r.id)
                              }
                            >
                              {isExpanded ? (
                                <IoIosArrowUp className="w-6 h-6 text-black" />
                              ) : (
                                <IoIosArrowDown className="w-6 h-6 text-black" />
                              )}
                            </div>
                          </div>

                          {/* Expanded section */}
                          {isExpanded && (
                            <div className="mt-3 px-10 space-y-3">
                              {/* Stars */}
                              {r.rating !== undefined && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) =>
                                    i < (r.rating ?? 0) ? (
                                      <AiFillStar
                                        key={i}
                                        className="w-7 h-7 text-yellow-400"
                                      />
                                    ) : (
                                      <AiOutlineStar
                                        key={i}
                                        className="w-7 h-7 text-gray-300"
                                      />
                                    )
                                  )}
                                </div>
                              )}
                              {/* Review text */}
                              {r.text && (
                                <p className="text-sm text-black leading-relaxed">
                                  {r.text}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg border text-sm transition ${
                          currentPage === i + 1
                            ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                            : "bg-white text-black border-black"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bizoverview;
