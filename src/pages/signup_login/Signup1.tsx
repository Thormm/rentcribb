import { useState, useEffect } from "react";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import { useNavigate } from "react-router-dom";

/* ---------- Helpers ---------- */
function debounce(fn: (...args: any[]) => void, delay = 2000) {
  let timer: ReturnType<typeof setTimeout>; // ✅ works in browser & Node
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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
          "bg-white",
          status === "valid" && "border border-green-600",
          status === "invalid" && "border border-red-600",
          status === "idle" && "border border-black"
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
      {error && <p className="text-red-600 text-[11px] ml-8">{error}</p>}
    </div>
  );
}

/* ---------- Main Signup1 Page ---------- */
interface Signup1Props {
  mode: "student" | "merchant";
  onNext?: () => void;
}

export default function Signup1({ mode, onNext }: Signup1Props) {
  const [email, setEmail] = useState("");
  const [callNo, setCallNo] = useState("");
  const [whats, setWhats] = useState("");
  const navigate = useNavigate();

  const [emailStatus, setEmailStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );
  const [callStatus, setCallStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );
  const [whatsStatus, setWhatsStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const [emailError, setEmailError] = useState("");
  const [callError, setCallError] = useState("");
  const [whatsError, setWhatsError] = useState("");


  // ---------- server validation ----------
  const validateField = async (field: string) => {
    try {
      const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          call_no: callNo,
          whats,
          check: field,
          mode: mode,
        }),
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

  // debounced validators
  const debouncedValidateEmail = debounce(async (val: string) => {
    if (!val) {
      setEmailStatus("invalid");
      setEmailError("Email is required");
      return;
    }
    const res = await validateField("email");
    setEmailStatus(res.status as any);
    setEmailError(res.error);
  }, 400);

  const debouncedValidateCall = debounce(async (val: string) => {
    if (!val) {
      setCallStatus("invalid");
      setCallError("Call number is required");
      return;
    }
    const res = await validateField("call_no");
    setCallStatus(res.status as any);
    setCallError(res.error);
  }, 400);

  const debouncedValidateWhats = debounce(async (val: string) => {
    if (!val) {
      setWhatsStatus("invalid");
      setWhatsError("WhatsApp number is required");
      return;
    }
    const res = await validateField("whats");
    setWhatsStatus(res.status as any);
    setWhatsError(res.error);
  }, 400);

  // trigger on change
  useEffect(() => {
    if (email) debouncedValidateEmail(email);
  }, [email]);

  useEffect(() => {
    if (callNo) debouncedValidateCall(callNo);
  }, [callNo]);

  useEffect(() => {
    if (whats) debouncedValidateWhats(whats);
  }, [whats]);

  const allValid =
    emailStatus === "valid" &&
    callStatus === "valid" &&
    whatsStatus === "valid";

  const handleVerify = () => {
  if (!allValid) return;

  // ✅ Save inputs into sessionStorage
  sessionStorage.setItem(
    "signup_data",
    JSON.stringify({
      email,
      callNo,
      whats,
    })
  );

  // Go to next page
  if (onNext) onNext();
};


  return (
    <>
      {/* Section */}
      <section
        className="px-2 pt-1 md:pt-10 pb-20 min-h-screen flex flex-col items-center justify-center text-black"
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
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader
              title="Sign Up"
              caption="Let’s get you Set-Up, it’s super easy!"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4">
              <InputField
                label="EMAIL"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={setEmail}
                status={emailStatus}
                error={emailError}
              />
              <InputField
                label="CALL NO."
                placeholder="Enter Number"
                type="tel"
                value={callNo}
                onChange={setCallNo}
                status={callStatus}
                error={callError}
              />
              <InputField
                label="WHATSAPP NO."
                placeholder="Enter Number"
                type="tel"
                value={whats}
                onChange={setWhats}
                status={whatsStatus}
                error={whatsError}
              />

              {/* Verify Button */}
              <InfoPill className="mt-5 md:mt-10 bg-black text-white">
                <button
                  className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                  onClick={handleVerify}
                  disabled={!allValid}
                >
                  <span className="text-xl">
                    Continue
                  </span>
                  <MdDoubleArrow className="ml-2 text-2xl md:text-4xl" />
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
                  Have a Cribb.Africa account?{" "}
                  <span className="text-[#0556F8] cursor-pointer"  onClick={() => navigate("/login")}>Log in</span>
                </span>
              </div>
            </div>
          </Maincard>
        </div>
      </section>
    </>
  );
}
