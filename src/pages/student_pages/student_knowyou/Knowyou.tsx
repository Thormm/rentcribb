import React, { useState } from "react";
import Knowyou1 from "./Knowyou1";
import Knowyou2 from "./Knowyou2";
import Knowyou3 from "./Knowyou3";
import Knowyou5 from "./Knowyou5";
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
  // Knowyou1 fields
  pref_gender?: string;
  pref_religion?: string;
  pref_year?: string;
  pref_faculty?: string;
  hobbies?: string[];
  pet?: string;
  // Knowyou2 fields
  type?: string;
  roommates?: number;
  hostel_loc?: string;
  availability?: string;
  amount_share?: number;
  duration?: string;
  // Knowyou3 fields
  security?: string[];
  water?: string[];
  power_supply?: number;
  network_strength?: number;
  compound?: number;
  access_road?: number;
}

const Knowyou: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    space_id: "",
    spaceName: "",
    fullAddress: "",
    selectedType: "",
    units: 2,
    selectedLocation: "",
    selectedMonth: "",
    selectedRules: [],
    hobbies: [],
    // Knowyou2 defaults
    type: "",
    roommates: 2,
    hostel_loc: "",
    availability: "",
    amount_share: 0,
    duration: "",
    // Knowyou3 defaults
    security: [],
    water: [],
    power_supply: 0,
    network_strength: 0,
    compound: 0,
    access_road: 0,
  });

  const goToStep = (stepNumber: number) => setStep(stepNumber);

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
        <div></div>
      </nav>

      {step === 1 && (
        <Knowyou1
          formData={formData}
          setFormData={setFormData}
          onNext={() => goToStep(2)}
          onNoSpace={() => goToStep(5)}
        />
      )}
      {step === 2 && (
        <Knowyou2
          formData={formData}
          setFormData={setFormData}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
        />
      )}
      {step === 3 && (
        <Knowyou3
          formData={formData}
          setFormData={setFormData}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}
      {step === 5 && <Knowyou5 formData={formData} setFormData={setFormData} />}
    </>
  );
};

export default Knowyou;