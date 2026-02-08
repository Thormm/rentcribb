import React from "react";
import {
  FaStar,
  FaRegStar,
  FaInfoCircle,
  FaExclamationTriangle,
  FaShareAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import InfoPill, { DfButton } from "../../components/Pill";
import clsx from "clsx"; // optional, for cleaner class merging
import Card from "../../components/Cards";
import Footer from "../../components/Footer";
import imgright from "../../assets/hero.jpg";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

async function getLiveSpaces(school: string): Promise<LiveSpace[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_student_live_spaces", school }),
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-center text-2xl md:text-4xl font-extrabold">
        {title}
      </h2>
      <p className="text-center text-xs md:text-sm pt-1 md:pt-5">
        Check out the Features of this Hostel
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

type LabelProps = React.PropsWithChildren<{
  className?: string;
}>;

function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg md:my-2 font-semibold ml-0",
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

// ----------------------- PAGINATION + CARDS -----------------------

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

export default function Hostelview() {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [openPhotos, setOpenPhotos] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const location = useLocation();
  const space = location.state?.space;
  const id = space?.[0];
  const space_type = space?.[1];
  const [cards, setCards] = useState<LiveSpace[]>([]);
  const [host, setHost] = useState<any>(null);
  const [openModal, setOpenModal] = React.useState<
    null | "amenities" | "rules"
  >(null);

  const isEntire = space_type === "entirespace";
  const mediaBase = isEntire
    ? `https://www.cribb.africa/uploads/entire_spaces/${hostel?.user}`
    : `https://www.cribb.africa/uploads/shared_spaces/${hostel?.user}`;
  const photos: string[] = useMemo(() => {
    try {
      if (!hostel?.photos) return [];
      const p = JSON.parse(hostel?.photos);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [hostel?.photos]);
  const mainPhoto = photos[0] ? `${mediaBase}/${photos[0]}` : imgright;

  const secondPhoto = photos[1] ? `${mediaBase}/${photos[1]}` : imgright;

  const videoUrl = hostel?.video ? `${mediaBase}/${hostel.video}` : null;

  const parseList = (value: any): string[] => {
    if (!value) return [];

    // already an array
    if (Array.isArray(value)) return value;

    if (typeof value !== "string") return [];

    const trimmed = value.trim();

    if (!trimmed) return [];

    // try JSON array first
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch {
        // fall through
      }
    }

    // fallback: comma separated list
    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    if (!login.school) return;
    getLiveSpaces(login.school).then(setCards);
  }, []);

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "--";

    let d: Date | null = null;

    // case 1: 2026-02-05 13:56:10.000000
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      d = new Date(dateStr.replace(" ", "T"));
    }

    // case 2: 26-01-11 03:49:32pm   (yy-mm-dd hh:mm:ssam)
    else if (/^\d{2}-\d{2}-\d{2}\s/.test(dateStr)) {
      const [datePart, timePartRaw] = dateStr.split(" ");

      const [yy, mm, dd] = datePart.split("-").map(Number);

      const timePart = timePartRaw.toLowerCase();
      const isPM = timePart.endsWith("pm");

      const [h, m, s] = timePart.replace(/am|pm/, "").split(":").map(Number);

      let hour = h;
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      // assume 20xx for your system
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

  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login"); // redirect using react-router
    }

    if (!space) {
      navigate("/studentlisting", { replace: true });
    }
  }, [space, navigate]);

  useEffect(() => {
    if (!id || !space_type) return;

    const fetchHostel = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_full_details_hostel",
          id,
          space_type,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setHostel(data.data);
        console.log("Fetched hostel data:", data.data);
      } else {
        console.log(data.message);
      }
    };

    fetchHostel();
  }, [id, space_type]);

  useEffect(() => {
    if (!hostel?.user) return;

    const fetchHost = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_host_summary",
          user: hostel.user,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setHost(data.data);
        console.log("Host summary:", data.data);
      }
    };

    fetchHost();
  }, [hostel?.user]);

  const otherCards = cards.filter(
    (c) => !(String(c.id) === String(id) && c.space === space_type),
  );

  if (!hostel) {
    return <div className="p-10">Loading hostel...</div>;
  }

  return (
    <div className="bg-[#F3EDFE]">
      <section className=" w-full ">
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
            <div className="text-md font-semibold text-[#FFA1A1]">LISTINGS</div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold ">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">
                  {hostel?.target_university?.split(" - ")?.[0] ?? ""}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 md:mt-15 md:mx-12 grid grid-cols-1 md:grid-cols-[40%_60%] gap-2 p-6 pt-0 bg-[#f5f5f7]">
        {/* Left Section */}
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

        {/* Right Section */}
        <section className="flex flex-col gap-2">
          {/* Top image */}
          <div className="relative hidden md:block w-full h-70">
            <img
              src={secondPhoto}
              className="w-full h-full object-cover border-2 rounded-3xl"
              alt=""
            />
          </div>

          {/* Bottom video */}
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
        {openPhotos && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              {/* close */}
              <button
                className="absolute -top-10 right-0 z-10 text-white text-2xl"
                onClick={() => setOpenPhotos(false)}
              >
                ✕
              </button>

              {/* prev */}
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

              {/* next */}
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

      <section className="bg-[#F3EDFE] my-20">
        <div className="mx-2 md:mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}
          <div className="space-y-1">
            {/* HOSTEL VIEW */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hostel View" />

              <div className="md:px-5 pb-4 pt-3 space-y-5 md:space-y-8">
                {/* Description */}
                <div className="space-y-1">
                  <Label className="ml-8">Description</Label>

                  <InfoPill className="text-xs md:text-base">
                    {hostel && (
                      <>
                        {hostel.units} unit{Number(hostel.units) > 1 ? "s" : ""}{" "}
                        of “{hostel.space_type}”{" "}
                        {hostel.space_type.toLowerCase().includes("flat") ||
                        hostel.space_type.toLowerCase().includes("room")
                          ? "(Furnished)"
                          : ""}{" "}
                        is available around {hostel.location} for{" "}
                        <span className="font-extrabold">
                          ₦
                          {Number(
                            hostel.space_type.toLowerCase().includes("shared")
                              ? hostel.rent
                              : hostel.price || 0,
                          ).toLocaleString()}
                        </span>{" "}
                        {hostel.duration}.
                        {!isEntire && (
                          <>
                            {" "}
                            Preferred Gender:{" "}
                            <span className="font-semibold">
                              {hostel.pref_gender}
                            </span>
                            , Religion:{" "}
                            <span className="font-semibold">
                              {hostel.pref_religion}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </InfoPill>
                </div>

                {/* Bedrooms & Toilets (ENTIRE SPACE ONLY) */}
                {isEntire && (
                  <div className="space-y-1">
                    <Label className="ml-8">Bedrooms and Toilets</Label>
                    <InfoPill className="text-xs md:text-base">
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
                    </InfoPill>
                  </div>
                )}

                {/* Security */}
                <div className="space-y-1">
                  <Label className="ml-8">Security</Label>
                  <InfoPill className="text-xs md:text-base">
                    {parseList(hostel?.security).join(" : ")}
                  </InfoPill>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <Label className="ml-8">Water</Label>
                  <InfoPill className="text-xs md:text-base">
                    {parseList(hostel?.water).join(" : ")}
                  </InfoPill>
                </div>

                {/* Grid pairs */}
                <div className="space-y-5 md:space-y-5">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Power Supply</Label>
                      <div>
                        <StarRow value={Number(hostel?.power_supply || 0)} />
                        <div className="mt-2 text-xs md:text-sm">
                          Good supply
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Network Strength</Label>
                      <div>
                        <StarRow
                          value={Number(hostel?.network_strength || 0)}
                        />
                        <div className="mt-2 text-xs md:text-sm">
                          Network Coverage
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Compound</Label>
                      <div>
                        <StarRow value={Number(hostel?.compound || 0)} />
                        <div className="mt-2 text-xs md:text-sm">
                          Good &amp; Aesthetic
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Access Road</Label>
                      <div>
                        <StarRow value={Number(hostel?.access_road || 0)} />
                        <div className="mt-2 text-xs md:text-sm">
                          Good &amp; Accessibility
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  {/* Left: Available block */}
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

                  {/* Right: Amenities Link */}
                  <div className="w-1/2 ml-5">
                    <button
                      onClick={() => setOpenModal("amenities")}
                      className="cursor-pointer text-xs md:text-sm text-[#0556F8] underline underline-offset-4"
                    >
                      See All Amenities &gt;&gt;
                    </button>
                  </div>
                </div>

                {/* View House Rules */}
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

                {/* Report / Share */}
                <div className="flex items-center justify-between mt-10 text-sm md:text-xl">
                  <button className="inline-flex items-center gap-2 text-red-600  underline underline-offset-4">
                    <FaExclamationTriangle />
                    Report listing
                  </button>
                  <button className="inline-flex items-center gap-2 underline">
                    SHARE <FaShareAlt />
                  </button>
                </div>
              </div>

              {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">
                        {openModal === "amenities"
                          ? "All Amenities"
                          : "House Rules"}
                      </h3>

                      <button
                        onClick={() => setOpenModal(null)}
                        className="text-sm underline cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
                      {(openModal === "amenities"
                        ? parseList(hostel?.all_feature)
                        : parseList(hostel?.house_rules)
                      ).map((item, index) => (
                        <li key={index} className="border-b pb-1">
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

            {/* MAP */}
            <Maincard className="bg-[#F4F6F5] mt-10 pb-5">
              <SectionHeader title="Map" />
              <div className="px-5 pb-5 pt-3">
                <div className="h-107 w-full rounded-xl border-2 bg-[#EDEDED] grid place-items-center my-9">
                  Map Placeholder
                </div>

                {/* Book inspection */}
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
            {/* HOST */}
            <Maincard className="bg-[#CDBCEC] pb-5">
              <SectionHeader title="Host" />

              <div className="md:px-5 space-y-5 pb-5 pt-3">
                {/* Host row */}
                <Label className="my-0 ml-2 md:ml-8 py-2 ">Host</Label>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-xl border-3 px-2 py-3">
                    <div className="place-items-center">
                      <FaUser className="text-[16px] md:text-[25px]" />
                    </div>

                    <span className="font-semibold text-sm md:text-xl mr-5 md:mr-35">
                      {hostel?.uploader?.toUpperCase?.() || "HOST"}
                    </span>
                  </div>

                  {/* rating still static for now */}
                  <button className="inline-flex items-center md:gap-1 text-xs font-semibold">
                    <FaStar className="text-lg text-yellow-400" />
                    <span className="underline ml-3">1.2 (85)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Verification */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Verification</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <div className="inline-flex items-center justify-between w-full text-[11px]">
                        <span className="text-xs md:text-sm inline-flex items-center gap-2 rounded px-2 md:px-3 py-1 bg-black text-white">
                          <FaShieldAlt size={14} />
                          TIER {host?.tier ?? "-"}
                        </span>

                        <FaInfoCircle size={14} className="md:ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Listings */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">No. of Listings</Label>

                    <InfoPill className="px-3 md:px-base">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:pl-4 md:text-sm py-1">
                          {host?.listings ?? 0}
                        </span>

                        <FaInfoCircle size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Joined */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Joined</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm text-start">
                        {timeAgo(host?.reg_time)} ago
                      </span>
                    </InfoPill>
                  </div>

                  {/* Last seen */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Last Seen</Label>

                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm">
                        {timeAgo(host?.last_activity)} ago
                      </span>
                    </InfoPill>
                  </div>
                </div>
              </div>
            </Maincard>

            {/* RENT */}
            <Maincard className="bg-[#CDBCEC] mt-10 pb-5">
              <SectionHeader title="Rent" />

              <div className="md:px-5 pb-6 pt-3 space-y-4">
                {/* Inspection Fee */}
                <div className="space-y-1">
                  <Label className="ml-8">Inspection Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
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

                {/* Rent Breakdown */}
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
                        <span className="inline-flex items-center gap-2 ">
                          {value}{" "}
                          <FaInfoCircle className="text-[16px] md:text-[25px]" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Package */}
                <div className="space-y-1">
                  <Label className="ml-8">Total Package</Label>
                  <InfoPill>
                    <div className="inline-flex items-center justify-between w-full">
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

                {/* Book Inspection */}
                <div className="pt-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 font-medium drop-shadow-lg">
                    <FaCalendarAlt className="text-black text-[20px] md:text-[25px]" />
                    <span className="text-lg md:text-2xl">Book Inspection</span>
                  </button>
                </div>

                {/* Terms */}
                <div className="w-full flex flex-col items-center text-center mt-2">
                  <label className="mt-2 flex items-center justify-center gap-2 text-sm text-center">
                    <input type="checkbox" className="h-4 w-4 accent-black" />
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

                {/* Connect */}
                <div className="pt-2 w-full">
                  <button className="text-lg md:text-2xl w-full flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-5 font-medium drop-shadow-lg">
                    Connect
                  </button>
                </div>
              </div>
            </Maincard>

            {/* SAFETY TIPS (place this after the Rent card in the RIGHT STACK) */}
            <Maincard className="bg-[#1C0B3D] mt-10 py-5">
              <div className="px-5 pb-6 pt-5">
                {/* Title */}
                <h4 className="text-lg font-semibold text-[#FFA1A1] tracking-wide">
                  SAFETY TIPS
                </h4>

                {/* subtle dashed divider like other cards */}
                <div className="mt-3 h-px w-full border-t border-dashed border-black/20" />

                {/* content */}
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
