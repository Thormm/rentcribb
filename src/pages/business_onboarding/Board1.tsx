import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgright from "../../assets/board1.png";
import InfoPill from "../../components/Pill";
import { IoIosArrowBack } from "react-icons/io";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";

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

export default function Board1({
  mode,
  onNext,
}: {
  mode: "student" | "merchant";
  onNext?: () => void;
}) {
  const navigate = useNavigate();

  // === State for input fields ===
  const [category, setCategory] = useState("");
  const [bemail, setEmail] = useState("");
  const [bNo, setCallNo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  // === Validate required fields ===
  const canContinue = category && bemail && bNo && whatsapp;

  // === Validation helpers ===
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^\+?[0-9]{8,15}$/.test(phone);

  // === Handle Save to API ===
  const handleSave = async () => {
    if (!canContinue) {
      alert("All fields are required.");
      return;
    }

    if (!isValidEmail(bemail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(bNo)) {
      alert(
        "Please enter a valid business call number (only digits, optional +, 8–15 digits)."
      );
      return;
    }

    if (!isValidPhone(whatsapp)) {
      alert(
        "Please enter a valid WhatsApp number (only digits, optional +, 8–15 digits)."
      );
      return;
    }

    const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const signup_key = login_data.signup_key;
    const user = login_data.user;
    login_data.category = category;
    login_data.email = bemail;

    // Save to sessionStorage
    sessionStorage.setItem("login_data", JSON.stringify(login_data));

    setLoading(true);
    try {
      const response = await fetch("https://www.cribb.africa/api_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          bemail,
          bNo,
          whatsapp,
          board1: true,
          user,
          mode,
          signup_key,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Saved successfully!");
        if (onNext) onNext();
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
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        {/* LEFT SIDE: IMAGE */}
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer absolute top-5 right-5 md:right-15 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader
              title="Know Your Business"
              caption="Few Details to help us Tailor your Experience"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4">
              {/* Category */}
              <div>
                <Label className="ml-8">Business Category</Label>
                <InfoPill className="bg-white">
                  <div className="inline-flex items-center justify-between w-full">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-transparent text-xs text-gray-500 outline-none"
                    >
                      <option value="">Select your Business Category</option>
                      <option value="Agent">Agent</option>
                      <option value="Landlord">Landlord</option>
                    </select>
                  </div>
                </InfoPill>
              </div>

              {/* Email */}
              <div>
                <Label className="ml-8">Business Email</Label>
                <InfoPill className="bg-white">
                  <input
                    value={bemail}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter your business email"
                    type="email"
                    inputMode="email"
                  />
                </InfoPill>
              </div>

              {/* Call Number */}
              <div>
                <Label className="ml-8">Business Call No.</Label>
                <InfoPill className="bg-white">
                  <input
                    value={bNo}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+]/g, "");
                      setCallNo(val);
                    }}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter business call number"
                    type="tel"
                    inputMode="tel"
                  />
                </InfoPill>
              </div>

              {/* Whatsapp */}
              <div>
                <Label className="ml-8">Whatsapp No.</Label>
                <InfoPill className="bg-white">
                  <input
                    value={whatsapp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+]/g, "");
                      setWhatsapp(val);
                    }}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter business whatsapp number"
                    type="tel"
                    inputMode="tel"
                  />
                </InfoPill>
              </div>

              {/* Proceed Button */}
              <div className="pt-2 w-full flex items-center justify-center">
                <InfoPill className="mt-2 bg-black text-white">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                    onClick={handleSave}
                    disabled={!canContinue || loading}
                  >
                    <span className="text-xl">
                      {loading ? "Saving..." : "Proceed"}
                    </span>
                    <MdDoubleArrow className="ml-2 text-2xl md:text-4xl" />
                  </button>
                </InfoPill>
              </div>
            </div>
          </Maincard>
        </div>
      </div>
    </section>
  );
}
