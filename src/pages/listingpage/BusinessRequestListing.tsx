import { Search, ChevronDown } from "lucide-react";

import { useState } from "react";
import Footer from "../../components/Footer";
import { FaRegCircle } from "react-icons/fa";
import { MdIosShare, MdOutlineMan4, MdOutlinePostAdd } from "react-icons/md";
import { CgCross } from "react-icons/cg";

const baseFilters = [
  { label: "Institution", value: "Select as applied" },
  { label: "Category", value: "Select Space Type" },
  { label: "Type", value: "Around Where?" },
  { label: "Gender", value: "Select price range" },
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

export default function BusinessListing() {
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div className="bg-[#F3EDFE]">
      <section className="min-h-screen w-full ">
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#1C0B3D] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
            <div className="text-md font-semibold text-[#FFA1A1]">REQUESTS</div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold ">
                Available Requests in{" "}
                <span className="text-[#C2C8DA]">Lagos State</span>
              </h1>

              <button className="inline-flex items-center gap-2 rounded-lg border-2 px-3 py-4 text-lg font-md text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/15">
                <div className="flex h-6 w-6 items-center justify-center rounded-md">
                  <MdOutlinePostAdd className="h-10 w-10" />
                </div>
                LIST SPACE
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
            <div className="min-h-[260px] flex items-center justify-center md:p-6 bg-[#f5f0fb]">
              {/* Outer rounded container with thick border */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="w-full rounded-4xl border-4 border-gray-800/90 bg-[#F4F6F5] py-6 px-4 md:px-10 shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: location + green pill */}
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-2">
                        <FaRegCircle className="text-xs md:text-sm" />
                        <span className="font-semibold tracking-wide text-sm md:text-base">
                          LASU
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
                  <div className="mt-2 flex items-center gap-3 pr-2 pl-3">
                    <span className="text-[12px]">Posted 7 days ago</span>
                    <span className="flex items-center ml-auto gap-3">
                      <MdOutlineMan4 className="text-3xl rounded-full p-1 bg-white"/>
                      <CgCross className="text-3xl rounded-full p-1 bg-white"/>
                      <span className="text-[12px] rounded-md p-1 bg-white">2 days ago</span>
                    </span>
                  </div>

                  {/* message bubble */}
                  <div className="mt-4 p-2 bg-[#FFFFFF] rounded-3xl text-xs md:text-sm leading-relaxed">
                    <p>
                      A Male Student needs a{" "}
                      <span className="font-bold">2 Bedroom</span> apartment
                      with <span className="font-semibold">POP Ceiling</span>{" "}
                      around{" "}
                      <span className="font-semibold">
                        WEST END, SAFARI or SCHOOL ROAD
                      </span>
                      .
                      <br />
                      <span className="font-bold">
                        Budget: (500,000 - 750,000)
                      </span>
                      <br />
                      Looking to Move-in on or before{" "}
                      <span className="font-bold">Sept 2025</span>.
                    </p>
                  </div>

                  {/* bottom row: share, reply button */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="underline text-sm md:text-md text-[#2563eb]">SHARE</span>
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
