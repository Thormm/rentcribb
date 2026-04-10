import imgright from "../../../../../src/assets/list2.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import { LuStar, LuStarOff } from "react-icons/lu";
import React, { useState, useEffect } from "react";
import { FaMale, FaFemale, FaMoon, FaCross, FaBan } from "react-icons/fa";


  const genderOptions: OptionItem[] = [
    { id: "male", icon: <FaMale /> },
    { id: "female", icon: <FaFemale /> },
  ];

  const religionOptions: OptionItem[] = [
    { id: "christian", icon: <FaCross /> },
    { id: "muslim", icon: <FaMoon /> },
    { id: "none", icon: <FaBan /> },
  ];

  const yearOptions = [
    { value: "", label: "Choose preference" },
    { value: "100 level", label: "100 Level" },
    { value: "200 level", label: "200 Level" },
    { value: "300 level", label: "300 Level" },
    { value: "400 level", label: "400 Level" },
    { value: "postgrad", label: "Postgraduate" },
  ];

  const facultyOptions = [
    { value: "", label: "Choose preference" },
    { value: "engineering", label: "Engineering" },
    { value: "sciences", label: "Sciences" },
    { value: "arts", label: "Arts" },
    { value: "management", label: "Management" },
    { value: "law", label: "Law" },
  ];

type OptionItem = {
  id: string;
  label?: string;
  icon?: React.ReactNode;
};

