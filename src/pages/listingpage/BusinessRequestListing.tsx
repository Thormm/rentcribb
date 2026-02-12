import { Search } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Footer from "../../components/Footer";
import clsx from "clsx";
import InfoPill from "../../components/Pill";
import { useNavigate } from "react-router-dom";
import {
  MdOutlinePostAdd,
  MdOutlineMan4,
  MdOutlineWoman2,
} from "react-icons/md";
import { CgCross } from "react-icons/cg";
import { MdIosShare } from "react-icons/md";
import { FaRegCircle, FaMosque } from "react-icons/fa";

// ----------------------- TYPES -----------------------

interface LiveRequest {
  id: number;
  user: string;
  gender: string;
  religion: string;
  category: string;
  type: string;
  preferred_location_1: string;
  preferred_location_2: string | null;
  features: string[];
  move_in_date: string;
  budget: string;
  school: string;
  status: string;
  created_at: string;
}

// ----------------------- API -----------------------

async function getRequests(): Promise<LiveRequest[]> {
  const res = await fetch("https://www.cribb.africa/apigets.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "get_requests_by_school",
    }),
  });

  const data = await res.json();

  return (data.requests ?? []).map((r: any) => ({
    id: Number(r.id),
    user: r.user,
    gender: r.gender,
    religion: r.religion,
    category: r.category,
    type: r.type,
    preferred_location_1: r.preferred_location_1,
    preferred_location_2: r.preferred_location_2 || null,
    features: typeof r.features === "string" ? JSON.parse(r.features) : [],
    move_in_date: r.move_in_date,
    budget: r.budget,
    school: r.school,
    status: r.status,
    created_at: r.created_at,
  }));
}

