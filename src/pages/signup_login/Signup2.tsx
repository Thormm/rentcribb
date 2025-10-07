import { useState, useEffect } from "react";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import { BsClipboard2Minus } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";

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

interface Signup2Props {
  mode: "student" | "merchant";
  onNext?: () => void;
  onBack?: () => void;
}

export default function Signup2({ mode, onNext, onBack }: Signup2Props) {
  const [otp, setOtp] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // prevent spamming
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // session storage
  const signupData = JSON.parse(sessionStorage.getItem("signup_data") || "{}");
  const callNo = signupData.callNo;
  const email = signupData.email;
  const whats = signupData.whats;

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

  // Send SMS OTP
  const handleSendSMS = async () => {
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("https://www.cribb.africa/apiotpsend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_no: callNo, sms: true }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setCountdown(300);
      }
    } catch (err) {
      console.error("Send SMS failed", err);
    }
    setSending(false);
  };

  // Send Email OTP
  const handleSendEmail = async () => {
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("https://www.cribb.africa/apiotpsend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, email_flag: true }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setCountdown(60);
      }
    } catch (err) {
      console.error("Send Email failed", err);
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
          email: email,
          whats: whats,
          mode: mode,
          secondpage: true,
          otp,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.signup_key) {
          sessionStorage.setItem("signup_key", data.signup_key);
        }
        if (onNext) onNext();
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

  return (
    <section
      className="px-2 pt-5 md:pt-10 pb-20 min-h-screen flex flex-col items-center justify-center text-black"
      style={{
        backgroundImage: `url(${signbg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Progress dots */}
      <div className="grid grid-cols-1 mb-5">
        <div className="flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            <span className="w-10 md:w-15 h-2 bg-white border-2 border-white" />
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center w-full md:w-2/5">
        {/* ---------- Call No. Verification ---------- */}
        {!showEmail && (
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <button
              onClick={onBack}
              className="absolute cursor-pointer top-3 left-3 bg-black text-white rounded-full p-2 shadow"
            >
              <IoChevronBack className="text-base" />
            </button>

            <SectionHeader
              title="Verify Call No."
              caption="Click on ‘Send Code’ and Paste the code sent here"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-6">
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
                <span className="text-xs rounded bg-white p-1">{callNo}</span>
              </div>

              {!codeSent ? (
                <InfoPill className="bg-black text-white">
                  <button
                    onClick={handleSendSMS}
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
                    onClick={handleSendSMS}
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

              <div
                className="md:mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />

              <div className="flex justify-center text-xs md:text-sm">
                Can’t get OTP?
                <span
                  className="text-[#0556F8] cursor-pointer ml-1"
                  onClick={() => setShowEmail(true)}
                >
                  Verify by Email
                </span>
              </div>
            </div>
          </Maincard>
        )}

        {/* ---------- Email Verification ---------- */}
        {showEmail && (
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <button
              onClick={onBack}
              className="absolute cursor-pointer top-3 left-3 bg-black text-white rounded-full p-2 shadow"
            >
              <IoChevronBack className="text-base" />
            </button>

            <SectionHeader
              title="Verify Email"
              caption="Click on ‘Send Code’ and Paste the code sent here"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-6">
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
                <span className="text-xs rounded bg-white p-1">{email}</span>
              </div>

              {!codeSent ? (
                <InfoPill className="bg-black text-white">
                  <button
                    onClick={handleSendEmail}
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
                    onClick={handleSendEmail}
                    className="inline-flex items-center cursor-pointer justify-center w-full disabled:opacity-50 gap-2"
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
                <>
                  <InfoPill className="bg-black text-white">
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="inline-flex cursor-pointer items-center justify-center w-full gap-2 disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </InfoPill>

                  {errorMessage && (
                    <p className="text-red-600 text-center text-sm mt-2">
                      {errorMessage}
                    </p>
                  )}
                </>
              )}

              <div
                className="md:mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />

              <div className="flex justify-center text-xs md:text-sm">
                Can’t get Email?
                <span
                  className="text-[#0556F8] cursor-pointer ml-1"
                  onClick={() => setShowEmail(false)}
                >
                  Verify by SMS
                </span>
              </div>
            </div>
          </Maincard>
        )}
      </div>
    </section>
  );
}
