import { useAlert } from "../../../../App";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaStar,
  FaRegStar,
  FaInfoCircle,
  FaExclamationTriangle,
  FaShareAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TbUserSquare } from "react-icons/tb";
import InfoPill, { DfButton } from "../../../../components/Pill";
import clsx from "clsx";
import Card from "../../../../components/Cards";
import Footer from "../../../../components/Footer";
import imgright from "../../../../assets/hero.jpg";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import mapbanner from "../../../../assets/mapbanner.png";

// ---------- MOCK DATA (no API calls) ----------
const mockLiveSpaces: LiveSpace[] = [
  {
    id: "1",
    space: "entirespace",
    name: "Mock Entire Space",
    type: "Flat",
    location: "Lekki, Lagos",
    price: 250000,
    duration: "per year",
    availability_month: "June 2026",
    power_supply: 4,
    security: "24/7 Guard, CCTV",
    status: "active",
    active: "1",
    rating: 4.5,
    reviews: 12,
    tier: 2,
    bookmarks: 8,
    background: "",
    photos: ["photo1.jpg", "photo2.jpg"],   // now an array
    user: "mock_user_1",
    uploader: "agent",
    units: 10,
    space_type: "Entire Flat",
    rent: 250000,
    bedrooms: 3,
    bathrooms: 2,
    ensuite: 1,
    pref_gender: "any",
    pref_religion: "any",
    pref_year: "all",
    pref_faculty: "all",
    water: "Borehole, Tank",
    network_strength: 4,
    compound: 3,
    access_road: 4,
    all_feature: ["WiFi", "Parking", "Generator", "Furnished"],
    house_rules: ["No smoking", "Pets allowed", "Quiet hours 10pm-7am"],
    caution_fee: 50000,
    service_charge: 20000,
    agreement_fee: 15000,
    agency_fee: 10000,
    inspection: "Paid",
    video: null,
  },
  {
    id: "2",
    space: "sharedspace",
    name: "Mock Shared Space",
    type: "Room",
    location: "Surulere, Lagos",
    price: 80000,
    duration: "per month",
    availability_month: "July 2026",
    power_supply: 3,
    security: "Gate",
    status: "active",
    active: "1",
    rating: 4.0,
    reviews: 5,
    tier: 1,
    bookmarks: 3,
    background: "",
    photos: ["photo3.jpg"],
    user: "mock_user_2",
    uploader: "landlord",
    units: 5,
    space_type: "Shared Room",
    rent: 80000,
    bedrooms: 1,
    bathrooms: 1,
    ensuite: 0,
    pref_gender: "female",
    pref_religion: "christian",
    pref_year: "2023",
    pref_faculty: "engineering",
    water: "Borehole",
    network_strength: 3,
    compound: 2,
    access_road: 3,
    all_feature: ["Kitchen", "Laundry"],
    house_rules: ["No visitors after 10pm"],
    caution_fee: 20000,
    service_charge: 10000,
    agreement_fee: 5000,
    agency_fee: 5000,
    inspection: "Free",
    video: null,
  },
];

const mockHost = {
  tier: 2,
  listings: 3,
  reg_time: "2025-01-15 10:30:00",
  last_activity: "2026-02-10 14:20:00",
};

// The first mock space is used as the default "current hostel"
const mockHostel = mockLiveSpaces[0];

// ---------- INTERFACE ----------
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
  photos?: string[];   // changed to array
  user?: string;
  uploader?: string;
  units?: number;
  space_type?: string;
  rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  ensuite?: number;
  pref_gender?: string;
  pref_religion?: string;
  pref_year?: string;
  pref_faculty?: string;
  water?: string;
  network_strength?: number;
  compound?: number;
  access_road?: number;
  all_feature?: string[];   // changed to array
  house_rules?: string[];   // changed to array
  caution_fee?: number;
  service_charge?: number;
  agreement_fee?: number;
  agency_fee?: number;
  inspection?: string;
  video?: string | null;
}

