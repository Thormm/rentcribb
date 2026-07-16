import React, { useState } from "react";
import Knowyou1 from "./Knowyou1";
import logo from "../../../assets/logo.png";
import nigeriaflag from "../../../assets/nigeriaflag.png";

interface FormData {
  space_id: string;
  spaceName: string;
  fullAddress: string;
  selectedType: string;
  units: number;
  selectedLocation: string;
  selectedMonth: string;
  selectedRules: string[];
}

const Knowyou: React.FC = () => {
 
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    space_id: "",
    spaceName: "",
    fullAddress: "",
    selectedType: "",
    units: 1,
    selectedLocation: "",
    selectedMonth: "",
    selectedRules: [],

  });

  const goNext = () => setStep((prev) => prev + 1);

  return (
    <>
      <nav className="w-full sticky top-0 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center px-4 md:px-6 py-3 md:py-4 shadow-sm bg-white z-50 border-b">
        <div className="hidden md:flex justify-center">
          <div className="rounded-full bg-black">
            <img
              src={nigeriaflag}
              alt="Nigeria Flag"
              className="h-7 md:h-12 object-contain p-3"
            />
          </div>
        </div>

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
              for Business
            </span>
          </div>
        </div>

        {/* Removed toggle button */}
        <div></div>
      </nav>

      {step === 1 && (
        <Knowyou1
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
        />
      )}
    </>
  );
};

export default Knowyou;