function IconOptionGroup({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: OptionItem[];
  value?: string | null;
  onChange: (id: string) => void;
  columns?: number;
}) {
  return (
    <div className={`grid grid-cols-${columns} gap-3 items-center `}>
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

function StarRow({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1 mt-1 mb:mt-0 text-yellow-500 cursor-pointer ${className}`}
    >
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <LuStar
            key={i}
            size={25}
            fill="currentColor"
            onClick={() => onChange(i + 1)}
          />
        ) : (
          <LuStarOff key={i} size={25} onClick={() => onChange(i + 1)} />
        ),
      )}
    </div>
  );
}

/* ---------------- OPTIONS ---------------- */

const securityOptions = [
  "Hostel Guard",
  "Fenced & Gated",
  "Alarm",
  "Surveillance",
  "Community Guard",
];

const waterOptions = ["Running", "Borehole", "Clean", "Well", "Treated"];

/* ---------------- HELPERS ---------------- */

/* Fix backend formats like:
["Fenced & Gated","Surveillance"]
["[\"Fenced & Gated\"","\"Surveillance\"]"]
"a,b"
*/
function normalizeArray(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((v) =>
        String(v)
          .replace(/[\[\]"]/g, "")
          .trim(),
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((v) =>
            String(v)
              .replace(/[\[\]"]/g, "")
              .trim(),
          )
          .filter(Boolean);
      }
    } catch {}

    return value
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

/* limit visible characters in textbox */
function limitDisplay(text: string, max = 15) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function Sharedspace2({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: any;
  onNext?: () => void;
  onBack?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);

  const security = normalizeArray(formData.security);
  const water = normalizeArray(formData.water);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: string, value: string) => {
    const current = field === "security" ? security : water;

    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    updateField(field, next);
  };

 

  /* ---------------- SAVE ---------------- */

  const saveAndContinue = async () => {
    if (
      !formData.pref_gender ||
      !formData.pref_religion ||
      !formData.pref_year ||
      !formData.pref_faculty ||
      !security.length ||
      !water.length ||
      !formData.power_supply ||
      !formData.network_strength ||
      !formData.compound ||
      !formData.access_road
    ) {
      setStatusMessage("Please complete all required fields");
      setTimeout(() => setStatusMessage(null), 2000);
      return;
    }

    if (loading) return;

    setLoading(true);
    setStatusMessage("Saving...");

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    const payload = {
      action: "shared_space2",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      space_id: formData.space_id ?? 0,
      pref_gender: formData.pref_gender ?? "",
      pref_religion: formData.pref_religion ?? "",
      pref_year: formData.pref_year ?? "",
      pref_faculty: formData.pref_faculty ?? "",
      security,
      water,
      power_supply: formData.power_supply ?? 0,
      network_strength: formData.network_strength ?? 0,
      compound: formData.compound ?? 0,
      access_road: formData.access_road ?? 0,
    };

    try {
      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage("Saved successfully!");

        setTimeout(() => {
          setStatusMessage(null);
          onNext && onNext();
        }, 1000);
      } else {
        setStatusMessage(data.message || "Error saving");
      }
    } catch {
      setStatusMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData.bathrooms) updateField("bathrooms", 1);
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <section className="mx-1 md:mx-0 md:px-10 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      {/* Progress */}

      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>

        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 border-2 box-border" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        {/* IMAGE */}

        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />

          <button
            onClick={onBack}
            className="absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* CARD */}

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 md:mt-0">
              {/* COUNTERS */}

              <div className="grid grid-cols-2 gap-6">
                {/* ---- REPLACED ROWS: Four preference controls ---- */}

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Pref. Gender</Label>
                  <IconOptionGroup
                    options={genderOptions}
                    value={formData.pref_gender ?? ""}
                    onChange={(id) => updateField("pref_gender", id)}
                    columns={2}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Pref. Religion</Label>
                  <IconOptionGroup
                    options={religionOptions}
                    value={formData.pref_religion ?? ""}
                    onChange={(id) => updateField("pref_religion", id)}
                    columns={3}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Pref. Year</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                        value={formData.pref_year ?? ""}
                        onChange={(e) =>
                          updateField("pref_year", e.target.value)
                        }
                      >
                        {yearOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Pref. Faculty</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                        value={formData.pref_faculty ?? ""}
                        onChange={(e) =>
                          updateField("pref_faculty", e.target.value)
                        }
                      >
                        {facultyOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                {/* ---- Keep the Security & Water selects as before ---- */}
              </div>

              {/* SECURITY + WATER */}

              <div className="grid grid-cols-2 gap-6">
                <div
                  className="space-y-1"
                  onClick={() => setShowSecurityModal(true)}
                >
                  <Label>Security</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          security.length
                            ? limitDisplay(security.join(", "), 12)
                            : "Select options"
                        }
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                        placeholder="Select house rules"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
                <div
                  className="space-y-1"
                  onClick={() => setShowWaterModal(true)}
                >
                  <Label>Water</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          water.length
                            ? limitDisplay(water.join(", "), 12)
                            : "Select options"
                        }
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                        placeholder="Select house rules"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              {/* RATINGS */}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label >Power Supply</Label>
                  <StarRow
                    value={formData.power_supply ?? 0}
                    onChange={(v) => updateField("power_supply", v)}
                  />
                </div>

                <div>
                  <Label >Network </Label>
                  <StarRow
                    value={formData.network_strength ?? 0}
                    onChange={(v) => updateField("network_strength", v)}
                  />
                </div>

                <div>
                  <Label >Compound</Label>
                  <StarRow
                    value={formData.compound ?? 0}
                    onChange={(v) => updateField("compound", v)}
                  />
                </div>

                <div>
                  <Label >Access Road</Label>
                  <StarRow
                    value={formData.access_road ?? 0}
                    onChange={(v) => updateField("access_road", v)}
                  />
                </div>
              </div>

              <div className="pt-2 w-full mt-2 flex items-center justify-center">
                <DfButton onClick={saveAndContinue} disabled={loading}>
                  {loading ? "Saving..." : "NEXT"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>

      {/* STATUS MODAL */}

      {statusMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-72 text-center shadow-lg">
            <p>{statusMessage}</p>
          </div>
        </div>
      )}

      {/* SECURITY MODAL */}

      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Select Security</h3>
              <button onClick={() => setShowSecurityModal(false)}>Close</button>
            </div>

            {securityOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={security.includes(opt)}
                  onChange={() => toggleMulti("security", opt)}
                />

                {opt}
              </label>
            ))}

            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowSecurityModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* WATER MODAL */}

      {showWaterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Select Water</h3>
              <button onClick={() => setShowWaterModal(false)}>Close</button>
            </div>

            {waterOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={water.includes(opt)}
                  onChange={() => toggleMulti("water", opt)}
                />

                {opt}
              </label>
            ))}

            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowWaterModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
