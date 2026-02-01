import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import InfoPill, { DfButton } from "../../components/Pill";
import imgright from "../../assets/request.png";
import { Check } from "lucide-react";

import { FaMale, FaFemale, FaMoon, FaCross, FaBan } from "react-icons/fa";

/* ---------- CONSTANT OPTIONS ---------- */

const CATEGORY_OPTIONS = ["Entire Space", "Shared Space"];

const TYPE_OPTIONS = [
  "Room",
  "Room in a flat",
  "Self-contained room",
  "Room and parlor",
  "2 bedroom apartment",
  "3 bedroom apartment",
  "4 bedroom apartment",
  "5 bedroom apartment",
];

const SHOULD_HAVE_OPTIONS = [
  "Parking Space",
  "Fence",
  "Gate",
  "POP",
  "PVC",
  "Balcony",
  "WiFi",
  "AC",
  "TV",
  "Dstv",
  "Workspace",
  "Bed",
  "Wardrobe",
  "Ensuite Bathroom",
  "Kitchen Cabinet",
  "Fridge",
];

const MOVE_IN_OPTIONS = [
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

const BUDGET_OPTIONS = [
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

/* ---------- SMALL UI HELPERS ---------- */

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

function Label({ children }: React.PropsWithChildren) {
  return <div className="text-md my-3 font-semibold ml-8">{children}</div>;
}



/* ---------- REUSABLE COMPONENTS ---------- */

function IconButton({ active, children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
                    "w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center gap-1 rounded-lg p-3 border transition-all",
                    active ? "bg-[#CCAC13] border-[#CCAC13] text-white" : "bg-white border-black text-black"
                  )}
    >
      {children}
    </button>
  );
}

function Select({ label, value, setValue, options, placeholder }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <InfoPill className="bg-white">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-xs outline-none cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </InfoPill>
    </div>
  );
}

function TextInput({
  label,
  value,
  setValue,
  placeholder,
  disabled = false,
}: any) {
  return (
    <div>
      <Label>{label}</Label>
      <InfoPill className={clsx("bg-white", disabled && "opacity-50")}>
        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-xs outline-none"
        />
      </InfoPill>
    </div>
  );
}

/* ---------- MULTI SELECT (MAX 3, COLLAPSING) ---------- */

function MultiSelect({ label, options, value, setValue }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (opt: string) => {
    setValue((prev: string[]) => {
      if (prev.includes(opt)) return prev.filter((o) => o !== opt);
      if (prev.length >= 3) return prev;
      return [...prev, opt];
    });
  };

  return (
    <div ref={ref} className="relative">
      <Label>{label}</Label>
      <InfoPill
        className="bg-white cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="text-xs">
          {value.length === 0 ? "Priority features?" : value.join(", ")}
        </div>
      </InfoPill>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow max-h-48 overflow-y-auto">
          {options.map((opt: string) => {
            const selected = value.includes(opt);
            const disabled = !selected && value.length >= 3;
            return (
              <button
                key={opt}
                disabled={disabled}
                onClick={() => toggle(opt)}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-100",
                  selected && "font-semibold",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {opt}
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div className="pt-8 md:px-5">
      <h3 className="text-xl md:text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-xs md:text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 md:w-95 border-t-4 mx-auto text-[#0000004D]"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
        }}
      />
    </div>
  );
}

/* ---------- PAGE ---------- */

export default function Request() {
  const navigate = useNavigate();

  /* ---------- AUTH GUARD ---------- */
  useEffect(() => {
    const loginData = sessionStorage.getItem("login_data");
    if (!loginData) navigate("/login", { replace: true });
  }, [navigate]);

  /* ---------- FORM STATE ---------- */

  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [religion, setReligion] = useState<
    "christian" | "muslim" | "none" | ""
  >("");

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {


    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    if (
      !gender ||
      !religion ||
      !category ||
      !type ||
      !moveInDate ||
      !budget ||
      !location1
    ) {
      alert("Please complete all required fields");
      return;
    }

    const payload = {
      action: "post_request",
      user,
      signup_key,
      gender,
      religion,
      category,
      type,
      preferred_locations: [location1, location2].filter(Boolean),
      should_have: features,
      move_in_date: moveInDate,
      budget,
    };

    try {
      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");
      navigate("/studentdash");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img src={imgright} className="rounded-tl-4xl rounded-bl-4xl" />
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Request"
              caption="Post Request and Get Hostel Offers from Hosts"
            />

            <div className="px-5 pt-6 space-y-4">
              {/* Gender & Religion */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    <IconButton
                      active={gender === "male"}
                      onClick={() => setGender("male")}
                    >
                      <FaMale />
                    </IconButton>
                    <IconButton
                      active={gender === "female"}
                      onClick={() => setGender("female")}
                    >
                      <FaFemale />
                    </IconButton>
                  </div>
                </div>

                <div>
                  <Label>Religion</Label>
                  <div className="flex gap-2">
                    <IconButton
                      active={religion === "christian"}
                      onClick={() => setReligion("christian")}
                    >
                      <FaCross />
                    </IconButton>
                    <IconButton
                      active={religion === "muslim"}
                      onClick={() => setReligion("muslim")}
                    >
                      <FaMoon />
                    </IconButton>
                    <IconButton
                      active={religion === "none"}
                      onClick={() => setReligion("none")}
                    >
                      <FaBan />
                    </IconButton>
                  </div>
                </div>
              </div>

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Category"
                  value={category}
                  setValue={setCategory}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select Space category"
                />
                <Select
                  label="Type"
                  value={type}
                  setValue={setType}
                  options={TYPE_OPTIONS}
                  placeholder="Select Space type"
                />

                <TextInput
                  label="Pref. Location 1"
                  value={location1}
                  setValue={setLocation1}
                  placeholder="e.g. Yaba, Surulere"
                />

                <TextInput
                  label="Pref. Location 2"
                  value={location2}
                  setValue={setLocation2}
                  placeholder="Optional second location"
                  disabled={!location1}
                />

                <MultiSelect
                  label="Should Have"
                  options={SHOULD_HAVE_OPTIONS}
                  value={features}
                  setValue={setFeatures}
                />

                <Select
                  label="Move In Date"
                  value={moveInDate}
                  setValue={setMoveInDate}
                  options={MOVE_IN_OPTIONS}
                  placeholder="How soon?"
                />
              </div>

              <Select
                label="Budget"
                value={budget}
                setValue={setBudget}
                options={BUDGET_OPTIONS}
                placeholder="Select budget range"
              />

              <div className="flex justify-center pt-4">
                <DfButton onClick={handleSubmit} disabled={loading}>
                  {loading ? "Posting..." : "POST"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}