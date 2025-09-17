import React, { useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import Card from "../../components/Cards";
import { PiHouse } from "react-icons/pi";
import { HiOutlineUsers, HiOutlineMail } from "react-icons/hi";
import {
  MdOutlinePendingActions,
  MdErrorOutline,
  MdBlock,
  MdOutlineDeleteForever,
  MdOutlineCall,
} from "react-icons/md";
import { FaToggleOn } from "react-icons/fa";
import { FiChevronDown, FiCopy } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { BiComment } from "react-icons/bi";
import { RiWhatsappLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// ----------------------- States -----------------------
const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];

// ----------------------- Draft mock data -----------------------
const draftItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  hostel: `Hostel ${i + 1}`,
  name: `Name ${i + 1}`,
  leftIcon: i % 2 === 0 ? "house" : "users",
  shared: i % 2 === 0,
  statusIcon:
    i % 3 === 0 ? "processing" : i % 3 === 1 ? "incomplete" : "notapproved",
  status:
    i % 3 === 0 ? "Processing" : i % 3 === 1 ? "Incomplete" : "Not Approved",
  date: `2025-09-${String((i % 20) + 1).padStart(2, "0")}`,
  type: i % 2 === 0 ? "home" : "users",
  email: `user${i + 1}@example.com`,
  call: `080000000${i + 1}`,
  whatsapp: `090000000${i + 1}`,
}));

// ----------------------- Sample Card data -----------------------
const cards = Array.from({ length: 12 }, (_, i) => ({
  tier: (i % 3) + 1,
  rating: 4.0 + (i % 5) * 0.1,
  reviews: 100 + i * 10,
  title: `Listing ${i + 1} - Room type available`,
  location: `Location ${i + 1}`,
  price: `₦${(i + 1) * 100000} per Year`,
  background: "bg-white",
}));

// ----------------------- Reusable small helpers -----------------------
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx("text-md pl-8 my-2 font-semibold text-black", className)}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-sm pt-5">See full details of all your Bookings</p>

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

