import {
  Star,
  StarOff,
  Info,
  AlertTriangle,
  Share2,
  Calendar,
  ShieldCheck,
  User,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Card from "../../components/Cards";

type CardItemA = {
  background: string;
  tier: number;
  rating: number;
  reviews: number;
  title: string;
  location: string;
  price: string;
};

const cards: CardItemA[] = [
  {
    tier: 1,
    rating: 4.2,
    reviews: 527,
    title: "A room and parlor (New) is available",
    location: "Safari Agbeke",
    price: "₦800,000 per Session",
    background: "bg-white",
  },
  {
    tier: 2,
    rating: 3.2,
    reviews: 27,
    title: "A Room Selfcontain (New) is available",
    location: "around PAYE for a Split Amount of",
    price: "200,000 per Year.",
    background: "bg-white",
  },
  {
    tier: 3,
    rating: 4.2,
    reviews: 527,
    title: "3 units of ‘A room in a flat’ (Furnished)",
    location: "is available around PAYE for",
    price: "₦800,000 per 9months",
    background: "bg-white",
  },
];

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
      <h3 className="text-4xl font-medium text-center">{title}</h3>
      <p className="text-center text-md pt-3">
        Check out the Features of this Hostel
      </p>
      <div
        className="mt-1 w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

import InfoPill, { DfButton } from "../../components/Pill";

import clsx from "clsx"; // optional, for cleaner class merging

type LabelProps = React.PropsWithChildren<{
  className?: string;
}>;

function Label({ children, className }: LabelProps) {
  return (
    <div className={clsx("text-md my-5 font-semibold ml-0", className)}>
      {children}
    </div>
  );
}

function StarRow({ value = 4 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <Star key={i} size={25} fill="currentColor" />
        ) : (
          <StarOff key={i} size={25} />
        )
      )}
    </div>
  );
}

import Footer from "../../components/Footer";
import imgright from "../../assets/hero.jpg";

