import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaStar,
  FaRegStar,
  FaExclamationTriangle,
  FaShareAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import InfoPill from "../../../../components/Pill";
import clsx from "clsx";
import Footer from "../../../../components/Footer";
import imgright from "../../../../assets/hero.jpg";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import mapbanner from "../../../../assets/mapbanner.png";

// NEW IMPORT
import RoommateCard, { type Roommate } from "../../components/RoommateCard";

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

function StarRow({ value = 4 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <FaStar key={i} size={25} fill="currentColor" />
        ) : (
          <FaRegStar key={i} size={25} />
        ),
      )}
    </div>
  );
}

export default function SendRoommateRequest() {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [openPhotos, setOpenPhotos] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const location = useLocation();
  const space = location.state?.whats;
  const whats = location.state?.whats;
  const id = space?.[0];
  const space_type = space?.[1];
  const [openModal, setOpenModal] = React.useState<
    null | "amenities" | "rules"
  >(null);

  const mediaBase = `https://www.cribb.africa/uploads/users/${hostel?.whats}`;

  const photos: string[] = useMemo(() => {
    if (!hostel) return [];
    const images: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const key = `image${i}`;
      if (
        hostel[key] &&
        typeof hostel[key] === "string" &&
        hostel[key].trim() !== ""
      ) {
        images.push(hostel[key]);
      }
    }
    return images;
  }, [hostel]);

  // NEW: Build roommate data from hostel
  const roommateData: Roommate | null = useMemo(() => {
    if (!hostel) return null;
    return {
      id: parseInt(hostel.id) || Math.random(),
      whats: hostel.whats || "User",
      gender: hostel.gender || "",
      religion: hostel.religion || "",
      level: hostel.level || "",
      faculty: hostel.faculty || "",
      move_in_date: hostel.availability || "",
      duration: hostel.duration || "",
      type: hostel.type || "",
      price: hostel.amount_share ? String(hostel.amount_share) : "",
      features: hostel.hobby
        ? hostel.hobby.split(",").map((s: string) => s.trim())
        : [],
      pet: hostel.pet || "",
      school: hostel.school || "",
      created_at: new Date().toISOString(),
      value: "100%",
    };
  }, [hostel, login?.user]);

  const mainPhoto = photos[0] ? `${mediaBase}/${photos[0]}` : imgright;
  const secondPhoto = photos[1] ? `${mediaBase}/${photos[1]}` : imgright;
  const videoUrl = hostel?.video ? `${mediaBase}/${hostel.video}` : null;

  const parseList = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== "string") return [];
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch {
        // fall through
      }
    }
    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login");
    }
    if (!space) {
      navigate("/studentlisting", { replace: true });
    }
  }, [space, navigate]);

  useEffect(() => {
    if (!id || !space_type) return;

    const fetchHostel = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_roommate_hostel_details",
          whats: whats,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setHostel(data.data);
      } else {
        console.log(data.message);
      }
    };

    fetchHostel();
  }, [id, space_type]);

  if (!hostel) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-black text-center">
        <>
          <AiOutlineLoading3Quarters className="w-8 h-8 md:w-10 md:h-10 animate-spin mb-3" />
          <h1 className="text-lg md:text-xl font-semibold">Loading...</h1>
        </>
      </div>
    );
  }

  return (
    <div className="bg-[#F3EECE]">
      <section className=" w-full ">
        <div className="w-full bg-[#3A2A05] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-md font-semibold text-[#FFA1A1]">EXPLORE</div>
            <div className="mt-1 flex items-center justify-between gap-4">
              <h1 className="text-4xl my-4 font-extrabold ">
                Available Hostels in{" "}
                <span className="text-[#C2C8DA]">
                  {login?.school?.split(" - ")?.[0] ?? ""}
                </span>
              </h1>
            </div>
            <button
              onClick={() => navigate(`/explore`)}
              className="mt-4 cursor-pointer w-11 h-11 border-2 border-white flex items-center justify-center rounded-full bg-[#202020] text-white shadow-lg"
            >
              <IoIosArrowBack size={14} />
            </button>
          </div>
        </div>
      </section>

      {hostel?.image_1 && (
        <section className="mt-5 md:mt-15 md:mx-12 grid grid-cols-1 md:grid-cols-[40%_60%] gap-2 p-6 pt-0">
          <section className="relative w-full h-full">
            <img
              src={mainPhoto}
              className="w-full h-full object-cover border-2 rounded-3xl"
              alt=""
            />
            {photos.length > 0 && (
              <button
                onClick={() => {
                  setPhotoIndex(0);
                  setOpenPhotos(true);
                }}
                className="cursor-pointer text-xs md:text-base absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md"
              >
                VIEW PHOTOS
              </button>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <div className="relative hidden md:block w-full h-70">
              <img
                src={secondPhoto}
                className="w-full h-full object-cover border-2 rounded-3xl"
                alt=""
              />
            </div>
            <div className="relative w-full h-full">
              {videoUrl ? (
                <video
                  className="h-50 md:h-80 w-full object-cover border-2 rounded-3xl"
                  src={videoUrl}
                  muted
                />
              ) : (
                <div className="h-50 md:h-80 w-full border-2 rounded-3xl flex items-center justify-center text-sm text-gray-400">
                  No video
                </div>
              )}
              {videoUrl && (
                <button
                  onClick={() => setOpenVideo(true)}
                  className="cursor-pointer text-xs md:text-base absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 md:px-7 py-4 font-semibold rounded-lg shadow-md"
                >
                  VIEW VIDEO
                </button>
              )}
            </div>
          </section>

          {openPhotos && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
              <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <button
                  className="absolute -top-10 right-0 z-10 text-white text-2xl"
                  onClick={() => setOpenPhotos(false)}
                >
                  ✕
                </button>
                <button
                  onClick={() =>
                    setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
                  }
                  className="absolute left-2 z-10 text-white text-3xl rounded-full bg-black/80 px-2 py-1 cursor-pointer"
                >
                  ‹
                </button>
                <img
                  src={`${mediaBase}/${photos[photoIndex]}`}
                  className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                  alt=""
                />
                <button
                  onClick={() =>
                    setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-2 z-10 text-white text-3xl rounded-full bg-black/80 px-2 py-1 cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {openVideo && videoUrl && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
              <div className="relative max-w-[90vw] max-h-[90vh]">
                <button
                  className="absolute -top-10 right-0 z-10 text-white text-2xl"
                  onClick={() => setOpenVideo(false)}
                >
                  ✕
                </button>
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="max-h-[90vh] max-w-[90vw] rounded-xl"
                />
              </div>
            </div>
          )}
        </section>
      )}

      <section className="my-10">
        <div className="mx-2 md:mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}
          {hostel?.image_1 && (
            <div className="space-y-1">
              <Maincard className="bg-[#F4F6F5] pb-5">
                <SectionHeader title="Hostel View" />
                <div className="md:px-5 pb-4 pt-3 space-y-5 md:space-y-8">
                  <div className="space-y-1">
                    <Label>Security</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {parseList(hostel?.security).join(" : ")}
                      </span>
                    </InfoPill>
                  </div>
                  <div className="space-y-1">
                    <Label>Water</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {parseList(hostel?.water).join(" : ")}
                      </span>
                    </InfoPill>
                  </div>
                  <div className="space-y-5 md:space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label>Power Supply</Label>
                        <div>
                          <StarRow value={Number(hostel?.power || 0)} />
                          <div className="mt-2 text-xs md:text-sm">
                            Good supply
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Network Strength</Label>
                        <div>
                          <StarRow value={Number(hostel?.network || 0)} />
                          <div className="mt-2 text-xs md:text-sm">
                            Network Coverage
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label>Compound</Label>
                        <div>
                          <StarRow value={Number(hostel?.compound || 0)} />
                          <div className="mt-2 text-xs md:text-sm">
                            Good &amp; Aesthetic
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Access Road</Label>
                        <div>
                          <StarRow value={Number(hostel?.road || 0)} />
                          <div className="mt-2 text-xs md:text-sm">
                            Good &amp; Accessibility
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex">
                    <div className="w-1/2 flex flex-col items-start">
                      <div className="flex flex-col items-center">
                        <span className="rounded-md bg-black text-white px-3 py-1 text-xs font-bold">
                          AVAILABLE FROM
                        </span>
                        <span className="text-sm mt-1">
                          {hostel?.availability || "--"}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 ml-5">
                      <button
                        onClick={() => setOpenModal("amenities")}
                        className="cursor-pointer text-xs md:text-sm text-[#0556F8] underline underline-offset-4"
                      >
                        See All Amenities &gt;&gt;
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 w-full">
                    <button
                      onClick={() => setOpenModal("rules")}
                      className="cursor-pointer w-full rounded-full bg-[#FFFFFF] px-5 py-5 text-sm md:text-xl drop-shadow-lg"
                    >
                      View House Rules
                    </button>
                  </div>
                  <div
                    className="mt-2 w-full border-t-4"
                    style={{
                      borderStyle: "dashed",
                      borderImage:
                        "repeating-linear-gradient(to right, #0000004D 0, #0000004D 10px, transparent 6px, transparent 24px) 1",
                    }}
                  />
                  <div className="flex items-center justify-between mt-10 text-sm md:text-xl">
                    <button className="inline-flex items-center gap-2 text-red-600  underline underline-offset-4">
                      <FaExclamationTriangle />
                      Report listing
                    </button>
                    <button className="inline-flex items-center gap-2 underline">
                      SHARE <FaShareAlt />
                    </button>
                  </div>
                </div>

                {openModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-[90%] max-w-md rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">
                          {openModal === "amenities"
                            ? "All Amenities"
                            : "House Rules"}
                        </h3>
                        <button
                          onClick={() => setOpenModal(null)}
                          className="text-sm cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
                        {(openModal === "amenities"
                          ? parseList(hostel?.all_feature)
                          : parseList(hostel?.house_rules)
                        ).map((item, index) => (
                          <li key={index} className="pb-1">
                            • {item}
                          </li>
                        ))}
                        {(openModal === "amenities"
                          ? parseList(hostel?.all_feature)
                          : parseList(hostel?.house_rules)
                        ).length === 0 && (
                          <li className="text-gray-400">No data available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </Maincard>
            </div>
          )}

          {/* RIGHT STACK - FIXED RoommateCard */}
          <div className="space-y-4">
            <Maincard className="bg-[#EBD96B] pb-5">
              <SectionHeader
                title="Send Request"
                caption="Send your preferred user a pairing request"
              />
              {roommateData && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 md:gap-12 px-0 md:px-6 mt-4 items-center">
                  <div>
                    <RoommateCard card={roommateData} onClick={() => {}} />
                  </div>
                  <div className="flex items-center justify-center">
                    <button className="inline-flex items-center gap-2 text-sm font-medium border-l-3 border-black pl-8 min-h-[100px]">
                      <FaShareAlt className="text-sm" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}
            </Maincard>

            <Maincard className="bg-[#3A2A05] mt-10 py-5">
              <div className="px-5 pb-6 pt-5">
                <h4 className="text-lg font-semibold text-[#FFA1A1] tracking-wide">
                  SAFETY TIPS
                </h4>
                <div className="mt-3 h-px w-full border-t border-dashed border-black/20" />
                <div className="mt-4 space-y-5 text-xs md:text-base text-white leading-relaxed">
                  <p>Chat first, don't rush. Ask plenty of questions online.</p>
                  <p>First meetup should be in a public place.</p>
                  <p>Bring a friend or tell someone where you're going.</p>
                  <p>
                    Never send money before meeting, seeing the space, and
                    signing a lease.
                  </p>
                  <p>
                    Look around the apartment to ensure it meets your
                    expectations.
                  </p>
                </div>
              </div>
            </Maincard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