// ----------------------- Tabs -----------------------
const tabs = ["Bookings", "Requests"];
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
      style={{ borderStyle: "dashed", borderColor: "#0000004D" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-lg relative text-black font-medium text-center",
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

// ----------------------- Paginated Cards -----------------------
function PaginatedCards() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const currentData = cards.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="space-y-3 max-h-[1000px] overflow-y-auto pr-12 cards-scroll"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((card, idx) => (
          <div
            key={idx}
            className="mb-10 relative flex items-center w-full gap-10 bg-[#F3EDFE] rounded-3xl p-5 shadow-lg pr-8
  before:content-[''] before:absolute before:-bottom-3 before:right-10 
  before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px] before:border-t-[12px] 
  before:border-l-transparent before:border-r-transparent before:border-t-[#F3EDFE]"
          >
            <div className="w-auto flex justify-start ">
              <Card item={card} />
            </div>
            <div className="w-1/3 grid h-56 content-between gap-15">
              <div className="flex flex-col gap-4 ">
                <InfoPill className="bg-[#D6FFC3]">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-md py-1 text-black">Online</span>
                    <FaToggleOn size={25} className="ml-auto text-black" />
                  </div>
                </InfoPill>
                <InfoPill className="bg-[#FFA1A1]">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-md py-1 text-black">Delete</span>
                    <MdOutlineDeleteForever
                      size={25}
                      className="ml-auto text-black"
                    />
                  </div>
                </InfoPill>
                <div className="flex justify-center">
                  <button className="py-3 text-md w-30 font-medium bg-black text-white shadow-lg rounded-lg">
                    EDIT
                  </button>
                </div>
              </div>
              <div className="text-black text-center">11-12-2009</div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------- Paginated Drafts -----------------------
function PaginatedDrafts() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div
        className="space-y-6 draft-scroll overflow-y-auto pr-2"
        style={{
          maxHeight: "420px",
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start w-full gap-6"
          >
            {/* LEFT CARD */}
            <div className="flex-1 border-black rounded-4xl border px-6 py-4 shadow-sm">
              {/* Row 1 (always visible) */}
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center text-black">
                  {item.type === "home" ? (
                    <PiHouse className="w-7 h-7" />
                  ) : (
                    <HiOutlineUsers className="w-7 h-7" />
                  )}
                </div>

                <div className="flex flex-grow items-center gap-5 px-4">
                  {/* Date on the left */}
                  <span className="text-md font-normal text-black whitespace-nowrap">
                    {item.hostel}
                  </span>
                  {/* Name in the middle */}
                  <span className="text-md text-black font-normal truncate">
                    {item.name}
                  </span>
                </div>

                {/* Dropdown / up arrow instead of comment icon */}
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() =>
                    setExpanded(expanded === item.id ? null : item.id)
                  }
                >
                  {expanded === item.id ? (
                    <IoIosArrowUp className="w-7 h-7 text-black" />
                  ) : (
                    <IoIosArrowDown className="w-7 h-7 text-black" />
                  )}
                </button>
              </div>
              {/* Row 2: Date (left) + Action Icons (right) */}
              {expanded === item.id && (
                <div className="flex items-center text-[black] justify-between mt-3 px-8">
                  {/* Date on left */}
                  <span className="text-xs">{item.date}</span>

                  {/* Icons on right */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white   shadow flex items-center justify-center">
                      <HiOutlineMail className="w-4 h-4 " />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white   shadow flex items-center justify-center">
                      <MdOutlineCall className="w-4 h-4 " />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white   shadow flex items-center justify-center">
                      <RiWhatsappLine className="w-4 h-4 " />
                    </div>
                  </div>
                </div>
              )}
              {/* Expanded Section: Contact Info */}
              {expanded === item.id && (
                <div className="mt-4 bg-white rounded-xl border  p-4 px-8 text-black shadow-sm">
                  <div className="space-y-3">
                    {[
                      { label: "Email", value: item.email },
                      { label: "Call no.", value: item.call },
                      { label: "Whatsapp", value: item.whatsapp },
                    ].map((field, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {field.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm  truncate max-w-[180px]">
                            {field.value}
                          </span>
                          <FiCopy className="w-4 h-4 cursor-pointer hover:text-black transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT STATUS */}
            <div className="flex items-center justify-center gap-3 w-1/3 border-black rounded-4xl border py-4 shadow-sm">
              <div className="flex items-center w-40 space-x-3">
                {item.statusIcon === "processing" && (
                  <MdOutlinePendingActions className="w-6 h-6 text-black" />
                )}
                {item.statusIcon === "incomplete" && (
                  <MdErrorOutline className="w-6 h-6 text-black" />
                )}
                {item.statusIcon === "notapproved" && (
                  <MdBlock className="w-6 h-6 text-black" />
                )}
                <span className="text-md text-black truncate">
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------- Page -----------------------
const Bookingsagent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Bookings");
  const [stateValue, setStateValue] = useState("");

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full max-w-6xl">
          <SectionHeader title="Bookings" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {activeTab === "Bookings" && (
              <div className="p-5 mt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  {/* --- STATS ROW (TOTAL + TOP BOOKINGS) --- */}
                  <div className="col-span-2">
                    {/* Row 1: Labels */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <Label>TOTAL</Label>
                      <Label>TOP BOOKINGS</Label>
                    </div>

                    {/* Row 2: Circle + Bars */}
                    <div className="flex items-center gap-8">
                      {/* TOTAL Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-medium text-black">
                            70
                          </span>
                        </div>
                      </div>

                      {/* TOP BOOKINGS */}
                      <div className="flex-1 space-y-3">
                        {[
                          { name: "Great Villa", value: 90 },
                          { name: "Zaani Hostel", value: 60 },
                          { name: "Kaffto Laurel", value: 40 },
                        ].map((b, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {/* Booking name */}
                            <span className="w-28 text-md text-black truncate">
                              {b.name}
                            </span>

                            {/* Bar */}
                            <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-black"
                                style={{ width: `${b.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-2 mt-10 gap-4">
                    <div>
                      <Label>FILTER</Label>
                      <InfoPill className="relative flex items-center bg-white">
                        <select
                          value={stateValue}
                          onChange={(e) => setStateValue(e.target.value)}
                          className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                        >
                          <option value="">{states[0].label}</option>
                          {states
                            .filter((s) => s.value !== "")
                            .map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                        </select>
                        <FiChevronDown className="pointer-events-none absolute right-3 text-gray-500" />
                      </InfoPill>
                    </div>

                    <div>
                      <Label>SEARCH BY NAME</Label>
                      <InfoPill className="relative flex items-center bg-white">
                        <input
                          className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                          placeholder="Enter here"
                        ></input>
                        <IoIosArrowForward className="pointer-events-none absolute right-1  text-white w-13 h-13 p-3 rounded-full bg-black" />
                      </InfoPill>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 my-8">
                  <span className="text-md font-medium text-black tracking-wide mt-10">
                    --- YOUR BOOKINGS ------------------------------- STATUS
                    ----------
                  </span>
                </div>

                <PaginatedDrafts />

                <button className="w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  View Sent Requests
                </button>
              </div>
            )}

            {activeTab === "Requests" && (
              <div className="p-5 mt-5 space-y-6">
                <div className="col-span-2 grid grid-cols-2 gap-4 w-2/3">
                  <div>
                    <Label>FILTER</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                      >
                        <option value="">{states[0].label}</option>
                        {states
                          .filter((s) => s.value !== "")
                          .map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 text-gray-500" />
                    </InfoPill>
                  </div>

                  <div>
                    <Label>SEARCH BY NAME</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <input
                        className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                        placeholder="Enter here"
                      ></input>
                      <IoIosArrowForward className="pointer-events-none absolute right-1  text-white w-13 h-13 p-3 rounded-full bg-black" />
                    </InfoPill>
                  </div>
                </div>
                <PaginatedCards />

                <button className="w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  View Sent Requests
                </button>

                <button className="w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <BiComment className="w-8 h-8" />
                  Post New Listings
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bookingsagent;
