import React, { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import imgright from "../../../assets/knowyou4.png";
import { DfButton } from "../../../components/Pill";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../components/Pill";
import clsx from "clsx";
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { PiHouse } from "react-icons/pi";
import { useAlert } from "../../../App";
import { useNavigate } from "react-router-dom";

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

const ALL_FEATURES = [
  "Parking Space",
  "Fenced",
  "Gated",
  "POP",
  "PVC",
  "Balcony",
  "WiFi",
  "AC",
  "Netflix",
  "PS4 Console",
  "TV",
  "Dstv",
  "Cable",
  "Desk lamp",
  "Ceiling Fan",
  "Cushion Chair",
  "Table",
  "Desk",
  "Workspace",
  "Bed",
  "Double bed",
  "Bed Frame",
  "Side drawer",
  "Bedsheet",
  "Mirror",
  "Vanity table",
  "Lock on bedroom door",
  "Pillow",
  "Wardrobe",
  "Hanger",
  "Standing Fan",
  "Bathroom",
  "Ensuite",
  "Shower-room",
  "Basin",
  "Running water",
  "Treated water",
  "Kitchen Cabinet",
  "Sink",
  "Fridge",
];

const houseRuleOptions = [
  "No smoking",
  "No pets",
  "No Inflammables",
  "No overnight guests",
  "No parties or events",
  "No loud music after 10pm",
  "Not suitable for Children under 12years",
  "Not suitable for Children under 2years",
  "Replacement charge if you lose access key",
  "No structural changes without host permission",
  "CCTV surveillance",
  "Private/residential use only",
  "Smoking is allowed on Balconies only",
  "No illegal activities",
];

interface Knowyou4Props {
  formData: any;
  setFormData: (data: any) => void;
  onBack?: () => void;
}

export default function Knowyou4({
  formData,
  setFormData,
  onBack,
}: Knowyou4Props) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [showAllFeaturesModal, setShowAllFeaturesModal] = useState(false);
  const [showSpecialFeatureModal, setShowSpecialFeatureModal] = useState(false);
  const [showHouseRulesModal, setShowHouseRulesModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Progress states for upload feedback
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number>(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Refs for change detection
  const initialFormDataRef = useRef<any>(null);
  const isFirstLoad = useRef(true);

  const navigate = useNavigate();

  // ===== GET USER =====
  const getCurrentUser = () => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    return login?.user || "";
  };

  // ===== GET IMAGE URL =====
  const getImageUrl = (filename: string): string => {
    if (!filename) return "";
    // If it's already a full URL, return it
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }
    // Otherwise, build the full URL
    const user = getCurrentUser();
    return `https://www.cribb.africa/uploads/users/${user}/${filename}`;
  };

  // ===== GET SRC =====
  const getSrc = (p: any): string | undefined => {
    if (!p) return undefined;
    if (p instanceof File) return URL.createObjectURL(p);
    if (typeof p === "string") {
      // If it's a filename (not a full URL), build the full URL
      return getImageUrl(p);
    }
    return undefined;
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const selectedFeatures = (formData.all_feature || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const selectedRules: string[] = formData.selectedRules || [];
  
  const toggleRule = (rule: string) => {
    const next = selectedRules.includes(rule)
      ? selectedRules.filter((r: string) => r !== rule)
      : [...selectedRules, rule];
    const newData = { ...formData, selectedRules: next };
    setFormData(newData);
    checkForChanges(newData);
  };

  const rulesDisplay = selectedRules.length === 0
    ? "Select House Rules"
    : truncateText(selectedRules.join(", "), 25);

  // ===== CAPTURE INITIAL FORM DATA =====
  useEffect(() => {
    if (isFirstLoad.current && formData) {
      initialFormDataRef.current = {
        all_feature: formData.all_feature || "",
        special_feature: formData.special_feature || "",
        selectedRules: [...(formData.selectedRules || [])],
        photos: formData.photos || [],
        video: formData.video || null,
      };
      isFirstLoad.current = false;
    }
  }, [formData]);

  // ===== CHECK FOR CHANGES =====
  const checkForChanges = (newData: any) => {
    if (!initialFormDataRef.current) return true;
    
    const initial = initialFormDataRef.current;
    
    // Check if photos changed (compare by length and file names)
    const initialPhotos = initial.photos || [];
    const currentPhotos = newData.photos || [];
    const photosChanged = 
      initialPhotos.length !== currentPhotos.length ||
      JSON.stringify(initialPhotos.map((p: any) => p instanceof File ? p.name : p)) !== 
      JSON.stringify(currentPhotos.map((p: any) => p instanceof File ? p.name : p));

    // Check if video changed
    const initialVideo = initial.video;
    const currentVideo = newData.video;
    const videoChanged = 
      (initialVideo instanceof File && currentVideo instanceof File && initialVideo.name !== currentVideo.name) ||
      (!initialVideo && currentVideo) ||
      (initialVideo && !currentVideo);

    const hasChanged = 
      initial.all_feature !== newData.all_feature ||
      initial.special_feature !== newData.special_feature ||
      JSON.stringify([...(initial.selectedRules || [])].sort()) !== 
        JSON.stringify([...(newData.selectedRules || [])].sort()) ||
      photosChanged ||
      videoChanged;

    setHasChanges(hasChanged);
    return hasChanged;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "photos") {
      const selected = Array.from(files);
      if (selected.length > 5) {
        showAlert("You can upload a maximum of 5 photos. Please select up to 5.", "warning");
        return;
      }
      const newData = { ...formData, photos: selected };
      setFormData(newData);
      checkForChanges(newData);

      setPhotoUploadProgress(0);
      let p = 0;
      const t = setInterval(() => {
        p += 20;
        setPhotoUploadProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => setPhotoUploadProgress(0), 700);
        }
      }, 120);
    }

    if (name === "video") {
      const file = files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        const duration = videoEl.duration;
        if (duration > 120) {
          showAlert(
            "Video must not exceed 2 minutes (120 seconds). Please choose a shorter video.",
            "warning"
          );
          return;
        }
        const newData = { ...formData, video: file };
        setFormData(newData);
        checkForChanges(newData);

        setVideoUploadProgress(0);
        let p = 0;
        const t = setInterval(() => {
          p += 25;
          setVideoUploadProgress(Math.min(100, p));
          if (p >= 100) {
            clearInterval(t);
            setTimeout(() => setVideoUploadProgress(0), 700);
          }
        }, 140);
      };
      videoEl.onerror = () => {
        showAlert("Unable to read video. Try another file.", "warning");
      };
    }
  };

  const handleSubmit = async () => {
    // Validate: Features, House Rules, Photos OR Video
    if (!formData.all_feature) {
      showAlert("Please select at least one feature", "warning");
      return;
    }
    if (!selectedRules || selectedRules.length === 0) {
      showAlert("Please select house rules", "warning");
      return;
    }
    if (!(formData.photos && formData.photos.length > 0) && !formData.video) {
      showAlert("Please upload at least one photo or a video", "warning");
      return;
    }

    if (loading) return;

    // If no changes were made, just navigate to next step
    if (!hasChanges) {
      navigate("/studentdash");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    try {
      const data = new FormData();
      data.append("action", "knowyou4");
      data.append("user", user);
      data.append("signup_key", signup_key);
      data.append("all_feature", formData.all_feature || "");
      data.append("special_feature", formData.special_feature || "");
      data.append("house_rules", JSON.stringify(selectedRules));

      (formData.photos || []).forEach((p: any) => {
        if (p instanceof File) {
          data.append("photos[]", p);
        }
      });

      if (formData.video instanceof File) {
        data.append("video", formData.video);
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://www.cribb.africa/api_save.php");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            try {
              const resp = JSON.parse(xhr.responseText || "{}");

              if (xhr.status >= 200 && xhr.status < 300 && resp.success) {
                showAlert("Saved successfully!", "success", true);
                setUploadProgress(100);

                if (resp.photos_final && Array.isArray(resp.photos_final)) {
                  // Store just the filenames, the getSrc function will build the full URL
                  setFormData((prev: any) => ({ 
                    ...prev, 
                    photos: resp.photos_final 
                  }));
                }

                if (resp.video_final) {
                  setFormData((prev: any) => ({ 
                    ...prev, 
                    video: resp.video_final 
                  }));
                }

                // Update initial data reference after successful save
                initialFormDataRef.current = {
                  all_feature: formData.all_feature || "",
                  special_feature: formData.special_feature || "",
                  selectedRules: [...selectedRules],
                  photos: formData.photos || [],
                  video: formData.video || null,
                };
                setHasChanges(false);

                setTimeout(() => {
                  navigate("/studentdash");
                }, 500);

                resolve();
              } else {
                reject(resp?.reply || "Upload failed");
              }
            } catch (err) {
              reject("Invalid server response");
            }
          }
        };

        xhr.onerror = () => reject("Network error during upload");
        xhr.send(data);
      });

    } catch (err: any) {
      console.error(err);
      showAlert(typeof err === "string" ? err : err?.message || "Upload failed", "warning");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const toggleFeature = (feature: string) => {
    const features = formData.all_feature
      ? formData.all_feature.split(",")
      : [];
    let newData;
    if (features.includes(feature)) {
      const filtered = features.filter((f: string) => f !== feature).join(",");
      newData = {
        ...formData,
        all_feature: filtered,
        special_feature:
          formData.special_feature === feature ? "" : formData.special_feature,
      };
    } else {
      newData = {
        ...formData,
        all_feature: [...features, feature].join(","),
      };
    }
    setFormData(newData);
    checkForChanges(newData);
  };

  return (
    <section className="mx-1 md:mx-0 md:px-10 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      {/* Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover"
          />
          <button
            onClick={onBack}
            className="cursor-pointer absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 mb:mt-0">
              <div className="grid grid-cols-2 gap-6">
                {/* All Features */}
                <div
                  className="space-y-1"
                  onClick={() => setShowAllFeaturesModal(true)}
                >
                  <Label>Features</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={truncateText(
                          formData.all_feature || "Select Features",
                        )}
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>

                {/* Special Feature */}
                <div
                  className="space-y-1"
                  onClick={() => setShowSpecialFeatureModal(true)}
                >
                  <Label>Special Feature</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={truncateText(
                          formData.special_feature || "Select Special Feature",
                        )}
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>

                {/* Photo Upload */}
                <div className="space-y-1">
                  <Label>Hostel Photo</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] pl-5 md:px-4 py-3 text-[15px] text-[#222] shadow-sm relative cursor-pointer">
                    <div className="flex items-center py-1 gap-3">
                      <IoCameraOutline className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {formData.photos?.length
                          ? `Photos (${formData.photos.length})`
                          : "Add Photo"}
                        {photoUploadProgress > 0 && photoUploadProgress < 100 && (
                          <span className="text-xs text-[#2b8a3e]">
                            {photoUploadProgress}%
                          </span>
                        )}
                      </span>
                      <input
                        type="file"
                        name="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-2 md:mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      add a sum of 5 photos that shows overall view of the space
                      features.
                    </span>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-1">
                  <Label>Hostel Video</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] pl-5 md:px-4 py-3 text-[15px] text-[#222] shadow-sm relative cursor-pointer">
                    <div className="flex items-center py-1 gap-3">
                      <AiOutlineVideoCameraAdd className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {formData.video ? "Video (1)" : "Add Video"}
                        {videoUploadProgress > 0 && videoUploadProgress < 100 && (
                          <span className="text-xs text-[#2b8a3e]">
                            {videoUploadProgress}%
                          </span>
                        )}
                      </span>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-2 md:mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      add a 2mins videos that shows detailed & quick overall
                      view of the space.
                    </span>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="grid grid-cols-1 gap-6">
                <div
                  className="space-y-1"
                  onClick={() => setShowHouseRulesModal(true)}
                >
                  <Label>House Rules</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={rulesDisplay}
                        readOnly
                        className="w-full appearance-none bg-transparent text-xs leading-5 outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div
                className="mt-6 w-full border-t-4 mx-auto text-[#0000004D]"
                style={{
                  borderStyle: "dashed",
                  borderImage:
                    "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
                }}
              />

              {/* Preview Button */}
              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full my-8 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
              >
                <PiHouse className="w-8 h-8" /> Preview Space
              </button>

              {/* Submit Button */}
              <div className="pt-2 w-full mt-2 flex items-center justify-center">
                <DfButton onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? uploadProgress > 0
                      ? `Uploading ${uploadProgress}%`
                      : "Saving..."
                    : "NEXT"}
                </DfButton>
              </div>
            </div>
          </Maincard>
        </div>
      </div>

      {/* HOUSE RULES MODAL */}
      {showHouseRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select House Rules</h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => setShowHouseRulesModal(false)}
              >
                Close
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 pb-4">
              {houseRuleOptions.map((rule) => (
                <label
                  key={rule}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(rule)}
                    onChange={() => toggleRule(rule)}
                    className="w-4 h-4"
                  />
                  <span>{rule}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowHouseRulesModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL FEATURES MODAL */}
      {showAllFeaturesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Features</h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => setShowAllFeaturesModal(false)}
              >
                Close
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pb-4">
              {ALL_FEATURES.map((feat) => (
                <label
                  key={feat}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(formData.all_feature || "")
                      .split(",")
                      .includes(feat)}
                    onChange={() => toggleFeature(feat)}
                    className="w-4 h-4"
                  />
                  <span>{feat}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowAllFeaturesModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL FEATURE MODAL */}
      {showSpecialFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Special Feature</h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => setShowSpecialFeatureModal(false)}
              >
                Close
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pb-4">
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="specialFeature"
                  checked={
                    formData.special_feature === "None" ||
                    !formData.special_feature
                  }
                  onChange={() => {
                    const newData = { ...formData, special_feature: "None" };
                    setFormData(newData);
                    checkForChanges(newData);
                  }}
                  className="w-4 h-4"
                />
                <span>None</span>
              </label>

              {selectedFeatures.map((feat: string) => (
                <label
                  key={feat}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="specialFeature"
                    checked={formData.special_feature === feat}
                    onChange={() => {
                      const newData = { ...formData, special_feature: feat };
                      setFormData(newData);
                      checkForChanges(newData);
                    }}
                    className="w-4 h-4"
                  />
                  <span>{feat}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowSpecialFeatureModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl md:w-3/5 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Preview Space</h3>
              <button
                className="px-3 py-1 rounded-full border"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">All Features</h4>
              <p className="text-sm text-gray-700">
                {formData.all_feature || "None selected"}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Special Feature</h4>
              <p className="text-sm text-gray-700">
                {formData.special_feature || "None"}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">House Rules</h4>
              <p className="text-sm text-gray-700">
                {selectedRules.length > 0 ? selectedRules.join(", ") : "None selected"}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Photos</h4>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {formData.photos && formData.photos.length > 0 ? (
                  formData.photos.map((p: any, i: number) => {
                    const src = getSrc(p);
                    return src ? (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="rounded-xl h-28 w-full object-cover"
                      />
                    ) : null;
                  })
                ) : (
                  <p className="text-sm text-gray-500">No photos uploaded</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold">Video</h4>
              <div className="mt-2">
                {formData.video ? (
                  <video
                    controls
                    src={getSrc(formData.video)}
                    className="w-full rounded-xl"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No video uploaded</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}