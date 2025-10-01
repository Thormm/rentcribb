import { useState } from "react";
import Signup1 from "./Signup1";
import Signup2 from "./Signup2";
import Signup3 from "./Signup3";
import Signup4 from "./Signup4";
import { BiSolidBriefcase } from "react-icons/bi";
import logo from "../../assets/logo.png";
import nigeriaflag from "../../assets/nigeriaflag.png";

const Signup = () => {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => prev + 1);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        {/* Left: Flag */}
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black ">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start md:justify-center items-start gap-1 col-span-1 md:px-3">
          <img src={logo} alt="Cribb.Africa Logo" className="m-0 p-0 h-8 md:h-11" />
          <div className="flex flex-col items-end p-0 m-0">
            <span className="text-2xl p-0 m-0 md:text-4xl font-extrabold">
              Cribb
            </span>
            <span className="text-[10px] pr-1 -mt-2 md:text-sm text-black self-end">
              for Students
            </span>
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex justify-end md:justify-center items-center gap-2">
          <div className="md:hidden rounded-full bg-black p-2 shrink-0">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-4 md:h-8 object-contain"
            />
          </div>
          <button className="px-3 md:px-5 py-2 md:py-3 bg-black flex items-center gap-2 text-white rounded-lg shadow-md whitespace-nowrap">
            <span className="text-xs md:text-2xl">
              <BiSolidBriefcase />
            </span>
            <span className="text-[8px] md:text-[15px] underline">
              SWITCH TO BUSINESS &gt;&gt;
            </span>
          </button>
        </div>
      </nav>
      {step === 1 && <Signup1 onNext={goNext} />}
      {step === 2 && <Signup2 onNext={goNext} />}
      {step === 3 && <Signup3 onNext={goNext} />}
      {step === 4 && <Signup4 />}
    </>
  );
};

export default Signup;
