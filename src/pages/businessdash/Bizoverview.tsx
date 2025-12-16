import React, { useState, useMemo, useEffect } from "react";
import { FiCamera, FiChevronDown, FiMail } from "react-icons/fi";
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
import { useDashboardTab } from "./DashComponents/DashboardTabContext";

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg pl-5 md:pl-8 md:my-3 font-semibold text-black",
        className
      )}
    >
      {children}
    </div>
  );
}

type Review = {
  id: number;
  date: string;
  name: string;
  rating?: number;
  text?: string;
};

type Plan = {
  tag: string;
  features1: string[][];
  features2?: string[][];
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

interface AgentDetails {
  agent_callno: string;
  agent_email: string;
  agent_whats: string;
  bname_agent: string;
  babout_agent: string;
  baddress_agent: string;
  kin: string;
  address: string;
  call_no: string;
  first: string;
}

const Bizoverview: React.FC = () => {
  const { setActiveTab } = useDashboardTab();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTabPage] = useState<string>("Profile");
  // Note: original code referenced `plans` in the useState initializer.
  // To keep identical behavior to your original file, we keep this line as-is.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activePlan, setActivePlan] = useState<any>("TIER1");

  const [agentDetails, setAgentDetails] = useState<AgentDetails>({
    agent_callno: "",
    agent_email: "",
    agent_whats: "",
    bname_agent: "",
    babout_agent: "",
    baddress_agent: "",
    kin: "",
    address: "",
    call_no: "",
    first: "",
  });

  // Reviews state (loaded from backend)
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filters + pagination
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // per your instruction

  // derived values (computed from reviews)
  const filterCounts = useMemo(() => {
    const byStar: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    reviews.forEach((r) => {
      const val = r.rating ?? 0;
      if (val >= 1 && val <= 5) {
        byStar[val] = (byStar[val] || 0) + 1;
      }
    });
    return {
      total: reviews.length,
      byStar,
    };
  }, [reviews]);

  const filtered = useMemo<Review[]>(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === selectedFilter);
  }, [selectedFilter, reviews]);

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

  useEffect(() => {
    const fetchAgentDetails = async () => {
      const login_data = JSON.parse(
        sessionStorage.getItem("login_data") || "{}"
      );
      const user = login_data?.user || "";

      console.log("Fetching agent details for user:", user);

      try {
        const response = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getAgentDetails",
            user: user,
          }),
        });

        // ✅ Read only once, sanitize it, then parse
        const text = await response.text();
        const cleanText = text.trim().replace(/\[\]$/, ""); // remove trailing []
        console.log("Clean raw response:", cleanText);

        const data = JSON.parse(cleanText || "{}");

        if (data.success && data.agent_details) {
          setAgentDetails(data.agent_details);
        } else {
          console.error("Unexpected data:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchAgentDetails();
  }, []);

  // Fetch reviews from backend (get_REVIEWS)
  useEffect(() => {
    const loadReviews = async () => {
      const login_data = JSON.parse(
        sessionStorage.getItem("login_data") || "{}"
      );
      const user = login_data?.user || "";

      try {
        const resp = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_reviews",
            user: user,
          }),
        });

        const text = await resp.text();
        const clean = text.trim().replace(/\[\]$/, "");
        let data;
        try {
          data = JSON.parse(clean || "{}");
        } catch (parseErr) {
          console.error(
            "Failed to parse reviews JSON:",
            parseErr,
            "raw:",
            clean
          );
          data = null;
        }

        if (data && data.success && Array.isArray(data.reviews)) {
          // Map/normalize incoming reviews to expected shape if necessary
          const normalized: Review[] = data.reviews.map((r: any) => ({
            id: Number(r.id),
            date: r.date ?? "",
            name: r.name ?? "",
            rating: r.rating !== undefined ? Number(r.rating) : undefined,
            text: r.text ?? "",
          }));
          setReviews(normalized);
        } else {
          // If API responded but no reviews, set empty
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    loadReviews();
  }, []);

  // ✅ Build the plans reactively with useMemo
  const plans: Record<string, Plan> = useMemo(
    () => ({
      TIER1: {
        tag: "TIER1 : Post Up to 3 Listings",
        features1: [
          [
            "Verify Business Email",
            agentDetails.agent_email ? "Good" : "Pending",
          ],
          [
            "Verify Business Phone",
            agentDetails.agent_callno ? "Good" : "Pending",
          ],
          [
            "Business Address",
            agentDetails.baddress_agent ? "Good" : "Pending",
          ],
          [
            "Business Description",
            agentDetails.babout_agent ? "Good" : "Pending",
          ],
        ],
        features2: [
          ["Email Verification", agentDetails.agent_email ? "Good" : "Pending"],
          ["Call no. Verification", agentDetails.call_no ? "Good" : "Pending"],
          ["Next of Kin", agentDetails.kin ? "Good" : "Pending"],
          ["Residential Address", agentDetails.address ? "Good" : "Pending"],
        ],
      },
      TIER2: {
        tag: "TIER2 : Post Up to 15 Listings",
        features1: [
          ["ID Verification", "Pending"],
          ["Face Verification", "Pending"],
          ["Address Verification", "Pending"],
        ],
      },
      TIER3: {
        tag: "TIER3 : Post Unlimited Listings",
        features1: [
          ["CAC Verification", "Pending"],
          ["Supporting Doc.", "Pending"],
          ["Review Name", "Pending"],
          ["Posting Request", "Pending"],
        ],
      },
    }),
    [agentDetails]
  ); // 👈 updates only when agentDetails changes
  const current = plans[activePlan];

  // compute average rating (1 decimal) — safe guard against division by zero
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    const avg = sum / reviews.length;
    return avg.toFixed(1);
  }, [reviews]);

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title={agentDetails.first || "user"} />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTabPage} />

            {/* Content */}
            {activeTab === "Profile" && (
              <div className="p-5 md:p-5 md:w-2/3 mt-5">
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
                        {agentDetails.bname_agent || "-"}
                      </span>
                    </InfoPill>
                  </div>

                  {/* Row - About */}
                  <div className="md:col-span-2">
                    <Label>ABOUT</Label>
                    <InfoPill className="px-5 md:px-8">
                      <span className="w-full text-xs md:text-sm py-1 rounded-md text-black">
                        {agentDetails.babout_agent || "—"}
                      </span>
                    </InfoPill>
                  </div>

                  {/* Row - Call Number */}
                  <div>
                    <Label>CALL NUMBER</Label>
                    <InfoPill className="px-5 md:px-8">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm py-1">
                          {agentDetails.agent_callno || "—"}
                        </span>
                      </div>
                    </InfoPill>
                  </div>

                  {/* Row - WhatsApp Number */}
                  <div>
                    <Label>WHATSAPP NO</Label>
                    <InfoPill className="px-5 md:px-8 flex items-center justify-between">
                      <span className="flex-1 text-xs md:text-sm py-1 rounded-md text-black">
                        {agentDetails.agent_whats || "—"}
                      </span>
                    </InfoPill>
                  </div>

                  {/* Row - Email */}
                  <div className="md:col-span-2">
                    <Label>BUSINESS EMAIL</Label>
                    <InfoPill className="px-5 md:px-8">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm py-1">
                          {agentDetails.agent_email || "—"}
                        </span>
                      </div>
                    </InfoPill>
                  </div>

                  {/* Row - Address */}
                  <div className="md:col-span-2">
                    <Label>BUSINESS ADDRESS</Label>
                    <InfoPill className="px-5 md:px-8">
                      <span className="w-full text-xs md:text-sm py-1 rounded-md text-black">
                        {agentDetails.baddress_agent || "—"}
                      </span>
                    </InfoPill>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Business Tab */}
            {activeTab === "Verify Business" && (
              <div className="p-2 md:p-5 md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  {/* Current Verification Level */}
                  <div className="md:col-span-2">
                    <Label>CURRENT VERIFICATION LEVEL</Label>
                    <InfoPill className="px-5 md:px-8">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm py-1">
                          {current.tag}
                        </span>
                        <RiInformationLine size={25} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* KYC Tiers */}
                  <div className="md:col-span-2">
                    <Label>KYC TIERS</Label>
                    <div
                      className="grid grid-cols-3 gap-4 mt-3 md:mt-5 bg-white p-3 rounded-lg"
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
                              "flex items-center justify-center gap-2 rounded-lg md:px-4 py-2 font-semibold transition-colors duration-200 border",
                              isActive
                                ? "bg-black text-[#D6FFC3] border-black shadow-md"
                                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                            )}
                          >
                            <MdVerified />
                            <span className="text-xs md:text-lg">{`TIER ${
                              i + 1
                            }`}</span>
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
                            {current.features2.map(([label2, value2]) => {
                              let IconComponent;

                              // Define which icon to show based on value2
                              if (value2.toLowerCase() === "good") {
                                IconComponent = MdVerified;
                              } else {
                                IconComponent = MdOutlinePending; // default icon
                              }

                              return (
                                <div
                                  key={label2}
                                  className="flex items-center justify-between py-2 px-4 text-xs md:text-sm"
                                >
                                  <span>{label2}</span>
                                  <span className="inline-flex items-center gap-2 text-xs md:text-md">
                                    <IconComponent size={20} />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {(!agentDetails.agent_email ||
                        !agentDetails.call_no ||
                        !agentDetails.kin ||
                        !agentDetails.address) && (
                        <div className="mt-10 flex justify-center">
                          <button
                            onClick={() => setActiveTab("overview")}
                            className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                          >
                            UPDATE
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  <div className="rounded-2xl bg-white text-black mx-1 mt-10 border p-3 shadow-sm">
                    {current.features1.map(([label1, value1]) => {
                      let IconComponent;

                      // Define which icon to show based on value2
                      if (value1.toLowerCase() === "good") {
                        IconComponent = MdVerified;
                      } else {
                        IconComponent = MdOutlinePending; // default icon
                      }

                      return (
                        <div
                          key={label1}
                          className="flex items-center justify-between py-2 px-4 text-xs md:text-sm"
                        >
                          <span>{label1}</span>
                          <span className="inline-flex items-center gap-2 text-xs md:text-md">
                            <IconComponent size={20} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Update button
                <div className="mt-10 flex justify-center">
                  <button
                    className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                  >
                    UPGRADE
                  </button>
                </div> */}
              </div>
            )}

            {activeTab === "Operations" && (
              <div className="md:p-5 md:w-2/3 mt-5">
                {/* Inputs grid */}
                <div className="m-2 md:m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>INSPECTION DAYS</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select className="appearance-none w-full bg-transparent outline-none py-1 text-black"></select>
                      <FiChevronDown className="pointer-events-none absolute right-5 text-gray-500" />
                    </InfoPill>
                  </div>
                  {/* Row 2 */}
                  <div>
                    <Label>INSPECTION</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select className="appearance-none w-full bg-transparent outline-none py-1 text-black"></select>
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
                  <button className="py-3 text-md px-4 font-medium text-white bg-black shadow-lg rounded-lg">
                    SAVE CHANGES
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-10 mb-5">
                  <span className="text-sm md:text-md font-semibold text-black tracking-wide">
                    --- ANALYTICS ----------------------------
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 mt-5 border border-dashed border-gray-40 bg-white p-1 md:p-3 rounded-lg">
                  <button className="flex items-center border-2 justify-center md:gap-2 py-1 md:py-0 md:p-3 rounded-lg bg-transparent text-black">
                    <RiListView className="text-black" size={20} />
                    <span className="text-xs md:text-md font-semibold">
                      LISTINGS
                    </span>
                  </button>
                  <button className="flex items-center border-2 justify-center md:gap-2 py-1 md:py-0 md:p-3 rounded-lg bg-transparent text-black">
                    <MdOutlineBookmarkAdded className="text-black" size={20} />
                    <span className="text-xs md:text-md font-semibold">
                      BOOKINGS
                    </span>
                  </button>

                  <button className="flex border-2 items-center justify-center md:gap-2 py-1 md:py-0 md:p-3 rounded-lg bg-transparent text-black">
                    <MdOutlineSupervisedUserCircle
                      className="text-black"
                      size={20}
                    />
                    <span className="text-xs md:text-md font-semibold">
                      STUDENTS
                    </span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
                  {/* --- STATS ROW (TOTAL + TOP BOOKINGS) --- */}
                  <div className="col-span-2">
                    {/* Row 1: Labels */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Label>RATINGS</Label>
                    </div>

                    {/* Row 2: Circle + Bars */}
                    <div className="flex grid-cols-1 md:grid-cols-2 items-center md:ml-8">
                      {/* TOTAL Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-medium text-black">
                            {averageRating}
                          </span>
                        </div>
                      </div>

                      {/* TOP BOOKINGS */}
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((star, i) => {
                          const count = filterCounts.byStar[star] || 0;
                          const width =
                            filterCounts.total > 0
                              ? (count / filterCounts.total) * 100
                              : 0;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              {/* Stars right aligned */}
                              <div className="w-28 flex justify-end">
                                <div className="flex justify-end w-full">
                                  {Array.from({ length: star }).map((_, j) => (
                                    <AiFillStar
                                      key={j}
                                      className="text-yellow-500 text-md"
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-black"
                                  style={{ width: `${width}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
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
                            "flex items-center w-25 md:w-35 justify-center border-3 gap-2 rounded-lg px-4 py-2 font-semibold shadow-sm whitespace-nowrap",
                            selectedFilter === f.value
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-black"
                          )}
                        >
                          <span className="text-xs md:text-lg">
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
                <div className="flex items-center gap-3 my-8 md:w-2/3">
                  <span className="text-xs md:text-md font-semibold text-black tracking-wide">
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
                          className="border-black md:w-2/3 rounded-4xl border px-2 md:px-6 py-2 md:py-4 shadow-sm bg-white"
                        >
                          {/* Row 1 */}
                          <div className="flex items-center">
                            {/* Left icon */}
                            <div className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center text-black">
                              <PiHouse className="w-4 h-4 md:w-6 md:h-6" />
                            </div>

                            {/* Date + Name (SAME LINE) */}
                            <div className="flex flex-grow min-w-0 items-center gap-2 px-2 md:px-4">
                              <span className="text-[10px] md:text-md font-normal text-black whitespace-nowrap">
                                {r.date}
                              </span>

                              <span className="text-xs md:text-md font-normal text-black truncate max-w-[180px]">
                                {r.name.length > 14
                                  ? r.name.substring(0, 14) + "..."
                                  : r.name}
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
                                <IoIosArrowUp className="w-4 h-4 md:w-6 md:h-6 text-black" />
                              ) : (
                                <IoIosArrowDown className="w-4 h-4 md:w-6 md:h-6 text-black" />
                              )}
                            </div>
                          </div>

                          {/* Expanded section */}
                          {isExpanded && (
                            <div className="mt-3 px-5 md:px-10 space-y-3">
                              {/* Stars */}
                              {r.rating !== undefined && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) =>
                                    i < (r.rating ?? 0) ? (
                                      <AiFillStar
                                        key={i}
                                        className="w-4 h-4 md:w-7 md:h-7 text-yellow-400"
                                      />
                                    ) : (
                                      <AiOutlineStar
                                        key={i}
                                        className="w-4 h-4 md:w-7 md:h-7 text-gray-300"
                                      />
                                    )
                                  )}
                                </div>
                              )}
                              {/* Review text */}
                              {r.text && (
                                <p className="text-xs md:text-sm text-black leading-relaxed">
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
