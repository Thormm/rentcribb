import { useState, useEffect } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import { useNavigate } from "react-router-dom";
import {
  MdOutlinePending,
  MdOutlinePostAdd,
  MdLightbulbOutline,
} from "react-icons/md";
import { BiComment } from "react-icons/bi";
import Card from "../../components/Cards";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FaArrowRight, FaToggleOn } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";

// ----------------------- Reusable Label -----------------------
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg pl-5 md:pl-8 md:my-3 font-semibold text-black",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ----------------------- States -----------------------
const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];

// ----------------------- Mock Reviews (10 Records) -----------------------
const reviews = [
  { id: 1, date: "2025-09-01", name: "John Doe" },
  { id: 2, date: "2025-09-03", name: "Mary Johnson" },
  { id: 3, date: "2025-09-05", name: "David Smith" },
  { id: 4, date: "2025-09-07", name: "Sophia Williams" },
  { id: 5, date: "2025-09-10", name: "James Brown" },
  { id: 6, date: "2025-09-12", name: "Emily Davis" },
  { id: 7, date: "2025-09-14", name: "Michael Miller" },
  { id: 8, date: "2025-09-16", name: "Olivia Wilson" },
  { id: 9, date: "2025-09-18", name: "Daniel Taylor" },
  { id: 10, date: "2025-09-20", name: "Ava Martinez" },
];

interface LiveSpace {
  id: string;
  space: "entirespace" | "sharedspace";
  name: string;
  type: string;
  location: string;
  price: number;
  duration: string;
  availability_month?: string;
  power_supply?: number | string;
  security?: number | string;

  status: string;
  active: string;
  rating: number;
  reviews: number;
  tier: number;
  bookmarks: number;
  background: string;
}

async function getRepliesSpaces(responses: string[]): Promise<LiveSpace[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "get_request_replies_spaces",
      responses,
    }),
  });

  const data = await res.json();

  const entire = (data.entire_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "entirespace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    photos: item.photos,
    user: item.user,
  }));

  const shared = (data.shared_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "sharedspace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
    status: item.status,
    active: item.active,
    rating: item.rating,
    reviews: item.reviews,
    tier: item.tier,
    bookmarks: item.bookmarks,
    background: item.background,
    photos: item.photos,
    user: item.user,
  }));

  return [...entire, ...shared];
}

async function getLiveSpaces(user: string): Promise<LiveSpace[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_booked_spaces", user }),
  });

  const parsePhotos = (raw: any) => {
    if (!raw) return [];
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const data = await res.json();

  const entire: LiveSpace[] = (data.entire_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "entirespace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
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
    user: item.user,
  }));

  const shared: LiveSpace[] = (data.shared_spaces ?? []).map((item: any) => ({
    id: item.id,
    space: "sharedspace",
    name: item.name,
    type: item.type,
    location: item.location,
    price: Number(item.price),
    duration: item.duration,
    availability_month: item.availability_month,
    power_supply: item.power_supply,
    security: item.security,
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
    user: item.user,
  }));

  return [...entire, ...shared];
}

