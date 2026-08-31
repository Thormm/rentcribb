import React, { useState, useEffect } from "react";
import Knowyou1 from "./Knowyou1";
import Knowyou2 from "./Knowyou2";
import Knowyou3 from "./Knowyou3";
import Knowyou4 from "./Knowyou4";
import Knowyou5 from "./Knowyou5";
import logo from "../../../assets/logo.png";
import nigeriaflag from "../../../assets/nigeriaflag.png";

// ============================================================
// 1. FORM DATA INTERFACE
// ============================================================
interface FormData {
  // Step 1
  pref_gender?: string;
  pref_religion?: string;
  pref_year?: string;
  pref_faculty?: string;
  hobbies?: string[];
  pet?: string;
  // Step 2
  type?: string;
  roommates?: number;
  hostel_loc?: string;
  availability?: string;
  amount_share?: number;
  duration?: string;
  // Step 3
  security?: string[];
  water?: string[];
  power_supply?: number;
  network_strength?: number;
  compound?: number;
  access_road?: number;
  // Step 4
  all_feature?: string;
  special_feature?: string;
  photos?: any[];
  video?: any;
  selectedRules?: string[];
  // Step 5
  budget?: any;
}

// ============================================================
// 2. MAIN COMPONENT
// ============================================================
const Knowyou: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1 defaults
    pref_gender: "",
    pref_religion: "",
    pref_year: "",
    pref_faculty: "",
    hobbies: [],
    pet: "",
    // Step 2 defaults
    type: "",
    roommates: 2,
    hostel_loc: "",
    availability: "",
    amount_share: 0,
    duration: "",
    // Step 3 defaults
    security: [],
    water: [],
    power_supply: 0,
    network_strength: 0,
    compound: 0,
    access_road: 0,
    // Step 4 defaults
    all_feature: "",
    special_feature: "",
    photos: [],
    video: null,
    selectedRules: [],
    // Step 5 defaults
    budget: "",
  });

  // ----- Fetch existing user data on mount (no loading state) -----
  useEffect(() => {
    const fetchUserData = async () => {
      const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
      const user = login?.user || "";
      const signup_key = login?.signup_key || "";

      if (!user || !signup_key) return;

      try {
        const response = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_user_data",
            user: user,
            signup_key: signup_key, // include for session validation
          }),
        });
        const result = await response.json();

        if (result.success && result.data) {
          const d = result.data;
          setFormData({
            // Step 1 – map DB columns to frontend keys
            pref_gender: d.gender || "",
            pref_religion: d.religion || "",
            pref_year: d.level || "",
            pref_faculty: d.faculty || "",
            hobbies: d.hobby ? d.hobby.split(",").map((s: string) => s.trim()) : [],
            pet: d.pet || "",
            // Step 2
            type: d.type || "",
            roommates: parseInt(d.roommates) || 2,
            hostel_loc: d.hostel_loc || "",
            availability: d.availability || "",
            amount_share: parseFloat(d.amount_share) || 0,
            duration: d.duration || "",
            // Step 3
            security: d.security || [],
            water: d.water || [],
            power_supply: parseInt(d.power) || 0,
            network_strength: parseInt(d.network) || 0,
            compound: parseInt(d.compound) || 0,
            access_road: parseInt(d.road) || 0,
            // Step 4
            all_feature: d.all_feature || "",
            special_feature: d.special_feature || "",
            selectedRules: d.house_rules || [],
            photos: d.photos || [],
            video: d.video || null,
            //step 5
            budget: d.budget || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const goToStep = (stepNumber: number) => setStep(stepNumber);

  return (
    <>
      {/* --- Navbar --- */}
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

      {/* --- Step Renderer --- */}
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
      {step === 4 && (
        <Knowyou4
          formData={formData}
          setFormData={setFormData}
          onBack={() => goToStep(3)}
        />
      )}
      {step === 5 && (
        <Knowyou5
          formData={formData}
          setFormData={setFormData}
          onBack={() => goToStep(1)}
        />
      )}
    </>
  );
};

export default Knowyou;