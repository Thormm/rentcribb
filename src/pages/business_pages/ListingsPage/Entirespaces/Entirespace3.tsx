import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import type { ChangeEvent } from "react";
import imgright from "../../../../assets/list3.png";
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

interface Institute {
  id: number;
  institution: string;
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

/* ---------- Constants ---------- */
const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60 MB
const PHOTO_COUNT = 5;
const RETRIES = 3;
const MULTIPART_CHUNK = 5 * 1024 * 1024; // 5 MB per part
const API_CLOUD = "https://www.cribb.africa/cloud_r2_api.php"; // all R2 actions
const API_SAVE = "https://www.cribb.africa/api_save.php"; // entire_space3

/* ---------- Worker pool for compression ---------- */
const compressPool = async (
  files: File[],
  concurrency = 3,
  onEach?: (done: number) => void,
): Promise<File[]> => {
  const results: File[] = new Array(files.length);
  let idx = 0;
  let done = 0;

  const worker = async () => {
    while (true) {
      const i = idx++;
      if (i >= files.length) return;
      const file = files[i];
      try {
        if (!file.type.startsWith("image/")) {
          results[i] = file;
        } else {
          const out = await imageCompression(file, {
            maxSizeMB: 0.15,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.72,
          });
          results[i] = new File(
            [out],
            file.name.replace(/\.[^.]+$/, "") + ".webp",
            { type: "image/webp" },
          );
        }
      } catch {
        results[i] = file;
      }
      done++;
      onEach?.(done);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, files.length) }, worker),
  );
  return results;
};