function PaginatedRequests({
  setShowFirst,
  setSelectedResponses,
}: {
  setShowFirst: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedResponses: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [draftItems, setDraftItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    if (!login?.user || !login?.signup_key) {
      setDraftItems([]);
      setLoading(false);
      return;
    }

    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_my_requests",
        user: login.user,
        signup_key: login.signup_key,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setDraftItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setDraftItems([]))
      .finally(() => setLoading(false));
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  if (loading) {
    return <div className="px-8 text-black">Loading requests...</div>;
  }

  if (!draftItems.length) {
    return <div className="px-8 text-black">No requests found</div>;
  }

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
        {currentData.map((item, idx) => (
          <div key={item.id || idx}>
            <div className="grid grid-cols-1 font-semibold my-5 mx-8 text-black">
              Request {(page - 1) * itemsPerPage + idx + 1}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
              <div className="flex items-center text-black px-6 text-sm flex-1 border-black rounded-4xl border py-3 shadow-sm">
                <p className="text-xs md:text-base">
                  A {item.gender} Student needs a{" "}
                  <b>
                    {item.category === "Shared Space" ? "SHARED " : ""}
                    {item.type}
                  </b>{" "}
                  with{" "}
                  {Array.isArray(item.features) && item.features.length
                    ? item.features.join(", ")
                    : "basic facilities"}{" "}
                  around{" "}
                  {[item.preferred_location_1, item.preferred_location_2]
                    .filter(Boolean)
                    .join(", ")}
                  .
                  <br />
                  Budget: <b>({item.budget})</b>
                  <br />
                  {item.move_in_date?.toLowerCase() === "urgently" ? (
                    <>
                      Looking to Move in <b>URGENTLY</b>
                    </>
                  ) : (
                    <>
                      Looking to Move-in on or before <b>{item.move_in_date}</b>
                      .
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 w-full md:w-1/3">
                <div className="flex items-center justify-center gap-3 w-full border-black rounded-4xl border py-2 md:py-4 shadow-sm">
                  <div className="flex items-center relative w-20 md:w-40 justify-between">
                    <span className="text-xs md:text-lg text-black truncate">
                      More
                    </span>
                    <HiOutlineDotsVertical className="absolute -right-3 md:-right-5 text-white w-8 h-8 md:w-12 md:h-12 p-1 md:p-3 rounded-full bg-black" />
                  </div>
                </div>

                <div
                  onClick={() => {
                    let list: string[] = [];

                    try {
                      list =
                        typeof item.responses === "string"
                          ? JSON.parse(item.responses)
                          : item.responses;
                    } catch {
                      list = [];
                    }
                    setSelectedResponses(list);
                    setShowFirst(false);
                  }}
                  className="flex items-center justify-center bg-black gap-3 w-full border-black rounded-4xl border py-4 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center relative w-20 md:w-40 justify-between">
                    <span className="text-xs md:text-lg text-white truncate">
                      {(() => {
                        try {
                          const list =
                            typeof item.responses === "string"
                              ? JSON.parse(item.responses)
                              : item.responses;

                          return Array.isArray(list) ? list.length : 0;
                        } catch {
                          return 0;
                        }
                      })()}{" "}
                      Replies
                    </span>

                    <FaArrowRight className="absolute -right-3 md:-right-5 text-white w-8 h-8 md:w-12 md:h-12 p-1 md:p-3 rounded-full bg-[#202020]" />
                  </div>
                </div>
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
                  : "bg-white text-black border-black",
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

// ----------------------- Live: existing paginated cards (5 per page) -----------------------
function PaginatedCards({ data }: { data: LiveSpace[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div>
      <div className="w-full max-w-6xl mx-auto px-4 pb-16 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentData.map((card) => (
            <div key={`${card.space}-${card.id}`} className="mb-10 ...">
              <div className="w-auto flex justify-end">
                <Card
                  item={card}
                  onView={() =>
                    navigate("/hostelview", {
                      state: { space: [card.id, card.space] },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "px-3 py-1 rounded-md border",
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black",
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

// ----------------------- Paginated Cards -----------------------
function PaginatedCards2({ responses }: { responses: string[] }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LiveSpace[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  useEffect(() => {
    if (!responses.length) {
      setData([]);
      return;
    }

    setLoading(true);

    getRepliesSpaces(responses)
      .then(setData)
      .finally(() => setLoading(false));
  }, [responses]);

  return (
    <div>
      <div
        className="space-y-3 max-h-[1000px] overflow-y-auto pr-3 md:pr-12 cards-scroll"
        style={{
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {loading && (
          <div className="text-sm text-gray-500">Loading replies...</div>
        )}

        {!responses.length && data.length === 0 && (
          <div className="text-sm text-gray-500">
            No replies found for this request.
          </div>
        )}

        {currentData.map((card) => (
          <div
            key={`${card.space}-${card.id}`}
            className="mb-10 relative items-center flex flex-col md:flex-row w-full gap-10 bg-[#F3EDFE] rounded-3xl p-2 md:p-5 pt-0 md:pt-0 shadow-lg md:pr-8
  before:content-[''] before:absolute before:-bottom-3 before:left-10 
  before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px] before:border-t-[12px] 
  before:border-l-transparent before:border-r-transparent before:border-t-[#F3EDFE]"
          >
            <div className="w-auto flex justify-end">
              <Card item={card} />
            </div>
            <div className="md:w-1/3 grid md:h-56 content-between gap-5 md:gap-15">
              <div className="grid grid-cols-3 items-center justify-content-center md:grid-cols-1 gap-1 md:gap-8">
                <InfoPill className="bg-[#D6FFC3] md:rounded-full rounded-2xl py-2 px-2 md:px-8">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-xs md:text-lg py-1 text-black">
                      Online
                    </span>
                    <FaToggleOn className="ml-auto md:text-2xl text-black" />
                  </div>
                </InfoPill>
                <InfoPill className="bg-[#FFA1A1] md:rounded-full rounded-2xl py-2 px-2 md:px-8">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-xs md:text-lg py-1 text-black">
                      Delete
                    </span>
                    <MdOutlineDeleteForever className="ml-auto md:text-2xl text-black" />
                  </div>
                </InfoPill>
                <div className="flex justify-center">
                  <button className="py-2 md:py-3 text-md w-30 font-medium bg-black text-white shadow-lg rounded-lg">
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
                  : "bg-white text-black border-black",
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

// ----------------------- Section Header -----------------------
// Header with help icon
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        We’ve made it a soft experience getting your Place ...
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

// ----------------------- Tabs -----------------------
const tabs = ["Booked", "Requests", "Host"];
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
            "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : "",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ----------------------- Main Component -----------------------
export default function Rent() {
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Booked");
  const [stateValue, setStateValue] = useState("");
  const [showFirst, setShowFirst] = useState(true); // default: first section visible
  const navigate = useNavigate();
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

  const [cards, setCards] = useState<LiveSpace[]>([]);
  useEffect(() => {
    if (!login.user) return;
    getLiveSpaces(login.user).then(setCards);
  }, []);

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Rent" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Booked Tab */}
            {activeTab === "Booked" && (
              <div className="mb-10">
                <div className="flex items-center gap-3 w-2/3">
                  <span className="text-md font-semibold text-black tracking-wide mt-10">
                    --- ALL BOOKINGS -------------------------------
                  </span>
                </div>

                <PaginatedCards data={cards} />
                <button
                  onClick={() => navigate("/request")}
                  className="cursor-pointer md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                >
                  <BiComment className="w-8 h-8" />
                  Post a Rent Requests
                </button>
                <button
                  onClick={() => navigate("/studentlisting")}
                  className="cursor-pointer md:w-2/3 mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
                  View Other Listings
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-1 md:p-5 mt-5 space-y-6">
                {showFirst ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
                      <div className="relative flex flex-col mb-10">
                        <Label>NEW REQUEST</Label>
                        <div
                          onClick={() => navigate("/request")}
                          className="absolute left-8 top-9 flex items-center justify-center w-12 h-12 rounded-full bg-black cursor-pointer"
                        >
                          <FaPlus size={20} className="text-white" />
                        </div>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div>
                          <Label>TOTAL ACTIVE</Label>
                          <InfoPill className="relative px-5 md:px-8 flex items-center bg-white">
                            <span>2</span>
                            <RiInformationLine className="pointer-events-none absolute right-3 text-gray-500" />
                          </InfoPill>
                        </div>

                        <div>
                          <Label>MAX REQUEST</Label>
                          <InfoPill className="relative px-5 md:px-8 flex items-center bg-white">
                            <span>3</span>
                            <RiInformationLine className="pointer-events-none absolute right-3 text-gray-500" />
                          </InfoPill>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 my-8">
                      <span className="text-md font-semibold text-black tracking-wide mt-10">
                        --- YOUR REQUESTS -----------------------
                      </span>
                    </div>

                    <PaginatedRequests
                      setShowFirst={setShowFirst}
                      setSelectedResponses={setSelectedResponses}
                    />

                    <button className="md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                      <BiComment className="w-8 h-8" />
                      View Rent Requests
                    </button>
                  </>
                ) : (
                  <>
                    <IoIosArrowBack
                      onClick={() => setShowFirst(true)}
                      className="cursor-pointer text-white w-13 h-13 p-3 ml-8 rounded-full bg-black"
                    />

                    <div className="col-span-2 grid grid-cols-2 gap-4 md:w-2/3">
                      <div>
                        <Label>HOW IT WORKS</Label>
                        <InfoPill className="relative px-5 md:px-8 flex items-center bg-white">
                          <span className="py-1">Info</span>
                          <MdLightbulbOutline className="pointer-events-none absolute right-5 text-lg text-black" />
                        </InfoPill>
                      </div>

                      <div>
                        <Label>FILTER</Label>
                        <InfoPill className="relative px-5 md:px-8 flex items-center bg-white">
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
                          <FiChevronDown className="pointer-events-none absolute right-5 text-black" />
                        </InfoPill>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="text-md font-semibold text-black tracking-wide mt-10">
                        --- REPLIES ----------------------------------
                        {selectedResponses.length}
                      </span>
                    </div>

                    <PaginatedCards2 responses={selectedResponses} />

                    <button
                      onClick={() => navigate("/request")}
                      className="cursor-pointer md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                    >
                      <BiComment className="w-8 h-8" />
                      Post a Rent Requests
                    </button>
                    <button
                      onClick={() => navigate("/studentlisting")}
                      className="cursor-pointer md:w-2/3 mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                    >
                      <MdOutlinePostAdd className="w-8 h-8" />
                      View Other Listings
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Host Tab */}
            {activeTab === "Host" && (
              <div className="md:w-2/3 p-5">
                {/* Header with dashed line */}
                <div className="flex items-center gap-3 my-8">
                  <span className="text-md font-semibold text-black tracking-wide">
                    -- YOUR HOST --------------------------
                  </span>
                </div>

                {/* Reviews list */}
                <div className="space-y-8">
                  {reviews.map((r) => {
                    return (
                      <div
                        key={r.id}
                        className="border-black rounded-4xl border px-2 md:px-6 py-4 shadow-sm "
                      >
                        {/* Row 1 */}
                        <div className="flex items-center">
                          {/* Left icon (PiHouse) */}
                          <div className="w-6 h-6 flex items-center justify-center text-black">
                            <HiOutlineUserCircle className="w-6 h-6" />
                          </div>

                          {/* Date + name */}
                          <div className="flex flex-grow items-center gap-5 px-4">
                            <span className="text-xs md:text-lg font-normal text-black whitespace-nowrap">
                              {r.date}
                            </span>
                            <span className="text-xs md:text-lg text-black font-normal truncate">
                              {r.name.length > 13
                                ? r.name.slice(0, 13) + "…"
                                : r.name}
                            </span>
                          </div>

                          {/* Right dropdown toggle */}
                          <div className="w-6 h-6 flex items-center justify-center cursor-pointer">
                            <MdOutlinePending className="w-6 h-6 text-black" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => navigate("/request")}
                    className="cursor-pointer md:w-2/3 mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                  >
                    <BiComment className="w-8 h-8" />
                    Post a Rent Requests
                  </button>
                  <button
                    onClick={() => navigate("/studentlisting")}
                    className="cursor-pointer md:w-2/3 mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                  >
                    <MdOutlinePostAdd className="w-8 h-8" />
                    View Other Listings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
