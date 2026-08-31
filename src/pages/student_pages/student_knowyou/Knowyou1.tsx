import { useAlert } from "../../../App";
import imgright from "../../../assets/knowyou1.png";
import { DfButton } from "../../../components/Pill";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../components/Pill";
import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";
import { FaMale, FaFemale, FaMoon, FaCross } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiHouse } from "react-icons/pi";
import { MdOutlineBed } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const genderOptions = [
  { id: "male", icon: <FaMale /> },
  { id: "female", icon: <FaFemale /> },
];

const religionOptions = [
  { id: "christian", icon: <FaCross /> },
  { id: "muslim", icon: <FaMoon /> },
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

const petOptions = [
  { value: "Cat_Dog", label: "Okay with cat and dog" },
  { value: "Cat", label: "Cat friendly : not Dog friendly" },
  { value: "Dog", label: "Dog friendly : not Cat friendly" },
  { value: "None", label: "Not Cat and Dog Friendly" },
];

const hobbiesOptions = [
  "Games",
  "Food",
  "Exercise",
  "Reading",
  "Hangout",
  "Sleep",
  "Movies",
  "Chat",
  "Music",
];

interface OptionItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
}

interface IconOptionGroupProps {
  options: OptionItem[];
  value?: string | null;
  onChange: (id: string) => void;
  className?: string;
}

function IconOptionGroup({
  options,
  value,
  className,
  onChange,
}: IconOptionGroupProps) {
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

function limitDisplay(text: string, max: number = 15) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

function getPetLabel(value: string) {
  const option = petOptions.find((opt) => opt.value === value);
  return option ? option.label : "Select option";
}

interface Knowyou1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onNoSpace?: () => void;
}

