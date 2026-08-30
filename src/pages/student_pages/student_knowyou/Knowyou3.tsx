import { useAlert } from "../../../App";
import imgright from "../../../assets/knowyou3.png";
import { DfButton } from "../../../components/Pill";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../components/Pill";
import clsx from "clsx";
import React, { useState } from "react";
import { LuStar, LuStarOff } from "react-icons/lu";

// ===== COMPONENTS =====
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
      className={`flex items-center gap-1 mt-1 mb:mt-0 ml-6 text-yellow-500 cursor-pointer ${className}`}
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

// ===== OPTIONS =====
const securityOptions = [
  "Hostel Guard",
  "Fenced & Gated",
  "Alarm",
  "Surveillance",
  "Community Guard",
];

const waterOptions = ["Running", "Borehole", "Clean", "Well", "Treated"];

// ===== HELPERS =====
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

function limitDisplay(text: string, max = 15) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

// ===== MAIN COMPONENT =====
interface Knowyou3Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function Knowyou3({
  formData,
  setFormData,
  onNext,
  onBack,
}: Knowyou3Props) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
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

  // ===== SAVE =====
  const handleNext = async () => {
    // Validate all required fields
    if (!security.length) {
      showAlert("Please select security options", "warning");
      return;
    }
    if (!water.length) {
      showAlert("Please select water options", "warning");
      return;
    }
    if (!formData.power_supply || formData.power_supply < 1) {
      showAlert("Please rate the power supply", "warning");
      return;
    }
    if (!formData.network_strength || formData.network_strength < 1) {
      showAlert("Please rate the network strength", "warning");
      return;
    }
    if (!formData.compound || formData.compound < 1) {
      showAlert("Please rate the compound", "warning");
      return;
    }
    if (!formData.access_road || formData.access_road < 1) {
      showAlert("Please rate the access road", "warning");
      return;
    }

    if (loading) return;

    setLoading(true);

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    const payload = {
      action: "knowyou3",
      user: user,
      signup_key: signup_key,
      security: security,
      water: water,
      power_supply: formData.power_supply,
      network_strength: formData.network_strength,
      compound: formData.compound,
      access_road: formData.access_road,
    };

    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Saved successfully!", "success", true);
        setTimeout(() => {
          onNext?.();
        }, 500);
      } else {
        showAlert(data.reply || "Error saving", "warning");
      }
    } catch {
      showAlert("Network error occurred", "warning");
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <section className="mx-1 md:px-10 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EECE]">
      {/* Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        {/* Image */}
        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler"
            className="h-full w-full object-cover"
          />
          <button
            onClick={onBack}
            className="absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Space Amenities"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 mb:mt-0">
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
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              {/* RATINGS - Power, Network, Compound, Access Road */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Power Supply</Label>
                  <StarRow
                    value={formData.power_supply ?? 0}
                    onChange={(v) => updateField("power_supply", v)}
                  />
                </div>

                <div>
                  <Label>Network</Label>
                  <StarRow
                    value={formData.network_strength ?? 0}
                    onChange={(v) => updateField("network_strength", v)}
                  />
                </div>

                <div>
                  <Label>Compound</Label>
                  <StarRow
                    value={formData.compound ?? 0}
                    onChange={(v) => updateField("compound", v)}
                  />
                </div>

                <div>
                  <Label>Access Road</Label>
                  <StarRow
                    value={formData.access_road ?? 0}
                    onChange={(v) => updateField("access_road", v)}
                  />
                </div>
              </div>

              {/* NEXT BUTTON */}
              <div className="pt-2 w-full mt-2 flex items-center justify-center">
                <DfButton onClick={handleNext} disabled={loading}>
                  {loading ? "Saving..." : "NEXT"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>

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
