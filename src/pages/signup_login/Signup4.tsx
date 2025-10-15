import React, { useEffect, useState } from "react";
import { MdDoubleArrow } from "react-icons/md";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import signbg from "../../assets/signbg.png";
import InfoPill from "../../components/Pill";
import { FaArrowRight } from "react-icons/fa";
import { RiListView } from "react-icons/ri";

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
        "text-sm md:text-md md:my-3 font-semibold ml-8",
        className
      )}
    >
      {children}
    </div>
  );
}

interface Signup4Props {
  mode: "student" | "merchant";
}

interface Institute {
  id: number;
  institution: string;
}

export default function Signup4({ mode }: Signup4Props) {
  const [institution, setInstitution] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const navigate = useNavigate();

  // Static list of Nigerian states (you can expand this list)
  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  useEffect(() => {
    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getInstitutes" }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((item: string) => JSON.parse(item));
        setInstitutes(parsed);
      })
      .catch((err) => console.error("Failed to load institutions:", err));
  }, []);

  const openTerms = () => {
    window.open("/terms", "_blank");
  };

  const openPrivacy = () => {
    window.open("/privacy", "_blank");
  };

  const handleSubmit = async () => {
    if (!institution || !agreed) return;

    const signup_key = sessionStorage.getItem("signup_key");
    if (!signup_key) {
      alert("Missing signup key from first step");
      return;
    }

    try {
      const res = await fetch("https://www.cribb.africa/apiverifysign.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institution, // this may be institute id or state string
          fourthpage: true,
          signup_key,
          mode: mode,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        navigate("/login");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error, try again.");
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
      <div className="grid grid-cols-1 mb-5">
        <div className="flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            <span className="w-10 md:w-15 h-2 bg-[#3A3A3A] border border-white" />
            <span className="w-10 md:w-15 h-2 bg-white border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center w-full md:w-2/5">
        <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 px-6 md:px-10">
          <SectionHeader
            title="Terms & Policy"
            caption="Review, Acknowledge and Agree to Proceed"
          />

          <div className="space-y-5 md:space-y-6 pt-3 md:pt-5">
            <div className="space-y-1">
              <Label>
                {mode === "student"
                  ? "INSTITUTION"
                  : "PRINCIPAL PLACE OF BUSINESS"}
              </Label>
              <InfoPill>
                <select
                  className="w-full focus:outline-none  bg-transparent text-xs md:text-sm"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                >
                  <option value="">
                    {mode === "student"
                      ? "Select your Institution"
                      : "Select your State"}
                  </option>
                  {mode === "student"
                    ? institutes.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.institution}
                        </option>
                      ))
                    : states.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                </select>
              </InfoPill>
              <div className="w-full flex justify-center md:justify-end">
                <span className="text-xs rounded-lg bg-white p-2 md:mr-6 text-[#5B5B5B]">
                  {mode === "student"
                    ? "Your Institution determines your"
                    : "Your State determines your"}{" "}
                  <br />
                  Terms of Service.
                </span>
              </div>
            </div>

            <InfoPill className="bg-white cursor-pointer">
              <button
                className="w-full flex items-center justify-between text-sm md:text-base h-6 md:h-8 md:px-3"
                onClick={openTerms}
              >
                <RiListView className="text-lg md:text-4xl -ml-2" />
                <span className="flex-1 text-center text-md md:text-xl">
                  Terms of Use
                </span>
                <FaArrowRight className="text-white h-8 w-8 md:h-12 md:w-12 p-2 md:p-3 rounded-full bg-black shrink-0 ml-auto -mr-6 md:-mr-8" />
              </button>
            </InfoPill>

            <InfoPill className="bg-white cursor-pointer my-3">
              <button
                className="w-full flex items-center justify-between text-sm md:text-base h-6 md:h-8 md:px-3"
                onClick={openPrivacy}
              >
                <RiListView className="text-lg md:text-4xl -ml-2" />
                <span className="flex-1 text-center text-md md:text-xl">
                  Privacy Policy
                </span>
                <FaArrowRight className="text-white h-8 w-8 md:h-12 md:w-12 p-2 md:p-3 rounded-full bg-black shrink-0 ml-auto -mr-6 md:-mr-8" />
              </button>
            </InfoPill>

            <div className="w-full flex justify-center">
              <span className="text-xs justify-center p-2 rounded-lg bg-white text-[#5B5B5B]">
                By selecting “I Agree” below, you have reviewed and agreed
                <br />
                to the Terms of Use and acknowledged the Privacy Policy notice.
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 ml-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                id="agreeTerms"
                className="w-4 h-4"
              />
              <label htmlFor="agreeTerms" className="text-sm md:text-md">
                I agree to the terms above
              </label>
            </div>

            <InfoPill className="mt-5 md:mt-10 bg-black text-white">
              <button
                className="inline-flex cursor-pointer items-center justify-center w-full disabled:opacity-50"
                onClick={handleSubmit}
                disabled={!agreed || !institution}
              >
                <span className="text-md md:text-xl">Proceed</span>
                <MdDoubleArrow className="ml-2 text-2xl md:text-4xl" />
              </button>
            </InfoPill>
          </div>
        </Maincard>
      </div>
    </section>
  );
}
