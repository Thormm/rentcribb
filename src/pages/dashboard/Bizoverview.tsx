import { useState } from "react";
import { FiCamera, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import clsx from "clsx";
import InfoPill from "../../components/Pill"; // pill component
import { BsQuestionCircle } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";


// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx("text-md pl-8 my-2 font-semibold text-black", className)}
    >
      {children}
    </div>
  );
}

type Plan = {
  tag: string;
  features1: string[][];
  features2?: string[][];
};

// Mock plan data
const plans: Record<string, Plan> = {
  TIER1: {
    tag: "TIER1 : Post Up to 3 Listings",
    features1: [
      ["Verify Business Email", ""],
      ["Verify Business Phone", "Pending"],
      ["Business Address", "Pending"],
      ["Business Description", "Pending"],
      ["Attestation", "Pending"],
    ],
    features2: [
      ["Email Verification", ""],
      ["Call no. Verification", "Pending"],
      ["Next of Kin", "Pending"],
      ["Residential Address", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
  TIER2: {
    tag: "TIER2 : Post Up to 15 Listings",
    features1: [
      ["ID Verificaiton", "Pending"],
      ["Face Verificaiton", "Pending"],
      ["Address Verificaiton", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
  TIER3: {
    tag: "TIER3 : Post Unlimited Listings",
    features1: [
      ["CAC Verification", "Pending"],
      ["Supporting Doc.", "Pending"],
      ["Review Name", "Pending"],
      ["Posting Request", "Pending"],
      ["Attestation", "Pending"],
    ],
  },
};

// Header with help icon
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold">Hola, {title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-sm pt-5">
        Our goal is for your{" "}
        <span className="text-[#FFA1A1] font-semibold">SCHOOL LIFE</span> to be{" "}
        <span className="text-[#FFA1A1] font-semibold">MADE SOFT</span>
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

// Tabs component
const tabs = ["Profile", "Verify Business", "Operations", "Reviews"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex mt-5 border-2 py-4 rounded-xl relative overflow-hidden"
      style={{
        borderStyle: "dashed",
        borderColor: "#0000004D",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : ""
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

const Bizoverview = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [activePlan, setActivePlan] = useState<keyof typeof plans>("TIER1");
  const current = plans[activePlan];
  const [whatsapp, setWhatsapp] = useState("08078436972");
  const [stateValue, setStateValue] = useState(""); // store state code/name
  const [address, setAddress] = useState("");

  const states = [
    { value: "", label: "Select State" },
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "rivers", label: "Rivers" },
    // add more as needed
  ];

  const handleSave = () => {
    const payload = {
      whatsapp,
      state: stateValue,
      address,
    };
    console.log("Save profile:", payload);
  };

  return (
    <div className="bg-white py-10">
      <section className="px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title="Zarken" />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Content */}
            {activeTab === "Profile" && (
              <div className="p-5 w-2/3">
                {/* Avatar Upload - left aligned */}
                <div className="flex justify-start my-10 pl-5">
                  <div className="h-24 w-24 rounded-full border border-black bg-white flex items-center justify-center">
                    <FiCamera className="text-black" size={35} />
                  </div>
                </div>

                {/* Inputs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>BUSINESS NAME</Label>
                    <InfoPill>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Area, City, Postal"
                        className="w-full outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>ABOUT</Label>
                    <InfoPill className="bg-white">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Area, City, Postal"
                        className="w-full outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>
                  {/* Row 2 */}
                  <div>
                    <Label>CALL NUMBER</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  <div>
                    <Label>WHATSAPP NO</Label>
                    <InfoPill className="flex items-center justify-between">
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="08078436972"
                        className="flex-1 outline-none py-1 rounded-md text-black"
                      />
                      <FiCheckCircle className="text-gray-400 ml-2" size={20} />
                    </InfoPill>
                  </div>

                  {/* Row 3 - Email full width */}
                  <div className="md:col-span-2">
                    <Label>BUSINESS EMAIL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">26</span>
                        <RiInformationLine size={14} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* Row 4 - Full Address */}
                  <div className="md:col-span-2">
                    <Label>BUSINESS ADDRESS</Label>
                    <InfoPill className="bg-white">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Area, City, Postal"
                        className="w-full outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 5 - State and Landmark */}
                  <div className="md:col-span-2">
                    <Label>STATE</Label>
                    <InfoPill className="relative flex items-center bg-white">
                      <select
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        className="appearance-none w-full bg-transparent outline-none py-1 text-black"
                      >
                        <option value="">{states[0].label}</option>
                        {states
                          .filter((s) => s.value !== "")
                          .map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-5 text-gray-500" />
                    </InfoPill>
                  </div>
                </div>

                {/* Save Changes */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleSave}
                    className="py-3 text-md px-4 font-medium bg-black shadow-lg rounded-lg"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            )}

            {/* Verify Business Tab */}
            {activeTab === "Verify Business" && (
              <div className="p-5 w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  {/* Current Verification Level */}
                  <div className="md:col-span-2">
                    <Label>CURRENT VERIFICATION LEVEL</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-md py-1">{current.tag}</span>
                        <RiInformationLine size={25} className="ml-auto" />
                      </div>
                    </InfoPill>
                  </div>

                  {/* KYC Tiers */}
                  <div className="md:col-span-2">
                    <Label>KYC TIERS</Label>
                    <div
                      className="grid grid-cols-3 gap-4 mt-5 bg-white p-3 rounded-lg"
                      style={{
                        borderStyle: "dashed",
                        borderColor: "#0000004D",
                        borderWidth: "1px",
                      }}
                    >
                      {(
                        ["TIER1", "TIER2", "TIER3"] as (keyof typeof plans)[]
                      ).map((tier, i) => {
                        const isActive = activePlan === tier;
                        return (
                          <button
                            key={tier}
                            onClick={() => setActivePlan(tier)}
                            className={clsx(
                              "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors duration-200 border",
                              isActive
                                ? "bg-black text-[#D6FFC3] border-black shadow-md"
                                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                            )}
                          >
                            <MdVerified />
                            <span className="text-lg">{`TIER ${i + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Features 1 */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 mt-10 mb-5">
                    <span className="text-md font-medium text-black tracking-wide">
                      --- REQUIREMENTS ----------------------------
                    </span>
                  </div>

                  {/* Features 2 (only for TIER1) */}
                  {current.features2 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                        <div className="md:col-span-2">
                          <div className="rounded-2xl bg-white text-black mx-1 border p-3 shadow-sm">
                            {current.features2.map(([label2, value2]) => (
                              <div
                                key={label2}
                                className="flex items-center justify-between py-2 px-4 text-md"
                              >
                                <span>{label2}</span>
                                <span className="inline-flex items-center gap-2">
                                  {value2} <RiInformationLine size={20} />
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 flex justify-center">
                        <button
                          onClick={handleSave}
                          className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                        >
                          UPDATE
                        </button>
                      </div>
                    </>
                  )}

                  <div className="rounded-2xl bg-white text-black mx-1 mt-10 border p-3 shadow-sm">
                    {current.features1.map(([label1, value1]) => (
                      <div
                        key={label1}
                        className="flex items-center justify-between py-2 px-4 text-md"
                      >
                        <span>{label1}</span>
                        <span className="inline-flex items-center gap-2">
                          {value1} <RiInformationLine size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update button */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleSave}
                    className="py-3 text-md px-6 font-medium bg-black text-white shadow-lg rounded-lg hover:bg-gray-900"
                  >
                    UPGRADE
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Operations" && <div></div>}
            {activeTab === "Reviews" && (
              <div className="p-5 mt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-2/3">
                  {/* --- STATS ROW (TOTAL + TOP BOOKINGS) --- */}
                  <div className="col-span-2">
                    {/* Row 1: Labels */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <Label>TOTAL</Label>
                    </div>

                    {/* Row 2: Circle + Bars */}
                    <div className="flex items-center gap-8">
                      {/* TOTAL Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-medium text-black">
                            70
                          </span>
                        </div>
                      </div>
{/* TOP BOOKINGS */}
<div className="flex-1 space-y-3">
  {[5, 4, 3, 2, 1].map((count, i) => (
    <div key={i} className="flex items-center gap-3">
      {/* Stars right aligned */}
      <div className="w-28 flex justify-end">
        <div className="flex justify-end w-full">
          {Array.from({ length: count }).map((_, j) => (
            <AiFillStar key={j} className="text-yellow-500 text-lg" />
          ))}
        </div>
      </div>

      {/* Progress bar stays untouched */}
      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black"
          style={{ width: `${count * 20}%` }}
        />
      </div>
    </div>
  ))}
</div>
                    </div>
                  </div>
                </div>
                <div>
                  {/* Reviews Filters */}
                  <div className="md:col-span-2">
                    <Label>REVIEWS FILTERS</Label>
                    <div
                      className="grid grid-cols-5 gap-4 mt-5 bg-white p-3 rounded-lg"
                      style={{
                        borderStyle: "dashed",
                        borderColor: "#0000004D",
                        borderWidth: "1px",
                      }}
                    >
                      {[
                        "ALL (100)",
                        "5 STAR (108)",
                        "4 STAR (108)",
                        "3 STAR (108)",
                        "2 STAR (108)",
                        "1 STAR (108)",
                      ].map((filter, i) => (
                        <span
                          key={i}
                          className={clsx(
                            "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold border bg-white text-black border-gray-300 shadow-sm"
                          )}
                        >
                          <span className="text-sm">{filter}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bizoverview;
