import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import imgright from "../../assets/board1.png";
import InfoPill from "../../components/Pill";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";

/* ---------- debounce ---------- */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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
      <h3 className="text-3xl font-medium text-center">{title}</h3>
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

export default function Board1({
  onNext,
  data,
  setData,
  lockedCategory,
}: {
  onNext?: () => void;
  data: {
    category: string;
    bemail: string;
    bNo: string;
    whatsapp: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      category: string;
      bemail: string;
      bNo: string;
      whatsapp: string;
    }>
  >;
  lockedCategory?: boolean;
}) {
  const navigate = useNavigate();

  /* ---------- validation helpers ---------- */
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^\+?[0-9]{8,15}$/.test(phone);

  /* ---------- states ---------- */
  const [emailStatus, setEmailStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [callStatus, setCallStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [whatsStatus, setWhatsStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const [emailError, setEmailError] = useState("");
  const [callError, setCallError] = useState("");
  const [whatsError, setWhatsError] = useState("");

  /* ---------- debounced validators ---------- */
  const debouncedValidateEmail = useMemo(
    () =>
      debounce((val: string) => {
        if (!val) {
          setEmailStatus("idle");
          setEmailError("");
          return;
        }

        if (isValidEmail(val)) {
          setEmailStatus("valid");
          setEmailError("");
        } else {
          setEmailStatus("invalid");
          setEmailError("Enter a valid email");
        }
      }),
    []
  );

  const debouncedValidateCall = useMemo(
    () =>
      debounce((val: string) => {
        if (!val) {
          setCallStatus("idle");
          setCallError("");
          return;
        }

        if (isValidPhone(val)) {
          setCallStatus("valid");
          setCallError("");
        } else {
          setCallStatus("invalid");
          setCallError("Enter a valid number");
        }
      }),
    []
  );

  const debouncedValidateWhats = useMemo(
    () =>
      debounce((val: string) => {
        if (!val) {
          setWhatsStatus("idle");
          setWhatsError("");
          return;
        }

        if (isValidPhone(val)) {
          setWhatsStatus("valid");
          setWhatsError("");
        } else {
          setWhatsStatus("invalid");
          setWhatsError("Enter a valid number");
        }
      }),
    []
  );

  /* ---------- effects ---------- */
  useEffect(() => {
    debouncedValidateEmail(data.bemail);
  }, [data.bemail]);

  useEffect(() => {
    debouncedValidateCall(data.bNo);
  }, [data.bNo]);

  useEffect(() => {
    debouncedValidateWhats(data.whatsapp);
  }, [data.whatsapp]);

  /* ---------- continue logic ---------- */
  const canContinue =
    emailStatus === "valid" &&
    callStatus === "valid" &&
    whatsStatus === "valid" &&
    data.category;

  const handleSave = () => {
    if (!canContinue) return;

    const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    login_data.category = data.category;
    login_data.email = data.bemail;
    sessionStorage.setItem("login_data", JSON.stringify(login_data));

    onNext?.();
  };

  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center mb-0 md:-mb-20">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img src={imgright} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => navigate("/businessdash")}
            className="cursor-pointer absolute top-5 left-5 md:right-15 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
            <SectionHeader
              title="Know Your Business"
              caption="Few Details to help us Tailor your Experience"
            />

            <div className="md:px-5 pb-4 pt-6 space-y-4">
              {/* Category */}
              <div>
                <Label>Business Category</Label>
                <InfoPill className="bg-white border border-black">
                  {lockedCategory ? (
                    <span className="text-xs text-gray-600">{data.category}</span>
                  ) : (
                    <select
                      value={data.category}
                      onChange={(e) =>
                        setData((p) => ({ ...p, category: e.target.value }))
                      }
                      className="w-full bg-transparent text-xs text-gray-500 outline-none"
                    >
                      <option value="">Select your Business Category</option>
                      <option value="Agent">Agent</option>
                      <option value="Landlord">Landlord</option>
                    </select>
                  )}
                </InfoPill>
              </div>

              {/* Email */}
              <div>
                <Label>Business Email</Label>
                <InfoPill
                  className={clsx(
                    "bg-white",
                    emailStatus === "valid" && "border border-green-600",
                    emailStatus === "invalid" && "border border-red-600",
                    emailStatus === "idle" && "border border-black"
                  )}
                >
                  <input
                    value={data.bemail}
                    onChange={(e) =>
                      setData((p) => ({ ...p, bemail: e.target.value }))
                    }
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter your business email"
                    type="email"
                  />
                </InfoPill>
                {emailError && (
                  <p className="text-red-600 text-[11px] ml-6">{emailError}</p>
                )}
              </div>

              {/* Call */}
              <div>
                <Label>Business Call No.</Label>
                <InfoPill
                  className={clsx(
                    "bg-white",
                    callStatus === "valid" && "border border-green-600",
                    callStatus === "invalid" && "border border-red-600",
                    callStatus === "idle" && "border border-black"
                  )}
                >
                  <input
                    value={data.bNo}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+]/g, "");
                      setData((p) => ({ ...p, bNo: val }));
                    }}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter business call number"
                    type="tel"
                  />
                </InfoPill>
                {callError && (
                  <p className="text-red-600 text-[11px] ml-6">{callError}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <Label>Whatsapp No.</Label>
                <InfoPill
                  className={clsx(
                    "bg-white",
                    whatsStatus === "valid" && "border border-green-600",
                    whatsStatus === "invalid" && "border border-red-600",
                    whatsStatus === "idle" && "border border-black"
                  )}
                >
                  <input
                    value={data.whatsapp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+]/g, "");
                      setData((p) => ({ ...p, whatsapp: val }));
                    }}
                    className="w-full appearance-none bg-transparent text-xs outline-none"
                    placeholder="Enter business whatsapp number"
                    type="tel"
                  />
                </InfoPill>
                {whatsError && (
                  <p className="text-red-600 text-[11px] ml-6">
                    {whatsError}
                  </p>
                )}
              </div>

              {/* Button */}
              <div className="pt-2 w-full flex items-center justify-center">
                <InfoPill className="mt-2 bg-black text-white">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                    onClick={handleSave}
                    disabled={!canContinue}
                  >
                    <span className="text-xl">Proceed</span>
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