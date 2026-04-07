import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../components/Pill";
import Card from "../../components/Cards";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { GrCheckmark } from "react-icons/gr";
import {
  MdOutlineCall,
  MdOutlinePostAdd,
  MdLightbulbOutline,
} from "react-icons/md";
import { FiChevronDown, FiCopy } from "react-icons/fi";
//import { IoIosArrowForward } from "react-icons/io";
import { TbCancel } from "react-icons/tb";
import { BiComment } from "react-icons/bi";
import { RiWhatsappLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";

// ----------------------- States -----------------------
const states = [
  { value: "", label: "Sort by" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];

interface DraftItem {
  id: number | string;
  name: string;
  date: string;
  email: string;
  call: string;
  whatsapp: string;
  status: string;
  space_name: string;
}

// Reusable Label
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-sm pt-5">See full details of your Bookings.</p>

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
              : "",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ----------------------- Paginated Drafts -----------------------
function PaginatedBookings() {
  const [page, setPage] = useState(1);
  const [expandedLeft, setExpandedLeft] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [expandedRight, setExpandedRight] = useState<{
    [key: string]: boolean;
  }>({});
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const loginData = sessionStorage.getItem("login_data");
    if (!loginData) return;

    const user = JSON.parse(loginData)?.user;

    const fetchBookings = async () => {
      try {
        const res = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_bookings",
            user: user,
            uploader: "agent",
          }),
        });

        const data = await res.json();
        setDraftItems(
          data.map((b: any) => ({
            id: b.id,
            name: b.name ?? "Unknown",
            date: b.date ?? "",
            email: b.email ?? "",
            call: b.call ?? "",
            whatsapp: b.whatsapp ?? "",
            status: b.status ?? "",
            space_name: b.space_name ?? "",
          })),
        );
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const totalPages = Math.ceil(draftItems.length / itemsPerPage);
  const currentData = draftItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div>
      <div
        className="space-y-6 pb-4 draft-scroll overflow-y-auto overflow-x-auto pr-2"
        style={{
          maxHeight: "420px",
          scrollbarColor: "#FFA1A1 transparent",
          scrollbarWidth: "thin",
        }}
      >
        {currentData.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 w-[450px] md:w-full items-center"
          >
            {/* Left card */}
            <div
              className={clsx(
                "flex-1 border-black rounded-4xl border shadow-sm",
                "min-h-[40px] md:min-h-[60px] flex flex-col justify-center self-center", // <--- add self-start
              )}
            >
              {/* Header row */}
              <div className="flex items-center px-4 py-3">
                <div className="w-6 h-6 flex items-center justify-center text-black">
                  <HiOutlineUserCircle className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-5 px-4">
                  <span className="text-xs md:text-sm text-black font-normal truncate">
                    {item.space_name?.length > 7
                      ? item.space_name.slice(0, 7) + "…"
                      : item.space_name}
                  </span>
                </div>

                <div className="flex items-center gap-5 px-4">
                  <span className="text-xs md:text-sm text-black font-normal truncate">
                    {item.name?.length > 7
                      ? item.name.slice(0, 7) + "…"
                      : item.name}
                  </span>
                </div>

                <button
                  className="ml-auto w-6 h-6 flex items-center justify-center"
                  onClick={() =>
                    setExpandedLeft((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                >
                  {expandedLeft[item.id] ? (
                    <IoIosArrowUp className="w-7 h-7 text-black" />
                  ) : (
                    <IoIosArrowDown className="w-7 h-7 text-black" />
                  )}
                </button>
              </div>

              {/* Row 2 icons */}
              {expandedLeft[item.id] && (
                <div className="flex items-center text-black justify-between mt-4 px-4 md:px-6">
                  <span className="text-xs">{item.date}</span>

                  <div className="flex gap-2 md:gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        (window.location.href = `mailto:${item.email}`)
                      }
                    >
                      <HiOutlineMail className="w-4 h-4" />
                    </div>

                    <div
                      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        (window.location.href = `tel:${item.call}`)
                      }
                    >
                      <MdOutlineCall className="w-4 h-4" />
                    </div>

                    <div
                      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        window.open(`https://wa.me/${item.whatsapp}`, "_blank")
                      }
                    >
                      <RiWhatsappLine className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded contact info */}
              {expandedLeft[item.id] && (
                <div className="m-4 bg-white rounded-xl border p-4 md:p-6 text-black shadow-sm">
                  <div className="space-y-4">
                    {[
                      { label: "Email", value: item.email },
                      { label: "Call no.", value: item.call },
                      { label: "Whatsapp", value: item.whatsapp },
                    ].map((field, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between relative"
                      >
                        <span className="text-xs md:text-base font-semibold">
                          {field.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-base truncate">
                            {field.value?.length > 15
                              ? field.value.slice(0, 15) + "…"
                              : field.value}
                          </span>
                          <FiCopy
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleCopy(field.label, field.value)}
                          />
                        </div>
                        {copiedField === field.label && (
                          <div className="absolute -top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow-md">
                            Copied!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right status card */}
            <div className="min-h-[40px] md:min-h-[60px] w-[150px] md:w-[200px] flex-shrink-0 border border-black rounded-4xl shadow-sm flex flex-col justify-center self-center">
              {/* Header row */}
              <div
                className="flex items-center justify-between  px-6 py-4 cursor-pointer"
                onClick={() =>
                  setExpandedRight((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
              >
                <span className="text-xs md:text-sm text-black">
                  {item.status == "Inspection" && (<span>Waiting...</span>)}
                </span>
                <span>
                  {expandedRight[item.id] ? (
                    <IoIosArrowUp className="w-5 h-5 text-black" />
                  ) : (
                    <IoIosArrowDown className="w-5 h-5 text-black" />
                  )}
                </span>
              </div>

              {/* Expanded right card buttons */}
              {expandedRight[item.id] && (
                <div className="flex flex-col px-3 md:px-6 gap-3 pb-4">
                  {item.status == "Inspection" && (
                    <div className="flex items-center justify-between bg-[#FFA1A1] p-2 rounded-md">
                      <span className="text-xs md:text-sm text-black">
                        Decline
                      </span>
                      <TbCancel className="text-black w-4 h-4 md:h-6 md:w-6" />
                    </div>
                  )}
                  {item.status == "Inspection" && (
                    <div className="flex items-center justify-between bg-[#D6FFC3] p-2 rounded-md">
                      <span className="text-xs md:text-sm text-black">
                        Completed
                      </span>
                      <GrCheckmark className="w-5 h-5 md:h-6 md:w-6 p-1 rounded-full  border-2 shadow-md" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                page === i + 1
                  ? "bg-[#FFA1A1] text-white border-[#FFA1A1]"
                  : "bg-white text-black border-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PaginatedRequests() {
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<any[]>([]);

  const itemsPerPage = 5;

  useEffect(() => {
    const loginData = sessionStorage.getItem("login_data");
    if (!loginData) return;

    const user = JSON.parse(loginData)?.user;

    const fetchData = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_agent_requests",
          user: user,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const requestsWithPhotos = (data.requests || []).map((req: any) => ({
          ...req,
          spaces: (req.spaces || []).map((space: any) => ({
            ...space,
            user: space.user || req.user || user, // keep user if needed
            photos: Array.isArray(space.photos_full)
              ? space.photos_full.map((url: string) => {
                  const parts = url.split("/");
                  return parts[parts.length - 1];
                })
              : [],
          })),
        }));

        setRequests(requestsWithPhotos);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const currentData = requests.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const parseFeatures = (features: any) => {
    if (Array.isArray(features)) return features.join(", ");
    if (features) {
      try {
        const arr = JSON.parse(features);
        return Array.isArray(arr) ? arr.join(", ") : "";
      } catch {
        return "";
      }
    }
    return "";
  };

  return (
    <div
      className="space-y-8"
      style={{
        scrollbarColor: "#FFA1A1 transparent",
        scrollbarWidth: "thin",
      }}
    >
      {currentData.map((item: any, idx: number) => (
        <div key={item.id || idx} className="space-y-4">
          {/* ---------------- TITLE ---------------- */}
          <div className="flex justify-end">
            <span className="bg-white text-[#5B5B5B] text-xs md:text-sm rounded-xl p-2">
              You replied...
            </span>
          </div>

          {/* ---------------- ROW 1 → REQUEST (RIGHT) --------------- */}
          <div className="flex justify-end">
            <div className="flex items-stretch w-full md:w-[60%]">
              {/* TEXT BOX */}
              <div className="flex-1 border-black rounded-3xl border p-4 shadow-sm text-black">
                <p className="text-xs md:text-sm">
                  A {item.gender} {item.category === "Student" ? "Student" : ""}{" "}
                  needs a{" "}
                  <b>
                    {item.category === "Shared Space" ? "SHARED " : ""}
                    {item.type}
                  </b>{" "}
                  {parseFeatures(item.features)} around{" "}
                  {[item.preferred_location_1, item.preferred_location_2]
                    .filter(Boolean)
                    .join(", ")}
                  .
                  <br />
                  Budget: <b>{item.budget}</b>
                  <br />
                  {item.move_in_date?.toLowerCase() === "urgently" ? (
                    <>
                      Looking to Move in <b>URGENTLY</b>
                    </>
                  ) : (
                    <>
                      Move-in before <b>{item.move_in_date}</b>
                    </>
                  )}
                </p>
              </div>

              {/* VERTICAL LINE */}
              <div className="w-[4px] bg-black ml-3 my-3 rounded"></div>
            </div>
          </div>

          {/* ---------------- ROW 2 → CARDS (LEFT + SCROLL) ---------------- */}
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {(item.spaces || []).map((card: any) => (
                <div key={card.id} className="shrink-0">
                  <Card item={card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
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

// ----------------------- Page -----------------------
const Bookingsagent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Bookings");
  const [stateValue, setStateValue] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Bookings" />

          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {activeTab === "Bookings" && (
              <div className="md:p-5 mt-5 space-y-6">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <Label>TOTAL</Label>
                      <Label>TOP BOOKINGS</Label>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-medium text-black">
                            70
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        {[
                          { name: "Great Villa", value: 90 },
                          { name: "Zaani Hostel", value: 60 },
                          { name: "Kaffto Laurel", value: 40 },
                        ].map((b, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-28 text-md text-black truncate">
                              {b.name}
                            </span>

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
                */}

                <div className="flex items-center gap-3 my-8">
                  <span className="text-md font-semibold text-black tracking-wide">
                    --- YOUR BOOKINGS ----------
                  </span>
                </div>

                <PaginatedBookings />

                <button
                  onClick={() => navigate("/businessrequests")}
                  className="w-full md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                >
                  <BiComment className="w-8 h-8" />
                  View Rent Requests
                </button>

                <button
                  onClick={() => navigate("/listings")}
                  className="w-full md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Post New Listings
                </button>
              </div>
            )}

            {activeTab === "Requests" && (
              <div className="md:p-5 mt-5 space-y-6">
                <div className="col-span-2 grid grid-cols-2 gap-4 md:w-2/3">
                  <div>
                    <Label>HOW IT WORKS</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <span className="text-xs md:text-sm">Info</span>
                      <MdLightbulbOutline className="pointer-events-none absolute right-5 text-lg text-black" />
                    </InfoPill>
                  </div>

                  <div>
                    <Label>FILTER</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="appearance-none w-full bg-transparent outline-none text-xs md:text-sm text-black"
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
                  <span className="text-md font-semibold text-black tracking-wide mt-5 md:mt-10">
                    --- REPLIES --------
                  </span>
                </div>
                <PaginatedRequests />

                <button
                  onClick={() => navigate("/businessrequests")}
                  className="w-full md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
                >
                  <BiComment className="w-8 h-8" />
                  View Rent Requests
                </button>

                <button
                  onClick={() => navigate("/listings")}
                  className="w-full md:w-2/3 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
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
