import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import loginStudent from "../../assets/login1.png";
import loginMerchant from "../../assets/login2.png"; // add a second image
import { BiSolidBriefcase } from "react-icons/bi";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { LuLogIn } from "react-icons/lu";
import { PiHouse } from "react-icons/pi";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineDashboard, MdOutlinePostAdd } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";

function Maincard({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "rounded-2xl md:rounded-4xl px-5 border-4 shadow",
        className
      )}
    >
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
        {caption ?? "Welcome to Cribb"}
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

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="ml-8">{label}</Label>
      <InfoPill className="bg-white border border-black">
        <div className="inline-flex items-center justify-between w-full">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-xs md:text-sm outline-none"
          />
        </div>
      </InfoPill>
    </div>
  );
}

interface LoginpageProps {
  mode: "student" | "merchant";
}

export default function Loginpage({
  mode: initialMode = "student",
}: LoginpageProps) {
  const [mode, setMode] = useState<"student" | "merchant">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // existing "what next" modal open
  const [open, setOpen] = useState(false);

  // NEW: forgot password modal states
  const [showForgotPrompt, setShowForgotPrompt] = useState(false); // shows modal asking for email/phone if username empty

  const navigate = useNavigate();

  const toggleMode = () => {
    setMode((prev) => (prev === "student" ? "merchant" : "student"));
  };

  const isEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const normalizePhone = (val: string) => {
    // Very small normalization: remove spaces, parentheses, dashes.
    return val.replace(/[^\d+]/g, "");
  };

  const handleContinue = async () => {
    if (!username || !password || loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://www.cribb.africa/api_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          username,
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.removeItem("signup_key");
        sessionStorage.setItem("signup_key", data.signup_key);
        if (data.verification !== "otp") {
          setOpen(true);
          // Clear all previous sessionStorage items
          sessionStorage.clear();

          // Create new login_data object
          const login_data = {
            signup_key: data.signup_key,
            mode: mode,
            user: data.user,
            verification : data.verification
          };

          // Save to sessionStorage as JSON string
          sessionStorage.setItem("login_data", JSON.stringify(login_data));
        } else {
          sessionStorage.setItem("signupStep", "3"); // open step 3
          sessionStorage.setItem("signupMode", mode); // open as merchant
          sessionStorage.removeItem("signup_data");
          sessionStorage.setItem(
            "signup_data",
            JSON.stringify({
              email: data.email,
              callNo: data.call_no,
              whats: data.whats,
            })
          );
          alert("Continue Registration");
          window.location.href = "/signup";
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: perform navigation to forgotpassword page with appropriate session storage
  const goToForgotPassword = (identifier: string, type: "email" | "phone") => {
    // store signup_data expected by forgotpassword page
    // keep shape consistent with forgotpassword: { email, callNo, whats } where applicable
    const signupData: any = { mode };
    if (type === "email") signupData.email = identifier;
    else signupData.callNo = identifier;

    sessionStorage.setItem("signup_data", JSON.stringify(signupData));
    // Also store a small indicator to make it explicit
    sessionStorage.setItem("forgot_via", type);
    // navigate
    navigate("/forgotpassword");
  };

  const handleForgotClick = () => {
    const trimmed = username.trim();
    if (trimmed.length > 0) {
      if (isEmail(trimmed)) {
        goToForgotPassword(trimmed, "email");
      } else {
        const phone = normalizePhone(trimmed);
        goToForgotPassword(phone, "phone");
      }
    } else {
      // just show a modal telling user to enter email/phone
      setShowForgotPrompt(true);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        {/* Left: Flag */}
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start md:justify-center items-start gap-1 col-span-1 md:px-3">
          <img
            src={logo}
            alt="Cribb.Africa Logo"
            className="m-0 p-0 h-8 md:h-11"
          />
          <div className="flex flex-col items-end p-0 m-0">
            <span className="text-2xl p-0 m-0 md:text-4xl font-extrabold">
              Cribb
            </span>
            <span className="text-[10px] pr-1 -mt-2 md:text-sm text-black self-end">
              {mode === "student" ? "for Students" : "for Business"}
            </span>
          </div>
        </div>

        {/* Right: Toggle Button */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-4 md:h-8 object-contain"
            />
          </div>
          <button
            onClick={toggleMode}
            className="px-3 cursor-pointer md:px-5 py-2 md:py-3 bg-black flex items-center gap-2 text-white rounded-lg shadow-md whitespace-nowrap"
          >
            {mode === "student" ? (
              <>
                <BiSolidBriefcase className="text-xs md:text-2xl" />
                <span className="text-[8px] md:text-[15px] underline">
                  SWITCH TO BUSINESS &gt;&gt;
                </span>
              </>
            ) : (
              <>
                <HiOutlineUsers className="text-xs md:text-2xl" />
                <span className="text-[8px] md:text-[15px] underline">
                  SWITCH TO STUDENTS &gt;&gt;
                </span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Section */}
      <section
        className="px-2 pt-5 md:pt-10 pb-20 min-h-screen flex flex-col items-center justify-center text-black"
        style={{
          backgroundImage: `url(${signbg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
          {/* Left: Image changes with mode */}
          <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10">
            <img
              src={mode === "student" ? loginStudent : loginMerchant}
              alt="Login visual"
              className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
            />
          </div>

          {/* Right: Form */}
          <div className="space-y-1 md:mr-20 md:-ml-10">
            <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
              <SectionHeader
                title="Welcome back"
                caption={`Sign-in to your Cribb For ${
                  mode === "student" ? "Students" : "Business"
                } Account to continue`}
              />

              <div className="md:px-5 mt-3 md:mt-auto pb-4 pt-3 space-y-4">
                <InputField
                  label="EMAIL / PHONE NO."
                  placeholder="Enter email / phone no."
                  type="text"
                  value={username}
                  onChange={setUsername}
                />
                <InputField
                  label="PASSWORD"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />

                <div className="w-full flex pr-5 justify-end">
                  <span
                    className="text-xs rounded bg-white p-1 text-[#EC0000] cursor-pointer"
                    onClick={handleForgotClick}
                  >
                    Forgot Password?
                  </span>
                </div>

                {/* Continue Button */}
                <InfoPill className="mt-5 md:mt-5 bg-black text-white">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center w-full"
                    onClick={handleContinue}
                    disabled={!username || !password || loading}
                  >
                    <LuLogIn className="ml-2 text-2xl md:text-4xl" />
                    <span className="text-md md:text-xl">
                      &nbsp;&nbsp;{" "}
                      {loading
                        ? "Logging in..."
                        : `Login as ${
                            mode === "student" ? "Student" : "Business"
                          }`}
                    </span>
                  </button>
                </InfoPill>

                {/* Divider */}
                <div
                  className="md:mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
                  style={{
                    borderStyle: "dashed",
                    borderImage:
                      "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                  }}
                />

                {/* Footer link */}
                <div className="w-full flex text-xs md:text-sm md:pt-5 justify-center">
                  <span>
                    New to Cribb.Africa{" "}
                    {mode === "student" ? "For Students" : "For Business"}?{" "}
                    <span
                      className="text-[#0556F8] cursor-pointer"
                      onClick={() => navigate("/signup")}
                    >
                      Sign-up
                    </span>
                  </span>
                </div>
              </div>
            </Maincard>
          </div>
        </div>
      </section>

      {/* Modal Box 1*/}
      {open && mode === "student" && (
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
              {/* Roommate */}
              <div>
                <div
                  onClick={() => {
                    window.location.href = "https://www.cribb.africa/homepage";
                  }}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#FFDF73]"
                >
                  <HiOutlineUsers className="text-black text-2xl md:text-4xl ml-5" />
                  <span className="flex-1 text-black text-md md:text-lg text-center font-medium">
                    Find Rommate
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-xl md:text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-[7px] md:text-xs p-2 mx-5 rounded-2xl text-black bg-white">
                    New student or Returning? Have a room or looking for one.
                    Find your perfect match faster, safer and softer on Cribb.
                  </span>
                </div>
              </div>

              {/* Space */}
              <div>
                <div
                  onClick={() => navigate("/")}
                  className="cursor-pointer relative flex border-[1px] pl-3 py-2 border-[black] items-center pr-2 rounded-full bg-[#CDBCEC]"
                >
                  <PiHouse className="text-black text-2xl md:text-4xl ml-5" />
                  <span className="flex-1 text-black text-md md:text-lg text-center font-medium">
                    Rent A Space
                  </span>
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center">
                    <FiArrowRight className="text-white text-xl md:text-2xl" />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <span className="inline-block text-[7px] md:text-xs p-2 rounded-2xl mx-5 text-black bg-white">
                    We are actively building Cribb/Rent to make your renting
                    experience as a Uni-student softer. Join waitlist to be
                    first to try
                  </span>
                </div>
              </div>

              {/* Waitlist Space */}
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

              {/* Student Dash */}
              <div>
                <div
                  onClick={() => navigate("/studentdash")}
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

      {/* Modal Box 2*/}
      {open && mode === "merchant" && (
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

      {/* ==== FORGOT PROMPT MODAL ==== */}
      {showForgotPrompt && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative">
            <div
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setShowForgotPrompt(false)}
            >
              <FaTimes className="text-white" />
            </div>

            <h3 className="text-xl font-semibold text-center mb-2">
              Reset Password
            </h3>
            <p className="text-sm text-center text-gray-600 mb-4">
              Please enter your email or phone number in the login field above
              before requesting a password reset.
            </p>

            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={() => setShowForgotPrompt(false)}
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
