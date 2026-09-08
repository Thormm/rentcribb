import React, { useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaStar,
  FaRegStar,
  FaExclamationTriangle,
  FaShareAlt,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import InfoPill, { DfButton } from "../../../../components/Pill";
import clsx from "clsx";
import Footer from "../../../../components/Footer";
import imgright from "../../../../assets/hero.jpg";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { MdOutlineReviews, MdOutlineCall } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { RiWhatsappLine } from "react-icons/ri";
import { FiCopy } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// NEW IMPORT
import RoommateCard, { type Roommate } from "../../components/RoommateCard";

// #4: Reusable Dashed Divider Component
function DashedDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-t-4 mx-auto text-[#0000004D] ${className}`}
      style={{
        borderStyle: "dashed",
        borderImage:
          "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
      }}
    />
  );
}

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
      <DashedDivider className="mt-1 md:w-95" />
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

// #1: Changed from array to single object
const currentUser = {
  id: 1,
  space_name: "Sunset Hostel",
  name: "John Doe",
  date: "2026-09-08",
  email: "john.doe@email.com",
  call: "+1234567890",
  whatsapp: "1234567890",
};

export default function SendRoommateRequest() {
  const login = JSON.parse(sessionStorage.getItem("login_data") || "{}");
  const [openPhotos, setOpenPhotos] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();
  const [hostel, setHostel] = React.useState<any>(null);
  const location = useLocation();
  const id = location.state?.id;
  const [openModal, setOpenModal] = React.useState<
    null | "amenities" | "rules"
  >(null);
  const [agreed, setAgreed] = useState(false);
  const [otherHostels, setOtherHostels] = useState<Roommate[]>([]);
  const [loadingOtherHostels, setLoadingOtherHostels] = useState(true);
  const hasFetchedOtherHostels = useRef(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedLeft, setExpandedLeft] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // --- DEFINE parseList FIRST ---
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

  const mediaBase = `https://www.cribb.africa/uploads/users/${hostel?.id}`;

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

  // #3: Memoized parse results (parseList is now defined above)
  const securityList = useMemo(() => parseList(hostel?.security), [hostel]);
  const waterList = useMemo(() => parseList(hostel?.water), [hostel]);
  const amenitiesList = useMemo(() => parseList(hostel?.all_feature), [hostel]);
  const rulesList = useMemo(() => parseList(hostel?.house_rules), [hostel]);

  const ConnectRoommate = async () => {
    setShowConnectModal(true);
  };

  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login");
    }
    if (!id) {
      navigate("/studentlisting", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;

    const fetchHostel = async () => {
      const res = await fetch("https://www.cribb.africa/apigets.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_roommate_hostel_details",
          id: id,
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
  }, [id]);

  // Reset fetch flag when hostel changes
  useEffect(() => {
    hasFetchedOtherHostels.current = false;
    setOtherHostels([]); // Clear old hostels
    setLoadingOtherHostels(true); // Show loading state
  }, [hostel?.id]);

  // ----- Fetch other hostels (filter out current hostel AND logged-in user) -----
  useEffect(() => {
    if (!hostel) return;
    if (hasFetchedOtherHostels.current) return;

    const fetchOtherHostels = async () => {
      setLoadingOtherHostels(true);
      try {
        const user = login?.user || "";
        const signup_key = login?.signup_key || "";
        const school = login?.school || "";

        if (!user || !signup_key || !school) {
          setOtherHostels([]);
          setLoadingOtherHostels(false);
          return;
        }

        const response = await fetch("https://www.cribb.africa/apigets.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_roommates",
            user: user,
            signup_key: signup_key,
            school: school,
          }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Transform all data
          const transformedCards: Roommate[] = result.data.map(
            (item: any, index: number) => ({
              id: parseInt(item.id),
              gender: item.gender || "",
              religion: item.religion || "",
              level: item.level || "",
              faculty: item.faculty || "",
              move_in_date: item.availability || "",
              duration: item.duration || "",
              type: item.type || "",
              price: item.amount_share ? String(item.amount_share) : "",
              features: item.hobby
                ? item.hobby.split(",").map((s: string) => s.trim())
                : [],
              pet: item.pet || "",
              school: item.school || "",
              created_at: new Date().toISOString(),
              value: index === 0 ? "You" : "100%", // First row is always "You"
            }),
          );

          const filteredCards = transformedCards.filter((card) => {
            if (card.id === id) {
              return false;
            }
            if (card.value === "You") {
              return false;
            }
            return true;
          });

          setOtherHostels(filteredCards);
          hasFetchedOtherHostels.current = true;
        } else {
          setOtherHostels([]);
        }
      } catch (error) {
        console.error("Error fetching other hostels:", error);
        setOtherHostels([]);
      } finally {
        setLoadingOtherHostels(false);
      }
    };

    fetchOtherHostels();
  }, [hostel, login?.user, login?.signup_key, login?.school]);

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

      {hostel?.image1 && (
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
        <div
          className={`mx-2 md:mx-24 max-w-6xl ${hostel?.image1 ? "grid grid-cols-1 gap-14 lg:grid-cols-2" : ""}`}
        >
          {/* LEFT STACK */}
          {hostel?.image1 && (
            <div className="space-y-1">
              <Maincard className="bg-[#F4F6F5] pb-5">
                <SectionHeader title="Hostel View" />
                <div className="md:px-5 pb-4 pt-3 space-y-5 md:space-y-8">
                  <div className="space-y-1">
                    <Label>Security</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {securityList.join(" : ")}
                      </span>
                    </InfoPill>
                  </div>
                  <div className="space-y-1">
                    <Label>Water</Label>
                    <InfoPill>
                      <span className="text-xs py-1">
                        {waterList.join(" : ")}
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
                  <DashedDivider className="mt-2 w-full" />
                  <div className="flex items-center justify-between mt-10 text-sm md:text-xl">
                    <button className="inline-flex items-center gap-2 text-red-600 underline underline-offset-4">
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
                          ? amenitiesList
                          : rulesList
                        ).map((item, index) => (
                          <li key={index} className="pb-1">
                            • {item}
                          </li>
                        ))}
                        {(openModal === "amenities" ? amenitiesList : rulesList)
                          .length === 0 && (
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
          <div
            className={`space-y-4 ${!hostel?.image1 ? "lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center" : ""}`}
          >
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

              <DashedDivider className="mt-10 md:w-95" />

              {/* Terms */}
              <div className="w-full flex flex-col items-center text-center mt-2">
                <label className="mt-2 flex items-center justify-center gap-2 text-sm text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-black"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <span className="underline font-semibold text-[#0556F8]">
                      Terms
                    </span>{" "}
                    and{" "}
                    <span className="underline font-semibold text-[#0556F8]">
                      Privacy Policy
                    </span>{" "}
                    of Cribb
                  </span>
                </label>
              </div>

              {/* Connect */}
              <div className="pt-2 w-full">
                <button
                  disabled={!agreed}
                  onClick={ConnectRoommate}
                  className={clsx(
                    "cursor-pointer text-lg md:text-2xl w-full flex items-center justify-center gap-2 rounded-full px-5 py-5 font-medium drop-shadow-lg",
                    agreed
                      ? "bg-black text-white"
                      : "bg-gray-400 text-white cursor-not-allowed",
                  )}
                >
                  Connect
                </button>
              </div>
            </Maincard>

            <Maincard className="bg-[#3A2A05] py-5">
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

      <section className="bg-[#EBD96B] my-20 rounded-4xl border-4">
        <div className="w-full px-4 pb-16 pt-6">
          <h1 className="font-semibold text-lg">MORE ROOMMATES LIKE THIS</h1>

          <div className="flex justify-center mb-4">
            {loadingOtherHostels ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">
                  <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin mx-auto" />
                  <p className="mt-2 text-sm">Loading other hostels...</p>
                </div>
              </div>
            ) : otherHostels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No other hostels available</p>
              </div>
            ) : (
              <div className="grid my-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {otherHostels.map((card) => {
                  const isUserCard = card.value === "You";
                  return (
                    <RoommateCard
                      key={card.id}
                      card={card}
                      bgColor={isUserCard ? "#EBD96B" : "#F4F6F5"}
                      onClick={() =>
                        navigate("/sendroommaterequest?domain=student", {
                          state: { id: card.id },
                        })
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <DfButton
              className="font-[300] py-3 px-7 text-[16px]"
              onClick={() => navigate("/explore")}
            >
              EXPLORE
            </DfButton>
          </div>
        </div>
      </section>

      {/* Space Availability Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-[500px] bg-[#F4F6F5] border-3 rounded-4xl border-black p-6 my-8 mx-auto">
            <div
              className="border-2 border-white absolute -top-3 -right-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer z-10"
              onClick={() => setShowConnectModal(false)}
            >
              <FaTimes className="text-white" />
            </div>
            <h2 className="text-3xl mt-5 font-medium text-center text-black">
              Space Availability
            </h2>
            <p className="text-sm text-black text-center mt-5">
              Hola, do you have a Hostel?
            </p>

            <DashedDivider className="mt-1 mb-5 md:w-95" />

            <div className="space-y-6">
              {roommateData && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 md:gap-12 px-0 md:px-6 mt-4 items-center">
                  <div>
                    <RoommateCard card={roommateData} onClick={() => {}} />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col gap-4 text-sm font-medium border-l-3 border-black pl-4 min-h-[100px]">
                      <button className="flex items-center gap-2 text-[#EC0000]">
                        <PiWarningCircle className="text-md" />
                        <span className="underline text-xs">
                          Report Listing
                        </span>
                      </button>
                      <button className="flex items-center gap-2 ">
                        <MdOutlineReviews className="text-sm" />
                        <span className="underline text-xs text-[#0556F8]">
                          Give Review
                        </span>
                      </button>
                      <button className="flex items-center border-2 p-2 rounded gap-2">
                        <FaHome className="text-sm" />
                        <span>SPACE</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* #2: Removed IIFE and array, using direct object */}
            <div className="space-y-4 mt-8">
              <div className="pb-4">
                <div className="flex gap-6 items-start">
                  <div
                    className={clsx(
                      "flex-1 border-black rounded-4xl border shadow-sm w-full",
                      "min-h-[40px] md:min-h-[60px] flex flex-col justify-center",
                    )}
                  >
                    {/* Header row - always visible */}
                    <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center px-3 py-3 gap-3">
                      <div className="flex justify-center">
                        <HiOutlineUserCircle className="w-7 h-7 text-black" />
                      </div>

                      <div className="truncate text-xs md:text-sm text-black">
                        {currentUser.space_name?.length > 7
                          ? currentUser.space_name.slice(0, 7) + "…"
                          : currentUser.space_name}
                      </div>

                      <div className="truncate text-xs md:text-sm text-black">
                        {currentUser.name?.length > 7
                          ? currentUser.name.slice(0, 7) + "…"
                          : currentUser.name}
                      </div>

                      {/* Toggle arrow */}
                      <span
                        className="flex justify-center cursor-pointer"
                        onClick={() =>
                          setExpandedLeft((prev) => ({
                            ...prev,
                            [currentUser.id]: !prev[currentUser.id],
                          }))
                        }
                      >
                        {expandedLeft[currentUser.id] !== false ? (
                          <IoIosArrowUp className="w-7 h-7 text-black" />
                        ) : (
                          <IoIosArrowDown className="w-7 h-7 text-black" />
                        )}
                      </span>
                    </div>

                    {/* Expanded content - only shown when expanded */}
                    {expandedLeft[currentUser.id] !== false && (
                      <>
                        {/* Row 2 icons */}
                        <div className="flex items-center text-black justify-between mt-4 px-4 md:px-6">
                          <span className="text-xs">{currentUser.date}</span>

                          <div className="flex gap-2 md:gap-3">
                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                (window.location.href = `mailto:${currentUser.email}`)
                              }
                            >
                              <HiOutlineMail className="w-4 h-4" />
                            </div>

                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                (window.location.href = `tel:${currentUser.call}`)
                              }
                            >
                              <MdOutlineCall className="w-4 h-4" />
                            </div>

                            <div
                              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${currentUser.whatsapp}`,
                                  "_blank",
                                )
                              }
                            >
                              <RiWhatsappLine className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="m-4 bg-white rounded-xl border p-4 md:p-6 text-black shadow-sm">
                          <div className="space-y-4">
                            {[
                              { label: "Email", value: currentUser.email },
                              { label: "Call no.", value: currentUser.call },
                              {
                                label: "Whatsapp",
                                value: currentUser.whatsapp,
                              },
                            ].map((field, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between relative"
                              >
                                <span className="text-xs md:text-base font-semibold">
                                  {field.label}
                                </span>
                                <div className="flex items-center pl-4">
                                  <span className="text-xs md:text-base truncate">
                                    {field.value?.length > 14
                                      ? field.value.slice(0, 14) + "…"
                                      : field.value}
                                  </span>
                                  <FiCopy
                                    className="w-4 h-4 cursor-pointer ml-2"
                                    onClick={() =>
                                      handleCopy(field.label, field.value)
                                    }
                                  />
                                </div>
                                {copiedField === field.label && (
                                  <div className="absolute -top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow-md">
                                    Copied!
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Connect */}
            <div className="pt-2 w-full">
              <button
                disabled={!agreed}
                onClick={ConnectRoommate}
                className={clsx(
                  "cursor-pointer w-full flex items-center justify-center gap-2 rounded-full px-5 py-5 font-medium drop-shadow-lg",
                  agreed
                    ? "bg-black text-white"
                    : "bg-gray-400 text-white cursor-not-allowed",
                )}
              >
                <RiWhatsappLine className="w-7 h-7 rounded-full text-black bg-white p-1" />
                <span className="text-sm md:text-2xl">
                  Say “Hola” to your Match
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer bgColor="#3A2A05" iconBgColor="#EBD96B" />
    </div>
  );
}
