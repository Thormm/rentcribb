import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import InfoPill from "../../../components/Pill";
import { MdOutlinePostAdd, MdLightbulbOutline } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import RoommateCard, { type Roommate } from "../components/RoommateCard";

// ----------------------- Reusable Label -----------------------
type LabelProps = React.PropsWithChildren<{ className?: string }>;
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

// ----------------------- Section Header -----------------------
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">{title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        We’ve made it a soft experience getting a Match...
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

// ----------------------- Tabs -----------------------
const tabs = ["Explore", "Requests", "Match"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex md:mt-5 border-2 py-4 rounded-2xl relative overflow-hidden bg-white"
      style={{ borderStyle: "dashed", borderColor: "#0000004D" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : "",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ----------------------- Main Component -----------------------
const Rommates = () => {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [activeTab, setActiveTab] = useState("Explore");
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const [toggling, setToggling] = useState(false);

  // ✅ Visibility flag from backend — "yes" → Active, anything else → INACTIVE
  const isVisible = String(hostel?.open ?? "").toLowerCase() === "yes";

  // NEW: Build roommate data from hostel
  const roommateData: Roommate | null = useMemo(() => {
    if (!hostel) return null;
    return {
      id: parseInt(hostel.id) || Math.random(),
      gender: hostel.gender || "",
      religion: hostel.religion || "",
      level: hostel.level || "",
      faculty: hostel.faculty || "",
      move_in_date: hostel.availability || "",
      duration: hostel.duration || "",
      type: hostel.type || "",
      price: hostel.amount_share ? String(hostel.amount_share) : "",
      features: hostel.hobby
        ? hostel.hobby.split(",").map((s: string) => s.trim())
        : [],
      pet: hostel.pet || "",
      school: hostel.school || "",
      created_at: new Date().toISOString(),
      value: "You",
    };
  }, [hostel, login?.user]);

  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchHostel = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "student_roommate_details",
          whats: login?.user,
        }),
      });

      const data = await res.json();

      if (data.data) {
        // ✅ Verification guard — must be verified to see roommates
        // Backend returns `verification: 0` (or "0") when the student
        // hasn't completed the "know you" flow yet.
        const verification = data.data.verification;
        if (
          verification === 0 ||
          verification === "0" ||
          verification === false
        ) {
          navigate("/knowyou", { replace: true });
          return;
        }

        setHostel(data.data);
      } else {
        console.log(data.message);
      }
    };

    fetchHostel();
  }, [login?.user, navigate]);

  const handleToggleVisibility = async () => {
    if (!hostel || toggling) return;
    setToggling(true);

    // Optimistic update
    const previous = hostel.open;
    const next = String(previous ?? "").toLowerCase() === "yes" ? "no" : "yes";
    setHostel({ ...hostel, open: next });

    try {
      const res = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_roommate_visibility",
          user: login?.user,
          signup_key: login?.signup_key, // <- confirm this key exists
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // Roll back on failure
        setHostel({ ...hostel, open: previous });
        console.error("Toggle failed:", data.reply);
      } else {
        // Trust the server's value
        setHostel({ ...hostel, open: data.open });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      setHostel({ ...hostel, open: previous });
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          <SectionHeader title="Roommates" />

          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Explore Tab */}
            {activeTab === "Explore" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label>VISIBILITY</Label>
                    <InfoPill>
                      <div className="inline-flex items-center justify-between w-full">
                        <span className=" text-xs md:text-sm">
                          {isVisible
                            ? "Active : Yes, Receiving Requests"
                            : "INACTIVE : Not Receiving Requests"}
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleVisibility}
                          disabled={toggling}
                          className="bg-black space-x-1 px-4 py-2 rounded-md text-[#D6FFC3] flex items-center disabled:opacity-60"
                        >
                          {isVisible ? <FaToggleOn /> : <FaToggleOff />}{" "}
                          <span className=" text-xs md:text-sm">SWITCH</span>
                        </button>
                      </div>
                    </InfoPill>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="justify-start flex ml-8">
                  <div className="flex flex-col items-center mt-15">
                    {roommateData && (
                      <RoommateCard card={roommateData} bgColor={"#EBD96B"} />
                    )}

                    <button
                      onClick={() => navigate("/knowyou")}
                      className="mt-6 bg-black text-semibold text-white w-40 py-4 rounded-lg shadow-md"
                    >
                      EDIT
                    </button>
                  </div>
                </div>

                <button className=" w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>

                <button
                  onClick={() => navigate("/explore")}
                  className="mt-5 w-full  flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white"
                >
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "Requests" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>HOW IT WORKS</Label>
                    <InfoPill className="relative flex items-center">
                      12
                      <MdLightbulbOutline className="pointer-events-none absolute right-5 text-black" />
                    </InfoPill>
                  </div>
                  <div>
                    <Label>FILTER</Label>
                    <InfoPill className="relative flex items-center">
                      Sortby
                      <FiChevronDown className="pointer-events-none absolute right-5 text-black" />
                    </InfoPill>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8 mb-10">
                  <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10">
                    --- YOUR LISTINGS -------------
                  </span>
                </div>
                <div className="overflow-x-auto md:min-w-150"></div>

                <button className="w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}

            {/* Match Tab */}
            {activeTab === "Match" && (
              <div className="p-2 md:p-5 mt-5 md:w-2/3">
                <span className="text-sm md:text-md font-semibold text-black tracking-wide mt-10">
                  --- YOUR LISTINGS ----------
                </span>

                <div className="overflow-x-auto md:min-w-150"></div>
                <button className="w-full mt-10 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                  <BiComment className="w-8 h-8" />
                  Rommate Requests
                </button>
                <button className="w-full mt-5 flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                  <MdOutlinePostAdd className="w-8 h-8" />
                  Explore Rommates
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rommates;
