import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../../components/Footer";
import clsx from "clsx";
import InfoPill from "../../../../components/Pill";
import { MdOutlinePostAdd } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

// Import the reusable card and its type
import RoommateCard, { type Roommate } from "../../components/RoommateCard";

// ---------- Option arrays ----------
const departments = [
  "Mass Communication",
  "Computer Science",
  "Engineering",
  "Business Admin",
  "Economics",
  "Law",
  "Medicine",
  "Architecture",
];

const levels = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "Postgraduate",
];

const moveInDates = [
  "Urgently",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const durationOptions = [
  "Per Year",
  "Per Session",
  "Per 9months",
  "Per 6months",
  "Per Semester",
  "Per 3months",
  "Per month",
];

const spaceTypes = [
  "A room",
  "A room in a flat",
  "A room self-contain",
  "A room and parlor",
  "2 bedroom apartment",
  "3 bedroom apartment",
  "4 bedroom apartment",
  "5 bedroom apartment",
];

const priceRanges = [
  "₦50,000 - ₦100,000",
  "₦100,000 - ₦250,000",
  "₦250,000 - ₦500,000",
  "₦500,000 - ₦750,000",
  "₦750,000 - ₦1,000,000",
  "₦1,000,000 - ₦2,000,000",
  "₦2,000,000 - ₦3,000,000",
  "₦3,000,000 - ₦4,000,000",
  "₦4,000,000 - ₦5,000,000",
];

// ---------- FilterSelect Component ----------
type FilterSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="space-y-1">
      <Label className="text-white">{label}</Label>
      <InfoPill className="bg-white">
        <div className="flex items-center justify-between w-full">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
          >
            <option value="">{placeholder}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="ml-2" />
        </div>
      </InfoPill>
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
        className
      )}
    >
      {children}
    </div>
  );
}

