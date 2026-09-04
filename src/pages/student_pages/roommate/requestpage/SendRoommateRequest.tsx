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
import clsx from "clsx"; // optional, for cleaner
import Footer from "../../../../components/Footer";
import imgright from "../../../../assets/hero.jpg";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import mapbanner from "../../../../assets/mapbanner.png";

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
  }, [hostel]); // ← depends on hostel, not hostel?.photos

  const mainPhoto = photos[0] ? `${mediaBase}/${photos[0]}` : imgright;

  const secondPhoto = photos[1] ? `${mediaBase}/${photos[1]}` : imgright;

  const videoUrl = hostel?.video ? `${mediaBase}/${hostel.video}` : null;

  const parseList = (value: any): string[] => {
    if (!value) return [];

    // already an array
    if (Array.isArray(value)) return value;

    if (typeof value !== "string") return [];

    const trimmed = value.trim();

    if (!trimmed) return [];

    // try JSON array first
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

    // fallback: comma separated list
    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    const user = login?.user;
    if (!user) {
      navigate("/login"); // redirect using react-router
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
        {/* SECTION 1: Headbar */}
        <div className="w-full bg-[#3A2A05] pb-8 pt-8 text-white shadow">
          <div className="mx-auto w-full max-w-6xl px-4">
            {/* small kicker */}
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

      <section className="mt-5 md:mt-15 md:mx-12 grid grid-cols-1 md:grid-cols-[40%_60%] gap-2 p-6 pt-0">
        {/* Left Section */}
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

        {/* Right Section */}
        <section className="flex flex-col gap-2">
          {/* Top image */}
          <div className="relative hidden md:block w-full h-70">
            <img
              src={secondPhoto}
              className="w-full h-full object-cover border-2 rounded-3xl"
              alt=""
            />
          </div>

          {/* Bottom video */}
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
              {/* close */}
              <button
                className="absolute -top-10 right-0 z-10 text-white text-2xl"
                onClick={() => setOpenPhotos(false)}
              >
                ✕
              </button>

              {/* prev */}
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

              {/* next */}
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

      <section className="my-10">
        <div className="mx-2 md:mx-24 max-w-6xl grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* LEFT STACK */}
          <div className="space-y-1">
            {/* HOSTEL VIEW */}
            <Maincard className="bg-[#F4F6F5] pb-5">
              <SectionHeader title="Hostel View" />

              <div className="md:px-5 pb-4 pt-3 space-y-5 md:space-y-8">
                {/* Security */}
                <div className="space-y-1">
                  <Label>Security</Label>
                  <InfoPill>
                    <span className="text-xs py-1">
                      {" "}
                      {parseList(hostel?.security).join(" : ")}
                    </span>
                  </InfoPill>
                </div>
                {/* Water */}
                <div className="space-y-1">
                  <Label>Water</Label>
                  <InfoPill>
                    <span className="text-xs py-1">
                      {" "}
                      {parseList(hostel?.water).join(" : ")}{" "}
                    </span>
                  </InfoPill>
                </div>
                {/* Grid pairs */}
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
                  {/* Left: Available block */}
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

                  {/* Right: Amenities Link */}
                  <div className="w-1/2 ml-5">
                    <button
                      onClick={() => setOpenModal("amenities")}
                      className="cursor-pointer text-xs md:text-sm text-[#0556F8] underline underline-offset-4"
                    >
                      See All Amenities &gt;&gt;
                    </button>
                  </div>
                </div>
                {/* View House Rules */}
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
                {/* Report / Share */}
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

            {/* MAP */}
            <Maincard className="bg-[#F4F6F5] mt-10 pb-5">
              <SectionHeader title="Map" />
              <div className="px-5 pb-5 pt-3">
                <div className="h-107 relative w-full rounded-xl border-2 bg-[#EDEDED] grid place-items-center my-9">
                  <img
                    src={mapbanner}
                    alt="Banner"
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                  />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-black text-center">
                    <h1 className="text-xl md:text-2xl font-semibold">
                      Nothing to see yet...
                    </h1>

                    <p className="mt-3 text-xs md:text-sm">Coming Soon ...</p>
                  </div>
                </div>

                {/* Book inspection */}
                <div className="pt-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-5 py-5 text-xl font-medium drop-shadow-lg">
                    <FaMapMarkerAlt size={30} className="text-black" />
                    <span className="text-sm md:text-lg">
                      Check Proximity to your Uni{" "}
                    </span>
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
              </div>
            </Maincard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
