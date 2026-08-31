import { useAlert } from "../../../App";
import imgright from "../../../assets/knowyou2.png";
import { DfButton } from "../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../components/Pill";
import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Updated duration options
const durationOptions = [
  "Per Year",
  "Per Session",
  "Per 9months",
  "Per 6months",
  "Per Semester",
  "Per 3months",
  "Per month",
];

// Budget options
const budgetOptions = [
  "50,000 - 100,000",
  "100,000 - 200,000",
  "200,000 - 500,000",
  "500,000 - 1,000,000",
];

interface MaincardProps {
  className?: string;
  children: React.ReactNode;
}

function Maincard({ className = "", children }: MaincardProps) {
  return (
    <div className={["rounded-4xl px-5 border-4 shadow", className].join(" ")}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  caption?: string;
}

function SectionHeader({ title, caption }: SectionHeaderProps) {
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

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

function Label({ children, className }: LabelProps) {
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

interface Knowyou5Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function Knowyou5({
  formData,
  setFormData,
  onBack,
}: Knowyou5Props) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Refs for change detection
  const initialFormDataRef = useRef<any>(null);
  const isFirstLoad = useRef(true);

  // ===== CAPTURE INITIAL FORM DATA =====
  useEffect(() => {
    if (isFirstLoad.current && formData) {
      initialFormDataRef.current = {
        budget: formData.budget || "",
        duration: formData.duration || "",
      };
      isFirstLoad.current = false;
    }
  }, [formData]);

  // ===== CHECK FOR CHANGES =====
  const checkForChanges = (newData: any) => {
    if (!initialFormDataRef.current) return true;
    
    const initial = initialFormDataRef.current;
    const current = {
      budget: newData.budget || "",
      duration: newData.duration || "",
    };

    const hasChanged = 
      initial.budget !== current.budget ||
      initial.duration !== current.duration;

    setHasChanges(hasChanged);
    return hasChanged;
  };

  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    checkForChanges(newData);
  };

  const saveAndContinue = async () => {
    // Validate only the two fields
    if (!formData.budget) {
      showAlert("Please select a budget range", "warning");
      return;
    }
    if (!formData.duration) {
      showAlert("Please select a duration", "warning");
      return;
    }

    if (loading) return;

    // If no changes were made, just navigate to dashboard
    if (!hasChanges) {
      navigate("/studentdash");
      return;
    }

    setLoading(true);

    // Get user session data
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    // Prepare payload
    const payload = {
      action: "knowyou5",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      budget: formData.budget || "",
      duration: formData.duration || "",
    };

    try {
      console.log("Saving payload:", payload);

      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Saved successfully!", "success");
        
        // Update formData to reflect saved state
        setFormData((prev: any) => ({
          ...prev,
          budget: formData.budget,
          duration: formData.duration,
        }));

        // Update initial data reference
        initialFormDataRef.current = {
          budget: formData.budget || "",
          duration: formData.duration || "",
        };
        setHasChanges(false);

        // Navigate to studentdash after successful save
        setTimeout(() => {
          navigate("/studentdash");
        }, 1000);
      } else {
        showAlert(data.reply || "Error saving", "warning");
      }
    } catch (error) {
      console.error("Save error:", error);
      showAlert("Network error. Please try again.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-1 md:mx-0 md:px-10 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EECE]">
      {/* Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 border-2 box-border" />
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

        {/* Card */}
        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#EBD96B] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Let's Know You"
              caption="Yes! We'd like to Show off your awesome qualities"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 md:mt-0">
              {/* Budget Row */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label>Split-Amount</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center justify-between w-full">
                      <select
                        value={formData.budget || ""}
                        onChange={(e) => updateField("budget", e.target.value)}
                        className="w-full appearance-none bg-transparent text-xs leading-5 text-gray-500 outline-none cursor-pointer py-1"
                      >
                        <option value="">Select Budget Range</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            ₦{b}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              {/* Duration Row */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label>Duration</Label>
                  <InfoPill className="bg-white">
                    <div className="flex items-center justify-between w-full">
                      <select
                        value={formData.duration || ""}
                        onChange={(e) => updateField("duration", e.target.value)}
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

              <div className="pt-2 w-full mt-2 flex items-center justify-center">
                <DfButton onClick={saveAndContinue} disabled={loading}>
                  {loading ? "Saving..." : "NEXT"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}