export default function Hostelview() {
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
                <span className="text-[#C2C8DA]">Lasu</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-15 mx-12 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-2 p-6 pt-0 bg-[#f5f5f7]">
        {/* Left Section */}
        <section className="relative w-full h-full">
          <img
            src={imgright}
            alt="Guest relaxing"
            className="w-full h-full object-cover border-2 rounded-3xl"
          />
          <button className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-7 py-4 font-semibold rounded-lg shadow-md">
            VIEW PHOTO
          </button>
        </section>

        {/* Right Section */}
        <section className="flex flex-col gap-2">
          {/* Top image (no button) */}
          <div className="relative w-full h-70">
            <img
              src={imgright}
              alt="Bunk bed view"
              className="w-full h-full object-cover border-2 rounded-3xl"
            />
          </div>

          {/* Bottom image (with button) */}
          <div className="relative w-full h-full">
            <iframe
              className="md:h-80 w-full h-70 object-cover border-2 rounded-3xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How It Works Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-7 py-4 font-semibold rounded-lg shadow-md">
              VIEW VIDEO
            </button>
          </div>
        </section>
      </section>

      <section className="bg-[#F3EDFE] my-20">
        <div className="mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}
          <div className="space-y-1">
            {/* HOSTEL VIEW */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hostel View" />

              <div className="px-5 pb-4 pt-3 space-y-4">
                {/* Description */}
                <div className="space-y-1">
                  <Label className="ml-8">Description</Label>
                  <InfoPill>
                    3 units of “A room in a flat” (Furnished) is available
                    around IgPay for{" "}
                    <span className="font-extrabold">₦800,000</span> per 6
                    months
                  </InfoPill>
                </div>

                {/* Bedrooms & Toilets */}
                <div className="space-y-1">
                  <Label className="ml-8">Bedrooms and Toilets</Label>
                  <InfoPill>
                    3 Bedroom : 2 Bathroom (1 Shared, 1 Ensuite)
                  </InfoPill>
                </div>

                {/* Security */}
                <div className="space-y-1">
                  <Label className="ml-8">Security</Label>
                  <InfoPill>
                    Fenced &amp; Gate : Community Guard : Surveillance : Alarm :
                    Hostel guard
                  </InfoPill>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <Label className="ml-8">Water</Label>
                  <InfoPill>
                    Borehole : Well : Clean : Running : Treated
                  </InfoPill>
                </div>

                {/* Grid pairs */}
                <div className="">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Power Supply</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-3 text-md">Good supply</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Network Strength</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-3 text-md">Network Coverage</div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Compound</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-3 text-md">Good &amp; Aesthetic</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Access Road</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-3 text-md">
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
                      <span className="text-sm mt-1">12/Aug/2025</span>
                    </div>
                  </div>

                  {/* Right: Amenities Link */}
                  <div className="w-1/2 ml-5">
                    <button className="text-md text-[#0556F8] underline underline-offset-4">
                      See All Amenities &gt;&gt;
                    </button>
                  </div>
                </div>

                {/* View House Rules */}
                <div className="pt-2 w-full">
                  <button className="w-full rounded-full bg-[#FFFFFF] px-5 py-5 text-xl drop-shadow-lg">
                    View House Rules
                  </button>
                </div>

                <div
                  className="mt-3 w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                  }}
                />

                {/* Report / Share */}
                <div className="flex items-center justify-between mt-10">
                  <button className="inline-flex items-center text-sm gap-2 text-red-600  underline underline-offset-4">
                    <AlertTriangle size={35} />
                    Report listing
                  </button>
                  <button className="inline-flex items-center gap-2 underline">
                    SHARE <Share2 size={35} />
                  </button>
                </div>
              </div>
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
                    <MapPin size={30} className="text-black" />
                    <span>Check Proximity to your Uni </span>
                  </button>
                </div>

                <div
                  className="mt-8 w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
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

              <div className="px-5 pb-5 pt-3">
                {/* Host row */}
                <Label className="ml-8">Host</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-xl border-3 px-2 py-3">
                    <div className="place-items-center">
                      <User size={30} />
                    </div>
                    <span className="font-semibold text-xl mr-35">
                      LANDLORD
                    </span>
                  </div>

                  <button className="inline-flex items-center gap-1 text-xs font-semibold">
                    <Star /> <span className="underline ml-3">1.2 (85)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* First InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-8">Verification</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full text-[11px]">
                        <span className="inline-flex items-center gap-2 rounded px-3 py-1 bg-black text-white ">
                          <ShieldCheck size={14} /> TIER 1
                        </span>
                        <Info size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Second InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-8">No. of Listings</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <Info size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-8">How long on Cribb</Label>
                    <InfoPill>2 Months</InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label className="ml-8">Last Seen</Label>
                    <InfoPill>2 Days Ago</InfoPill>
                  </div>
                </div>
              </div>
            </Maincard>

            {/* RENT */}
            <Maincard className="bg-[#CDBCEC] mt-10 pb-5">
              <SectionHeader title="Rent" />

              <div className="px-5 pb-6 pt-3 space-y-4">
                {/* Inspection fee row */}

                <div className="space-y-1">
                  <Label className="ml-8">Inspection Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-md py-1">₦800,000</span>
                      <div className="relative inline-flex items-center">
                        {/* Native select */}
                        <select className="appearance-none bg-transparent text-sm focus:outline-none pr-6 cursor-pointer">
                          <option>One Time Fee</option>
                          <option>Monthly Fee</option>
                          <option>Yearly Fee</option>
                        </select>

                        {/* Chevron icon */}
                        <ChevronDown
                          size={16}
                          className="absolute right-0 pointer-events-none text-gray-600"
                        />
                      </div>
                    </div>
                  </InfoPill>
                </div>

                {/* Breakdown */}
                <div className="space-y-1">
                  <Label className="ml-8">Rent Breakdown</Label>
                  <div className="rounded-2xl bg-white mx-1 border-1 p-3">
                    {[
                      ["Rent", "₦800,000 (yearly)"],
                      ["Caution", "₦80,000"],
                      ["Service Charge", "₦10,000 (weekly)"],
                      ["Agreement & Legal", "₦160,000"],
                      ["Agency Fee", "₦160,000"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 px-4 text-md"
                      >
                        <span>{label}</span>
                        <span className="inline-flex items-center gap-2">
                          {value} <Info size={25} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="space-y-1">
                  <Label className="ml-8">Total Package</Label>
                  <InfoPill>
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-lg py-1 font-bold">₦1,200,000</span>
                    </div>
                  </InfoPill>
                </div>

                {/* Book inspection */}
                <div className="pt-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <Calendar size={30} className="text-black" />
                    <span>Book Inspection</span>
                  </button>
                </div>

                <div
                  className="mt-1 w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                  }}
                />

                <div className="w-full flex flex-col items-center text-center">
                  {/* Terms */}
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

                <div className="pt-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-5 text-3xl font-medium drop-shadow-lg">
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
                <div className="mt-4 space-y-5 text-md text-white leading-relaxed">
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
