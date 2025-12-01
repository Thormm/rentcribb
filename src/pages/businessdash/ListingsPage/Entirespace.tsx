import { useState } from "react";
import Entirespace1 from "./Entirespaces/Entirespace1";
import Entirespace2 from "./Entirespaces/Entirespace2";
import Entirespace3 from "./Entirespaces/Entirespace3";
import Entirespace4 from "./Entirespaces/Entirespace4";

const Entirespace = () => {
  const [step, setStep] = useState(1);

  // -------------------------------
  // CENTRAL MASTER FORM DATA
  // -------------------------------
  const [formData, setFormData] = useState({
    // ----- STEP 1 -----
    space_id: "",
    spaceName: "",
    fullAddress: "",
    selectedType: "",
    units: 1,
    selectedLocation: "",
    selectedMonth: "",
    selectedRules: [] as string[],

    // ----- STEP 2 -----
    bedrooms: 0,
    ensuite: 0,
    bathrooms: 0,
    toilets: 0,
    security: "",
    water: "",
    power_supply: 0,
    network_strength: 0,
    compound: 0,
    access_road: 0,

    // ----- STEP 3 -----
    all_feature: "",
    special_feature: "",
    target_university: "",
    photos: [] as File[],
    video: null as File | null,

    // ----- STEP 4 -----
    inspection: "",
    price: "",
    rent: "",
    duration: "",
    caution_fee: "",
    service_charge: "",
    agreement_fee: "",
    agency_fee: "",
  });

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <>
      {step === 1 && (
        <Entirespace1
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
        />
      )}

      {step === 2 && (
        <Entirespace2
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <Entirespace3
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <Entirespace4
          formData={formData}        // pass the central form state
          setFormData={setFormData}  // allow step 4 to update it
          onBack={goBack}
        />
      )}
    </>
  );
};

export default Entirespace;
