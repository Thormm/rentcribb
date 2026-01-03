import imgright from "../../../../../src/assets/list2.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import { FaMinus, FaPlus } from "react-icons/fa";
import { LuStar, LuStarOff } from "react-icons/lu";
import React, { useState } from "react";

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

function StarRow({
  value,
  onChange,
  className = "",
}: {
  className?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className={`flex items-center gap-1 text-yellow-500 cursor-pointer ${className}`}
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
        )
      )}
    </div>
  );
}

export default function Entirespace2({
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
  // saving state + status modal
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveAndContinue = async () => {
    if (
      !formData.security ||
      !formData.water ||
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
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    const payload = {
      action: "entire_space2",
      user: user,
      signup_key: signup_key,
      space_id: formData.space_id ?? 0,
      bedrooms: formData.bedrooms ?? 0,
      ensuite: formData.ensuite ?? 0,
      bathrooms: formData.bathrooms ?? 0,
      toilets: formData.toilets ?? 0,
      security: formData.security ?? "",
      water: formData.water ?? "",

      power_supply: formData.power_supply ?? 0,
      network_strength: formData.network_strength ?? 0,
      compound: formData.compound ?? 0,
      access_road: formData.access_road ?? 0,
    };

    try {
      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setStatusMessage("Error: " + (data.message || "Unknown"));
        setTimeout(() => setStatusMessage(null), 2000);
      }
    } catch (e) {
      setStatusMessage("Network error");
      setTimeout(() => setStatusMessage(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const counter = (field: string, value: number) => (
    <InfoPill className="bg-white">
      <div className="inline-flex items-center justify-between w-full">
        <FaMinus
          className="cursor-pointer"
          onClick={() =>
            updateField(field, Math.max(0, (formData[field] || 0) - 1))
          }
        />
        <span>{value}</span>
        <FaPlus
          className="cursor-pointer"
          onClick={() => updateField(field, (formData[field] || 0) + 1)}
        />
      </div>
    </InfoPill>
  );

  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
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
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
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

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 md:mt-0">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">No. of Bedroom</Label>
                  {counter("bedrooms", formData.bedrooms ?? 0)}
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">No. of Ensuite</Label>
                  {counter("ensuite", formData.ensuite ?? 0)}
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">No. of Bathroom</Label>
                  {counter("bathrooms", formData.bathrooms ?? 0)}
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">No. of Toilets</Label>
                  {counter("toilets", formData.toilets ?? 0)}
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Security</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                        value={formData.security ?? ""}
                        onChange={(e) =>
                          updateField("security", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Water</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                        value={formData.water ?? ""}
                        onChange={(e) => updateField("water", e.target.value)}
                      >
                        <option value="">Availability</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                      </select>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>
              </div>

              {/* Star rating rows */}
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="space-y-1 pl-2 md:pl-6">
                      Power Supply
                    </Label>
                    <StarRow
                      className="space-y-1 md:pl-2"
                      value={formData.power_supply ?? 0}
                      onChange={(v) => updateField("power_supply", v)}
                    />
                  </div>

                  <div>
                    <Label className="space-y-1 pl-2 md:pl-6">
                      Network Strength
                    </Label>
                    <StarRow
                      className="space-y-1 md:pl-2"
                      value={formData.network_strength ?? 0}
                      onChange={(v) => updateField("network_strength", v)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="space-y-1 pl-2 md:pl-6">Compound</Label>
                    <StarRow
                      className="space-y-1 md:pl-2"
                      value={formData.compound ?? 0}
                      onChange={(v) => updateField("compound", v)}
                    />
                  </div>

                  <div>
                    <Label className="space-y-1 pl-2 md:pl-6">
                      Access Road
                    </Label>
                    <StarRow
                      className="space-y-1 md:pl-2"
                      value={formData.access_road ?? 0}
                      onChange={(v) => updateField("access_road", v)}
                    />
                  </div>
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
            <p className="text-sm md:text-md">{statusMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}
