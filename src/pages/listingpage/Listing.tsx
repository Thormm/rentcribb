import {
  Search,
  SquarePlus,
  ChevronDown,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Medal,
} from "lucide-react";

import { useState } from "react";

import logo from "../../assets/logo.png";

const baseFilters = [
  { label: "Category", value: "Select as applied" },
  { label: "Type", value: "Select Space Type" },
  { label: "Location", value: "Around Where?" },
  { label: "Price", value: "Select price range" },
];

const extraFilters = [
  { label: "Amenities", value: "Select amenities" },
  { label: "Gender", value: "Select gender" },
  { label: "Furnishing", value: "Select furnishing" },
  { label: "Tenure", value: "Select duration" },
];

const cards = [
  {
    tier: 1,
    rating: 4.2,
    reviews: 527,
    title: "A room and parlor (New) is available",
    location: "Safari Agbeke",
    price: "₦800,000 per Session",
    border: "ring-0",
  },
  {
    tier: 2,
    rating: 3.2,
    reviews: 27,
    title: "A Room Selfcontain (New) is available",
    location: "around PAYE for a Split Amount of",
    price: "200,000 per Year.",
    border: "ring-2 ring-purple-400",
  },
  {
    tier: 3,
    rating: 4.2,
    reviews: 527,
    title: "3 units of ‘A room in a flat’ (Furnished)",
    location: "is available around PAYE for",
    price: "₦800,000 per 9months",
    border: "ring-0",
  },
];

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-white pb-2 pl-4">{label}</span>
      <button className="group w-50 inline-flex items-center justify-between gap-2 rounded-full bg-white/95 px-4 py-4 text-xs text-gray-700 shadow-sm ring-1 ring-white/20 hover:bg-white">
        <span className="truncate opacity-90">{value}</span>
        <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" />
      </button>
    </div>
  );
}

function TierBadge({ n }: { n: number }) {
  return (
    <div>
      <span>
        <User className="h-4 w-4" />
      </span>
      <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
        <Medal className="h-3.5 w-3.5" />
        <span className="font-medium">TIER {n}</span>
      </span>
    </div>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="inline-flex items-center gap-2 text-[13px] text-gray-700">
      <div className="inline-flex items-center gap-1">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-semibold">{value}</span>
        <span className="opacity-70">({reviews})</span>
      </div>
    </div>
  );
}

function Card({ item }: { item: (typeof cards)[number] }) {
  return (
    <div
      className={`relative rounded-2xl bg-white p-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${item.border}`}
    >
      {/* image placeholder with shuttle buttons */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <button className="grid h-7 w-7 place-items-center rounded-full bg-black/80 text-white ring-1 ring-black/60">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="grid h-7 w-7 place-items-center rounded-full bg-black/80 text-white ring-1 ring-black/60">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* meta row */}
      <div className="mt-3 flex items-center justify-between">
        <TierBadge n={item.tier} />
        <Rating value={item.rating} reviews={item.reviews} />
      </div>

      {/* description */}
      <p className="mt-3 text-[13px] leading-5 text-gray-700">
        {item.title} <span className="font-semibold">{item.location}</span> for
        <br />
        <span className="font-semibold">{item.price}</span>
      </p>
    </div>
  );
}

export default function Listing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="relative flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        {/* Left side (desktop links) */}
        <div className="hidden space-x-6 text-gray-700 md:flex">
          <a href="/products" className="hover:text-black">
            Products
          </a>
          <a href="/rent" className="hover:text-black">
            /Rent
          </a>
        </div>

        {/* Center Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Cribb.Africa Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-extrabold">Cribb.Africa</h1>
        </div>

        {/* Right (desktop links + login) */}
        <div className="hidden items-center space-x-6 md:flex">
          <a href="/about" className="hover:text-black">
            About Us
          </a>
          <button className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
            LOGIN
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center text-gray-800 md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Overlay Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute right-0 top-0 flex h-full w-2/3 flex-col bg-white p-6">
              {/* Close Button */}
              <button
                className="mb-8 self-end"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="h-7 w-7 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Menu Items */}
              <div className="flex flex-col items-center space-y-6 text-lg font-medium">
                <a href="/products" onClick={() => setIsMenuOpen(false)}>
                  Products
                </a>
                <a href="/rent" onClick={() => setIsMenuOpen(false)}>
                  /Rent
                </a>
                <a href="/about" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </a>
                <button className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800">
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="min-h-screen w-full ">
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
            <div className="text-[11px] font-semibold tracking-[0.2em] text-[#FFA1A1]">
              LISTINGS
            </div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-3xl my-4 font-bold ">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">Lasu</span>
              </h1>

              <button className="inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <div className="flex h-6 w-6 items-center justify-center rounded-md">
                  <SquarePlus className="h-4 w-4" />
                </div>
                POST A REQUEST
              </button>
            </div>
            <div className="grid grid-cols-[80%_20%] items-end">
              <div>
                {/* extra filters below when toggled */}
                {showAllFilters && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {extraFilters.map((f) => (
                      <Pill key={f.label} label={f.label} value={f.value} />
                    ))}
                  </div>
                )}
                {/* first four dropdowns */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-4 md:grid-cols-4">
                  {baseFilters.map((f) => (
                    <Pill key={f.label} label={f.label} value={f.value} />
                  ))}
                </div>
              </div>

              {/* actions + search */}
              <div className="flex items-center justify-end gap-4 md:col-span-1">
                <div className="grid grid-cols-1 ">
                  <div>
                    <button className="text-[red] text-xs">Clear Filter</button>
                  </div>
                  <div>
                    {" "}
                    <button
                      className="inline-flex items-center gap-1 mt-3"
                      onClick={() => setShowAllFilters((v) => !v)}
                    >
                      <span className="text-sm text-[blue]">
                        {showAllFilters ? "Hide filters" : "Show all Filter"}
                      </span>
                      <span className="text-sm text-[blue] leading-none ">
                        ›
                      </span>
                    </button>
                  </div>
                </div>
                <button className="grid h-15 w-15 place-items-center rounded-full border-white  border-2 bg-gradient-to-tr from-[#C6B0EF] to-[#4600C8] shadow-lg ring-1 ring-white/20">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Cards (no overlap into header) */}
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cards.map((c, i) => (
              <Card key={i} item={c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
