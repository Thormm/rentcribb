import React, { useState } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import Card from "../../components/Cards";
import { PiHouse } from "react-icons/pi";
import { HiOutlineDotsVertical, HiOutlineUsers } from "react-icons/hi";
import {
  MdOutlinePendingActions,
  MdErrorOutline,
  MdBlock,
  MdOutlineBookmarkAdded,
  MdOutlineDeleteForever,
} from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { FaPlus, FaToggleOn } from "react-icons/fa";

import { FiChevronDown } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { BiComment } from "react-icons/bi";

const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
  // add more as needed
];

// ----------------------- Draft mock data (20 items) -----------------------
const draftItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Name ${i + 1}`,
  leftIcon: i % 2 === 0 ? "house" : "users",
  shared: i % 2 === 0,
  statusIcon:
    i % 3 === 0 ? "processing" : i % 3 === 1 ? "incomplete" : "notapproved",
  status:
    i % 3 === 0 ? "Processing" : i % 3 === 1 ? "Incomplete" : "Not Approved",
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
      <p className="text-sm pt-5">Managment your Apartments on Cribb</p>

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
const tabs = ["Live", "Drafts"];
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

// ----------------------- Sample Card data (for Live) -----------------------
const cards = Array.from({ length: 12 }, (_, i) => ({
  tier: (i % 3) + 1,
  rating: 4.0 + (i % 5) * 0.1,
  reviews: 100 + i * 10,
  title: `Listing ${i + 1} - Room type available`,
  location: `Location ${i + 1}`,
  price: `₦${(i + 1) * 100000} per Year`,
  background: "bg-white",
}));

// ----------------------- Live: existing paginated cards (5 per page) -----------------------
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
        className="space-y-3 max-h-[1000px] overflow-y-auto pr-2 cards-scroll"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((card, idx) => (
          <div key={idx} className="flex items-center gap-6 w-full">
            <div className="w-1/3 flex flex-col gap-4">
              <InfoPill>
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-md py-1 text-black">Great deals</span>
                  <LuPencil size={25} className="ml-auto text-black" />
                </div>
              </InfoPill>
              <InfoPill>
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-md py-1 text-black">26 Students</span>
                  <MdOutlineBookmarkAdded
                    size={25}
                    className="ml-auto text-black"
                  />
                </div>
              </InfoPill>
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

            <div className="w-2/3 flex justify-center">
              <Card item={card} />
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

// ----------------------- Drafts: 20 items, 10 per page, scroll shows 5 at once -----------------------
function PaginatedDrafts() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      {/* Scroll box (5 visible at once, scrollable) */}
      <div
        className="space-y-6 draft-scroll overflow-y-auto pr-2"
        style={{
          maxHeight: "420px", // ✅ about 5 rows height
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center w-full gap-6"
          >
            {/* Left column */}
            <div className="flex items-center flex-1 border-black rounded-4xl border px-10 py-4 shadow-sm">
              <div className="w-6 h-6 flex items-center justify-center text-black">
                {item.leftIcon === "house" ? (
                  <PiHouse className="w-7 h-7" />
                ) : (
                  <HiOutlineUsers className="w-7 h-7" />
                )}
              </div>

              <div className="flex flex-grow items-center gap-3 px-4">
                <span className="text-md font-normal text-black truncate">
                  {item.name}
                </span>
                <span className="text-md text-black whitespace-nowrap">
                  {item.shared ? "Shared Space" : "Entire Space"}
                </span>
              </div>

              <div className="ml-auto text-black">
                <HiOutlineDotsVertical className="w-6 h-6" />
              </div>
            </div>

            {/* Right column */}
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
                <span className="text-md text-black truncate">{item.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination pills */}
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
const Listingslandlord: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Live");

  const [stateValue, setStateValue] = useState(""); // store state code/name

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full max-w-6xl">
          <SectionHeader title="Listings" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {activeTab === "Live" && (
              <div className="p-5 mt-5 space-y-6">
                <PaginatedCards />
              </div>
            )}

            {activeTab === "Drafts" && (
              <div className="p-5 mt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  {/* Row 1 - First Name with FaPlus */}
                  <div className="relative flex flex-col mb-10">
                    <Label>NEW LISTING</Label>
                    <div className="absolute left-8 top-9 flex items-center justify-center w-12 h-12 rounded-full bg-black">
                      <FaPlus size={20} className="text-white text-sm" />
                    </div>
                  </div>

                  {/* Row 2 - State + State side by side */}
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {/* State 1 */}
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

                    {/* State 2 */}
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
                {/* Coming Soon */}
                                  <button className="w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                                    <BiComment className="w-8 h-8" />
                                    View Sent Requests
                                  </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Listingslandlord;
