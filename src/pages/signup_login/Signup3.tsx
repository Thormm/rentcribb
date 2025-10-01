import { useState } from "react";
import clsx from "clsx";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import { MdDoubleArrow } from "react-icons/md";

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
            className="w-full appearance-none bg-transparent text-[10px] md:text-xs outline-none"
          />
        </div>
      </InfoPill>
    </div>
  );
}

/* ---------- Main Signup1 Page ---------- */
export default function Signup3({ onNext }: { onNext?: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [referral, setReferral] = useState("");

  // password match logic
  const confirmStatus =
    confirm === "" ? "idle" : confirm === password ? "valid" : "invalid";

  // check if all fields except referral are filled
  const canContinue = firstName && lastName && password && confirm;

  const handleSubmit = async () => {
    if (!canContinue) return;

    const signup_key = sessionStorage.getItem("signup_key");
    if (!signup_key) return alert("Missing signup key from first step");

    const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        password,
        referral,
        thirdpage: true,
        signup_key, // send the key to PHP
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success && onNext) {
      onNext();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

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
              <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
              <span className="w-10 md:w-15 h-2 bg-white border-2 border-white" />
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
                label="FIRST NAME"
                placeholder="Enter first name"
                value={firstName}
                onChange={setFirstName}
                status={"idle"}
              />
              <InputField
                label="LAST NAME"
                placeholder="Enter last name"
                value={lastName}
                onChange={setLastName}
                status={"idle"}
              />
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
              <InputField
                label="REFERRAL ID"
                placeholder="Enter Referral ID (optional)"
                value={referral}
                onChange={setReferral}
                status="idle"
              />

              {/* Continue Button */}
              <InfoPill className="mt-5 md:mt-10 bg-black text-white">
                <button
                  className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={!canContinue}
                >
                  <span className="text-xl">Continue</span>
                  <MdDoubleArrow className="ml-2 text-4xl" />
                </button>
              </InfoPill>
            </div>
          </Maincard>
        </div>
      </section>
    </>
  );
}
