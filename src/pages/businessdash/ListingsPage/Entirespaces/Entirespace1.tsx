import imgright from "../../../../../src/assets/list1.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import LGAS_DATA from "../../../../components/localgovt.json";

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

function Label({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "text-sm md:text-md md:my-3 font-semibold ml-0",
        className
      )}
    >
      {children}
    </div>
  );
}

interface Entirespace1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
}

export default function Entirespace1({
  formData,
  setFormData,
  onNext,
}: Entirespace1Props) {
  const navigate = useNavigate();

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

  const houseRuleOptions = [
    "None",
    "No smoking",
    "No pets",
    "No Inflammables",
    "No overnight guests",
    "No parties or events",
    "No loud music after 10pm",
    "Not suitable for Children under 12years",
    "Not suitable for Children under 2years",
    "Replacement charge if you lose access key",
    "No structural changes without host permission",
    "CCTV surveillance",
    "Private/residential use only",
    "Smoking is allowed on Balconies only",
    "No illegal activities",
  ];

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showHouseModal, setShowHouseModal] = useState(false);

  const statesAndLgas: { state: string; lgas: string[] }[] =
    React.useMemo(() => {
      try {
        if (Array.isArray(LGAS_DATA as any)) return LGAS_DATA as any;
        return Object.keys(LGAS_DATA as any).map((s) => ({
          state: s,
          lgas: (LGAS_DATA as any)[s],
        }));
      } catch (e) {
        return [];
      }
    }, []);

  const incUnits = () =>
    setFormData({ ...formData, units: Math.min(50, formData.units + 1) });
  const decUnits = () =>
    setFormData({ ...formData, units: Math.max(1, formData.units - 1) });

  const toggleRule = (rule: string) => {
    const newRules = formData.selectedRules.includes(rule)
      ? formData.selectedRules.filter((r: string) => r !== rule)
      : [...formData.selectedRules, rule];
    setFormData({ ...formData, selectedRules: newRules });
  };

  const houseRulesDisplay =
    formData.selectedRules.length === 0
      ? "Select all that applies"
      : formData.selectedRules.join(", ");

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);
    setStatusMessage("Saving...");

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    const payload = {
      action: "entire_space1",
      user,
      signup_key,
      space_id: formData.space_id,
      spaceName: formData.spaceName,
      fullAddress: formData.fullAddress,
      selectedType: formData.selectedType,
      units: formData.units,
      selectedLocation: formData.selectedLocation,
      selectedMonth: formData.selectedMonth,
      selectedRules: formData.selectedRules,
    };

    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage("Saved successfully!");
        if (!formData.space_id && data.space_id) {
          setFormData({ ...formData, space_id: data.space_id });
        }
        setTimeout(() => {
          setStatusMessage(null);
          if (onNext) onNext();
        }, 1000);
      } else {
        setStatusMessage(`Error: ${data.message}`);
        setTimeout(() => setStatusMessage(null), 2000);
      }
    } catch (err) {
      setStatusMessage("Network error occurred");
      setTimeout(() => setStatusMessage(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />

          <button
            onClick={() => navigate("/businessdash")}
            className="cursor-pointer absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 mb:mt-0">
              {/* SPACE NAME */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Space Name (Your Eyes Only)</Label>
                  <InfoPill className="bg-white">
                    <input
                      value={formData.spaceName}
                      onChange={(e) =>
                        setFormData({ ...formData, spaceName: e.target.value })
                      }
                      className="w-full appearance-none bg-transparent text-xs outline-none px-2 py-1"
                      placeholder="Give your entire unit a name"
                    />
                  </InfoPill>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Full Address (Your Eyes Only)</Label>
                  <InfoPill className="bg-white">
                    <input
                      value={formData.fullAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullAddress: e.target.value,
                        })
                      }
                      className="w-full appearance-none bg-transparent text-xs outline-none px-2 py-1"
                      placeholder="Enter Space address"
                    />
                  </InfoPill>
                </div>
              </div>

              {/* TYPE + UNITS */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Type</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        value={formData.selectedType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            selectedType: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                      >
                        <option value="">Select Space Type</option>
                        {spaceTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-8">No. of Units</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <button onClick={decUnits} className="px-2">
                        <FaMinus />
                      </button>
                      <span>{formData.units}</span>
                      <button onClick={incUnits} className="px-2">
                        <FaPlus />
                      </button>
                    </div>
                  </InfoPill>
                </div>

                {/* LOCATION */}
                <div className="space-y-1">
                  <Label className="ml-8">Location</Label>
                  <InfoPill className="bg-white">
                    <select
                      value={formData.selectedLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          selectedLocation: e.target.value,
                        })
                      }
                      className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                    >
                      <option value="">Around where?</option>
                      {statesAndLgas.map((s) => (
                        <optgroup label={s.state} key={s.state}>
                          {s.lgas.map((l) => (
                            <option key={l} value={`${s.state} - ${l}`}>
                              {l}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </InfoPill>
                </div>

                {/* AVAILABILITY */}
                <div className="space-y-1">
                  <Label className="ml-8">Availability</Label>
                  <InfoPill className="bg-white">
                    <select
                      value={formData.selectedMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          selectedMonth: e.target.value,
                        })
                      }
                      className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                    >
                      <option value="">Available from?</option>
                      {availabilityMonths.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </InfoPill>
                </div>
              </div>

              {/* HOUSE RULES */}
              <div className="grid grid-cols-1 gap-6">
                <div
                  className="space-y-1"
                  onClick={() => setShowHouseModal(true)}
                >
                  <Label className="ml-8">House Rules</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <span className="text-xs md:text-sm text-gray-500">
                      {houseRulesDisplay}
                    </span>
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

      {/* HOUSE RULES MODAL */}
      {showHouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select House Rules</h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => setShowHouseModal(false)}
              >
                Close
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 pb-4">
              {houseRuleOptions.map((rule) => (
                <label
                  key={rule}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedRules.includes(rule)}
                    onChange={() => toggleRule(rule)}
                    className="w-4 h-4"
                  />
                  <span>{rule}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowHouseModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS MODAL */}
      {statusMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-72 text-center shadow-lg">
            <p className="text-sm md:text-md">{statusMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}
