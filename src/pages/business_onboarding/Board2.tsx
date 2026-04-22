import { useState, useEffect } from "react";
import imgright from "../../assets/board2.png";
import InfoPill from "../../components/Pill";
import { IoIosArrowBack, IoIosStarOutline } from "react-icons/io";
import {
  MdOutlineCreditCardOff,
  MdWallet,
  MdOutlineDashboard,
  MdOutlinePostAdd,
} from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import clsx from "clsx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TbUserSquare } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

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
        "text-sm md:text-md md:my-3 font-semibold ml-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Board2({
  mode,
  onBack,
  category,
  data,
  setData,
  board1Data,
}: {
  mode: "student" | "merchant";
  category: string;
  onBack?: () => void;
  data: {
    bname: string;
    bAbout: string;
    bAddress: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      bname: string;
      bAbout: string;
      bAddress: string;
    }>
  >;
  board1Data: {
    category: string;
    bemail: string;
    bNo: string;
    whatsapp: string;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [openmodal, setOpen] = useState(false);
  const [showCongrats, setCongrats] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const { user, category } = loginData;

    if (!user || !category) {
      alert("Login session invalid. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getPlan", user, category }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.plan && Object.keys(data.plan).length > 0) {
          setHasPlan(true);
        }
      })
      .catch((err) => console.error("Network error:", err))
      .finally(() => setLoading(false));
  }, []);

  const canContinue = data.bname && data.bAbout && data.bAddress;

  const handleSave = async () => {
    if (!canContinue) {
      alert("All fields are required.");
      return;
    }

    const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const signup_key = login_data.signup_key;
    const user = login_data.user;

    setLoading(true);

    try {
      // -------- save board1 first ----------
      const res1 = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: board1Data.category,
          bemail: board1Data.bemail,
          bNo: board1Data.bNo,
          whatsapp: board1Data.whatsapp,
          board1: true,
          user,
          mode,
          signup_key,
        }),
      });

      const r1 = await res1.json();

      if (!r1.success) {
        alert(r1.message || "Failed to save board1 data.");
        return;
      }

      // -------- then save board2 ----------
      const res2 = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          bname: data.bname,
          bAbout: data.bAbout,
          bAddress: data.bAddress,
          board2: true,
          user,
          mode,
          signup_key,
        }),
      });

      const r2 = await res2.json();

      if (r2.success) {
        login_data.verification = "4";
        sessionStorage.setItem("login_data", JSON.stringify(login_data));
        alert("Saved successfully!");
        setOpen(true);
      } else {
        alert(r2.message || "Failed to save board2 data.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const freeplan = async () => {
    const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const signup_key = login_data.signup_key;
    const user = login_data.user;

    setLoading(true);
    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          freeplan: true,
          user,
          mode,
          signup_key,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOpen(false);
        setCongrats(true);
      } else {
        alert(data.message || "Failed to save data.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getListingRoute = () => {
    if (category === "Agent") return "agentlistings";
    if (category === "Landlord") return "landlordlistings";
    return "listings"; // fallback safety
  };

  return (
    <>
      <section className="mx-1 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
        <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
          <div></div>
          <div className="min-w-0 flex items-center justify-center">
            <div className="flex gap-2 flex-wrap justify-center max-w-full">
              <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
              <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
          <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
            <img
              src={imgright}
              alt="Traveler with suitcase"
              className="h-full w-full object-cover"
            />
            <button
              onClick={onBack}
              className="cursor-pointer absolute top-5 right-5 md:right-15 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
            >
              <IoIosArrowBack size={14} />
            </button>
          </div>

          <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
            <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
              <SectionHeader
                title="Know Your Business"
                caption="Few Details to help us Tailor your Experience"
              />

              <div className="md:px-5 pb-4 pt-3 space-y-4">
                {category === "Agent" && (
                  <div className="flex items-center rounded my-5 gap-1 pr-4 w-full justify-between">
                    <button className="flex items-center w-60 border-3 p-3 rounded-xl gap-3 transition text-left">
                      <HiOutlineUserCircle className="h-8 w-8" />
                      <span className="truncate text-xl">AGENT</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <IoIosStarOutline className="h-6 w-6 text-black" />
                      <span className="flex items-center font-semibold gap-1 rounded-lg bg-white px-2 py-1 text-sm text-black shadow whitespace-nowrap">
                        5.0 (0)
                      </span>
                    </div>
                  </div>
                )}

                {category === "Landlord" && (
                  <div className="flex items-center rounded gap-1 pr-4 w-full justify-between">
                    <button className="flex items-center w-60 border-3 p-3 rounded-xl gap-3 transition text-left">
                      <TbUserSquare className="h-8 w-8" />
                      <span className="truncate text-xl">LANDLORD</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <IoIosStarOutline className="h-6 w-6 text-black" />
                      <span className="flex items-center font-semibold gap-1 rounded-lg bg-white px-2 py-1 text-sm text-black shadow whitespace-nowrap">
                        1.2 (85)
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Business Name</Label>
                  <InfoPill className="bg-white">
                    <input
                      value={data.bname}
                      onChange={(e) =>
                        setData((p) => ({ ...p, bname: e.target.value }))
                      }
                      className="w-full appearance-none bg-transparent text-xs outline-none"
                      placeholder="Enter your business name"
                      type="text"
                    />
                  </InfoPill>
                </div>

                <div>
                  <Label>About</Label>
                  <InfoPill className="bg-white">
                    <input
                      value={data.bAbout}
                      onChange={(e) =>
                        setData((p) => ({ ...p, bAbout: e.target.value }))
                      }
                      className="w-full appearance-none bg-transparent text-xs outline-none"
                      placeholder="Enter your business description"
                    />
                  </InfoPill>
                </div>

                <div>
                  <Label>Business Address</Label>
                  <InfoPill className="bg-white">
                    <input
                      value={data.bAddress}
                      onChange={(e) =>
                        setData((p) => ({ ...p, bAddress: e.target.value }))
                      }
                      className="w-full appearance-none bg-transparent text-xs outline-none"
                      placeholder="Enter your business address"
                    />
                  </InfoPill>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!canContinue || loading}
                  className="w-full cursor-pointer mt-10 relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#CDBCEC] disabled:opacity-60"
                >
                  <MdOutlinePostAdd className="ml-2 text-3xl md:text-4xl" />
                  <span className="flex-1 text-black text-xl text-center font-medium">
                    Start Listing
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl md:text-4xl" />
                  </div>
                </button>
              </div>
            </Maincard>
          </div>
        </div>
      </section>

      {openmodal && (
        <div className="fixed inset-0 bg-black/90 z-50 scrollbar-hide overflow-y-scroll no-scrollbar">
          <div className="relative mx-2 md:mx-auto my-10 md:w-[500px] bg-[#F4F6F5] border-3 rounded-4xl border-black p-6">
            <div
              className="border-2 border-white absolute -top-3 -right-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <FaTimes className="text-white text-2xl" />
            </div>

            <h2 className="text-3xl mt-5 font-medium text-center text-black">
              Plan
            </h2>

            <p className="text-sm text-black text-center mt-5">
              Simple, Transparent Plan based on your need
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
              {/* Paid Plan */}
              <div>
                <div
                  onClick={() => navigate("/businessplan")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-black items-center pr-2 rounded-full bg-[#CDBCEC]"
                >
                  <MdWallet className="text-black text-4xl ml-5" />
                  <span className="flex-1 text-black text-lg text-center font-medium">
                    Choose a Paid Plan
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
                </div>
              </div>

              {/* Free Trial */}
              {!hasPlan && (
                <div>
                  <div
                    onClick={freeplan}
                    className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-black items-center pr-2 rounded-full bg-white"
                  >
                    <MdOutlineCreditCardOff className="text-black text-4xl ml-5" />
                    <span className="flex-1 text-black text-lg text-center font-medium">
                      14-days Free Trial
                    </span>
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <FiArrowRight className="text-white text-2xl" />
                    </div>
                  </div>

                  <div className="flex justify-center mt-1">
                    <span className="inline-block text-xs p-2 rounded-2xl text-black bg-white">
                      1 listing : Unlimited bookings : Reply requests for free
                    </span>
                  </div>
                </div>
              )}

              <div className="text-sm font-semibold text-black text-center">
                ----------------- OR -----------------
              </div>

              {/* Dashboard */}
              <div>
                <div
                  onClick={() => navigate("/businessdash")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-black items-center pr-2 rounded-full bg-black"
                >
                  <MdOutlineDashboard className="text-white text-4xl ml-5" />
                  <span className="flex-1 text-white text-lg text-center font-medium">
                    Go to Dashboard
                  </span>
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-2xl" />
                  </div>
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

      {showCongrats && (
        <div className="fixed inset-0 bg-black/90 z-50 py-10 items-center flex justify-center scrollbar-hide overflow-y-scroll no-scrollbar">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative">
            <p className="text-sm text-center text-gray-600 mb-4">
              Your 14-day free trial has started. You have access to all
              features for the next 14 days. Enjoy exploring!
            </p>

            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={() =>
                  navigate(`/businessdash?goto=${getListingRoute()}`)
                }
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