export default function Knowyou1({
  formData,
  setFormData,
  onNext,
  onNoSpace,
}: Knowyou1Props) {
  const [loading, setLoading] = useState(false);
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Store initial form data to detect changes
  const initialFormDataRef = useRef<any>(null);

  // Track if this is the first load
  const isFirstLoad = useRef(true);

  // Capture initial form data on first render
  useEffect(() => {
    if (isFirstLoad.current && formData) {
      initialFormDataRef.current = {
        pref_gender: formData.pref_gender || "",
        pref_religion: formData.pref_religion || "",
        pref_year: formData.pref_year || "",
        pref_faculty: formData.pref_faculty || "",
        hobbies: [...(formData.hobbies || [])],
        pet: formData.pet || "",
      };
      isFirstLoad.current = false;
    }
  }, [formData]);

  const hobbies: string[] = formData.hobbies || [];
  const pet: string = formData.pet || "";

  // Check if data has changed
  const checkForChanges = (newData: any) => {
    if (!initialFormDataRef.current) return true;

    const initial = initialFormDataRef.current;
    const current = {
      pref_gender: newData.pref_gender || "",
      pref_religion: newData.pref_religion || "",
      pref_year: newData.pref_year || "",
      pref_faculty: newData.pref_faculty || "",
      hobbies: [...(newData.hobbies || [])].sort(),
      pet: newData.pet || "",
    };

    const initialHobbies = [...(initial.hobbies || [])].sort();
    const currentHobbies = [...(current.hobbies || [])].sort();

    const hasChanged =
      initial.pref_gender !== current.pref_gender ||
      initial.pref_religion !== current.pref_religion ||
      initial.pref_year !== current.pref_year ||
      initial.pref_faculty !== current.pref_faculty ||
      JSON.stringify(initialHobbies) !== JSON.stringify(currentHobbies) ||
      initial.pet !== current.pet;

    setHasChanges(hasChanged);
    return hasChanged;
  };

  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    checkForChanges(newData);
  };

  const toggleHobby = (hobby: string) => {
    const next = hobbies.includes(hobby)
      ? hobbies.filter((h) => h !== hobby)
      : [...hobbies, hobby];
    const newData = { ...formData, hobbies: next };
    setFormData(newData);
    checkForChanges(newData);
  };

  const saveAndContinue = async () => {
    // Validate all required fields
    if (
      !formData.pref_gender ||
      !formData.pref_religion ||
      !formData.pref_year ||
      !formData.pref_faculty ||
      !hobbies.length ||
      !formData.pet
    ) {
      showAlert("Please complete all required fields", "warning");
      return;
    }

    if (loading) return;

    // If no changes were made, just open the modal without saving
    if (!hasChanges) {
      setShowSpaceModal(true);
      return;
    }

    setLoading(true);

    // Get user session data
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    // Prepare payload - matching the database columns in users table
    const payload = {
      action: "knowyou1",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      gender: formData.pref_gender,
      religion: formData.pref_religion,
      level: formData.pref_year,
      faculty: formData.pref_faculty,
      hobby: hobbies.join(", "),
      pet: formData.pet,
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
          pref_gender: formData.pref_gender,
          pref_religion: formData.pref_religion,
          pref_year: formData.pref_year,
          pref_faculty: formData.pref_faculty,
          hobbies: hobbies,
          pet: formData.pet,
        }));

        // Reset initial data to current data (so changes are reset)
        initialFormDataRef.current = {
          pref_gender: formData.pref_gender,
          pref_religion: formData.pref_religion,
          pref_year: formData.pref_year,
          pref_faculty: formData.pref_faculty,
          hobbies: [...hobbies],
          pet: formData.pet,
        };
        setHasChanges(false);

        // Open the Space Availability modal after saving
        setTimeout(() => {
          setShowSpaceModal(true);
        }, 500);
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

  // Handle navigation from modal
  const handleHasSpace = () => {
    setShowSpaceModal(false);
    if (onNext) onNext();
  };

  const handleNoSpace = () => {
    setShowSpaceModal(false);
    if (onNoSpace) onNoSpace();
  };

  return (
    <section className="mx-1 md:mx-0 md:px-10 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EECE]">
      {/* Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 border-2 box-border" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
            <a className="w-15 h-2 bg-[#3A3A3A]" />
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
            onClick={() => navigate("/studentdash")}
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
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label>Pref. Gender</Label>
                  <IconOptionGroup
                    options={genderOptions}
                    value={formData.pref_gender ?? ""}
                    onChange={(id) => updateField("pref_gender", id)}
                    className="ml-6"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Pref. Religion</Label>
                  <IconOptionGroup
                    options={religionOptions}
                    value={formData.pref_religion ?? ""}
                    onChange={(id) => updateField("pref_religion", id)}
                    className="ml-6"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Level</Label>
                  <InfoPill
                    className="bg-white cursor-pointer"
                    onClick={() => setShowYearModal(true)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          formData.pref_year
                            ? limitDisplay(formData.pref_year, 15)
                            : "Choose preference"
                        }
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Faculty</Label>
                  <InfoPill
                    className="bg-white cursor-pointer"
                    onClick={() => setShowFacultyModal(true)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          formData.pref_faculty
                            ? limitDisplay(formData.pref_faculty, 15)
                            : "Choose preference"
                        }
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div
                  className="space-y-1"
                  onClick={() => setShowHobbiesModal(true)}
                >
                  <Label>How do you Chill?</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          hobbies.length
                            ? limitDisplay(hobbies.join(", "), 12)
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
                  onClick={() => setShowPetModal(true)}
                >
                  <Label>Pet Tolerance</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={
                          pet
                            ? limitDisplay(getPetLabel(pet), 20)
                            : "Select option"
                        }
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
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

      {/* Hobbies Modal */}
      {showHobbiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Select Hobbies</h3>
              <button onClick={() => setShowHobbiesModal(false)}>Close</button>
            </div>
            {hobbiesOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={hobbies.includes(opt)}
                  onChange={() => toggleHobby(opt)}
                />
                {opt}
              </label>
            ))}
            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowHobbiesModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Pet Modal */}
      {showPetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Pet Tolerance</h3>
              <button onClick={() => setShowPetModal(false)}>Close</button>
            </div>
            <div className="space-y-2">
              {petOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 py-1">
                  <input
                    type="radio"
                    name="petOption"
                    value={opt.value}
                    checked={pet === opt.value}
                    onChange={() => {
                      updateField("pet", opt.value);
                      setShowPetModal(false);
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowPetModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Year Modal */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Select Preferred Year</h3>
              <button onClick={() => setShowYearModal(false)}>Close</button>
            </div>
            <div className="space-y-2">
              {yearOptions
                .filter((o) => o.value)
                .map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 py-1"
                  >
                    <input
                      type="radio"
                      checked={formData.pref_year === opt.value}
                      onChange={() => {
                        updateField("pref_year", opt.value);
                        setShowYearModal(false);
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
            </div>
            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowYearModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Faculty Modal */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Select Preferred Faculty</h3>
              <button onClick={() => setShowFacultyModal(false)}>Close</button>
            </div>
            <div className="space-y-2">
              {facultyOptions
                .filter((o) => o.value)
                .map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 py-1"
                  >
                    <input
                      type="radio"
                      checked={formData.pref_faculty === opt.value}
                      onChange={() => {
                        updateField("pref_faculty", opt.value);
                        setShowFacultyModal(false);
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
            </div>
            <button
              className="w-full mt-4 py-2 bg-black text-white rounded"
              onClick={() => setShowFacultyModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Space Availability Modal */}
      {showSpaceModal && (
        <div className="fixed inset-0 bg-black/90 z-50 scrollbar-hide overflow-y-scroll no-scrollbar">
          <div className="relative mx-2 md:mx-auto my-10 md:w-[500px] bg-[#F4F6F5] border-3 rounded-4xl border-black p-6">
            <div
              className="border-2 border-white absolute -top-3 -right-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setShowSpaceModal(false)}
            >
              <FaTimes className="text-white" />
            </div>
            <h2 className="text-3xl mt-5 font-medium text-center text-black">
              Space Availability
            </h2>
            <p className="text-sm text-black text-center mt-5">
              Hola, do you have a Hostel?
            </p>

            <div
              className="mt-1 mb-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />

            <div className="space-y-6">
              <div>
                <div
                  onClick={handleHasSpace}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#FEFCED]"
                >
                  <PiHouse className="text-black text-4xl ml-5" />
                  <span className="flex-1 text-black text-lg text-center font-medium">
                    Yes, I have a Space already
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-xs p-2 rounded-2xl text-black bg-white">
                    Connect directly to roommates, that need a space at your
                    Uni.
                  </span>
                </div>
              </div>

              <div>
                <div
                  onClick={handleNoSpace}
                  className="cursor-pointer relative flex border-1 pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#3A2A05]"
                >
                  <MdOutlineBed className="text-white text-3xl ml-5" />
                  <span className="flex-1 text-white text-lg text-center font-medium">
                    No, I don't have a Space
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-xs p-2 rounded-2xl text-black bg-white">
                    Connect directly to roommates, that need a space at your
                    Uni.
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
