import { useAlert } from "../../../App";
import imgright from "../../../assets/knowyou2.jpg";
import { DfButton } from "../../../components/Pill";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../components/Pill";
import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import LGAS_DATA from "../../../components/localgovt.json";

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

// ===== MAIN COMPONENT =====
interface Knowyou2Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function Knowyou2({
  formData,
  setFormData,
  onNext,
  onBack,
}: Knowyou2Props) {
  const { showAlert } = useAlert();

  // ===== OPTIONS =====
  const spaceTypes = [
    "A room",
    "A room in a flat",
    "A room self-contain",
    "A room and parlor",
    "2 bedroom apartment",
    "3 bedroom apartment",
    "4 bedroom apartment",
    "5 bedroom apartment",
  ];

  const availabilityMonths = [
    "Currently",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const durationOptions = [
    "Per Year",
    "Per Session",
    "Per 9months",
    "Per 6months",
    "Per Semester",
    "Per 3months",
    "Per month",
  ];

  // ===== STATE =====
  const [loading, setLoading] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  // ===== GET USER'S SCHOOL LOCATION =====
  const getUserLocation = () => {
    try {
      const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
      const school = login?.school || "";
      // Extract location from school name (e.g., "KWASU - Kwara State University, Ilorin (Kwara)")
      const match = school.match(/\(([^)]+)\)/);
      if (match) {
        return match[1]; // Returns "Kwara" or "Abuja" etc.
      }
      return null;
    } catch {
      return null;
    }
  };

  const userLocation = getUserLocation();

  // ===== LOCATION DATA - Filtered by user's school location =====
  const statesAndLgas: { state: string; lgas: string[] }[] =
    React.useMemo(() => {
      try {
        let data: { state: string; lgas: string[] }[] = [];
        if (Array.isArray(LGAS_DATA as any)) {
          data = LGAS_DATA as any;
        } else {
          data = Object.keys(LGAS_DATA as any).map((s) => ({
            state: s,
            lgas: (LGAS_DATA as any)[s],
          }));
        }

        // Filter by user's location if available
        if (userLocation) {
          return data.filter(
            (s) => s.state.toLowerCase() === userLocation.toLowerCase()
          );
        }
        return data;
      } catch (e) {
        return [];
      }
    }, [userLocation]);

  const filteredStates = statesAndLgas.filter((s) =>
    s.state.toLowerCase().startsWith(stateSearch.toLowerCase()),
  );

  // ===== FOCUS SEARCH =====
  useEffect(() => {
    if (showStateModal) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [showStateModal]);

  // ===== HELPERS =====
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const counter = (field: string, value: number, min = 2) => (
    <InfoPill className="bg-white">
      <div className="flex items-center justify-between w-full leading-5 text-xs py-1">
        <FaMinus
          className="cursor-pointer"
          onClick={() =>
            updateField(field, Math.max(min, (formData[field] || min) - 1))
          }
        />
        <span className="text-gray-500">
          {value} Bedspace{value > 1 ? "s" : ""}
        </span>
        <FaPlus
          className="cursor-pointer"
          onClick={() => updateField(field, (formData[field] || min) + 1)}
        />
      </div>
    </InfoPill>
  );

  // ===== SAVE =====
  const handleNext = async () => {
    // Validate all required fields
    if (!formData.type) {
      showAlert("Please select a space type", "warning");
      return;
    }
    if (!formData.hostel_loc) {
      showAlert("Please select a location", "warning");
      return;
    }
    if (!formData.availability) {
      showAlert("Please select availability date", "warning");
      return;
    }
    if (!formData.amount_share || formData.amount_share < 1) {
      showAlert("Please enter the split amount", "warning");
      return;
    }
    if (!formData.duration) {
      showAlert("Please select duration", "warning");
      return;
    }

    if (loading) return;

    setLoading(true);

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    // Payload matching database columns
    const payload = {
      action: "knowyou2",
      user: user,
      signup_key: signup_key,
      hostel_loc: formData.hostel_loc,
      type: formData.type,
      amount_share: formData.amount_share,
      roommates: formData.roommates || 2, // Default to 2 if not set
      duration: formData.duration,
      availability: formData.availability,
    };

    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Saved successfully!", "success");
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
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover"
          />
          <button
            onClick={onBack}
            className="cursor-pointer absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 mb:mt-0">
              {/* 1. TYPE + 2. NO. OF ROOMMATE (BEDSPACES) */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label>Type</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center justify-between w-full">
                      <select
                        value={formData.type || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
                      >
                        <option value="">Select Space Type</option>
                        {spaceTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label>No. of Roommate</Label>
                  {counter("roommates", formData.roommates ?? 2, 2)}
                </div>
              </div>

              {/* 3. LOCATION + 4. AVAILABILITY (same line) */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label>Location</Label>
                  <InfoPill
                    onClick={() => setShowStateModal(true)}
                    className="bg-white relative flex items-center justify-between cursor-pointer"
                  >
                    <input
                      type="text"
                      value={formData.hostel_loc || ""}
                      placeholder="Select Location"
                      readOnly
                      className="w-full appearance-none bg-transparent text-gray-500 text-xs leading-5 outline-none py-1"
                    />
                    <IoIosArrowDown className="ml-2" />
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label>Availability</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center justify-between w-full">
                      <select
                        value={formData.availability || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
                      >
                        <option value="">Available from?</option>
                        {availabilityMonths.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              {/* 5. SPLIT AMOUNT + 6. DURATION */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label>Split Amount</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center w-full">
                      <span className="text-gray-500 text-xs font-semibold mr-1">
                        ₦
                      </span>
                      <input
                        type="number"
                        value={formData.amount_share || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount_share: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Amount per person"
                        className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none py-1"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label>Duration</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center justify-between w-full">
                      <select
                        value={formData.duration || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
                      >
                        <option value="">Select Duration</option>
                        {durationOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
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

      {/* LOCATION MODAL */}
      {showStateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => {
                  setShowStateModal(false);
                  setStateSearch("");
                }}
              >
                Close
              </button>
            </div>

            <div className="mb-3">
              <input
                ref={searchRef}
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder={`Search ${userLocation || 'state'}`}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3 pb-4">
              {filteredStates.map((s) => (
                <div key={s.state}>
                  <p className="sticky top-0 bg-white text-xs font-semibold text-gray-500 py-1">
                    {s.state}
                  </p>
                  {s.lgas.map((lga) => {
                    const value = `${s.state} - ${lga}`;
                    const isSelected = formData.hostel_loc === value;

                    return (
                      <label
                        key={value}
                        className={`flex items-center gap-3 text-sm cursor-pointer py-1 px-2 rounded-md ${
                          isSelected ? "bg-gray-100" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => {
                            setFormData((prev: any) => ({
                              ...prev,
                              hostel_loc: value,
                            }));
                            setShowStateModal(false);
                            setStateSearch("");
                          }}
                          className="w-4 h-4"
                        />
                        <span>{lga}</span>
                      </label>
                    );
                  })}
                </div>
              ))}

              {filteredStates.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-3">
                  {userLocation ? `No locations found for ${userLocation}` : "No state found"}
                </p>
              )}
            </div>

            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => {
                  setShowStateModal(false);
                  setStateSearch("");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}