import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import Fuse from "fuse.js";
import { debounce } from "lodash";

import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import Card from "../../components/Cards";
import { PiHouse } from "react-icons/pi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbCancel, TbHomeSpark } from "react-icons/tb";
import {
  MdOutlinePending,
  MdOutlineBed,
  MdCancel,
  MdOutlineDeleteForever,
  MdOutlineBookmarkAdded,
} from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { BiComment } from "react-icons/bi";
import { RiInformationLine } from "react-icons/ri";

// ----------------------- CONSTANTS -----------------------
const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];

const SORT_OPTIONS = [
  { value: "date_recent", label: "Date (Recent)" },
  { value: "date_old", label: "Date (Old)" },
  { value: "processing", label: "Processing" },
  { value: "incomplete", label: "Incomplete" },
  { value: "not_approved", label: "Not approved" },
  { value: "shared", label: "Shared" },
  { value: "entire", label: "Entire space" },
  { value: "name_az", label: "Name A-Z" },
  { value: "name_za", label: "Name Z-A" },
];

const statusIcons: any = {
  Incomplete: <MdOutlinePending className="w-4 h-4 md:w-7 md:h-7 text-black" />,
  Processing: (
    <AiOutlineLoading3Quarters className="w-4 h-4 md:w-7 md:h-7 text-black animate-spin" />
  ),
  "Not Approved": <TbCancel className="w-4 h-4 md:w-7 md:h-7 text-black" />,
};

// ----------------------- API -----------------------
async function getDraftSpaces(user: string) {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_landlord_spaces", user }),
  });

  const data = await res.json();

  const entire = (data.entire_spaces || []).map((item: any) => ({
    id: `entire-${item.id}`,
    gotoid: item.id,
    name: item.space_name || "Entire Space",
    type: "entire",
    created_at: item.created_at,
    status: item.status,
    space: "entirespace",
  }));

  const shared = (data.shared_spaces || []).map((item: any) => ({
    id: `shared-${item.id}`,
    gotoid: item.id,
    name: item.space_name || "Shared Space",
    type: "shared",
    created_at: item.created_at,
    status: item.status,
    space: "sharedspace",
  }));

  return [...entire, ...shared];
}

type DraftItem = {
  id: string;
  name: string;
  type: string;
  created_at: string;
  status?: string;
  gotoid: string;
  space: string;
};

const groupByStatus = (data: DraftItem[], order: string[]): DraftItem[] => {
  const buckets: Record<string, DraftItem[]> = {};
  const rest: DraftItem[] = [];

  order.forEach((status) => {
    buckets[status] = [];
  });

  data.forEach((item) => {
    const status = item.status?.trim();
    if (status && buckets[status]) {
      buckets[status].push(item);
    } else {
      rest.push(item);
    }
  });

  return [...order.flatMap((s) => buckets[s]), ...rest];
};