export default function Entirespace3({
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

  const [photoUploadProgress, setPhotoUploadProgress] = useState<number>(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [photosBusy, setPhotosBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);

  useEffect(() => {
    fetch("https://www.cribb.africa/apigets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getInstitutes" }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        try {
          const parsed = (data || []).map((item: string) => JSON.parse(item));
          setInstitutes(parsed);
        } catch {
          setInstitutes([]);
        }
      })
      .catch((err) => console.error("Failed to load institutions:", err));
  }, []);

  /* ----------------- Helpers ----------------- */
  const getSrc = (p: any) =>
    !p ? null : p instanceof File ? URL.createObjectURL(p) : p;

  const truncateText = (text: string, maxLength: number = 20) =>
    !text
      ? ""
      : text.length > maxLength
        ? text.slice(0, maxLength) + "..."
        : text;

  const selectedFeatures = (formData.all_feature || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  /* ----------------- R2 helpers (all go to cloud_api.php) ----------------- */
  const deleteFromR2 = async (urls: string[]) => {
    const clean = urls.filter(
      (u) => typeof u === "string" && /^https?:\/\//.test(u),
    );
    if (!clean.length) return;
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const fd = new URLSearchParams({
      action: "delete_r2_objects",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      urls: JSON.stringify(clean),
    });
    try {
      await fetch(API_CLOUD, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: fd.toString(),
        credentials: "include",
      });
    } catch (err) {
      console.warn("R2 delete failed:", err);
    }
  };

  const presignBatch = async (
    items: { filename: string; content_type: string }[],
    folder = "entire_spaces",
  ): Promise<{ upload_url: string; public_url: string; key: string }[]> => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const fd = new URLSearchParams({
      action: "get_r2_presigned_batch",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      folder,
      items: JSON.stringify(items),
    });
    const resp = await fetch(API_CLOUD, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: fd.toString(),
      credentials: "include",
    }).then((r) => r.json());
    if (!resp.success) throw new Error(resp.message || "Presign batch failed");
    return resp.urls;
  };

  /* PUT with retry (used for photo chunks AND video parts) */
  const putWithRetry = (
    url: string,
    blob: Blob,
    contentType?: string,
  ): Promise<string> => {
    const attempt = (n: number): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        if (contentType) xhr.setRequestHeader("Content-Type", contentType);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const etag = xhr.getResponseHeader("ETag") || "";
            resolve(etag.replace(/"/g, ""));
          } else if (n < RETRIES) {
            setTimeout(() => attempt(n + 1).then(resolve, reject), 400 * n);
          } else {
            reject(new Error("PUT failed: " + xhr.status));
          }
        };
        xhr.onerror = () => {
          if (n < RETRIES)
            setTimeout(() => attempt(n + 1).then(resolve, reject), 400 * n);
          else reject(new Error("Network error during PUT"));
        };
        xhr.send(blob);
      });
    return attempt(1);
  };

  /* ------------- MULTIPART RESUME for VIDEO ------------- */
  const uploadVideoMultipart = async (
    file: File,
    onProgress: (p: number) => void,
    folder = "entire_spaces",
  ): Promise<string> => {
    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");

    // 1) start multipart upload
    const startFd = new URLSearchParams({
      action: "r2_multipart_start",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      folder,
      filename: file.name,
      content_type: file.type || "application/octet-stream",
    });

    const startResp = await fetch(API_CLOUD, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: startFd.toString(),
      credentials: "include",
    }).then((r) => r.json());

    if (!startResp.success)
      throw new Error(startResp.message || "Multipart start failed");

    const uploadKey: string = startResp.key;
    const uploadId: string = startResp.upload_id;
    const finalPublicUrl: string = startResp.public_url;

    // 2) upload each chunk
    const totalParts = Math.ceil(file.size / MULTIPART_CHUNK);
    const completed: { PartNumber: number; ETag: string }[] = [];

    try {
      for (let i = 0; i < totalParts; i++) {
        const partNumber = i + 1;
        const byteStart = i * MULTIPART_CHUNK;
        const byteEnd = Math.min(byteStart + MULTIPART_CHUNK, file.size);
        const chunk = file.slice(byteStart, byteEnd);

        const presignFd = new URLSearchParams({
          action: "r2_multipart_presign_parts",
          user: login?.user || "",
          signup_key: login?.signup_key || "",
          key: uploadKey,
          upload_id: uploadId,
          parts: JSON.stringify([partNumber]),
        });
        const presign = await fetch(API_CLOUD, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: presignFd.toString(),
          credentials: "include",
        }).then((r) => r.json());

        if (!presign.success)
          throw new Error(presign.message || "Presign part failed");

        const url = presign.parts[0].upload_url as string;
        const etag = await putWithRetry(url, chunk, file.type);
        completed.push({ PartNumber: partNumber, ETag: etag });

        onProgress(Math.round(((i + 1) / totalParts) * 100));
      }
    } catch (err) {
      // abort to avoid orphaned parts
      try {
        const abortFd = new URLSearchParams({
          action: "r2_multipart_abort",
          user: login?.user || "",
          signup_key: login?.signup_key || "",
          key: uploadKey,
          upload_id: uploadId,
        });
        await fetch(API_CLOUD, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: abortFd.toString(),
          credentials: "include",
        });
      } catch {
        /* ignore */
      }
      throw err;
    }

    // 3) complete
    const completeFd = new URLSearchParams({
      action: "r2_multipart_complete",
      user: login?.user || "",
      signup_key: login?.signup_key || "",
      key: uploadKey,
      upload_id: uploadId,
      parts: JSON.stringify(completed),
    });
    const complete = await fetch(API_CLOUD, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: completeFd.toString(),
      credentials: "include",
    }).then((r) => r.json());

    if (!complete.success)
      throw new Error(complete.message || "Multipart complete failed");

    return finalPublicUrl;
  };

  /* ----------------- Photo workflow ----------------- */
  const processPhotos = async (
    selected: File[],
    inputEl: HTMLInputElement,
  ) => {
    setPhotosBusy(true);
    setPhotoUploadProgress(1);
    const oldUrls = (formData.photos || []).filter(
      (p: any) => typeof p === "string" && /^https?:\/\//.test(p),
    );
    try {
      const compressed = await compressPool(selected, 3, (done) => {
        setPhotoUploadProgress(
          Math.max(1, Math.round((done / selected.length) * 30)),
        );
      });

      const items = compressed.map((f) => ({
        filename: f.name,
        content_type: f.type || "application/octet-stream",
      }));
      const presigned = await presignBatch(items, "entire_spaces");

      const perFile: number[] = new Array(compressed.length).fill(0);
      await Promise.all(
        compressed.map(
          (f, i) =>
            new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open("PUT", presigned[i].upload_url);
              xhr.setRequestHeader(
                "Content-Type",
                f.type || "application/octet-stream",
              );
              xhr.upload.onprogress = (e) => {
                if (!e.lengthComputable) return;
                perFile[i] = Math.round((e.loaded / e.total) * 100);
                const avg =
                  perFile.reduce((a, b) => a + b, 0) / perFile.length;
                setPhotoUploadProgress(
                  Math.max(31, Math.min(99, 30 + Math.round(avg * 0.7))),
                );
              };
              xhr.onload = () =>
                xhr.status >= 200 && xhr.status < 300
                  ? resolve()
                  : reject(new Error("PUT " + xhr.status));
              xhr.onerror = () => reject(new Error("Network error"));
              xhr.send(f);
            }),
        ),
      );

      const newUrls = presigned.map((p) => p.public_url);
      setFormData((prev: any) => ({ ...prev, photos: newUrls }));
      if (oldUrls.length) await deleteFromR2(oldUrls);
      setPhotoUploadProgress(0);
    } catch (err) {
      console.error(err);
      alert("Photo upload failed. Please try again.");
      setPhotoUploadProgress(0);
    } finally {
      setPhotosBusy(false);
      inputEl.value = "";
    }
  };

  /* ----------------- Video workflow ----------------- */
  const processVideo = async (file: File, inputEl: HTMLInputElement) => {
    setVideoBusy(true);
    setVideoUploadProgress(1);
    const oldVideo = formData.video;
    try {
      const publicUrl = await uploadVideoMultipart(
        file,
        setVideoUploadProgress,
        "entire_spaces",
      );
      setFormData((prev: any) => ({ ...prev, video: publicUrl }));
      if (
        oldVideo &&
        typeof oldVideo === "string" &&
        /^https?:\/\//.test(oldVideo)
      ) {
        await deleteFromR2([oldVideo]);
      }
      setVideoUploadProgress(0);
    } catch (err) {
      console.error(err);
      alert("Video upload failed. Please try again.");
      setVideoUploadProgress(0);
    } finally {
      setVideoBusy(false);
      inputEl.value = "";
    }
  };

  /* ----------------- File select handler ----------------- */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const inputEl = e.target;
    if (!files) return;

    if (name === "photos") {
      const selected = Array.from(files);
      if (selected.length !== PHOTO_COUNT) {
        alert(
          `You must select exactly ${PHOTO_COUNT} photos at once. You selected ${selected.length}.`,
        );
        inputEl.value = "";
        return;
      }
      void processPhotos(selected, inputEl);
      return;
    }

    if (name === "video") {
      const file = files[0];
      if (!file) return;
      if (file.size > MAX_VIDEO_BYTES) {
        alert(
          `Video is too large (${(file.size / 1024 / 1024).toFixed(
            1,
          )} MB). Max ${MAX_VIDEO_BYTES / 1024 / 1024} MB.`,
        );
        inputEl.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      const v = document.createElement("video");
      v.preload = "metadata";
      v.src = url;
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (v.duration > 120) {
          alert("Video must not exceed 2 minutes (120 seconds).");
          inputEl.value = "";
          return;
        }
        void processVideo(file, inputEl);
      };
      v.onerror = () => {
        URL.revokeObjectURL(url);
        alert("Unable to read video. Try another file.");
        inputEl.value = "";
      };
    }
  };

  /* ----------------- Submit (api_save.php only) ----------------- */
  const handleSubmit = async () => {
    const selectedUniversities = JSON.parse(formData.target_university || "[]");
    const photoCount = (formData.photos || []).filter(
      (p: any) => typeof p === "string" && /^https?:\/\//.test(p),
    ).length;

    if (
      selectedUniversities.length === 0 ||
      photoCount !== 5 ||
      !formData.video
    ) {
      setStatusMessage(
        "Please select exactly 5 photos, 1 video and at least 1 university",
      );
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }
    if (photosBusy || videoBusy) {
      setStatusMessage("Please wait for uploads to finish");
      setTimeout(() => setStatusMessage(null), 2000);
      return;
    }

    setLoading(true);
    setStatusMessage("Saving...");
    setUploadProgress(0);

    const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
    const user = login?.user || "";
    const signup_key = login?.signup_key || "";

    try {
      const data = new FormData();
      data.append("action", "entire_space3");
      data.append("user", user);
      data.append("signup_key", signup_key);
      data.append("space_id", formData.space_id || "");
      data.append("all_feature", formData.all_feature || "");
      data.append("special_feature", formData.special_feature || "");
      data.append("target_university", formData.target_university || "");

      const photoUrls = (formData.photos || []).filter(
        (p: any) => typeof p === "string" && /^https?:\/\//.test(p),
      );
      data.append("photos_r2", JSON.stringify(photoUrls));
      if (
        formData.video &&
        typeof formData.video === "string" &&
        /^https?:\/\//.test(formData.video)
      ) {
        data.append("video_r2", formData.video);
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_SAVE);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            try {
              const resp = JSON.parse(xhr.responseText || "{}");
              if (xhr.status >= 200 && xhr.status < 300 && resp.success) {
                setStatusMessage("Saved successfully!");
                setUploadProgress(100);
                if (resp.photos_final && Array.isArray(resp.photos_final)) {
                  setFormData((prev: any) => ({
                    ...prev,
                    photos: resp.photos_final,
                  }));
                }
                if (resp.video_final) {
                  setFormData((prev: any) => ({
                    ...prev,
                    video: resp.video_final,
                  }));
                }
                setTimeout(() => {
                  setStatusMessage(null);
                  onNext?.();
                }, 700);
                resolve();
              } else reject(resp?.message || "Save failed");
            } catch {
              reject("Invalid server response");
            }
          }
        };
        xhr.onerror = () => reject("Network error during save");
        xhr.send(data);
      });

      setLoading(false);
      setUploadProgress(0);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setUploadProgress(0);
      alert(typeof err === "string" ? err : err?.message || "Save failed");
    }
  };

  /* ----------------- Features toggling ----------------- */
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

  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const userSchoolState = (login?.school || "").toLowerCase();

  const filteredInstitutes = React.useMemo(() => {
    if (!userSchoolState) return institutes;
    return institutes.filter((inst) =>
      (inst?.institution || "").toLowerCase().includes(`(${userSchoolState})`),
    );
  }, [institutes, userSchoolState]);

  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const normalize = (str: string) => str.replace(/\s+/g, " ").trim();

  let selectedUniversities: string[] = [];
  try {
    selectedUniversities = JSON.parse(formData.target_university || "[]");
  } catch {
    selectedUniversities = [];
  }

  const toggleUniversity = (uni: string) => {
    const normalizedUni = normalize(uni);
    setFormData((prev: any) => {
      let current: string[] = [];
      try {
        current = JSON.parse(prev.target_university || "[]");
      } catch {
        current = [];
      }
      const next = current.includes(normalizedUni)
        ? current.filter((u) => u !== normalizedUni)
        : [...current, normalizedUni];
      return { ...prev, target_university: JSON.stringify(next) };
    });
  };

  const selectAllUniversities = () => {
    const all = filteredInstitutes.map((i) => normalize(i.institution));
    setFormData((prev: any) => ({
      ...prev,
      target_university: JSON.stringify(all),
    }));
  };

  const clearAllUniversities = () =>
    setFormData((prev: any) => ({
      ...prev,
      target_university: JSON.stringify([]),
    }));

  const photoLabel = photosBusy
    ? `Photos (${photoUploadProgress || 1}%)`
    : formData.photos?.length
      ? `Photos (${formData.photos.length}/5)`
      : "Add 5 Photos";

  const videoLabel = videoBusy
    ? `Video (${videoUploadProgress || 1}%)`
    : formData.video
      ? "Video (1)"
      : "Add Video";

  return (
    <section className="mx-1 md:mx-0 md:px-10 flex flex-col gap-4 justify-center items-center py-10 bg-[#F3EDFE]">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] w-full">
        <div></div>
        <div className="min-w-0 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-full">
            <a className="w-15 h-2 bg-[#3A3A3A]"></a>
            <a className="w-15 h-2 bg-[#3A3A3A]"></a>
            <a className="w-15 h-2 border-2"></a>
            <a className="w-15 h-2 bg-[#3A3A3A]"></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-center">
        <div className="-mb-35 md:mb-0 mx-2 md:ml-20 md:-mr-10 relative">
          <img
            src={imgright}
            alt=""
            className="h-full w-full object-cover rounded-tl-4xl rounded-bl-4xl"
          />
          <button
            onClick={onBack}
            className="absolute top-5 right-5 md:right-25 w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
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
                {/* PHOTOS */}
                <div className="space-y-1">
                  <Label>Hostel Photo</Label>
                  <div
                    className={clsx(
                      "w-full bg-white rounded-full border-[1.5px] pl-5 md:px-4 py-3 shadow-sm relative cursor-pointer",
                      photosBusy && "opacity-70 cursor-wait",
                    )}
                  >
                    <div className="flex items-center gap-3 py-1">
                      <IoCameraOutline className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {photoLabel}
                      </span>
                      <input
                        type="file"
                        name="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={photosBusy}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-2 md:mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      select exactly 5 photos at once
                    </span>
                  </div>
                </div>

                {/* VIDEO */}
                <div className="space-y-1">
                  <Label>Hostel Video</Label>
                  <div
                    className={clsx(
                      "w-full bg-white rounded-full border-[1.5px] pl-5 md:px-4 py-3 shadow-sm relative cursor-pointer",
                      videoBusy && "opacity-70 cursor-wait",
                    )}
                  >
                    <div className="flex items-center gap-3 py-1">
                      <AiOutlineVideoCameraAdd className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-xs text-gray-500">
                        {videoLabel}
                      </span>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={videoBusy}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-1 mx-2 md:mx-5">
                    <span className="inline-block text-xs p-2 rounded-2xl text-[#7F7F7F] bg-white">
                      2 min max, 60 MB max, resumable
                    </span>
                  </div>
                </div>

                {/* FEATURES */}
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
                        className="w-full bg-transparent text-xs outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>

                {/* SPECIAL */}
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
                        className="w-full bg-transparent text-xs outline-none py-1 cursor-pointer text-gray-500"
                      />
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  </InfoPill>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div
                  className="space-y-1"
                  onClick={() => setShowUniversityModal(true)}
                >
                  <Label>Target University</Label>
                  <InfoPill className="bg-white cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <input
                        value={truncateText(
                          selectedUniversities.length > 0
                            ? selectedUniversities.join(", ")
                            : "Select Target Universities",
                        )}
                        readOnly
                        className="w-full bg-transparent text-xs outline-none py-1 cursor-pointer text-gray-500"
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

              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full my-8 flex items-center justify-center gap-3 rounded-full bg-white px-5 py-4 shadow-sm text-lg text-black"
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

      {showUniversityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-11/12 md:w-2/5 bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Select Target Universities
              </h3>
              <button
                className="text-sm text-gray-600"
                onClick={() => setShowUniversityModal(false)}
              >
                Close
              </button>
            </div>
            <div className="flex gap-3 mb-3">
              <button
                className="text-xs px-3 py-1 bg-black text-white rounded"
                onClick={selectAllUniversities}
              >
                Select All
              </button>
              <button
                className="text-xs px-3 py-1 bg-gray-200 rounded"
                onClick={clearAllUniversities}
              >
                Clear All
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 pb-4">
              {filteredInstitutes.map((inst) => (
                <label
                  key={inst.id}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUniversities.includes(
                      normalize(inst.institution),
                    )}
                    onChange={() => toggleUniversity(inst.institution)}
                    className="w-4 h-4"
                  />
                  <span>{inst.institution}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg bg-black text-white"
                onClick={() => setShowUniversityModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
                  name="sf"
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
              {selectedFeatures.map((feat: string) => (
                <label
                  key={feat}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sf"
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
              <h4 className="font-semibold">
                Photos ({formData.photos?.length || 0}/5)
              </h4>
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
            <button
              className="w-full py-2 rounded-lg bg-black text-white"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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