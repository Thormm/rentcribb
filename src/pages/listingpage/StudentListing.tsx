import { Search, SquarePlus } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Footer from "../../components/Footer";
import Card from "../../components/Cards";
import clsx from "clsx";
import InfoPill from "../../components/Pill";
import LGAS_DATA from "../../components/localgovt.json";
import { useNavigate } from "react-router-dom";

// ----------------------- TYPES -----------------------

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

// ----------------------- API -----------------------

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

// ----------------------- PAGINATION + CARDS -----------------------

function PaginatedCards({ data }: { data: LiveSpace[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
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
            <div key={card.id}>
              <Card
                item={card}
                onView={() =>
                  navigate("/hostelview", { state: { space: [card.id, card.space] } })
                }
              />
            </div>
          ))}
        </div>
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

// ----------------------- MAIN PAGE -----------------------

export default function StudentListing() {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [cards, setCards] = useState<LiveSpace[]>([]);
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const navigate = useNavigate();

  // Run this at the top of your page/component
  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login"); // redirect using react-router
    }
  }, [navigate]);

  const statesAndLgas: { state: string; lgas: string[] }[] =
    React.useMemo(() => {
      try {
        if (Array.isArray(LGAS_DATA as any)) return LGAS_DATA as any;
        return Object.keys(LGAS_DATA as any).map((s) => ({
          state: s,
          lgas: (LGAS_DATA as any)[s],
        }));
      } catch (e) {
        return [];
      }
    }, []);

  const [filters, setFilters] = useState({
    space: "",
    type: "",
    location: "",
    priceMin: "",
    priceMax: "",
    availability_month: "",
    duration: "",
    power_supply: "",
    security: "",
  });

  // ---------------- FILTERING ----------------

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (filters.space && card.space !== filters.space) return false;

      if (filters.type && card.type !== filters.type) return false;

      if (
        filters.location &&
        !card.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      if (filters.priceMin && card.price < Number(filters.priceMin))
        return false;

      if (filters.priceMax && card.price > Number(filters.priceMax))
        return false;

      if (
        filters.availability_month &&
        card.availability_month !== filters.availability_month
      )
        return false;

      if (filters.duration && card.duration !== filters.duration) return false;

      if (
        filters.power_supply &&
        String(card.power_supply) !== filters.power_supply
      )
        return false;

      if (filters.security && String(card.security) !== filters.security)
        return false;

      return true;
    });
  }, [cards, filters]);

  const clearFilters = () => {
    setFilters({
      space: "",
      type: "",
      location: "",
      priceMin: "",
      priceMax: "",
      availability_month: "",
      duration: "",
      power_supply: "",
      security: "",
    });
  };

  useEffect(() => {
    if (!login.school) return;
    getLiveSpaces(login.school).then(setCards);
  }, []);

  return (
    <div className="bg-[#F3EDFE]">
      <section className="min-h-screen w-full">
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-md font-semibold text-[#FFA1A1]">LISTINGS</div>

            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">
                  {login?.school?.split(" - ")?.[0] ?? ""}
                </span>
              </h1>

              <button
                onClick={() => navigate("/request")}
                className="justify-self-end cursor-pointer text-xs md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-4 font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15"
              >
                <SquarePlus className="h-6 w-6 md:h-10 md:w-10" />
                POST A REQUEST
              </button>
            </div>

            <div className="grid md:grid-cols-[80%_20%] items-end mt-5 md:mt-0">
              <div>
                {/* MAIN FILTERS */}
                <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Category</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.space}
                        onChange={(e) =>
                          setFilters({ ...filters, space: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none"
                      >
                        <option value="">Select as applied</option>
                        <option value="entirespace">entirespace</option>
                        <option value="sharedspace">sharedspace</option>
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
                        className="w-full bg-transparent text-xs md:text-sm outline-none "
                      >
                        <option value="">Select Space type...</option>
                        <option value="A room">A room</option>
                        <option value="A room in a flat">
                          A room in a flat
                        </option>
                        <option value="A room self-contain">
                          A room self-contain
                        </option>
                        <option value="A room and parlor">
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

                  {/* Location */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Location</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={filters.location}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                        className="w-full bg-transparent text-xs md:text-sm outline-none "
                      >
                        <option value="">Around Where?</option>
                        {statesAndLgas.map((s) => (
                          <optgroup label={s.state} key={s.state}>
                            {s.lgas.map((l) => (
                              <option key={l} value={`${s.state} - ${l}`}>
                                {l}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </InfoPill>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <Label className="ml-8 text-white">Price</Label>
                    <InfoPill className="bg-white">
                      <select
                        value={
                          filters.priceMin && filters.priceMax
                            ? `${filters.priceMin}-${filters.priceMax}`
                            : ""
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!v) {
                            setFilters({
                              ...filters,
                              priceMin: "",
                              priceMax: "",
                            });
                            return;
                          }
                          const [min, max] = v.split("-");
                          setFilters({
                            ...filters,
                            priceMin: min,
                            priceMax: max,
                          });
                        }}
                        className="w-full bg-transparent text-xs md:text-sm outline-none "
                      >
                        <option value="">Select price range</option>
                        <option value="50000-100000">50k – 100k</option>
                        <option value="100000-200000">100k – 200k</option>
                        <option value="200000-500000">200k – 500k</option>
                        <option value="500000-1000000">500k – 1M</option>
                      </select>
                    </InfoPill>
                  </div>
                </div>

                {/* EXTRA FILTERS */}
                {showAllFilters && (
                  <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                    {/* Move in Date */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Move in Date</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.availability_month}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              availability_month: e.target.value,
                            })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none "
                        >
                          <option value="">How soon?</option>
                          <option value="Currently">Currently</option>
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

                    {/* Duration */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Duration</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.duration}
                          onChange={(e) =>
                            setFilters({ ...filters, duration: e.target.value })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none "
                        >
                          <option value="">For how long?</option>
                          <option value="Per Year">Per Year</option>
                          <option value="Per Session">Per Session</option>
                          <option value="Per 9months">Per 9months</option>
                          <option value="Per 6months">Per 6months</option>
                          <option value="Per Semester">Per Semester</option>
                          <option value="Per 3months">Per 3months</option>
                          <option value="Per month">Per month</option>
                        </select>
                      </InfoPill>
                    </div>

                    {/* Power */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Power</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.power_supply}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              power_supply: e.target.value,
                            })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none "
                        >
                          <option value="">How good is supply?</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </InfoPill>
                    </div>

                    {/* Security */}
                    <div className="space-y-1">
                      <Label className="ml-8 text-white">Security</Label>
                      <InfoPill className="bg-white">
                        <select
                          value={filters.security}
                          onChange={(e) =>
                            setFilters({ ...filters, security: e.target.value })
                          }
                          className="w-full bg-transparent text-xs md:text-sm outline-none "
                        >
                          <option value="">How good is security?</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
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

        <div className="flex justify-center">
          <PaginatedCards data={filteredCards} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