// ----------------------- PAGINATED DRAFTS -----------------------
function PaginatedDrafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_recent");
  const [fuse, setFuse] = useState<Fuse<any> | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    if (!login.user) return;
    getDraftSpaces(login.user).then((data) => {
      setDrafts(data);
      setFuse(
        new Fuse(data, {
          keys: ["name"],
          threshold: 0.4,
        })
      );
    });
  }, []);

  const handleSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
        setPage(1);
      }, 300),
    []
  );

  const filteredDrafts = useMemo(() => {
    let data = [...drafts];

    if (search && fuse) {
      const results = fuse.search(search);
      data = results.map((res) => res.item);
    }

    switch (sortBy) {
      case "date_recent":
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "date_old":
        data.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "processing":
        data = groupByStatus(data, [
          "Processing",
          "Incomplete",
          "Not Approved",
        ]);
        break;
      case "not_approved":
        data = groupByStatus(data, [
          "Not Approved",
          "Processing",
          "Incomplete",
        ]);
        break;
      case "incomplete":
        data = groupByStatus(data, [
          "Incomplete",
          "Processing",
          "Not Approved",
        ]);
        break;
      case "shared":
        data.sort((a, b) =>
          a.type === "shared" ? -1 : b.type === "shared" ? 1 : 0
        );
        break;
      case "entire":
        data.sort((a, b) =>
          a.type === "entire" ? -1 : b.type === "entire" ? 1 : 0
        );
        break;
      case "name_az":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_za":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return data;
  }, [drafts, search, sortBy, fuse]);

  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);
  const currentData = filteredDrafts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 md:mt:0 mb-4 md:w-2/3">
        <div>
          <Label>FILTER</Label>
          <InfoPill className="relative flex items-center bg-white">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full text-xs md:text-sm  bg-transparent outline-none py-1 text-black"
            >
              {SORT_OPTIONS.map((s) => (
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
              className="appearance-none text-xs md:text-sm  w-full bg-transparent outline-none py-1 text-black"
              placeholder="Enter here"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <IoIosArrowForward className="pointer-events-none absolute right-1  text-white w-9 h-9 md:w-13 md:h-13 p-1 md:p-3 rounded-full bg-black" />
          </InfoPill>
        </div>
      </div>

      <div className="flex items-center gap-3 my-4">
        <span className="text-md font-semibold text-black tracking-wide mt-5">
          --- YOUR DRAFTS ------
        </span>
      </div>

      {/* Drafts List */}
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-[580px] md:min-w-0">
          <div
            className="space-y-6 overflow-y-auto pr-2"
            style={{ maxHeight: 420 }}
          >
            {currentData.map((item) => (
              <div
                key={item.id}
                className="flex gap-6"
                onClick={
                  item.status?.trim() === "Incomplete"
                    ? () => navigate(`/${item.space}?id=${item.gotoid}`)
                    : undefined
                }
              >
                {/* LEFT */}
                <div className="grid grid-cols-10 items-center bg-white border rounded-4xl gap-2 px-4 py-4 shadow-sm flex-1">
                  <div className="col-span-2 flex justify-left">
                    {item.type === "shared" ? (
                      <MdOutlineBed className="w-4 h-4 md:w-7 md:h-7" />
                    ) : (
                      <PiHouse className="w-4 h-4 md:w-7 md:h-7" />
                    )}
                  </div>
                  <span className="col-span-3 truncate text-xs md:text-base">
                    {item.name.trim()}
                  </span>
                  <span className="col-span-4 text-xs md:text-base">
                    {item.type.trim() === "shared"
                      ? "Shared Space"
                      : "Entire Space"}
                  </span>
                  <div className="col-span-1 flex justify-left">
                    <HiOutlineDotsVertical className="w-4 h-4 md:w-7 md:h-7" />
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  className={clsx(
                    "grid grid-cols-10 gap-2 md:gap-4 px-4 md:px-6 items-center border rounded-4xl py-4 shadow-sm w-[180px] md:w-[230px]",
                    item.status?.trim() === "Processing" && "bg-[#F3EDFE]",
                    item.status?.trim() === "Not Approved" && "bg-[#FFA9A9]",
                    item.status?.trim() === "Incomplete" && "bg-white"
                  )}
                >
                  <div className="col-span-2 md:col-span-3 flex justify-center">
                    {statusIcons[item.status?.trim()]}
                  </div>
                  <span className="col-span-8 md:col-span-7 truncate text-center text-xs md:text-base">
                    {item.status?.trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white"
                  : "bg-white text-black"
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

// ----------------------- LABEL -----------------------
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

// ----------------------- TABS -----------------------
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

// ----------------------- SECTION HEADER -----------------------
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
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

// ----------------------- LIVE CARDS -----------------------
interface LiveSpace {
  id: string;
  space: string;
  name: string;
  type: string;
  location: string;
  price: number;
  duration: string;
  status: string;
  active: string;
  rating: number;
  reviews: number;
  tier: number;
  bookmarks: number;
  background: string;
}

async function getLiveSpaces(user: string): Promise<LiveSpace[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_live_spaces", user }),
  });

  const data = await res.json();

  const parsePhotos = (raw: any) => {
    if (!raw) return [];
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const entire: LiveSpace[] = (data.entire_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "entirespace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: item.price,
    duration: item.duration,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    created_at: item.created_at,
    // NEW:
    photos: parsePhotos(item.photos), // e.g. ["photo_12_...jpg", ...]
    user: item.user || user, // fallback to logged-in user if returned differently
  }));

  const shared: LiveSpace[] = (data.shared_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "sharedspace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: item.price,
    duration: item.duration,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    created_at: item.created_at,
    // NEW:
    photos: parsePhotos(item.photos),
    user: item.user || user,
  }));

  return [...entire, ...shared];
}

function PaginatedCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    if (!login.user) return;

    getLiveSpaces(login.user).then((data) => setCards(data));
  }, []);

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
        {currentData.map((card) => (
          <div key={card.id} className="flex items-center gap-6 w-full">
            {/* LEFT PANEL */}
            <div className="md:w-1/3 flex flex-col gap-4">
              <InfoPill className="bg-white">
                <div className="inline-flex items-center justify-between w-full ">
                  <span className="text-md py-1 text-black">{card.name}</span>
                  <LuPencil size={25} className="ml-auto text-black" />
                </div>
              </InfoPill>

              <InfoPill>
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-md py-1 text-black">
                    {card.bookmarks} Students
                  </span>
                  <MdOutlineBookmarkAdded
                    size={25}
                    className="ml-auto text-black"
                  />
                </div>
              </InfoPill>

              <InfoPill
                style={{
                  backgroundColor: card.active === 1 ? "#D6FFC3" : "#9D9D9D",
                }}
              >
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-md py-1 text-black">
                    {card.active === 1 ? "Online" : "Offline"}
                  </span>
                  {card.active === 1 ? (
                    <FaToggleOn size={25} className="ml-auto text-black" />
                  ) : (
                    <FaToggleOff size={25} className="ml-auto text-black" />
                  )}
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
                <button
                  onClick={() => navigate(`/${card.space}?id=${card.id}`)}
                  className="py-3 text-md w-30 font-medium bg-black text-white shadow-lg rounded-lg"
                >
                  EDIT
                </button>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="md:w-2/3 flex justify-center">
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

// ----------------------- MAIN PAGE -----------------------
const Listingslandlord: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Live");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [stateValue, setStateValue] = useState(""); // store state code/name

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title="Listingslandlord" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {activeTab === "Live" && (
              <div className="md:p-5 mt-5 space-y-6">
                {/* LIVE tab content remains exactly as your raw code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
                  {/* Row 1 - First Name with FaPlus */}
                  <div className="relative flex flex-col mb-10">
                    <Label>NEW LISTING</Label>
                    <div
                      onClick={() => setOpen(true)}
                      className="absolute md:mt-5 left-8 top-9 flex items-center justify-center w-12 h-12 rounded-full bg-black cursor-pointer"
                    >
                      <FaPlus size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-5 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>TOTAL ACTIVE</Label>
                      <InfoPill className="relative flex items-center">
                        12
                        <FiChevronDown className="pointer-events-none absolute right-5 text-[black]" />
                      </InfoPill>
                    </div>
                    <div>
                      <Label>MAX ACTIVE</Label>
                      <InfoPill className="relative flex items-center">
                        TIER 2 &raquo; 15
                        <RiInformationLine className="pointer-events-none absolute right-5  text-[black] " />
                      </InfoPill>
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>CATEGORY</Label>
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
                      <Label>SEARCH NAME</Label>
                      <InfoPill className="relative flex items-center bg-white">
                        <input
                          className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                          placeholder="Enter here"
                        />
                        <IoIosArrowForward className="pointer-events-none absolute right-1  text-white w-13 h-13 p-3 rounded-full bg-black" />
                      </InfoPill>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------------------------
                  </span>
                </div>
                <PaginatedCards />
                <button className="md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  View Rent Requests
                </button>
              </div>
            )}

            {activeTab === "Drafts" && (
              <div className="md:p-5 mt-5 space-y-6">
                {/* DRAFTS tab now uses upgraded PaginatedDrafts */}
                <PaginatedDrafts />
                <button className="md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  View Rent Requests
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Box remains as in your raw code */}
      {open && (
        <div className="fixed inset-0 bg-black/90 z-50 scrollbar-hide overflow-y-scroll no-scrollbar">
          <div className="relative mx-2 md:mx-auto my-10 md:w-[500px] bg-[#F4F6F5] border-3 rounded-4xl border-black p-6">
            <div
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <MdCancel className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl mt-5 font-medium text-center text-black">
              New Listing
            </h2>
            <p className="text-sm text-black text-center mt-5">
              Hola, What type of space would you like to list
            </p>

            <div
              className="mt-1 mb-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />

            <div className="space-y-6">
              <div>
                <div
                  onClick={() => navigate("/entirespace?uploader=landlord")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#F3EDFE]"
                >
                  <PiHouse className="text-black text-4xl ml-5" />
                  <span className="flex-1 text-black text-lg text-center font-medium">
                    Entire Space
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-xs p-2 rounded-2xl text-black bg-white">
                    List your entire space and connect to student renters.
                  </span>
                </div>
              </div>

              <div>
                <div
                  onClick={() => navigate("/sharedspace?uploader=landlord")}
                  className="cursor-pointer relative flex border-1 pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#CDBCEC]"
                >
                  <MdOutlineBed className="text-black text-3xl ml-5" />
                  <span className="flex-1 text-black text-lg text-center font-medium">
                    Shared Space
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-xs p-2 rounded-2xl text-black bg-white">
                    List shared spaces: Find roommates for your clients.
                  </span>
                </div>
              </div>

              <div className="text-md font-semibold text-black text-center">
                -------- COMING SOON --------
              </div>

              <div>
                <div className="relative flex border-1 py-2 border-[black] items-center pl-3 pr-2 rounded-full bg-[#1C0B3D]">
                  <TbHomeSpark className="text-white text-3xl ml-5" />
                  <span className="flex-1 text-white text-lg text-center font-medium">
                    Short-let Space
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border-white border-1">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Listingslandlord;
