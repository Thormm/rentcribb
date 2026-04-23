// Entirespace.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Entirespace1 from "./Entirespaces/Entirespace1";
import Entirespace2 from "./Entirespaces/Entirespace2";
import Entirespace3 from "./Entirespaces/Entirespace3";
import Entirespace4 from "./Entirespaces/Entirespace4";
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

  bedrooms: number;
  ensuite: number;
  bathrooms: number;
  toilets: number;
  security: string;
  water: string;
  power_supply: number;
  network_strength: number;
  compound: number;
  access_road: number;

  all_feature: string;
  special_feature: string;
  target_university: string;
  photos: (File | string)[];
  video: File | string | null;

  inspection: string;
  price: string;
  rent: string;
  duration: string;
  caution_fee: string;
  service_charge: string;
  agreement_fee: string;
  agency_fee: string;
}

const Entirespace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const spaceIdFromUrl = searchParams.get("id") || "";
  const uploaderType = searchParams.get("uploader") || "";

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

    all_feature: "",
    special_feature: "",
    target_university: "",
    photos: [],
    video: null,

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

  // ------------------------------
  // Load existing space if space_id is in URL
  // ------------------------------
  useEffect(() => {
    if (!spaceIdFromUrl) return;

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";

    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get_entirespace_by_id",
        user,
        space_id: spaceIdFromUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.space) {
          const space = data.space;

          // backend stores photo filenames (e.g. photo_1_12345.jpg).
          // build full URLs for preview using the same user folder used on upload:
          const base = `https://www.cribb.africa/uploads/entire_spaces/${user}`;

          const photosFromDb: string[] =
            space.photos && Array.isArray(space.photos) ? space.photos : [];

          const photoUrls = photosFromDb.map((fn: string) =>
            // if it's already a full URL, keep it; otherwise build path
            fn && (fn.startsWith("http://") || fn.startsWith("https://"))
              ? fn
              : `${base}/${fn}`,
          );

          const videoFn = space.video || "";
          const videoUrl =
            videoFn &&
            (videoFn.startsWith("http://") || videoFn.startsWith("https://"))
              ? videoFn
              : videoFn
                ? `${base}/${videoFn}`
                : null;

          setFormData((prev) => ({
            ...prev,
            space_id: String(space.id || ""),
            spaceName: space.space_name || "",
            fullAddress: space.full_address || "",
            selectedType: space.space_type || "",
            units: space.units || 1,
            selectedLocation: space.location || "",
            selectedMonth: space.availability_month || "",
            selectedRules: space.house_rules
              ? Array.isArray(space.house_rules)
                ? space.house_rules
                : typeof space.house_rules === "string"
                  ? space.house_rules.split(",")
                  : []
              : [],

            bedrooms: space.bedrooms || 0,
            ensuite: space.ensuite || 0,
            bathrooms: space.bathrooms || 0,
            toilets: space.toilets || 0,
            security: space.security || "",
            water: space.water || "",
            power_supply: space.power_supply || 0,
            network_strength: space.network_strength || 0,
            compound: space.compound || 0,
            access_road: space.access_road || 0,

            all_feature: space.all_feature || "",
            special_feature: space.special_feature || "",
            target_university: space.target_university || "",

            // set URLs (strings). If user selects new File objects later,
            // they will replace this photos array with File objects.
            photos: photoUrls,
            video: videoUrl,

            inspection: space.inspection || "",
            price: space.price || "",
            rent: space.rent || "",
            duration: space.duration || "",
            caution_fee: space.caution_fee || "",
            service_charge: space.service_charge || "",
            agreement_fee: space.agreement_fee || "",
            agency_fee: space.agency_fee || "",
          }));
        }
      })
      .catch((err) => console.error("Failed to load space:", err));
  }, [spaceIdFromUrl]);

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
        <Entirespace1
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          uploader={uploaderType}
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
          formData={formData}
          setFormData={setFormData}
          onBack={goBack}
          uploader={uploaderType}
        />
      )}
    </>
  );
};

export default Entirespace;
