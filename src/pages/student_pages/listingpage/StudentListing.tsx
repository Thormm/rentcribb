import { SquarePlus } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Footer from "../../../components/Footer";
import Card from "../../../components/Cards";
import clsx from "clsx";
import InfoPill from "../../../components/Pill";
import LGAS_DATA from "../../../components/localgovt.json";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";

// ==========================
// REUSABLE FILTER COMPONENT
// ==========================

type FilterSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  children,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="space-y-1">
      <Label className=" text-white">{label}</Label>

      <InfoPill className="bg-white">
        <div className="flex items-center justify-between w-full">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
          >
            <option value="">{placeholder}</option>

            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}

            {children}
          </select>

          <IoIosArrowDown className="ml-2" />
        </div>
      </InfoPill>
    </div>
  );
}

// ==========================
// FILTER CONFIG
// ==========================

const mainFilters = [
  {
    label: "Category",
    key: "space",
    placeholder: "All Categories",
    options: [
      { value: "entirespace", label: "Entirespace" },
      { value: "sharedspace", label: "Sharedspace" },
    ],
  },

  {
    label: "Type",
    key: "type",
    placeholder: "All Space Type",
    options: [
      { value: "A room", label: "A room" },
      { value: "A room in a flat", label: "A room in a flat" },
      { value: "A room self-contain", label: "A room self-contain" },
      { value: "A room and parlor", label: "A room and parlor" },
      { value: "2 bedroom apartment", label: "2 bedroom apartment" },
      { value: "3 bedroom apartment", label: "3 bedroom apartment" },
      { value: "4 bedroom apartment", label: "4 bedroom apartment" },
      { value: "5 bedroom apartment", label: "5 bedroom apartment" },
    ],
  },

  {
    label: "Price",
    key: "price",
    placeholder: "All Price Ranges",
    options: [
      { value: "50000-100000", label: "50k – 100k" },
      { value: "100000-200000", label: "100k – 200k" },
      { value: "200000-500000", label: "200k – 500k" },
      { value: "500000-1000000", label: "500k – 1M" },
    ],
  },
];

