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
  FaChevronDown,
} from "react-icons/fa";
import InfoPill, { DfButton } from "../../components/Pill";
import clsx from "clsx"; // optional, for cleaner class merging
import Card from "../../components/Cards";
import Footer from "../../components/Footer";
import imgright from "../../assets/hero.jpg";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    price: 1,
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
    background: "bg-white",
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
    price: 800000,
    background: "bg-white",
    name: "Room in a flat",
    space: "100 sq ft",
    duration: "Yearly",
    type: "Self-contained",
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

export default function Hostelview() {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const location = useLocation();
  const space = location.state?.space;
  const id = space?.[0];
  const space_type = space?.[1];
  const [openModal, setOpenModal] = React.useState<
    null | "amenities" | "rules"
  >(null);

  const parseList = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
            src={imgright}
            alt="Guest relaxing"
            className="w-full h-full object-cover border-2 rounded-3xl"
          />
          <button className="text-xs md:text-base absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md">
            VIEW PHOTO
          </button>
        </section>

        {/* Right Section */}
        <section className="flex flex-col gap-2">
          {/* Top image (no button) */}
          <div className="relative hidden md:block w-full h-70">
            <img
              src={imgright}
              alt="Bunk bed view"
              className="w-full h-full object-cover border-2 rounded-3xl"
            />
          </div>

          {/* Bottom image (with button) */}
          <div className="relative w-full h-full">
            <iframe
              className="h-50 md:h-80 w-full object-cover border-2 rounded-3xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How It Works Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="text-xs md:text-base absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md">
              VIEW VIDEO
            </button>
          </div>
        </section>
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
                    3 units of “A room in a flat” (Furnished) is available
                    around IgPay for{" "}
                    <span className="font-extrabold">₦800,000</span> per 6
                    months
                  </InfoPill>
                </div>

                {/* Bedrooms & Toilets */}
                <div className="space-y-1">
                  <Label className="ml-8">Bedrooms and Toilets</Label>
                  <InfoPill className="text-xs md:text-base">
                    3 Bedroom : 2 Bathroom (1 Shared, 1 Ensuite)
                  </InfoPill>
                </div>

                {/* Security */}
                <div className="space-y-1">
                  <Label className="ml-8">Security</Label>
                  <InfoPill className="text-xs md:text-base">
                    Fenced &amp; Gate : Community Guard : Surveillance : Alarm :
                    Hostel guard
                  </InfoPill>
                </div>

                {/* Water */}
                <div className="space-y-1">
                  <Label className="ml-8">Water</Label>
                  <InfoPill className="text-xs md:text-base">
                    Borehole : Well : Clean : Running : Treated
                  </InfoPill>
                </div>

                {/* Grid pairs */}
                <div className="space-y-5 md:space-y-5">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Power Supply</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-2 text-xs md:text-sm">
                          Good supply
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Network Strength</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-2 text-xs md:text-sm">
                          Network Coverage
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Compound</Label>
                      <div>
                        <StarRow value={4} />
                        <div className="mt-2 text-xs md:text-sm">
                          Good &amp; Aesthetic
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Access Road</Label>
                      <div>
                        <StarRow value={4} />
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
                  className="mt-2 w-full border-t-4"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
                  }}
                />

                {/* Report / Share */}
                <div className="flex items-center justify-between mt-10">
                  <button className="inline-flex items-center text-sm gap-2 text-red-600  underline underline-offset-4">
                    <FaExclamationTriangle size={35} />
                    Report listing
                  </button>
                  <button className="inline-flex items-center gap-2 underline">
                    SHARE <FaShareAlt size={35} />
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
                    <FaMapMarkerAlt size={30} className="text-black" />
                    <span>Check Proximity to your Uni </span>
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
                      LANDLORD
                    </span>
                  </div>

                  <button className="inline-flex items-center md:gap-1 text-xs font-semibold">
                    <FaStar className="text-lg text-yellow-400" />{" "}
                    <span className="underline ml-3">1.2 (85)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* First InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Verification</Label>
                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <div className="inline-flex items-center justify-between w-full text-[11px]">
                        <span className="text-xs md:text-sm inline-flex items-center gap-2 rounded px-2 md:px-3 py-1 bg-black text-white ">
                          <FaShieldAlt size={14} /> TIER 1
                        </span>
                        <FaInfoCircle size={14} className="md:ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Second InfoPill */}
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">No. of Listings</Label>
                    <InfoPill className="px-3 md:px-base">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:pl-4 md:text-sm py-1">
                          26
                        </span>
                        <FaInfoCircle size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Joined</Label>
                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm text-start">
                        2 Months
                      </span>
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label className="ml-3 md:ml-8">Last Seen</Label>
                    <InfoPill className="px-3 md:pl-8 md:px-base">
                      <span className="text-xs md:text-sm">2 Months</span>
                    </InfoPill>
                  </div>
                </div>
              </div>
            </Maincard>

            {/* RENT */}
            <Maincard className="bg-[#CDBCEC] mt-10 pb-5">
              <SectionHeader title="Rent" />

              <div className="md:px-5 pb-6 pt-3 space-y-4">
                {/* Inspection fee row */}

                <div className="space-y-1">
                  <Label className="ml-8">Inspection Fee</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-xs md:text-sm py-1">₦800,000</span>
                      <div className="relative inline-flex items-center">
                        {/* Native select */}
                        <select className="appearance-none bg-transparen text-xs md:text-sm focus:outline-none pr-6 cursor-pointer">
                          <option>One Time Fee</option>
                          <option>Monthly Fee</option>
                          <option>Yearly Fee</option>
                        </select>

                        {/* Chevron icon */}
                        <FaChevronDown
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
                  <div className="rounded-2xl bg-white mx-1 border-1 md:p-3">
                    {[
                      ["Rent", "₦800,000 (yearly)"],
                      ["Caution", "₦80,000"],
                      ["Service Charge", "₦10,000 (weekly)"],
                      ["Agreement & Legal", "₦160,000"],
                      ["Agency Fee", "₦160,000"],
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
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 font-medium drop-shadow-lg">
                    <FaCalendarAlt className="text-black text-[20px] md:text-[25px]" />
                    <span className="text-lg md:text-2xl">Book Inspection</span>
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
                  <button className="text-lg md:text-2xl  w-full flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-5 font-medium drop-shadow-lg">
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
          <h1 className="font-semibold text-lg mb-6">OTHER HOSTELS</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {cards.map((c, i) => (
              <Card key={i} item={c} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <DfButton className="font-[300] py-3 px-7 text-[16px]">
              VIEW LISTING
            </DfButton>
          </div>
        </div>
      </section>

      <Footer />

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {openModal === "amenities" ? "All Amenities" : "House Rules"}
              </h3>

              <button
                onClick={() => setOpenModal(null)}
                className="text-sm underline"
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
    </div>
  );
}
