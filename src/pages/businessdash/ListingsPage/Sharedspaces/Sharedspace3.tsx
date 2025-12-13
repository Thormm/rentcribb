import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import imgright from "../../../../../src/assets/list3.png";
import { DfButton } from "../../../../components/Pill";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { PiHouse } from "react-icons/pi";

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

interface Institute {
  id: number;
  institution: string;
}

/* ---------- removed "None" from ALL_FEATURES; special feature gets "None" option ---------- */
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

export default function Sharedspace3({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext?: () => void;
  onBack?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [showAllFeaturesModal, setShowAllFeaturesModal] = useState(false);
  const [showSpecialFeatureModal, setShowSpecialFeatureModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New states for upload progress & preview modal
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number>(0); // simulated on select
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0); // simulated on select
  const [uploadProgress, setUploadProgress] = useState<number>(0); // real progress during submit (XHR)
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch universities correctly via GET request
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

  /* ----------------- FILE HANDLER (ENFORCEMENTS + SIMULATED PROGRESS) ----------------- */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "photos") {
      // Convert FileList to array
      const selected = Array.from(files);

      // ensure maximum of 5 photos total
      if (selected.length > 5) {
        alert("You can upload a maximum of 5 photos. Please select up to 5.");
        return;
      }

      // set files
      setFormData((prev: any) => ({ ...prev, photos: selected }));

      // Simulate per-file upload progress quickly (selection-time feedback)
      setPhotoUploadProgress(0);
      let p = 0;
      const t = setInterval(() => {
        p += 20;
        setPhotoUploadProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(t);
          // keep it visible briefly then clear
          setTimeout(() => setPhotoUploadProgress(0), 700);
        }
      }, 120);
    }

    if (name === "video") {
      const file = files[0];
      if (!file) return;

      // Only one video allowed
      // (input type file won't provide more than one here, but keep check for safety)
      // Check duration: create temporary video element
      const url = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        const duration = videoEl.duration;
        if (duration > 120) {
          alert(
            "Video must not exceed 2 minutes (120 seconds). Please choose a shorter video."
          );
          return;
        }

        // Accept video
        setFormData((prev: any) => ({ ...prev, video: file }));

        // Simulate upload progress for the video selection
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
        alert("Unable to read video. Try another file.");
      };
    }
  };

  /* ----------------- SUBMIT HANDLER with XHR to show real upload % ----------------- */
  const handleSubmit = async () => {
    setLoading(true);
    setStatusMessage("Saving...");
    setUploadProgress(0);

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    try {
      const data = new FormData();
      data.append("action", "shared_space3");
      data.append("user", user);
      data.append("signup_key", signup_key);
      data.append("space_id", formData.space_id || "");
      data.append("all_feature", formData.all_feature || "");
      data.append("special_feature", formData.special_feature || "");
      data.append("target_university", formData.target_university || "");

      // Append photos and video
      formData.photos?.forEach((file: File) => data.append("photos[]", file));
      if (formData.video) data.append("video", formData.video);

      // Use XHR to track upload progress
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
                // Success: show message and move next after 1 second
                setStatusMessage("Saved successfully!");
                setUploadProgress(100);

                setTimeout(() => {
                  setStatusMessage(null);
                  if (onNext) onNext(); // ONLY call onNext here
                }, 1000);

                resolve();
              } else {
                reject(resp?.message || "Upload failed");
                setStatusMessage(null);
              }
            } catch (err) {
              reject("Invalid server response");
            }
          }
        };

        xhr.onerror = () => reject("Network error during upload");

        xhr.send(data);
      });

      // Only clear loading and progress here, do NOT call onNext again
      setLoading(false);
      setUploadProgress(0);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setUploadProgress(0);
      alert(typeof err === "string" ? err : err?.message || "Upload failed");
    }
  };

  /* ----------------- FEATURES TOGGLING ----------------- */
  const toggleFeature = (feature: string) => {
    const features = formData.all_feature
      ? formData.all_feature.split(",")
      : [];
    if (features.includes(feature)) {
      const filtered = features.filter((f: string) => f !== feature).join(",");
      setFormData({
        ...formData,
        all_feature: filtered,
        special_feature:
          formData.special_feature === feature ? "" : formData.special_feature,
      });
    } else {
      setFormData({
        ...formData,
        all_feature: [...features, feature].join(","),
      });
    }
  };

  // Helper to truncate long strings
  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  /* ----------------- Helpers for special features list ----------------- */
  const selectedFeatures = (formData.all_feature || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <section className="mx-1 md:mx-0 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
            <a className="w-15 h-2 border-2 box-border flex items-center justify-center"></a>
            <a className="w-15 h-2 bg-[#3A3A3A] flex items-center justify-center"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-20 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt="Traveler with suitcase"
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />

          <button
            onClick={onBack}
            className="cursor-pointer absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
          >
            <IoIosArrowBack size={14} />
          </button>
        </div>

        {/* Right Stack */}
        <div className="space-y-1 md:mr-20 md:-ml-10 z-2">
          <Maincard className="bg-[#F4F6F5] pb-5 md:pb-8 md:px-10">
            <SectionHeader
              title="Space Details"
              caption="Help Guest Imagine their Stay in your Space"
            />

            <div className="md:px-5 pb-4 pt-3 space-y-4 mt-5 mb:mt-0">
              <div className="grid grid-cols-2 gap-6">
                {/* All Features */}
                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">All Feature</Label>
                  <InfoPill
                    className="bg-white cursor-pointer"
                    onClick={() => setShowAllFeaturesModal(true)}
                  >
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-xs text-gray-500 truncate block w-full">
                        {truncateText(
                          formData.all_feature || "Select Features"
                        )}
                      </span>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                {/* Special Feature */}
                <div className="space-y-1">
                  <Label className="ml-2 md:ml-8">Special Feature</Label>
                  <InfoPill
                    className="bg-white cursor-pointer"
                    onClick={() => setShowSpecialFeatureModal(true)}
                  >
                    <div className="inline-flex items-center justify-between w-full">
                      <span className="text-xs text-gray-500 truncate block w-full">
                        {truncateText(
                          formData.special_feature || "Select Special Feature"
                        )}
                      </span>
                      <IoIosArrowDown />
                    </div>
                  </InfoPill>
                </div>

                {/* Photo */}
                <div className="space-y-1">
                  <Label className="ml-5 md:ml-8">Hostel Photo</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] pl-5 md:px-8 py-3 text-[15px] text-[#222] shadow-sm relative cursor-pointer">
                    <div className="flex items-center gap-3">
                      <IoCameraOutline className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {formData.photos?.length
                          ? `Photos (${formData.photos.length}/5)`
                          : "Add Photo"}
                      </span>

                      {/* show selection-simulated progress or overall upload progress */}
                      <div className="ml-auto flex items-center gap-2">
                        {photoUploadProgress > 0 &&
                          photoUploadProgress < 100 && (
                            <span className="text-xs text-[#2b8a3e]">
                              Uploading {photoUploadProgress}%
                            </span>
                          )}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <span className="text-xs text-[#2b8a3e]">
                            Uploading {uploadProgress}%
                          </span>
                        )}
                      </div>

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

                {/* Video */}
                <div className="space-y-1">
                  <Label className="ml-5 md:ml-8">Hostel Video</Label>
                  <div className="w-full bg-white rounded-full border-[1.5px] pl-5 md:px-8 py-3 text-[15px] text-[#222] shadow-sm relative cursor-pointer">
                    <div className="flex items-center gap-3">
                      <AiOutlineVideoCameraAdd className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {formData.video ? "Video (1/1)" : "Add Video"}
                      </span>

                      {/* show selection-simulated progress or overall upload progress */}
                      <div className="ml-auto flex items-center gap-2">
                        {videoUploadProgress > 0 &&
                          videoUploadProgress < 100 && (
                            <span className="text-xs text-[#2b8a3e]">
                              Uploading {videoUploadProgress}%
                            </span>
                          )}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <span className="text-xs text-[#2b8a3e]">
                            Uploading {uploadProgress}%
                          </span>
                        )}
                      </div>

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

              {/* Target University */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <Label className="ml-8">Target University</Label>
                  <InfoPill className="bg-white">
                    <div className="inline-flex items-center justify-between w-full">
                      <select
                        name="target_university"
                        value={formData.target_university}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            target_university: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
                      >
                        <option value="">Select University</option>
                        {institutes.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.institution}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown />
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

              {/* PREVIEW BUTTON: clickable, opens modal */}
              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full my-8 flex items-center justify-center gap-3 rounded-full font-normal bg-white px-5 py-4 shadow-sm text-lg text-black"
              >
                <PiHouse className="w-8 h-8" /> Preview Space
              </button>

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

      {/* MODALS */}
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
              {/* None Option */}
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="specialFeature"
                  checked={
                    formData.special_feature === "None" ||
                    !formData.special_feature
                  }
                  onChange={() =>
                    setFormData({ ...formData, special_feature: "None" })
                  }
                  className="w-4 h-4"
                />
                <span>None</span>
              </label>

              {/* Only show features the user selected */}
              {selectedFeatures.map((feat: string) => (
                <label
                  key={feat}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="specialFeature"
                    checked={formData.special_feature === feat}
                    onChange={() =>
                      setFormData({ ...formData, special_feature: feat })
                    }
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
              <h4 className="font-semibold">Photos</h4>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {formData.photos && formData.photos.length > 0 ? (
                  formData.photos.map((p: File, i: number) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(p)}
                      alt={`preview-${i}`}
                      className="rounded-xl h-28 w-full object-cover"
                    />
                  ))
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
                    src={URL.createObjectURL(formData.video)}
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

      {/* STATUS MODAL */}
      {statusMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-72 text-center shadow-lg">
            <p className="text-sm md:text-md">{statusMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}
