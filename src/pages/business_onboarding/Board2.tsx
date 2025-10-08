import { useState } from "react";
import imgright from "../../assets/board2.png";
import InfoPill from "../../components/Pill";
import { IoIosArrowBack, IoIosStarOutline } from "react-icons/io";
import { MdOutlineDashboard, MdOutlinePostAdd } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import clsx from "clsx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TbUserSquare } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";

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
    <div className="px-5 pt-8">
      <h3 className="text-3xl font-medium text-center">{title}</h3>
      <p className="text-center text-md pt-3">
        {caption ?? "Check out the Features of this Hostel"}
      </p>
      <div
        className="mt-1 w-95 border-t-4 mx-auto text-[#0000004D]"
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
    <div className={clsx("text-md my-3 font-semibold ml-0", className)}>
      {children}
    </div>
  );
}

export default function Board2({
  mode,
  onBack,
  category,
}: {
  mode: "student" | "merchant";
  category: "Agent" | "Landlord";
  onBack?: () => void;
}) {
  const [bname, setEmail] = useState("");
  const [bAbout, setCallNo] = useState("");
  const [bAddress, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [openmodal, setOpen] = useState(false);
  const navigate = useNavigate();

  const canContinue = bname && bAbout && bAddress;

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
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          bname,
          bAbout,
          bAddress,
          board2: true, // ✅ changed to board2
          user,
          mode,
          signup_key,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Saved successfully!");
        setOpen(true);
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

  return (
    <>
    <section className="flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[55%_45%] items-center">
        {/* LEFT IMAGE */}
        <div className="ml-20 -mr-10 relative z-0">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />
          <button
            onClick={onBack}
            className="cursor-pointer absolute top-4 right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* RIGHT FORM */}
        <div className="space-y-1 mr-20 -ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader
              title="Know Your Business"
              caption="Few Details to help us Tailor your Experience"
            />

            <div className="px-5 pb-4 pt-3 space-y-4">
              {/* Show only one section based on category */}
              {category === "Agent" && (
                <div className="flex items-center rounded gap-1 pr-4 w-full justify-between">
                  <button className="flex items-center w-60 border-3 p-3 rounded-xl gap-3 transition text-left">
                    <HiOutlineUserCircle className="h-8 w-8" />
                    <span className="truncate text-xl">AGENT</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <IoIosStarOutline className="h-6 w-6 text-black" />
                    <span className="flex items-center font-semibold gap-1 rounded-lg bg-white px-2 py-1 text-sm text-black shadow whitespace-nowrap">
                      1.2 (85)
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

              {/* Business Inputs */}
              <div>
                <Label className="ml-8">Business Name</Label>
                <InfoPill className="bg-white">
                  <input
                    value={bname}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter your business name"
                    type="text"
                  />
                </InfoPill>
              </div>

              <div>
                <Label className="ml-8">About</Label>
                <InfoPill className="bg-white">
                  <input
                    value={bAbout}
                    onChange={(e) => setCallNo(e.target.value)}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter your business description"
                  />
                </InfoPill>
              </div>

              <div>
                <Label className="ml-8">Business Address</Label>
                <InfoPill className="bg-white">
                  <input
                    value={bAddress}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter your business address"
                  />
                </InfoPill>
              </div>

              {/* Submit */}
              <button
                onClick={handleSave}
                disabled={!canContinue || loading}
                className="w-full cursor-pointer mt-10 relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#CDBCEC] disabled:opacity-60"
              >
                <MdOutlinePostAdd className="text-black text-2xl md:text-4xl ml-5" />
                <span className="flex-1 text-black text-md md:text-lg text-center font-medium">
                  Start Listing
                </span>
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                  <FiArrowRight className="text-white text-xl md:text-2xl" />
                </div>
              </button>
            </div>
          </Maincard>
        </div>
      </div>
    </section>



      {openmodal && (
        <div className="fixed inset-0 bg-black/90 z-50 scrollbar-hide overflow-y-scroll no-scrollbar">
          {/* Modal Box */}
          <div className="relative mx-2 md:mx-auto my-10 md:w-[500px] bg-[#F4F6F5] border-3 rounded-4xl border-black p-6">
            {/* Close */}
            <div
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <FaTimes className="text-white text-2xl" />
            </div>

            {/* Header */}
            <h2 className="text-3xl mt-5 font-medium text-center text-black">
              What Next
            </h2>
            <p className="text-xs md:text-sm text-black text-center mt-5">
              Hola, What would you like to do on Cribb
            </p>

            <div
              className="mt-1 mb-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />

            {/* Pills */}
            <div className="space-y-6">
              {/* listing */}
              <div>
                <div
                  onClick={() => navigate("/businessonboarding")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#CDBCEC]"
                >
                  <MdOutlinePostAdd className="text-black text-2xl md:text-4xl ml-5" />
                  <span className="flex-1 text-black text-md md:text-lg text-center font-medium">
                    List Your Space
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-xl md:text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-[7px] md:text-xs p-2 rounded-2xl mx-5 text-black bg-white">
                    List your entire or shared space and connect to students.
                    Explore rent requests and reply with your available spaces.
                  </span>
                </div>
              </div>

              {/* Waitlist */}
              <div>
                <div
                  onClick={() => {
                    window.location.href = "https://www.cribb.africa/waitlist";
                  }}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#FFFFFF]"
                >
                  <CgSandClock className="text-black text-2xl md:text-4xl ml-5" />
                  <span className="flex-1 text-black text-md md:text-lg text-center font-medium">
                    Joint Waitlist
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-xl md:text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-[7px] md:text-xs p-2 rounded-2xl mx-5 text-black bg-white">
                    Join the wait list to be among the first to experience
                    Cribb/Rent Share your pain points to help us build a softer
                    life for Uni-student{" "}
                  </span>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="text-xs md:text-md font-semibold text-black text-center">
                ----------------- OR -----------------
              </div>

              {/* Business dash */}
              <div>
                <div
                  onClick={() => navigate("/businessdash")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-black"
                >
                  <MdOutlineDashboard className="text-white text-2xl md:text-4xl ml-5" />
                  <span className="flex-1 text-white text-md md:text-lg text-center font-medium">
                    Go to Dashboard
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-xl md:text-2xl" />
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

      </>
  );
}