const extraFilters = [
  {
    label: "Move in Date",
    key: "availability_month",
    placeholder: "Any Date?",
    options: [
      { value: "Currently", label: "Currently" },
      { value: "January", label: "January" },
      { value: "February", label: "February" },
      { value: "March", label: "March" },
      { value: "April", label: "April" },
      { value: "May", label: "May" },
      { value: "June", label: "June" },
      { value: "July", label: "July" },
      { value: "August", label: "August" },
      { value: "September", label: "September" },
      { value: "October", label: "October" },
      { value: "November", label: "November" },
      { value: "December", label: "December" },
    ],
  },

  {
    label: "Duration",
    key: "duration",
    placeholder: "All Duration?",
    options: [
      { value: "Per Year", label: "Per Year" },
      { value: "Per Session", label: "Per Session" },
      { value: "Per 9months", label: "Per 9months" },
      { value: "Per 6months", label: "Per 6months" },
      { value: "Per Semester", label: "Per Semester" },
      { value: "Per 3months", label: "Per 3months" },
      { value: "Per month", label: "Per month" },
    ],
  },

  {
    label: "Power",
    key: "power_supply",
    placeholder: "How good is supply?",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ],
  },

  {
    label: "Security",
    key: "security",
    placeholder: "How good is security?",
    options: [
      { value: "Low", label: "Low" },
      { value: "Moderate", label: "Moderate" },
      { value: "High", label: "High" },
    ],
  },
];

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
        "text-sm md:text-md md:my-3 font-semibold ml-6",
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
  const itemsPerPage = 15;
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

  const schoolStateLgas = React.useMemo(() => {
    try {
      const school = login?.school || "";
      const match = school.match(/\((.*?)\)/);
      const stateName = match?.[1]?.trim();
      if (!stateName) return [];

      return (LGAS_DATA as any)[stateName] || [];
    } catch {
      return [];
    }
  }, [login?.school]);

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

  useEffect(() => {
    if (!login.school) return;
    getLiveSpaces(login.school).then(setCards);
  }, []);

  return (
    <div className="bg-[#F3EDFE]">
      <section className="min-h-screen w-full">
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-1 px-5 md:px-33 bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          {/* LEFT SIDE */}
          <div className="w-full">
            <div className="grid grid-cols-[1fr_auto] items-center gap-1">
              {/* LEFT SIDE */}
              <div>
                <div className="text-md font-semibold text-[#FFA1A1]">
                  LISTINGS
                </div>

                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <h1 className="text-2xl md:text-4xl my-4 font-extrabold">
                    Available Hostels in{" "}
                    <span className="text-[#C2C8DA]">
                      {login?.school?.split(" - ")?.[0] ?? ""}
                    </span>
                  </h1>
                </div>
              </div>
              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end md:hidden  space-y-3">
                <button
                  onClick={() => navigate("/request")}
                  className="justify-self-end cursor-pointer text-xs md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 font-md text-white"
                >
                  <SquarePlus className="h-6 w-6 md:h-10 md:w-10" />
                  POST A REQUEST
                </button>

                <button
                  className="inline-flex items-center gap-1 mt-3 cursor-pointer"
                  onClick={() => setShowAllFilters((v) => !v)}
                >
                  <span className="text-xs md:text-md text-[#0556F8] p-1 bg-white rounded">
                    {showAllFilters ? "Hide filters" : "Show all Filter"} ›
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5 md:mt-0">
              {/* MAIN FILTERS */}
              <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                {mainFilters.map((field) => {
                  // PRICE SPECIAL CASE
                  if (field.key === "price") {
                    return (
                      <FilterSelect
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={
                          filters.priceMin && filters.priceMax
                            ? `${filters.priceMin}-${filters.priceMax}`
                            : ""
                        }
                        options={field.options}
                        onChange={(value) => {
                          if (!value) {
                            setFilters({
                              ...filters,
                              priceMin: "",
                              priceMax: "",
                            });

                            return;
                          }

                          const [min, max] = value.split("-");

                          setFilters({
                            ...filters,
                            priceMin: min,
                            priceMax: max,
                          });
                        }}
                      />
                    );
                  }

                  return (
                    <FilterSelect
                      key={field.key}
                      label={field.label}
                      placeholder={field.placeholder}
                      value={
                        filters[field.key as keyof typeof filters] as string
                      }
                      options={field.options}
                      onChange={(value) =>
                        setFilters({
                          ...filters,
                          [field.key]: value,
                        })
                      }
                    />
                  );
                })}

                {/* LOCATION SPECIAL CASE */}
                <FilterSelect
                  label="Location"
                  placeholder="All Areas?"
                  value={filters.location}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      location: value,
                    })
                  }
                >
                  {schoolStateLgas.map((lga: string) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </FilterSelect>
              </div>

              {/* EXTRA FILTERS */}
              {showAllFilters && (
                <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                  {extraFilters.map((field) => (
                    <FilterSelect
                      key={field.key}
                      label={field.label}
                      placeholder={field.placeholder}
                      value={
                        filters[field.key as keyof typeof filters] as string
                      }
                      options={field.options}
                      onChange={(value) =>
                        setFilters({
                          ...filters,
                          [field.key]: value,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-col hidden md:flex items-end space-y-5">
            <button
              onClick={() => navigate("/request")}
              className="justify-self-end cursor-pointer text-xs md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15"
            >
              <SquarePlus className="h-6 w-6 md:h-10 md:w-10" />
              POST A REQUEST
            </button>

            <button
              className="inline-flex items-center gap-1 mt-3 cursor-pointer"
              onClick={() => setShowAllFilters((v) => !v)}
            >
              <span className="text-xs md:text-md text-[#0556F8] p-1 bg-white rounded">
                {showAllFilters ? "Hide filters" : "Show all Filter"} ›
              </span>
            </button>
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
