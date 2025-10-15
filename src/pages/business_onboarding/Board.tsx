import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board1 from "./Board1";
import Board2 from "./Board2";
import nigeriaflag from "../../assets/nigeriaflag.png";
import logo from "../../assets/logo.png";

const Board = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const login_data = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const mode = login_data.mode;
  const verification = login_data.verification;
  const category = login_data.category;

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  // ✅ Redirect if verification is 4
  useEffect(() => {
    if (verification === "4" || verification === 4) {
      navigate("/businessrequests");
    }
  }, [verification, navigate]);

  return (
    <>
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
          <img src={logo} alt="Cribb.Africa Logo" className="m-0 p-0 h-8 md:h-11" />
          <div className="flex flex-col items-end p-0 m-0">
            <span className="text-2xl p-0 m-0 md:text-4xl font-extrabold">
              Cribb
            </span>
            <span className="text-[10px] pr-1 -mt-2 md:text-sm text-black self-end">
              {mode === "student" ? "for Students" : "for Business"}
            </span>
          </div>
        </div>

        {/* Right: Button (only on step 1) */}
        {step === 1 && (
          <div className="flex justify-end md:justify-center items-center gap-2">
            <div className="md:hidden rounded-full bg-black p-2 shrink-0">
              <img
                src={nigeriaflag}
                alt="Nigeria Flag"
                className="h-4 md:h-8 object-contain"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Steps */}
      {step === 1 && <Board1 mode={mode} onNext={goNext} />}
      {step === 2 && <Board2 category={category} mode={mode} onBack={goBack} />}
    </>
  );
};

export default Board;
