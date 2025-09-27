import { useState, useEffect } from "react";
import { BiSolidBriefcase } from "react-icons/bi";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";

/* ---------- Reusable Components ---------- */
function Maincard({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("rounded-2xl md:rounded-4xl px-5 border-4 shadow", className)}>
      {children}
    </div>
  );
}

function SectionHeader({ title, caption }: { title: string; caption?: string }) {
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

function Label({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("text-sm md:text-md md:my-3 font-semibold ml-0", className)}>{children}</div>;
}

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  status,
  error,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  status: "idle" | "valid" | "invalid";
  error: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="ml-8">{label}</Label>
      <InfoPill
        className={clsx(
          status === "valid" && "bg-green-100 border border-green-600",
          status === "invalid" && "bg-red-100 border border-red-600",
          status === "idle" && "bg-white"
        )}
      >
        <div className="inline-flex items-center justify-between w-full">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-[10px] md:text-xs outline-none"
          />
        </div>
      </InfoPill>
      {error && <p className="text-red-600 text-[11px] ml-2">{error}</p>}
    </div>
  );
}

/* ---------- Main Signup Page ---------- */
const Signup = () => {
  const [email, setEmail] = useState("");
  const [callNo, setCallNo] = useState("");
  const [whats, setWhats] = useState("");

  const [emailStatus, setEmailStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [callStatus, setCallStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [whatsStatus, setWhatsStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const [emailError, setEmailError] = useState("");
  const [callError, setCallError] = useState("");
  const [whatsError, setWhatsError] = useState("");

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // helper: validate on typing
  const validateField = async (field: string, value: string) => {
    if (!value) return { status: "invalid", error: `${field} is required` };

    try {
      const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, call_no: callNo, whats, check: field }),
      });
      const data = await res.json();

      if (data.success) {
        return { status: "valid", error: "" };
      } else {
        return { status: "invalid", error: data.message };
      }
    } catch {
      return { status: "invalid", error: "Server error" };
    }
  };

  useEffect(() => {
    if (email) {
      validateField("email", email).then((res) => {
        setEmailStatus(res.status as any);
        setEmailError(res.error);
      });
    }
  }, [email]);

  useEffect(() => {
    if (callNo) {
      validateField("call_no", callNo).then((res) => {
        setCallStatus(res.status as any);
        setCallError(res.error);
      });
    }
  }, [callNo]);

  useEffect(() => {
    if (whats) {
      validateField("whats", whats).then((res) => {
        setWhatsStatus(res.status as any);
        setWhatsError(res.error);
      });
    }
  }, [whats]);

  const allValid = emailStatus === "valid" && callStatus === "valid" && whatsStatus === "valid";

  const handleVerify = async () => {
    if (!allValid) return;
    setLoading(true);

    try {
      const res = await fetch("https://www.cribb.africa/api/verifysign.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, call_no: callNo, whats, final: true }),
      });
      const data = await res.json();

      if (data.success) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        {/* Left: Flag */}
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img src={nigeriaflag} alt="Nigeria Flag" className="h-10 md:h-12 object-contain p-3" />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start md:justify-center items-center gap-1 col-span-1">
          <img src={logo} alt="Cribb.Africa Logo" className="h-8 md:h-14" />
          <div className="flex flex-col">
            <h1 className="text-md md:text-2xl font-extrabold">Cribb</h1>
            <span className="text-[10px] md:text-sm text-black">for Students</span>
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img src={nigeriaflag} alt="Nigeria Flag" className="h-4 md:h-8 object-contain" />
          </div>
          <button className="px-3 md:px-4 py-2 md:py-3 bg-black flex items-center gap-2 text-[10px] text-white rounded-lg shadow-md whitespace-nowrap">
            <span className="sm:text-xs">
              <BiSolidBriefcase />
            </span>
            Business &gt;&gt;
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
        {/* Progress Dots */}
        <div className="grid grid-cols-1 mb-5">
          <div className="flex items-center justify-center">
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="w-10 md:w-15 h-2 bg-white border-2 border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 items-center w-full md:w-2/5">
          <Maincard className="bg-[#F4F6F5] pb-5">
            <SectionHeader title="Sign Up" caption="Let’s get you Set-Up, it’s super easy!" />

            <div className="md:px-5 pb-4 pt-3 space-y-4">
              <InputField label="EMAIL" placeholder="Enter your email" type="email" value={email} onChange={setEmail} status={emailStatus} error={emailError} />
              <InputField label="CALL NO." placeholder="Enter Number" type="tel" value={callNo} onChange={setCallNo} status={callStatus} error={callError} />
              <InputField label="WHATSAPP NO." placeholder="Enter Number" type="tel" value={whats} onChange={setWhats} status={whatsStatus} error={whatsError} />

              {/* Verify Button */}
              <InfoPill className={clsx("mt-5 md:mt-10", allValid ? "bg-green-600 text-white" : "bg-black text-white")}>
                <button
                  className="inline-flex items-center justify-center w-full disabled:opacity-50"
                  onClick={handleVerify}
                  disabled={loading || !allValid}
                >
                  <span>{loading ? "Verifying..." : "Verify"}</span>
                  <MdDoubleArrow className="ml-2 text-3xl" />
                </button>
              </InfoPill>

              {verified && <p className="text-center text-green-600 text-xs mt-2">✅ Verified successfully!</p>}

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
                  Have a Cribb.Africa account? <span className="text-[#0556F8] cursor-pointer">Log in</span>
                </span>
              </div>
            </div>
          </Maincard>
        </div>
      </section>
    </>
  );
};

export default Signup;