// ---------- SUB-COMPONENTS (unchanged) ----------
function Maincard({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={["rounded-4xl px-5 border-4 shadow", className].join(" ")}>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div className="pt-8 md:px-5">
      <h3 className="text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-xs md:text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

function Label({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "text-sm md:text-md md:my-3 font-semibold ml-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StarRow({ value = 4 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <FaStar key={i} size={25} fill="currentColor" />
        ) : (
          <FaRegStar key={i} size={25} />
        ),
      )}
    </div>
  );
}

function PaginatedCards({ data }: { data: LiveSpace[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
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
        <div className="flex flex-wrap justify-center gap-6">
          {currentData.map((card) => (
            <div key={`${card.space}-${card.id}`}>
              <Card
                item={card}
                onView={() =>
                  navigate("/hostelview", {
                    state: { space: [card.id, card.space] },
                  })
                }
              />
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

// ---------- MAIN COMPONENT ----------
export default function SendHostelRequest() {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [openPhotos, setOpenPhotos] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const space = location.state?.space;
  const id = space?.[0];
  const space_type = space?.[1];
  // request_id removed (unused)

  const [cards, setCards] = useState<LiveSpace[]>([]);
  const [hostel, setHostel] = useState<any>(null);
  const [host, setHost] = useState<any>(null);
  const [openModal, setOpenModal] = React.useState<
    null | "amenities" | "rules"
  >(null);
  const [agreed, setAgreed] = useState(false);
  const [booking, setBooking] = useState(false);
  const { showAlert } = useAlert();

  // ---------- USE MOCK DATA (NO API CALLS) ----------
  useEffect(() => {
    setCards(mockLiveSpaces);

    if (id) {
      const found = mockLiveSpaces.find(
        (item) => String(item.id) === String(id) && item.space === space_type,
      );
      setHostel(found || mockHostel);
    } else {
      setHostel(mockHostel);
    }

    setHost(mockHost);
  }, [id, space_type]);

  // ---------- MOCK BOOKING (no real API) ----------
  const handleBookInspection = async () => {
    if (!agreed) return;
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      showAlert("Mock: Connected to host now (API call skipped)", "success", true);
      navigate(
        `/connected?uploader=${hostel?.user || "mock"}&&type=${hostel?.uploader || "agent"}`,
      );
    }, 1000);
  };

  const isEntire = space_type === "entirespace";
  const mediaBase = isEntire
    ? `https://www.cribb.africa/uploads/entire_spaces/${hostel?.user || "mock"}`
    : `https://www.cribb.africa/uploads/shared_spaces/${hostel?.user || "mock"}`;

  // photos is now an array (from mock), but we keep a safety fallback
  const photos: string[] = useMemo(() => {
    if (!hostel?.photos) return [];
    if (Array.isArray(hostel.photos)) return hostel.photos;
    // fallback: try to parse if it's a JSON string (unlikely now)
    try {
      const parsed = JSON.parse(hostel.photos);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [hostel?.photos]);

  const mainPhoto = photos[0] ? `${mediaBase}/${photos[0]}` : imgright;
  const secondPhoto = photos[1] ? `${mediaBase}/${photos[1]}` : imgright;
  const videoUrl = hostel?.video ? `${mediaBase}/${hostel.video}` : null;

  // parseList now accepts array or string
  const parseList = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.map(String);
        } catch {
          // fall through
        }
      }
      return trimmed
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "--";
    let d: Date | null = null;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      d = new Date(dateStr.replace(" ", "T"));
    } else if (/^\d{2}-\d{2}-\d{2}\s/.test(dateStr)) {
      const [datePart, timePartRaw] = dateStr.split(" ");
      const [yy, mm, dd] = datePart.split("-").map(Number);
      const timePart = timePartRaw.toLowerCase();
      const isPM = timePart.endsWith("pm");
      const [h, m, s] = timePart.replace(/am|pm/, "").split(":").map(Number);
      let hour = h;
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      d = new Date(2000 + yy, mm - 1, dd, hour, m, s);
    }
    if (!d || isNaN(d.getTime())) return "--";
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${Math.max(mins, 0)} min`;
  };

  const capitalize = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

  const otherCards = cards.filter(
    (c) => !(String(c.id) === String(id) && c.space === space_type),
  );

  // Always show the page – no loading spinner
  if (!hostel) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-black text-center">
        <AiOutlineLoading3Quarters className="w-8 h-8 md:w-10 md:h-10 animate-spin mb-3" />
        <h1 className="text-lg md:text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="bg-[#F3EDFE]">
      {/* Header bar */}
      <section className="w-full">
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-md font-semibold text-[#FFA1A1]">HOSTEL VIEW</div>
            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">
                  {login?.school?.split(" - ")?.[0] || "Mock University"}
                </span>
              </h1>
            </div>
            <button
              onClick={() => navigate(`/studentlisting`)}
              className="mt-4 cursor-pointer w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
            >
              <IoIosArrowBack size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Photo & Video grid */}
      <section className="mt-5 md:mt-15 md:mx-12 grid grid-cols-1 md:grid-cols-[40%_60%] gap-2 p-6 pt-0">
        <section className="relative w-full h-full">
          <img
            src={mainPhoto}
            className="w-full h-full object-cover border-2 rounded-3xl"
            alt=""
          />
          {photos.length > 0 && (
            <button
              onClick={() => {
                setPhotoIndex(0);
                setOpenPhotos(true);
              }}
              className="cursor-pointer text-xs md:text-base absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md"
            >
              VIEW PHOTOS
            </button>
          )}
        </section>
        <section className="flex flex-col gap-2">
          <div className="relative hidden md:block w-full h-70">
            <img
              src={secondPhoto}
              className="w-full h-full object-cover border-2 rounded-3xl"
              alt=""
            />
          </div>
          <div className="relative w-full h-full">
            {videoUrl ? (
              <video
                className="h-50 md:h-80 w-full object-cover border-2 rounded-3xl"
                src={videoUrl}
                muted
              />
            ) : (
              <div className="h-50 md:h-80 w-full border-2 rounded-3xl flex items-center justify-center text-sm text-gray-400">
                No video
              </div>
            )}
            {videoUrl && (
              <button
                onClick={() => setOpenVideo(true)}
                className="cursor-pointer text-xs md:text-base absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md"
              >
                VIEW VIDEO
              </button>
            )}
          </div>
        </section>
        {/* Photo modal */}
        {openPhotos && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              <button
                className="absolute -top-10 right-0 z-10 text-white text-2xl"
                onClick={() => setOpenPhotos(false)}
              >
                ✕
              </button>
              <button
                onClick={() =>
                  setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
                }
                className="absolute left-2 z-10 text-white text-3xl rounded-full bg-black/80 px-2 py-1 cursor-pointer"
              >
                ‹
              </button>
              <img
                src={`${mediaBase}/${photos[photoIndex]}`}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                alt=""
              />
              <button
                onClick={() =>
                  setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
                }
                className="absolute right-2 z-10 text-white text-3xl rounded-full bg-black/80 px-2 py-1 cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>
        )}
        {openVideo && videoUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                className="absolute -top-10 right-0 z-10 text-white text-2xl"
                onClick={() => setOpenVideo(false)}
              >
                ✕
              </button>
              <video
                src={videoUrl}
                controls
                autoPlay
                className="max-h-[90vh] max-w-[90vw] rounded-xl"
              />
            </div>
          </div>
        )}
      </section>

      {/* Main content area */}
      <section className="bg-[#F3EDFE] my-10">
        <div className="mx-2 md:mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}
          <div className="space-y-1">
            {/* Hostel View card */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hostel View" />
              <div className="md:px-5 pb-4 pt-3 space-y-5 md:space-y-8">
                <div className="space-y-1">
                  <Label>Description</Label>
                  <InfoPill className="rounded-4xl">
                    <span className="text-xs py-1 leading-5">
                      {hostel && (
                        <>
                          {hostel.units} unit
                          {Number(hostel.units) > 1 ? "s" : ""} of “
                          {hostel.space_type}”{" "}
                          {hostel.space_type.toLowerCase().includes("flat") ||
                          hostel.space_type.toLowerCase().includes("room")
                            ? "(Furnished)"
                            : ""}{" "}
                          is available around {hostel.location} for{" "}
                          <span className="font-extrabold">
                            ₦{Number(hostel.rent || 0).toLocaleString()}
                          </span>{" "}
                          {hostel.duration}
                        </>
                      )}
                    </span>
                  </InfoPill>
                </div>
                {isEntire ? (
                  <div className="space-y-1">
                    <Label>Bedrooms and Toilets</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {hostel && (
                          <>
                            {hostel.bedrooms} Bedroom : {hostel.bathrooms}{" "}
                            Bathroom (
                            {Math.max(
                              0,
                              Number(hostel.bathrooms || 0) -
                                Number(hostel.ensuite || 0),
                            )}{" "}
                            Shared, {hostel.ensuite} Ensuite)
                          </>
                        )}
                      </span>
                    </InfoPill>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label>Preference</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {capitalize(hostel?.pref_gender)} :{" "}
                        {capitalize(hostel?.pref_religion)} :{" "}
                        {hostel?.pref_year} : {capitalize(hostel?.pref_faculty)}
                      </span>
                    </InfoPill>
                  </div>
                )}
                <div className="space-y-1">
                  <Label>Security</Label>
                  <InfoPill>
                    <span className="text-xs py-1">
                      {parseList(hostel?.security).join(" : ")}
                    </span>
                  </InfoPill>
                </div>
                <div className="space-y-1">
                  <Label>Water</Label>
                  <InfoPill>
                    <span className="text-xs py-1">
                      {parseList(hostel?.water).join(" : ")}
                    </span>
                  </InfoPill>
                </div>
                <div className="space-y-5 md:space-y-5">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Power Supply</Label>
                      <div>
                        <StarRow value={Number(hostel?.power_supply || 0)} />
                        <div className="mt-2 text-xs md:text-sm">Good supply</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Network Strength</Label>
                      <div>
                        <StarRow value={Number(hostel?.network_strength || 0)} />
                        <div className="mt-2 text-xs md:text-sm">Network Coverage</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Compound</Label>
                      <div>
                        <StarRow value={Number(hostel?.compound || 0)} />
                        <div className="mt-2 text-xs md:text-sm">Good &amp; Aesthetic</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Access Road</Label>
                      <div>
                        <StarRow value={Number(hostel?.access_road || 0)} />
                        <div className="mt-2 text-xs md:text-sm">Good &amp; Accessibility</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex">
                  <div className="w-1/2 flex flex-col items-start">
                    <div className="flex flex-col items-center">
                      <span className="rounded-md bg-black text-white px-3 py-1 text-xs font-bold">
                        AVAILABLE FROM
                      </span>
                      <span className="text-sm mt-1">
                        {hostel?.availability_month || "--"}
                      </span>
                    </div>
                  </div>
                  <div className="w-1/2 ml-5">
                    <button
                      onClick={() => setOpenModal("amenities")}
                      className="cursor-pointer text-xs md:text-sm text-[#0556F8] underline underline-offset-4"
                    >
                      See All Amenities &gt;&gt;
                    </button>
                  </div>
                </div>
                <div className="pt-2 w-full">
                  <button
                    onClick={() => setOpenModal("rules")}
                    className="cursor-pointer w-full rounded-full bg-[#FFFFFF] px-5 py-5 text-sm md:text-xl drop-shadow-lg"
                  >
                    View House Rules
                  </button>
                </div>
                <div
                  className="mt-2 w-full border-t-4"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
                  }}
                />
                <div className="flex items-center justify-between mt-10 text-sm md:text-xl">
                  <button className="inline-flex items-center gap-2 text-red-600 underline underline-offset-4">
                    <FaExclamationTriangle />
                    Report listing
                  </button>
                  <button className="inline-flex items-center gap-2 underline">
                    SHARE <FaShareAlt />
                  </button>
                </div>
              </div>
              {/* Modal for amenities/rules */}
              {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">
                        {openModal === "amenities" ? "All Amenities" : "House Rules"}
                      </h3>
                      <button
                        onClick={() => setOpenModal(null)}
                        className="text-sm cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                    <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
                      {(openModal === "amenities"
                        ? parseList(hostel?.all_feature)
                        : parseList(hostel?.house_rules)
                      ).map((item, index) => (
                        <li key={index} className="pb-1">
                          • {item}
                        </li>
                      ))}
                      {(openModal === "amenities"
                        ? parseList(hostel?.all_feature)
                        : parseList(hostel?.house_rules)
                      ).length === 0 && (
                        <li className="text-gray-400">No data available</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </Maincard>

            {/* Map card */}
            <Maincard className="bg-[#F4F6F5] mt-10 pb-5">
              <SectionHeader title="Map" />
              <div className="px-5 pb-5 pt-3">
                <div className="h-107 relative w-full rounded-xl border-2 bg-[#EDEDED] grid place-items-center my-9">
                  <img
                    src={mapbanner}
                    alt="Banner"
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-black text-center">
                    <h1 className="text-xl md:text-2xl font-semibold">
                      Nothing to see yet...
                    </h1>
                    <p className="mt-3 text-xs md:text-sm">Coming Soon ...</p>
                  </div>
                </div>
                <div className="pt-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <FaMapMarkerAlt size={30} className="text-black" />
                    <span className="text-sm md:text-lg">
                      Check Proximity to your Uni{" "}
                    </span>
                  </button>
                </div>
                <div
                  className="mt-2 w-full border-t-4"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
                  }}
                />
              </div>
            </Maincard>
          </div>

          {/* RIGHT STACK */}
          <div className="space-y-4">
            {/* Host card */}
            <Maincard className="bg-[#CDBCEC] pb-5">
              <SectionHeader title="Host" />
              <div className="md:px-5 space-y-5 pb-5 pt-3">
                <Label className="my-0 ml-2 md:ml-8 py-2">Host</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-xl border-3 px-2 py-3">
                    <div className="place-items-center">
                      {hostel?.uploader === "agent" ? (
                        <HiOutlineUserCircle className="text-[16px] md:text-[25px]" />
                      ) : (
                        <TbUserSquare className="text-[16px] md:text-[25px]" />
                      )}
                    </div>
                    <span className="font-semibold text-sm md:text-xl mr-5 md:mr-35">
                      {hostel?.uploader?.toUpperCase?.() || "HOST"}
                    </span>
                  </div>
                  <button className="inline-flex items-center md:gap-1 text-xs font-semibold">
                    <FaStar className="text-lg text-yellow-400" />
                    <span className="underline ml-3">0 (0)</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Verification</Label>
                    <InfoPill className="md:pl-8 md:px-base">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs inline-flex items-center gap-2 rounded px-2 md:px-3 py-1 bg-black text-white">
                          <FaShieldAlt />
                          TIER {host?.tier ?? "-"}
                        </span>
                        <FaInfoCircle size={14} className="md:ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">No. of Listings</Label>
                    <InfoPill className="md:pl-8 md:px-base">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs py-1">{host?.listings ?? 0}</span>
                        <FaInfoCircle size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Joined</Label>
                    <InfoPill className="md:pl-8 md:px-base">
                      <span className="text-xs text-start">
                        {timeAgo(host?.reg_time)} ago
                      </span>
                    </InfoPill>
                  </div>
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Last Seen</Label>
                    <InfoPill className="md:pl-8 md:px-base">
                      <span className="text-xs">
                        {timeAgo(host?.last_activity)} ago
                      </span>
                    </InfoPill>
                  </div>
                </div>
              </div>
            </Maincard>

            {/* Rent card */}
            <Maincard className="bg-[#CDBCEC] mt-10 pb-5">
              <SectionHeader title="Rent" />
              <div className="md:px-5 pb-6 pt-3 space-y-4">
                <div className="space-y-1">
                  <Label className="ml-8">Inspection Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex ml-2 items-center justify-between w-full">
                      <span className="text-xs md:text-sm py-1">
                        ₦{Number(hostel.price || 0).toLocaleString()}
                      </span>
                      <div className="relative inline-flex items-center">
                        <span className="appearance-none bg-transparent text-xs md:text-sm focus:outline-none pr-6 cursor-pointer">
                          {hostel.inspection}
                        </span>
                      </div>
                    </div>
                  </InfoPill>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">Rent Breakdown</Label>
                  <div className="rounded-2xl bg-white mx-1 border-1 md:p-3">
                    {[
                      [
                        "Rent",
                        `₦${Number(hostel.rent || hostel.price || 0).toLocaleString()} (${hostel.duration})`,
                      ],
                      [
                        "Caution",
                        `₦${Number(hostel.caution_fee || 0).toLocaleString()}`,
                      ],
                      [
                        "Service Charge",
                        `₦${Number(hostel.service_charge || 0).toLocaleString()}`,
                      ],
                      [
                        "Agreement & Legal",
                        `₦${Number(hostel.agreement_fee || 0).toLocaleString()}`,
                      ],
                      [
                        "Agency Fee",
                        `₦${Number(hostel.agency_fee || 0).toLocaleString()}`,
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 px-4 text-xs md:text-sm"
                      >
                        <span>{label}</span>
                        <span className="inline-flex items-center gap-2">
                          {value}{" "}
                          <FaInfoCircle className="text-[16px] md:text-[25px]" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="ml-8">Total Package</Label>
                  <InfoPill>
                    <div className="inline-flex items-center justify-between w-full ml-2">
                      <span className="text-lg py-1 font-bold">
                        ₦
                        {(
                          Number(hostel.rent || hostel.price || 0) +
                          Number(hostel.caution_fee || 0) +
                          Number(hostel.service_charge || 0) +
                          Number(hostel.agreement_fee || 0) +
                          Number(hostel.agency_fee || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </InfoPill>
                </div>
                <div className="pt-2 w-full hidden">
                  <button
                    disabled={!agreed || booking}
                    onClick={handleBookInspection}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 rounded-full px-5 py-5 font-medium drop-shadow-lg",
                      agreed
                        ? "bg-white cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed",
                    )}
                  >
                    <FaCalendarAlt className="text-black text-[20px] md:text-[25px]" />
                    <span className="text-lg md:text-2xl">
                      {booking ? "Booking..." : "Book Inspection"}
                    </span>
                  </button>
                </div>
                <div className="w-full flex flex-col items-center text-center mt-2">
                  <label className="mt-2 flex items-center justify-center gap-2 text-sm text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-black"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>
                      I agree to the{" "}
                      <span className="underline font-semibold text-[#0556F8]">
                        Terms
                      </span>{" "}
                      and{" "}
                      <span className="underline font-semibold text-[#0556F8]">
                        Privacy Policy
                      </span>{" "}
                      of Cribb
                    </span>
                  </label>
                </div>
                <div className="pt-2 w-full">
                  <button
                    disabled={!agreed}
                    onClick={handleBookInspection}
                    className={clsx(
                      "cursor-pointer text-lg md:text-2xl w-full flex items-center justify-center gap-2 rounded-full px-5 py-5 font-medium drop-shadow-lg",
                      agreed
                        ? "bg-black text-white"
                        : "bg-gray-400 text-white cursor-not-allowed",
                    )}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </Maincard>

            {/* Safety Tips card */}
            <Maincard className="bg-[#1C0B3D] mt-10 py-5">
              <div className="px-5 pb-6 pt-5">
                <h4 className="text-lg font-semibold text-[#FFA1A1] tracking-wide">
                  SAFETY TIPS
                </h4>
                <div className="mt-3 h-px w-full border-t border-dashed border-black/20" />
                <div className="mt-4 space-y-5 text-xs md:text-base text-white leading-relaxed">
                  <p>It’s safer not to pay ahead for inspections.</p>
                  <p>
                    Ask friends or someone you trust to accompany you for
                    inspection.
                  </p>
                  <p>
                    Look around the apartment to ensure it meets your
                    expectations.
                  </p>
                  <p>
                    It’s advisable not to pay beforehand if they won’t let you
                    move in immediately.
                  </p>
                  <p>
                    Verify that the account details belong to the right property
                    manager before payment.
                  </p>
                </div>
              </div>
            </Maincard>
          </div>
        </div>
      </section>

      {/* "OTHER HOSTELS" section */}
      <section className="bg-[#CDBCEC] my-20 rounded-4xl border-4">
        <div className="w-full px-4 pb-16 pt-6">
          <h1 className="font-semibold text-lg">OTHER HOSTELS</h1>
          <div className="flex justify-center mb-4">
            <PaginatedCards data={otherCards} />
          </div>
          <div className="flex justify-center">
            <DfButton
              className="font-[300] py-3 px-7 text-[16px]"
              onClick={() => navigate("/studentlisting")}
            >
              VIEW LISTING
            </DfButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}