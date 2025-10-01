import { useState } from "react";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import { BsClipboard2Minus } from "react-icons/bs";

/* ---------- Reusable Components ---------- */
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

/* ---------- Main OTP Page ---------- */
export default function Signup2({ onNext }: { onNext?: () => void }) {
  const [otp, setOtp] = useState("");
  //const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
 // const [message, setMessage] = useState("");
 // const [loading, setLoading] = useState(false);
  /* Replace handleVerifyOtp with this simple function */
  const handleGoNext = () => {
    if (onNext) onNext();
  };

 /* const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setStatus("invalid");
      setMessage("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://www.cribb.africa/api/verifyotp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("valid");
        setMessage("✅ OTP Verified successfully!");
      } else {
        setStatus("invalid");
        setMessage(data.message || "❌ Invalid OTP");
      }
    } catch {
      setStatus("invalid");
      setMessage("❌ Server error, try again");
    }
    setLoading(false);
  };*/

  return (
    <>
     

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
        {/* Progress Dots */}
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
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader
              title="Verify Call No."
              caption="Click on ‘Send Code’ and Paste the code sent here"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-6">
              {/* OTP Input */}
              {/* OTP Input */}
              <InfoPill
                className={clsx(
                  "bg-white flex items-center px-3 mb-1 border-2", // use gap instead of justify-between
                  status === "valid" && "border-green-600",
                  status === "invalid" && "border-red-600",
                  status === "idle" && "border-black" // black border instead of gray
                )}
              >
                <BsClipboard2Minus className="text-black text-lg md:text-3xl shrink-0" />
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
                {" "}
                <span className="text-xs rounded bg-white p-1">
                  08165000602
                </span>
              </div>

             {/* {message && (
                <p
                  className={clsx(
                    "text-xs text-center",
                    status === "valid" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {message}
                </p>
              )}*/} 

              {/* Send Code Button */}
              <InfoPill className="bg-white text-black">
                <button className="inline-flex items-center justify-center w-full disabled:opacity-50 gap-2">
                  Re-Send Code
                </button>
              </InfoPill>

              <InfoPill className="bg-black text-white">
                <button
                  className="inline-flex items-center justify-center w-full disabled:opacity-50 gap-2"
                  onClick={handleGoNext} // <--- direct go next
                >
                  Send Code
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

              {/* Alternate Verification */}
              <div className="flex justify-center text-xs md:text-sm">
                Can’t get OTP?{" "}
                <span className="text-[#0556F8] cursor-pointer ml-1">
                  Verify by Email
                </span>
              </div>
            </div>
          </Maincard>
        </div>
      </section>
    </>
  );
}
