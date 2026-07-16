import React, { useEffect, useState } from "react";
import { useAlert } from "../../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill, { DfButton } from "../../../components/Pill";
import imgright from "../../../assets/request.png";
import { IoIosArrowDown } from "react-icons/io";
import { FaMale, FaFemale, FaMoon, FaCross } from "react-icons/fa";

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
  "Fenced",
  "Gated",
  "POP",
  "PVC",
  "Balcony",
  "WiFi",
  "AC",
  "Netflix",
  "PS4 Console",
  "TV",
  "Dstv",
  "Cable",
  "Desk lamp",
  "Ceiling Fan",
  "Cushion Chair",
  "Table",
  "Desk",
  "Workspace",
  "Bed",
  "Double bed",
  "Bed Frame",
  "Side drawer",
  "Bedsheet",
  "Mirror",
  "Vanity table",
  "Lock on bedroom door",
  "Pillow",
  "Wardrobe",
  "Hanger",
  "Standing Fan",
  "Bathroom",
  "Ensuite",
  "Shower-room",
  "Basin",
  "Running water",
  "Treated water",
  "Kitchen Cabinet",
  "Sink",
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

const genderOptions = [
  { id: "male", icon: <FaMale /> },
  { id: "female", icon: <FaFemale /> },
];

const religionOptions = [
  { id: "christian", icon: <FaCross /> },
  { id: "muslim", icon: <FaMoon /> },
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

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div className="pt-8 md:px-5">
      <h3 className="text-3xl font-medium text-center">{title}</h3>

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

/* ---------- REUSABLE COMPONENTS ---------- */

type OptionItem = {
  id: string;
  icon?: React.ReactNode;
};

function IconOptionGroup({
  options,
  value,
  onChange,
  className,
}: {
  options: OptionItem[];
  value?: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {options.map((opt) => {
        const selected = value === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={clsx(
              "w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center gap-1 rounded-lg p-3 border transition-all",
              selected
                ? "bg-[#CCAC13] border-[#CCAC13] text-white"
                : "bg-white border-black text-black",
            )}
          >
            <div className="text-md md:text-2xl">{opt.icon}</div>
          </button>
        );
      })}
    </div>
  );
}

function SelectPill({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1 relative">
      <Label className="ml-2 md:ml-6">{label}</Label>

      <InfoPill
        className="bg-white cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between w-full">
          <input
            value={value || placeholder || "Select option"}
            readOnly
            className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 text-gray-500"
          />
          <IoIosArrowDown />
        </div>
      </InfoPill>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">{label}</h3>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <label key={opt} className="flex items-center gap-3 py-1">
                  <input
                    type="radio"
                    checked={value === opt}
                    onChange={() => {
                      onChange(opt);
                      setOpen(false); // auto close
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
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
          className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1"
        />
      </InfoPill>
    </div>
  );
}

/* ---------- MULTI SELECT (MAX 3, COLLAPSING) ---------- */

function MultiSelectPill({
  label,
  options,
  value,
  setValue,
}: {
  label: string;
  options: string[];
  value: string[];
  setValue: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      setValue(value.filter((o) => o !== opt));
    } else {
      if (value.length >= 3) return;
      setValue([...value, opt]);
    }
  };

  const limitDisplay = (text: string, max = 15) => {
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  };

  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      {/* PILL */}
      <InfoPill
        className="bg-white cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between w-full">
          <input
            value={
              value.length
                ? limitDisplay(value.join(", "), 20)
                : "Select options"
            }
            readOnly
            className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
          />
          <IoIosArrowDown className="ml-2" />
        </div>
      </InfoPill>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">{label}</h3>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {options.map((opt) => {
                const selected = value.includes(opt);
                const disabled = !selected && value.length >= 3;

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 py-1 ${
                      disabled ? "opacity-40" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => toggle(opt)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>

            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- PAGE ---------- */

export default function Request() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!isEdit) return;

    const fetchRequest = async () => {
      try {
        const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

        const res = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_request_for_edit",
            request_id: editId,
            user: login?.user,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message);
          navigate("/studentdash");
          return;
        }

        if (!data.editable) {
          alert("This request already has responses.");
          navigate("/studentdash");
          return;
        }

        const req = data.request;

        setGender(req.gender);
        setReligion(req.religion);

        setCategory(req.category);
        setType(req.type);

        setLocation1(req.preferred_locations?.[0] || "");
        setLocation2(req.preferred_locations?.[1] || "");

        setFeatures(req.should_have || []);

        setMoveInDate(req.move_in_date);
        setBudget(req.budget);
      } catch {
        alert("Failed to load request");
      }
    };

    fetchRequest();
  }, [editId, isEdit, navigate]);

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
  const { showAlert } = useAlert();
  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    if (!user || !signup_key) {
      showAlert("Session expired. Please login again.", "warning", true);
      return;
    }

    if (
      !gender ||
      !religion ||
      !category ||
      !type ||
      !moveInDate ||
      !budget ||
      !location1
    ) {
      showAlert("Please complete all required fields", "warning");
      return;
    }

    const payload = {
      action: "post_student_request",
      request_id: isEdit ? editId : 0,
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
      school: login?.school,
    };

    try {
      setLoading(true);

      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showAlert(
          data.message || (isEdit ? "Request updated" : "Request posted"),
          "success",
          true,
        );

        navigate("/studentdash?goto=rent");
      } else {
        showAlert(data.message || "Action failed", "warning");
      }
    } catch (err) {
      console.error(err);
      showAlert("Network error. Please try again.", "warning");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler"
            className="h-full w-full object-cover"
          />

          <button
            onClick={() => navigate("/studentdash?goto=rent")}
            className="absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Request"
              caption="Post Request and Get Hostel Offers from Hosts"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 md:mt-0">
              {/* Gender & Religion */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Gender</Label>
                  <IconOptionGroup
                    options={genderOptions}
                    value={gender}
                    onChange={(id) => setGender(id as "male" | "female")}
                    className="ml-6"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Religion</Label>
                  <IconOptionGroup
                    options={religionOptions}
                    value={religion}
                    onChange={(id) => setReligion(id as "christian" | "muslim")}
                    className="ml-6"
                  />
                </div>

                <SelectPill
                  label="Category"
                  value={category}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select Space category"
                  onChange={setCategory}
                />

                <SelectPill
                  label="Type"
                  value={type}
                  options={TYPE_OPTIONS}
                  placeholder="Select Space type"
                  onChange={setType}
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

                <MultiSelectPill
                  label="Should Have"
                  options={SHOULD_HAVE_OPTIONS}
                  value={features}
                  setValue={setFeatures}
                />

                <SelectPill
                  label="Move In Date"
                  value={moveInDate}
                  options={MOVE_IN_OPTIONS}
                  placeholder="How soon?"
                  onChange={setMoveInDate}
                />
              </div>

              <SelectPill
                label="Budget"
                value={budget}
                options={BUDGET_OPTIONS}
                placeholder="Select budget range"
                onChange={setBudget}
              />

              <div className="flex justify-center pt-4">
                <DfButton onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? isEdit
                      ? "Updating..."
                      : "Posting..."
                    : isEdit
                      ? "UPDATE"
                      : "POST"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}
