import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";
import InfoPill from "../../components/Pill";
import { BsClipboard2Minus } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { MdDoubleArrow } from "react-icons/md";

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

function Maincard({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "relative rounded-2xl md:rounded-4xl px-5 border-4 shadow",
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
  status,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  status: "idle" | "valid" | "invalid";
}) {
  return (
    <div className="space-y-1">
      <Label className="ml-8">{label}</Label>
      <InfoPill
        className={clsx(
          "bg-white border",
          status === "valid" && "border-green-600",
          status === "invalid" && "border-red-600",
          status === "idle" && "border-black"
        )}
      >
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
      <p className="text-center text-xs md:text-md pt-3">{caption}</p>
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

export default function ForgotPassword() {
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [card2, setcard2] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // check if all fields except referral are filled
 const canContinue = password && confirm && password === confirm;


  // password match logic
  const confirmStatus =
    confirm === "" ? "idle" : confirm === password ? "valid" : "invalid";

  // session storage
  const signupData = JSON.parse(sessionStorage.getItem("signup_data") || "{}");
  const callNo = signupData.callNo;
  const email = signupData.email;
  const mode = signupData.mode;

  // detect mode automatically
  const type = email ? "email" : "callNo";

  // countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Send OTP
  const handleSendCode = async () => {
    if (sending) return;
    setSending(true);

    try {
      const body =
        type === "email"
          ? { email, email_flag: true, reset: true, mode }
          : { call_no: callNo, sms: true, reset: true, mode };

      const res = await fetch("https://www.cribb.africa/apiotpsend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setCodeSent(true);
        setCountdown(60);
      } else {
        // show error from backend
        alert(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Send OTP failed", err);
      alert("Network error. Please try again later.");
    }

    setSending(false);
  };

  // Verify OTP
  const handleVerify = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_no: callNo,
          email,
          mode,
          reset: true,
          otp,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.signup_key) {
          sessionStorage.setItem("signup_key", data.signup_key);
          setcard2(true);
        }
      } else {
        setErrorMessage(data.message || "Invalid OTP, try again.");
      }
    } catch (err) {
      console.error("Verify failed", err);
      setErrorMessage("Something went wrong, please retry.");
    }
    setLoading(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && /^\d{6}$/.test(text)) setOtp(text);
    } catch {
      alert("Paste failed");
    }
  };


  const handlechange = async () => {
    if (!canContinue) return;

    const signup_key = sessionStorage.getItem("signup_key");
    if (!signup_key) return alert("Missing signup key from first step");

    const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        changed: true,
        email,
        call_no: callNo,
        password: password,
        signup_key, // send the key to PHP
        mode: mode
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      alert("Password changed successfully");
      navigate("/login");
    } else {
      alert(data.message || "Something went wrong");
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

        {/* Right: Empty */}
        <div />
      </nav>

      <section
        className="px-2 pt-5 md:pt-10 pb-20 min-h-screen flex flex-col items-center justify-center text-black"
        style={{
          backgroundImage: `url(${signbg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 items-center w-full md:w-2/5">
          {!card2 ? (
            <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
              {/* Back button */}
              <button
                onClick={() => navigate("/login")}
                className="absolute cursor-pointer top-3 left-3 bg-black text-white rounded-full p-2 shadow"
              >
                <IoChevronBack className="text-base" />
              </button>

              <SectionHeader
                title="Forgot Password?"
                caption="Chill, Let’s setup a new one ASAP"
              />

              <div className="md:px-5 pb-4 pt-3 space-y-6">
                <Label className="ml-8">ENTER OTP / PASSKEY</Label>
                <InfoPill className="bg-white flex items-center px-3 mb-1 border-2 border-black">
                  <BsClipboard2Minus
                    className="text-black text-lg md:text-3xl shrink-0 cursor-pointer"
                    onClick={handlePaste}
                  />
                  <input
                    type="text"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="flex-1 text-center text-sm md:text-xl tracking-[1em] bg-transparent outline-none"
                  />
                </InfoPill>

                <div className="w-full flex pr-5 justify-end">
                  <span className="text-xs rounded bg-white p-1">
                    {type === "email" ? email : callNo}
                  </span>
                </div>

                {!codeSent ? (
                  <InfoPill className="bg-black text-white">
                    <button
                      onClick={handleSendCode}
                      disabled={sending}
                      className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50 gap-2"
                    >
                      {sending ? "Sending..." : "Send Code"}
                    </button>
                  </InfoPill>
                ) : (
                  <InfoPill className="bg-white text-black">
                    <button
                      disabled={sending || countdown > 0}
                      onClick={handleSendCode}
                      className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50 gap-2"
                    >
                      {sending
                        ? "Sending..."
                        : countdown > 0
                        ? `Re-send in ${Math.floor(countdown / 60)}:${String(
                            countdown % 60
                          ).padStart(2, "0")}`
                        : "Re-Send Code"}
                    </button>
                  </InfoPill>
                )}

                {codeSent && otp.length === 6 && (
                  <InfoPill className="bg-black text-white">
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="inline-flex cursor-pointer items-center justify-center w-full gap-2 disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </InfoPill>
                )}

                {errorMessage && (
                  <p className="text-red-600 text-center text-sm mt-2">
                    {errorMessage}
                  </p>
                )}
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
                    Remember Password?
                    <span
                      className="text-[#0556F8] cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Sign-up
                    </span>
                  </span>
                </div>
                
              </div>
            </Maincard>
          ) : (
            <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
                        <SectionHeader
                title="Forgot Password?"
                caption="Chill, Let’s setup a new one ASAP"
              />
            
                        <div className="md:px-5 pb-4 pt-3 space-y-4">
                         
                          <InputField
                            label="PASSWORD"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            status={password ? "valid" : "idle"}
                          />
                          <InputField
                            label="CONFIRM PASSWORD"
                            placeholder="Re-enter your password"
                            type="password"
                            value={confirm}
                            onChange={setConfirm}
                            status={confirmStatus}
                          />
                          
                          {/* Continue Button */}
                          <InfoPill className="mt-5 md:mt-10 bg-black text-white">
                            <button
                              className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                              onClick={handlechange}
                              disabled={!canContinue}
                            >
                              <span className="text-xl">Proceed</span>
                              <MdDoubleArrow className="ml-2 text-2xl md:text-4xl" />
                            </button>
                          </InfoPill>
                        </div>
                      </Maincard>
          )}
        </div>
      </section>
    </>
  );
}