// ---------- Main Page ----------
export default function Explore() {
  const navigate = useNavigate();
  
  // Get login data once and memoize it
  const loginData = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("login_data") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [showAllFilters, setShowAllFilters] = useState(false);
  const [cards, setCards] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    level: "",
    department: "",
    moveIn: "",
    duration: "",
    type: "",
    price: "",
  });

  const mainFilters = [
    {
      key: "gender",
      label: "Gender",
      placeholder: "Any",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      key: "religion",
      label: "Religion",
      placeholder: "All Religions",
      options: [
        { label: "Christianity", value: "christian" },
        { label: "Islam", value: "muslim" },
        { label: "None", value: "none" },
      ],
    },
    {
      key: "level",
      label: "Level",
      placeholder: "All Levels",
      options: levels.map((l) => ({ label: l, value: l })),
    },
    {
      key: "department",
      label: "Department",
      placeholder: "All Departments",
      options: departments.map((d) => ({ label: d, value: d })),
    },
  ];

  const hiddenFilters = [
    {
      key: "moveIn",
      label: "Move‑in Date",
      placeholder: "Any time",
      options: moveInDates.map((m) => ({ label: m, value: m })),
    },
    {
      key: "duration",
      label: "Duration",
      placeholder: "Any",
      options: durationOptions.map((d) => ({ label: d, value: d })),
    },
    {
      key: "type",
      label: "Type",
      placeholder: "All Space Types",
      options: spaceTypes.map((t) => ({ label: t, value: t })),
    },
    {
      key: "price",
      label: "Price",
      placeholder: "Any Budget",
      options: priceRanges.map((p) => ({ label: p, value: p })),
    },
  ];

  // ----- Fetch real data from database -----
  useEffect(() => {
    const fetchRoommates = async () => {
      setLoading(true);
      try {
        const user = loginData?.user || "";
        const signup_key = loginData?.signup_key || "";
        const school = loginData?.school || "";

        if (!user || !signup_key || !school) {
          console.log("Missing session data");
          setCards([]);
          setLoading(false);
          return;
        }

        const response = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_roommates",
            user: user,
            signup_key: signup_key,
            school: school,
          }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Include ALL users - no filtering
          const transformedCards: Roommate[] = result.data.map((item: any) => ({
            id: parseInt(item.id) || Math.random(),
            user: item.whats || "User",
            gender: item.gender || "",
            religion: item.religion || "",
            level: item.level || "",
            department: item.faculty || "",
            move_in_date: item.availability || "",
            duration: item.duration || "",
            type: item.type || "",
            price: item.amount_share || "",
            features: item.hobby ? item.hobby.split(",").map((s: string) => s.trim()) : [],
            pet: item.pet || "",
            school: item.school || "",
            created_at: new Date().toISOString(),
            value: item.whats === user ? "You" : "100%",
          }));

          setCards(transformedCards);
        } else {
          console.log("No data found");
          setCards([]);
        }
      } catch (error) {
        console.error("Error fetching roommates:", error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [loginData]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (filters.gender && card.gender !== filters.gender) return false;
      if (filters.religion && card.religion !== filters.religion) return false;
      if (filters.level && card.level !== filters.level) return false;
      if (filters.department && card.department !== filters.department)
        return false;
      if (filters.moveIn && card.move_in_date !== filters.moveIn) return false;
      if (filters.duration && card.duration !== filters.duration) return false;
      if (filters.type && card.type !== filters.type) return false;
      if (filters.price && card.price !== filters.price) return false;
      return true;
    });
  }, [cards, filters]);

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCards.slice(start, start + itemsPerPage);
  }, [filteredCards, currentPage]);

  useEffect(() => setCurrentPage(1), [filters]);

  return (
    <div className="bg-[#F3EECE]">
      <section className="min-h-screen w-full">
        {/* Header */}
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-1 px-5 md:px-33 bg-[#3A2A05] pb-8 pt-8 text-white shadow">
          <div className="w-full">
            <div className="grid grid-cols-[1fr_auto] items-center gap-1">
              <div>
                <div className="text-md font-semibold text-[#FFA1A1]">
                  LISTINGS
                </div>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <h1 className="text-2xl md:text-4xl my-4 font-extrabold">
                    Available Roommates in{" "}
                    <span className="text-[#C2C8DA]">
                      {loginData?.school || "Your School"}
                    </span>
                  </h1>
                </div>
              </div>
              <div className="flex flex-col items-end md:hidden space-y-3">
                <button
                  onClick={() => navigate("/studentdash")}
                  className="justify-self-end cursor-pointer text-sm md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 font-md text-white"
                >
                  <MdOutlinePostAdd className="h-6 w-6 md:h-10 md:w-10" />
                  LIST SPACE
                </button>
                <button
                  className="justify-end gap-1 mt-3 cursor-pointer"
                  onClick={() => setShowAllFilters((v) => !v)}
                >
                  <span className="text-xs md:text-md text-[blue] p-1 bg-white rounded">
                    {showAllFilters ? "Hide filters" : "Show all Filter"} ›
                  </span>
                </button>
              </div>
            </div>

            {/* Main filters */}
            <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
              {mainFilters.map((field) => (
                <FilterSelect
                  key={field.key}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={filters[field.key as keyof typeof filters] as string}
                  options={field.options}
                  onChange={(value) =>
                    setFilters({ ...filters, [field.key]: value })
                  }
                />
              ))}
            </div>

            {/* Hidden filters */}
            {showAllFilters && (
              <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
                {hiddenFilters.map((field) => (
                  <FilterSelect
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={filters[field.key as keyof typeof filters] as string}
                    options={field.options}
                    onChange={(value) =>
                      setFilters({ ...filters, [field.key]: value })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex flex-col items-end space-y-5">
            <button
              onClick={() => navigate("/knowyou")}
              className="justify-self-end cursor-pointer text-sm md:text-lg inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15"
            >
              <MdOutlinePostAdd className="h-6 w-6 md:h-10 md:w-10" />
              LET'S KNOW YOU
            </button>
            <button
              className="inline-flex items-center justify-end gap-1 mt-3 cursor-pointer"
              onClick={() => setShowAllFilters((v) => !v)}
            >
              <span className="text-xs md:text-md text-[#0556F8] p-1 bg-white rounded">
                {showAllFilters ? "Hide filters" : "Show all Filter"} ›
              </span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A2A05] mx-auto"></div>
                <p className="mt-4 text-[#3A2A05]">Loading roommates...</p>
              </div>
            </div>
          ) : paginatedCards.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-xl text-[#3A2A05]">No roommates found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {paginatedCards.map((card, index) => {
                const isUserCard = index === 0 && card.value === "You";
                return (
                  <RoommateCard 
                    key={card.id} 
                    card={card}
                    bgColor={isUserCard ? "#EBD96B" : "#F4F6F5"}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-[#3A2A05] text-white rounded">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer bgColor="#3A2A05" iconBgColor="#EBD96B" />
    </div>
  );
}