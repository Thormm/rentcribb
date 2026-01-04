import { ChevronDown } from "lucide-react";
import { DfButton } from "../../components/Pill";
import { useState } from "react";
import Footer from "../../components/Footer";
import Card from "../../components/Cards";
import { HiOutlineUserCircle } from "react-icons/hi";
import { GrSearch } from "react-icons/gr";

type CardItemA = {
  background: string;
  tier: number;
  rating: number;
  reviews: number;
  title: string;
  location: string;
  price: number;
  name: string;
  space: string;
  duration: string;
  type: string;
};

const cards: CardItemA[] = [
  {
    tier: 1,
    rating: 4.2,
    reviews: 527,
    title: "A room and parlor (New) is available",
    location: "Safari Agbeke",
    price: 800000,
    background: "bg-white",
    name: "Room and Parlor",
    space: "100 sq ft",
    duration: "Yearly",
    type: "Self-contained",
  },
  {
    tier: 2,
    rating: 3.2,
    reviews: 27,
    title: "A Room Selfcontain (New) is available",
    location: "around PAYE for a Split Amount of",
    price: 200000,
    background: "bg-[#CDBCEC]",
    name: "Room Selfcontain",
    space: "100 sq ft",
    duration: "Yearly",
    type: "Self-contained",
  },
  {
    tier: 3,
    rating: 4.2,
    reviews: 527,
    title: "3 units of ‘A room in a flat’ (Furnished)",
    location: "is available around PAYE for",
    background: "bg-white",
    price: 200000,
    name: "Room Selfcontain",
    space: "100 sq ft",
    duration: "Yearly",
    type: "Self-contained",
  },
];

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

export default function Hostpage() {
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div className="bg-[#F3EDFE]">
      <section className="min-h-screen w-full ">
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
            <div className="text-md font-semibold text-[#FFA1A1]">LISTINGS</div>

            <div className="mt-1 flex items-end justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold leading-relaxed ">
                Available Listings From{" "}
                <span className="text-[#C2C8DA]">Lasu <br/> AYsmart Property & Investment</span>

              </h1>

              <button className="inline-flex items-center gap-2 rounded-xl border-3 pl-2 py-1 pr-12 text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <div className="flex h-12 w-12 items-center justify-center">
                  <HiOutlineUserCircle className="h-10 w-10" />
                </div>
                AGENT
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
                      <span className="text-md text-[blue] underline">
                        {showAllFilters ? "Hide filters" : "Show all Filter"}
                      </span>
                      <span className="text-md text-[blue] leading-none ">
                        ›
                      </span>
                    </button>
                  </div>
                </div>
                <button className="grid h-20 w-20 place-items-center rounded-full border-white  border-2 bg-gradient-to-tr from-[#C6B0EF] to-[#4600C8] shadow-lg ring-1 ring-white/20">
                  <GrSearch className="h-10 w-10" />
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
<section className="bg-[#CDBCEC] my-20 rounded-4xl border-4">
        {/* SECTION 2: Cards (no overlap into header) */}
        <div className="w-full max-w-6xl px-4 pb-16 pt-6 mx-auto">
          <h1 className="font-semibold text-lg">OTHER HOSTELS</h1>
          <div className="flex flex-wrap justify-center gap-6 space-x-6">
            {cards.map((c, i) => (
              <Card key={i} item={c} />
            ))}
          </div>

          <div className="flex justify-center mt-15">
            <DfButton className="font-[300px] py-3 px-7 text-[16px]">VIEW LISTING</DfButton>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
