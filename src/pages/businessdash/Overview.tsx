import { useState, useEffect, useRef } from "react";
import { FiCamera, FiChevronDown, FiArrowUpRight } from "react-icons/fi";
import clsx from "clsx";
import InfoPill from "../../components/Pill"; // pill component
import { BsQuestionCircle } from "react-icons/bs";
import { PiHouse } from "react-icons/pi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { MdOutlinePending } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// === Helper to get login info from sessionStorage ===
const getLoginData = () => {
  try {
    const raw = sessionStorage.getItem("login_data") || "{}";
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

type Review = {
  id: number;
  date: string;
  name: string;
  type: "home" | "user";
  rating?: number;
  text?: string;
};

const reviews: Review[] = [
  //{ id: 1, date: "6th Jan, 2025", name: "Zarken Christian", type: "home" },
];

// Reusable Label
type LabelProps = React.PropsWithChildren<{ className?: string }>;
function Label({ children, className }: LabelProps) {
  return (
    <div
      className={clsx(
        "text-sm md:text-lg pl-5 md:pl-8 md:my-3 font-semibold text-black",
        className
      )}
    >
      {children}
    </div>
  );
}

// Header with help icon
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-5 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-extrabold">Hola, {title}</h2>
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
          <BsQuestionCircle className="text-white" size={40} />
        </div>
      </div>
      <p className="text-xs md:text-sm pt-5">
        Our goal is for your{" "}
        <span className="text-[#FFA1A1] font-semibold">SCHOOL LIFE</span> to be{" "}
        <span className="text-[#FFA1A1] font-semibold">MADE SOFT</span>
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

// Tabs component
const tabs = ["Profile", "Verify ID", "Next of Kin", "Feedback"];
function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) {
  return (
    <div
      className="flex mt-5 border-2 py-4 rounded-xl relative overflow-hidden"
      style={{
        borderStyle: "dashed",
        borderColor: "#0000004D",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={clsx(
            "flex-1 pb-2 pt-2 text-xs md:text-lg relative text-black font-medium text-center",
            active === tab
              ? "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-3/4 after:h-1 after:bg-[#FFA1A1]"
              : ""
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// Full list of Nigerian states + FCT
const NIGERIA_STATES = [
  { value: "", label: "Select State" },
  { value: "abia", label: "Abia" },
  { value: "adamawa", label: "Adamawa" },
  { value: "akwa_ibom", label: "Akwa Ibom" },
  { value: "anambra", label: "Anambra" },
  { value: "bauchi", label: "Bauchi" },
  { value: "benue", label: "Benue" },
  { value: "borno", label: "Borno" },
  { value: "cross_river", label: "Cross River" },
  { value: "delta", label: "Delta" },
  { value: "ebonyi", label: "Ebonyi" },
  { value: "edo", label: "Edo" },
  { value: "ekiti", label: "Ekiti" },
  { value: "enugu", label: "Enugu" },
  { value: "gombe", label: "Gombe" },
  { value: "imo", label: "Imo" },
  { value: "jigawa", label: "Jigawa" },
  { value: "kaduna", label: "Kaduna" },
  { value: "kano", label: "Kano" },
  { value: "katsina", label: "Katsina" },
  { value: "kebbi", label: "Kebbi" },
  { value: "kogi", label: "Kogi" },
  { value: "kwara", label: "Kwara" },
  { value: "lagos", label: "Lagos" },
  { value: "nasarawa", label: "Nasarawa" },
  { value: "niger", label: "Niger" },
  { value: "ogun", label: "Ogun" },
  { value: "ondo", label: "Ondo" },
  { value: "oshun", label: "Oshun" },
  { value: "oyo", label: "Oyo" },
  { value: "plateau", label: "Plateau" },
  { value: "rivers", label: "Rivers" },
  { value: "sokoto", label: "Sokoto" },
  { value: "taraba", label: "Taraba" },
  { value: "yobe", label: "Yobe" },
  { value: "zamfara", label: "Zamfara" },
  { value: "fct", label: "FCT (Abuja)" },
];

const PROFILE_FETCH_URL = "https://www.cribb.africa/apigets.php";
const SAVE_URL = "https://www.cribb.africa/api_save.php";
const Overview = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Controls read-only + save button visibility
  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [isKinLocked, setIsKinLocked] = useState(false);

  // profile states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [callNo, setCallNo] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);

  // next of kin
  const [kinFirst, setKinFirst] = useState("");
  const [kinLast, setKinLast] = useState("");
  const [kinCall, setKinCall] = useState("");
  const [kinWhats, setKinWhats] = useState("");
  const [kinEmail, setKinEmail] = useState("");

  // feedback / UI
  const [expanded, setExpanded] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [key: number]: number }>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.rating || 0 }), {})
  );
  const [feedbackTexts, setFeedbackTexts] = useState<{ [key: number]: string }>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.text || "" }), {})
  );

  // refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetch data on mount
  useEffect(() => {
    const login = getLoginData();
    const whats = login?.user || "";
    if (!whats) return;

    fetch(PROFILE_FETCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "overviewfetchMerchant", whats }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.success) return;
        const p = data.profile || {};
        const k = data.next_kin || {};

        setFirstName(p.first || "");
        setLastName(p.last || "");
        setWhatsapp(p.whats || "");
        setAddress(p.address || "");
        setStateValue(p.state || "");
        setLandmark(p.landmark || "");
        setEmail(p.email || "");
        setCallNo(p.call_no || "");
        // profile_image from backend is expected to be a full URL (as per your PHP case)
        setProfileImage(p.profile_image || null);

        setKinFirst(k.kin_first || "");
        setKinLast(k.kin_last || "");
        setKinCall(k.kin_call || "");
        setKinWhats(k.kin_whats || "");
        setKinEmail(k.kin_email || "");
        // === LOCK PROFILE IF FIELDS ARE ALREADY FILLED ===
        if (p.address && p.state && p.landmark && p.profile_image) {
          setIsProfileLocked(true);
        }

        // === LOCK NEXT OF KIN IF ALREADY FILLED ===
        if (
          k.kin_first &&
          k.kin_last &&
          k.kin_call &&
          k.kin_whats &&
          k.kin_email
        ) {
          setIsKinLocked(true);
        }
      })
      .catch((err) => {
        console.error("Overview fetch error:", err);
      });
  }, []);

  // image select / preview
  const onAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setLocalImageFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(f);
  };

  // feedback handlers
  const handleStarClick = (reviewId: number, starIndex: number) => {
    setRatings((prev) => ({ ...prev, [reviewId]: starIndex + 1 }));
  };
  const handleTextChange = (reviewId: number, value: string) => {
    setFeedbackTexts((prev) => ({ ...prev, [reviewId]: value }));
  };

  // validation helpers
  const validateProfile = () => {
    if (!address || address.trim().length === 0) {
      alert("Please enter your full address.");
      return false;
    }
    if (!stateValue || stateValue.trim().length === 0) {
      alert("Please select your state.");
      return false;
    }
    if (!landmark || landmark.trim().length === 0) {
      alert("Please enter a landmark.");
      return false;
    }
    return true;
  };

  const validateKin = () => {
    if (!kinFirst.trim()) {
      alert("Please enter next of kin first name.");
      return false;
    }
    if (!kinLast.trim()) {
      alert("Please enter next of kin last name.");
      return false;
    }
    if (!kinCall.trim()) {
      alert("Please enter next of kin call number.");
      return false;
    }
    if (!kinWhats.trim()) {
      alert("Please enter next of kin WhatsApp number.");
      return false;
    }
    if (!kinEmail.trim()) {
      alert("Please enter next of kin email.");
      return false;
    }
    return true;
  };

  // Save profile (including optional image)
  const saveProfile = async () => {
    if (!validateProfile()) return;

    // ✅ Block saving if no profile image
    if (!localImageFile && !profileImage) {
      alert("Please upload a profile image before saving.");
      return;
    }

    const login = getLoginData();
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    // Use FormData if image present (multipart)
    const form = new FormData();
    form.append("action", "overviewupdate_profile_merchant");
    form.append("user", user);
    form.append("signup_key", signup_key);
    form.append("address", address);
    form.append("state", stateValue);
    form.append("landmark", landmark);

    if (localImageFile) {
      form.append("profile_image", localImageFile);
    }

    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        // NO content-type header with FormData
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Profile saved successfully.");
        if (data.profile_image) {
          setProfileImage(data.profile_image);
        }
        setLocalImageFile(null);
        setIsProfileLocked(true); // 🔒 lock fields after saving
      } else {
        alert(data.message || "Failed to save profile. Try again.");
      }
      console.log("Profile save response:", data);
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Network error while saving profile.");
    }
  };

  // Save next of kin (separate action)
  const saveNextOfKin = async () => {
    if (!validateKin()) return;

    const login = getLoginData();
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    const payload = {
      action: "overviewupdate_kin_merchant",
      user,
      signup_key,
      kin_first: kinFirst,
      kin_last: kinLast,
      kin_call: kinCall,
      kin_whats: kinWhats,
      kin_email: kinEmail,
    };

    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Next of kin saved.");
        setIsKinLocked(true); // 🔒 lock kin fields after saving
      } else {
        alert(data.message || "Failed to save next of kin.");
      }
      console.log("Next of kin save response:", data);
    } catch (err) {
      console.error("Save kin error:", err);
      alert("Network error while saving next of kin.");
    }
  };

  // single handleSave that dispatches based on active tab
  const handleSave = () => {
    if (activeTab === "Profile") saveProfile();
    else if (activeTab === "Next of Kin") saveNextOfKin();
    else {
      // Keep Feedback and Verify ID unchanged behaviour - fallback
      console.log("Save requested on tab:", activeTab);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please type your feedback before sending.");
      return;
    }

    const login = getLoginData();
    const user = login?.user || "";
    if (!user) {
      alert("Session expired, please log in again.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "overview_feedback_send_merchant",
          user,
          feedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Feedback sent successfully!");
        setFeedback("");
      } else {
        alert(data.message || "Failed to send feedback, please try again.");
      }
    } catch (err) {
      console.error("Feedback send error:", err);
      alert("Network error while sending feedback.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white md:py-10 mb-20">
      <section className="px-3 md:px-10 flex justify-center">
        <div className="w-full">
          {/* Header */}
          <SectionHeader title={firstName || "User"} />

          {/* Card */}
          <div className="mt-10 rounded-3xl border-4 border-black p-1 md:p-5 bg-[#F4F6F5]">
            {/* Tabs */}
            <Tabs active={activeTab} setActive={setActiveTab} />

            {/* Content */}
            {activeTab === "Profile" && (
              <div className="p-2 md:p-5 md:w-2/3">
                {/* Avatar Upload - left aligned */}
                <div className="flex justify-start my-5 md:my-10 pl-5">
                  {/* Image upload */}
                  <div
                    onClick={!isProfileLocked ? onAvatarClick : undefined}
                    style={{ cursor: isProfileLocked ? "default" : "pointer" }}
                    className="h-20 w-20 md:h-24 md:w-24 rounded-full border border-black bg-white flex items-center justify-center overflow-hidden"
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiCamera className="text-black" size={35} />
                    )}
                    {/* hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileSelected}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Inputs grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-10">
                  {/* Row 1 – First & Last Name */}
                  <div className="space-y-1">
                    <Label>FIRST NAME</Label>
                    <InfoPill className="px-5 md:px-8">
                      <input
                        type="text"
                        readOnly
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label>LAST NAME</Label>
                    <InfoPill className="px-5 md:px-8">
                      <input
                        type="text"
                        readOnly
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 2 – Call Number & WhatsApp */}
                  <div className="space-y-1">
                    <Label>CALL NUMBER</Label>
                    <InfoPill className="px-5 md:px-8">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm py-1 text-black">
                          {callNo}
                        </span>
                      </div>
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label>WHATSAPP NO</Label>
                    <InfoPill className="px-5 md:px-8 flex items-center justify-between">
                      <input
                        type="tel"
                        value={whatsapp}
                        readOnly
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="flex-1 text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 3 – Email (Full Width) */}
                  <div className="col-span-2 space-y-1">
                    <Label>EMAIL</Label>
                    <InfoPill className="px-5 md:px-8">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-xs md:text-sm py-1 text-black">
                          {email}
                        </span>
                      </div>
                    </InfoPill>
                  </div>

                  {/* Row 4 – Full Address (Full Width) */}
                  <div className="col-span-2 space-y-1">
                    <Label>FULL ADDRESS</Label>
                    <InfoPill
                      className={`px-5 md:px-8 ${
                        isProfileLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your Address"
                        readOnly={isProfileLocked}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 5 – State & Landmark */}
                  <div className="space-y-1">
                    <Label>STATE</Label>
                    <InfoPill
                      className={`px-5 md:px-8 relative flex items-center ${
                        isProfileLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <select
                        value={stateValue}
                        onChange={(e) => setStateValue(e.target.value)}
                        disabled={isProfileLocked}
                        className="appearance-none w-full bg-transparent outline-none py-1 text-xs md:text-sm text-black"
                      >
                        {NIGERIA_STATES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-8 text-gray-500" />
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label>LANDMARK</Label>
                    <InfoPill
                      className={`px-5 md:px-8 ${
                        isProfileLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Around Where"
                        readOnly={isProfileLocked}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>
                </div>

                {/* Save Changes */}
                {!isProfileLocked && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleSave}
                      className="py-3 text-md px-4 text-white font-medium bg-black shadow-lg rounded-lg"
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Verify ID */}
            {activeTab === "Verify ID" && (
              <div className="my-10 md:w-2/3">
                <div className="flex flex-col p-5 gap-8 bg-transparent">
                  {/* Coming Soon */}
                  <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black">
                    <MdOutlinePending className="w-8 h-8" />
                    Coming Soon ...
                  </button>

                  {/* Join Waitlist */}
                  <button className="w-full flex items-center justify-center gap-3 rounded-full font-normal bg-black px-5 py-4 shadow-sm text-lg text-white">
                    <FiMail className="w-8 h-8" />
                    Join Waitlist &gt;&gt;
                  </button>
                </div>
              </div>
            )}

            {/* Next of Kin */}
            {activeTab === "Next of Kin" && (
              <div className="p-2 md:p-5 w-full md:w-2/3">
                {/* Inputs grid */}
                <div className="grid mt-5 mb-10 grid-cols-2 md:grid-cols-2 gap-6">
                  {/* Row 1 — First & Last Name */}
                  <div className="space-y-1">
                    <Label>FIRST NAME</Label>
                    <InfoPill
                      className={`px-5 md:px-8 ${
                        isKinLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="text"
                        value={kinFirst}
                        onChange={(e) => setKinFirst(e.target.value)}
                        placeholder="Enter First name"
                        readOnly={isKinLocked}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label>LAST NAME</Label>
                    <InfoPill
                      className={`px-5 md:px-8 ${
                        isKinLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="text"
                        value={kinLast}
                        onChange={(e) => setKinLast(e.target.value)}
                        placeholder="Enter Last name"
                        readOnly={isKinLocked}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 2 — Call No. & WhatsApp No. */}
                  <div className="space-y-1">
                    <Label>CALL NO.</Label>
                    <InfoPill
                      className={`px-5 md:px-8 flex items-center justify-between ${
                        isKinLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="tel"
                        value={kinCall}
                        onChange={(e) => setKinCall(e.target.value)}
                        placeholder="Call No."
                        readOnly={isKinLocked}
                        className="flex-1 text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  <div className="space-y-1">
                    <Label>WHATSAPP NO</Label>
                    <InfoPill
                      className={`px-5 md:px-8 flex items-center justify-between ${
                        isKinLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="tel"
                        value={kinWhats}
                        onChange={(e) => setKinWhats(e.target.value)}
                        placeholder="Whatsapp No."
                        readOnly={isKinLocked}
                        className="flex-1 text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>

                  {/* Row 3 — Email (Full Width) */}
                  <div className="col-span-2 space-y-1">
                    <Label>EMAIL</Label>
                    <InfoPill
                      className={`px-5 md:px-8 ${
                        isKinLocked ? "bg-transparent" : "bg-white"
                      }`}
                    >
                      <input
                        type="email"
                        value={kinEmail}
                        onChange={(e) => setKinEmail(e.target.value)}
                        placeholder="Enter your email"
                        readOnly={isKinLocked}
                        className="w-full text-xs md:text-sm outline-none py-1 rounded-md text-black"
                      />
                    </InfoPill>
                  </div>
                </div>

                {/* Save Changes */}
                {!isKinLocked && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={handleSave}
                      className="py-3 text-md px-4 font-medium bg-black text-white shadow-lg rounded-lg"
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Feedback tab (un changed) */}
            {activeTab === "Feedback" && (
              <div className="md:w-2/3 p-5">
                {/* Header with dashed line */}
                <div className="flex items-center gap-3 my-4 md:my-8">
                  <span className="text-md font-semibold text-black tracking-wide">
                    -- GIVE REVIEWS -------------
                  </span>
                </div>

                {/* Reviews list */}
                <div className="space-y-3 md:space-y-6">
                  {reviews.map((r) => {
                    const isExpanded = expanded === r.id;
                    return (
                      <div
                        key={r.id}
                        className="border-black rounded-4xl border px-3 md:px-6 py-3 md:py-4 shadow-sm flex flex-col"
                      >
                        {/* Row 1 */}
                        <div className="flex items-center w-full gap-2 md:gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-5 md:w-6 flex justify-center">
                            <PiHouse className="w-4 h-4 md:w-6 md:h-6 text-black" />
                          </div>

                          {/* Date */}
                          <div className="flex-shrink-0 w-[90px] md:w-[120px] text-xs md:text-sm font-normal text-black text-left">
                            {r.date}
                          </div>

                          {/* Name */}
                          <div className="flex-grow min-w-0 text-xs md:text-sm text-black font-normal text-left break-words">
                            {r.name}
                          </div>

                          {/* Dropdown icon */}
                          <div
                            className="flex-shrink-0 w-5 md:w-6 flex justify-center cursor-pointer"
                            onClick={() =>
                              setExpanded(isExpanded ? null : r.id)
                            }
                          >
                            {isExpanded ? (
                              <IoIosArrowUp className="w-4 h-4 md:w-6 md:h-6 text-black" />
                            ) : (
                              <IoIosArrowDown className="w-4 h-4 md:w-6 md:h-6 text-black" />
                            )}
                          </div>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="mt-3 px-10">
                            {/* Stars + POST */}
                            <div className="flex flex-col items-center w-full gap-3">
                              {/* Stars + POST in same row, centered */}
                              <div className="flex items-center justify-center gap-3">
                                {/* Stars */}
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) =>
                                    i < (ratings[r.id] || 0) ? (
                                      <AiFillStar
                                        key={i}
                                        className="w-7 h-7 text-yellow-400 cursor-pointer"
                                        onClick={() => handleStarClick(r.id, i)}
                                      />
                                    ) : (
                                      <AiOutlineStar
                                        key={i}
                                        className="w-7 h-7 text-gray-300 cursor-pointer"
                                        onClick={() => handleStarClick(r.id, i)}
                                      />
                                    )
                                  )}
                                </div>

                                {/* POST button */}
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-black text-[#D6FFC3] text-sm font-medium cursor-pointer">
                                  <FiArrowUpRight className="w-4 h-4" />
                                  POST
                                </span>
                              </div>

                              {/* Feedback textarea */}
                              <div className="w-full">
                                <textarea
                                  value={feedbackTexts[r.id] || ""}
                                  onChange={(e) =>
                                    handleTextChange(r.id, e.target.value)
                                  }
                                  className="w-full min-h-[80px] py-2 px-3 text-black rounded-xl border border-black bg-white focus:outline-none resize-none text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback area */}
                <div className="mt-10">
                  <Label>FEEDBACK</Label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Hola, Cribb ..."
                    className="w-full min-h-[110px] py-3 px-5 md:px-10 text-[#00000080] rounded-2xl border border-black bg-white focus:outline-none resize-none text-sm placeholder-gray-400"
                  />
                </div>

                {/* Send button */}
                <div className="mt-5 md:mt-10 flex justify-center">
                  <button
                    onClick={handleSendFeedback}
                    disabled={isSending}
                    className="py-3 text-md px-8 font-medium bg-black shadow-lg rounded-lg text-white"
                  >
                    {isSending ? "SENDING..." : "SEND"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
