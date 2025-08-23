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
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
    border: "bg-white",
  },
  {
    tier: 2,
    rating: 3.2,
    reviews: 27,
    title: "A Room Selfcontain (New) is available",
    location: "around PAYE for a Split Amount of",
    price: "200,000 per Year.",
    border: "bg-[#CDBCEC]",
  },
  {
    tier: 3,
    rating: 4.2,
    reviews: 527,
    title: "3 units of ‘A room in a flat’ (Furnished)",
    location: "is available around PAYE for",
    price: "₦800,000 per 9months",
    border: "bg-white",
  },
];

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-md font-bold text-white pb-2 pl-6">{label}</span>
      <button className="group w-50 inline-flex items-center justify-between gap-2 rounded-full bg-white/95 px-6 py-5 text-sm text-gray-700 shadow-sm ring-1 ring-white/20 hover:bg-white">
        <span className="truncate opacity-90">{value}</span>
        <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" />
      </button>
    </div>
  );
}

function TierBadge({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* User icon */}
      <User className="h-5 w-5" />

      {/* Tier badge */}
      <span className="inline-flex items-center gap-1 rounded-md bg-black px-2 py-0.5 text-xs text-[white]">
        <Medal className="h-3.5 w-3.5 text-yellow-500" />
        <span className="text-xs font-semibold py-1 px-2">TIER {n}</span>
      </span>
    </div>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="inline-flex items-center gap-2 text-md">
      <div className="inline-flex items-center gap-1">
        <Star className="h-4 w-4 text-[orange]" />
        <span className="font-semibold">{value}</span>
        <span className="opacity-70">({reviews})</span>
      </div>
    </div>
  );
}

function Card({ item }: { item: (typeof cards)[number] }) {
  return (
    <div
      className={`w-80 rounded-2xl border-3 p-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${item.border}`}
    >
      {/* image placeholder with shuttle buttons */}
      <div className="relative h-70 border-3 w-full overflow-hidden rounded-xl bg-gray-100">
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

      <div className="border-t-2 border-dashed border-gray-400 my-2"></div>


      {/* description */}
      <p className="mt-3 text-md text-center">
        {item.title} <span className="font-semibold">{item.location}</span> for {" "}
        <span className="font-semibold">{item.price}</span>
      </p>
    </div>
  );
}

export default function Listing() {
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div className="bg-[#F3EDFE]">
      <Navbar />

      <section className="min-h-screen w-full ">
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
            <div className="text-md font-semibold tracking-[0.2em] text-[#FFA1A1]">
              LISTINGS
            </div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold ">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">Lasu</span>
              </h1>

              <button className="inline-flex items-center gap-2 rounded-lg border-2 px-3 py-4 text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <div className="flex h-6 w-6 items-center justify-center rounded-md">
                  <SquarePlus className="h-10 w-10" />
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
                    <button className="text-[red] text-md">
                      Clear Filter{" "}
                      <span className="text-md text-[red] leading-none ">
                        ›
                      </span>
                    </button>
                  </div>
                  <div>
                    {" "}
                    <button
                      className="inline-flex items-center gap-1 mt-3"
                      onClick={() => setShowAllFilters((v) => !v)}
                    >
                      <span className="text-md text-[blue]">
                        {showAllFilters ? "Hide filters" : "Show all Filter"}
                      </span>
                      <span className="text-md text-[blue] leading-none ">
                        ›
                      </span>
                    </button>
                  </div>
                </div>
                <button className="grid h-20 w-20 place-items-center rounded-full border-white  border-2 bg-gradient-to-tr from-[#C6B0EF] to-[#4600C8] shadow-lg ring-1 ring-white/20">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Cards (no overlap into header) */}
        <div className="w-full max-w-6xl px-4 pb-16 pt-6 mx-auto">
  <div className="flex flex-wrap justify-center gap-6 space-x-6">
    {cards.map((c, i) => (
      <Card key={i} item={c} />
    ))}
  </div>
</div>


      </section>

      <Footer />
    </div>
  );
}