function Label({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "text-sm md:text-md md:my-3 font-semibold ml-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

function daysAgo(dateStr: string) {
  const created = new Date(dateStr);
  const now = new Date();

  const diff = now.getTime() - created.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}

// ----------------------- PAGINATION + CARDS -----------------------

function PaginatedCards({ data }: { data: LiveRequest[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

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
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 pb-16 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6">
          {currentData.map((card) => (
            <div key={card.id}>
              <div className="w-full rounded-4xl border-4 border-gray-800/90 bg-[#F4F6F5] py-6 px-4 md:px-10 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: location + green pill */}
                  <div className="flex items-center gap-2 md:gap-10">
                    <div className="flex items-center gap-2">
                      <FaRegCircle className="text-xs md:text-sm" />
                      <span className="font-semibold tracking-wide text-sm md:text-base">
                        {card.school?.split(" - ")[0] ?? ""}
                      </span>
                    </div>

                    <div className="px-3 py-1 rounded-lg bg-[#D6FFC3] text-[10px] md:text-[12px] text-black">
                      7 hosts responded
                    </div>
                  </div>

                  {/* Right: last seen pill (black) */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-black text-white px-3 py-1 text-xs font-medium">
                      LAST SEEN
                    </div>
                  </div>
                </div>

                {/* meta row: posted / icons / time */}
                <div className="mt-2 flex items-center gap-2 px-3">
                  <span className="text-[12px] text-gray-700">
                    Posted {daysAgo(card.created_at)}
                  </span>

                  <span className="flex items-center ml-auto gap-1.5">
                    {/* gender */}
                    {card.gender?.toLowerCase() === "female" ? (
                      <MdOutlineWoman2
                        title="Female"
                        className="text-2xl rounded-full p-1 bg-white"
                      />
                    ) : (
                      <MdOutlineMan4
                        title="Male"
                        className="text-2xl rounded-full p-1 bg-white"
                      />
                    )}

                    {/* religion */}
                    {card.religion?.toLowerCase() === "muslim" ? (
                      <FaMosque
                        title="Muslim"
                        className="text-2xl rounded-full p-1 bg-white"
                      />
                    ) : card.religion?.toLowerCase() === "christian" ? (
                      <CgCross
                        title="Christian"
                        className="text-2xl rounded-full p-1 bg-white"
                      />
                    ) : null}

                    {/* time badge */}
                    <span className="text-[11px] rounded-md px-2 py-0.5 bg-white text-gray-700">
                      {daysAgo(card.created_at)}
                    </span>
                  </span>
                </div>

                {/* message bubble */}
                <div className="mt-4 p-2 bg-[#FFFFFF] rounded-3xl text-xs md:text-sm leading-relaxed">
                  <p>
                    A{" "}
                    <span className="font-bold capitalize">{card.gender}</span>{" "}
                    student needs a{" "}
                    {card.category === "Shared Space" && (
                      <span className="font-bold">SHARED</span>
                    )}{" "}
                    <span className="font-bold">{card.type}</span> around{" "}
                    <span className="font-semibold">
                      {card.preferred_location_1}
                      {card.preferred_location_2
                        ? `, ${card.preferred_location_2}`
                        : ""}
                    </span>
                    .
                    <br />
                    {card.features.length > 0 && (
                      <>
                        Must have{" "}
                        <span className="font-semibold">
                          {card.features.join(", ")}
                        </span>
                        .
                        <br />
                      </>
                    )}
                    <span className="font-bold">Budget: {card.budget}</span>
                    <br />
                    Looking to move in{" "}
                    <span className="font-bold">{card.move_in_date}</span>.
                  </p>
                </div>

                {/* bottom row: share, reply button */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="underline text-sm md:text-md text-[#2563eb]">
                      SHARE
                    </span>
                    <MdIosShare className="text-lg md:text-2xl" />
                  </div>

                  <button
                    className="mx-auto text-md md:text-xl bg-black text-white  rounded-xl px-10 py-3 shadow-md hover:opacity-95"
                    aria-label="Reply"
                  >
                    REPLY
                  </button>
                </div>
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

// ----------------------- MAIN PAGE -----------------------

export default function StudentListing() {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [cards, setCards] = useState<LiveRequest[]>([]);
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState<boolean>(false);

  const [institutes, setInstitutes] = useState<
    { id: number; institution: string }[]
  >([]);
  useEffect(() => {
    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getInstitutes" }),
    })
      .then((res) => res.json())
      .then((data) => {
        // data is an array of JSON strings
        const parsed = data.map((d: string) => JSON.parse(d));
        setInstitutes(parsed);
      });
  }, []);

  // Run this at the top of your page/component
  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login"); // redirect using react-router
    }
  }, [navigate]);

  const [filters, setFilters] = useState({
    school: login.school || "", // default school
    category: "",
    type: "",
    gender: "",
    moveIn: "",
    features: [] as string[],
    religion: "",
  });

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // 1️⃣ School filter
      if (filters.school && card.school !== filters.school) return false;

      // 2️⃣ Category filter
      if (filters.category && card.category !== filters.category) return false;

      // 3️⃣ Type filter
      if (filters.type && card.type !== filters.type) return false;

      // 4️⃣ Gender filter
      if (
        filters.gender &&
        card.gender?.toLowerCase() !== filters.gender.toLowerCase()
      )
        return false;

      // 5️⃣ Move-in date filter
      if (filters.moveIn && card.move_in_date !== filters.moveIn) return false;

      // 6️⃣ Special features filter
      if (filters.features.length > 0) {
        const cardFeatures = (card.features || []).map((f) => f.toLowerCase());
        const wanted = filters.features.map((f) => f.toLowerCase());
        const hasAll = wanted.every((f) => cardFeatures.includes(f));
        if (!hasAll) return false;
      }

      // 7️⃣ Religion filter
      if (filters.religion && card.religion !== filters.religion) return false;

      return true;
    });
  }, [cards, filters]);

  const clearFilters = () => {
    setFilters({
      school: login.school || "", // reset to default login school
      category: "",
      type: "",
      gender: "",
      moveIn: "",
      features: [],
      religion: "",
    });
  };

  useEffect(() => {
    if (!login.school) return;
    getRequests().then(setCards);
  }, [login.school]);

  return (
    <div className="bg-[#F3EDFE]">
      <section className="min-h-screen w-full">
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-md font-semibold text-[#FFA1A1]">REQUESTS</div>

            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold">
                Available Requests in{" "}
                <span className="text-[#C2C8DA]">
                  {filters.school
                    ? filters.school.split(" - ")[0] // abbreviation
                    : "All"}
                </span>
              </h1>

              <button
                onClick={() => navigate("/request")}
                className="justify-self-end cursor-pointer text-xs md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-4 font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15"
              >
                <MdOutlinePostAdd className="h-6 w-6 md:h-10 md:w-10" />
                LIST SPACE
              </button>
            </div>

            <div className="grid md:grid-cols-[80%_20%] items-end mt-5 md:mt-0">
              <div>
                <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                  {/* School / Institution */}
                  {/* School / Institution */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Institution</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.school}
                        onChange={(e) =>
                          setFilters({ ...filters, school: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none"
                      >
                        <option value="">All schools</option>
                        {institutes.map((inst) => (
                          <option key={inst.id} value={inst.institution}>
                            {inst.institution}
                          </option>
                        ))}
                      </select>
                    </InfoPill>
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Category</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none"
                      >
                        <option value="">All categories</option>
                        <option value="Entire Space">Entire Space</option>
                        <option value="Shared Space">Shared Space</option>
                      </select>
                    </InfoPill>
                  </div>

                  {/* Type */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Type</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.type}
                        onChange={(e) =>
                          setFilters({ ...filters, type: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none"
                      >
                        <option value="">Select Space type...</option>
                        <option value="Room">A room</option>
                        <option value="Room in a flat">A room in a flat</option>
                        <option value="Self-contained room">
                          Self-contained room
                        </option>
                        <option value="Room and parlor">
                          A room and parlor
                        </option>
                        <option value="2 bedroom apartment">
                          2 bedroom apartment
                        </option>
                        <option value="3 bedroom apartment">
                          3 bedroom apartment
                        </option>
                        <option value="4 bedroom apartment">
                          4 bedroom apartment
                        </option>
                        <option value="5 bedroom apartment">
                          5 bedroom apartment
                        </option>
                      </select>
                    </InfoPill>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Gender</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.gender}
                        onChange={(e) =>
                          setFilters({ ...filters, gender: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none"
                      >
                        <option value="">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </InfoPill>
                  </div>
                </div>

                {/* EXTRA FILTERS */}
                {showAllFilters && (
                  <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                    {/* Move-in date */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Move in date</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.moveIn}
                          onChange={(e) =>
                            setFilters({ ...filters, moveIn: e.target.value })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none"
                        >
                          <option value="">Any time</option>
                          <option value="Urgently">Urgently</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </InfoPill>
                    </div>

                    {/* Special Features - Fullscreen Dropdown Style */}
                    <div className="space-y-1 relative">
                      <Label className="ml-8 text-white">
                        Special features
                      </Label>

                      {/* InfoPill triggers the overlay */}
                      <InfoPill
                        className="bg-white cursor-pointer"
                        onClick={() => setShowFeatures((v: boolean) => !v)}
                      >
                        <span className="text-xs md:text-sm truncate  block">
                          {filters.features.length === 0
                            ? "Select..."
                            : filters.features.join(", ")}
                        </span>
                      </InfoPill>

                      {/* Fullscreen overlay */}
                      {showFeatures && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
                          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto">
                            {/* Close button */}
                            <button
                              onClick={() => setShowFeatures(false)}
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                              ×
                            </button>

                            <div className="p-4 py-10 space-y-2">
                              {[
                                ...new Set(
                                  cards.flatMap((c) => c.features || []),
                                ),
                              ].map((feature) => {
                                const selected =
                                  filters.features.includes(feature);
                                return (
                                  <label
                                    key={feature}
                                    className={`flex items-center justify-between px-4 py-2 text-sm text-black cursor-pointer rounded hover:bg-gray-100 ${
                                      selected ? "bg-[#F0EEFF]" : ""
                                    }`}
                                  >
                                    <span>{feature}</span>
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={() => {
                                        if (selected) {
                                          setFilters({
                                            ...filters,
                                            features: filters.features.filter(
                                              (f) => f !== feature,
                                            ),
                                          });
                                        } else {
                                          setFilters({
                                            ...filters,
                                            features: [
                                              ...filters.features,
                                              feature,
                                            ],
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Religion */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Religion</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.religion}
                          onChange={(e) =>
                            setFilters({ ...filters, religion: e.target.value })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none"
                        >
                          <option value="">All Religions</option>
                          <option value="christian">Christianity</option>
                          <option value="muslim">Islam</option>
                          <option value="none">None</option>
                        </select>
                      </InfoPill>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center mt-4 md:mt-0 md:justify-end gap-4">
                <div className="grid grid-cols-1">
                  <button
                    onClick={clearFilters}
                    className="text-[red] text-xs md:text-md cursor-pointer"
                  >
                    Clear Filter <span>›</span>
                  </button>

                  <button
                    className="inline-flex items-center gap-1 mt-3 cursor-pointer"
                    onClick={() => setShowAllFilters((v) => !v)}
                  >
                    <span className="text-xs md:text-md text-[blue]">
                      {showAllFilters ? "Hide filters" : "Show all Filter"}
                    </span>
                    <span className="text-xs md:text-md text-[blue] leading-none">
                      ›
                    </span>
                  </button>
                </div>

                <button className="grid h-15 w-15 md:h-20 md:w-20 place-items-center rounded-full border-white border-2 bg-gradient-to-tr from-[#C6B0EF] to-[#4600C8] shadow-lg ring-1 ring-white/20">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <PaginatedCards data={filteredCards} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
