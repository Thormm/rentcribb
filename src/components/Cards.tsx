import { useState, useEffect } from "react";
import { Medal, Star, User, ChevronLeft, ChevronRight } from "lucide-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { GrCheckmark } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { TbCancel, TbArrowBack  } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


function TierBadge({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-2">
      <User className="h-5 w-5" />
      <span className="inline-flex items-center gap-1 rounded-md bg-black px-2 py-0.5 text-xs text-white">
        <Medal className="h-3.5 w-3.5 text-yellow-500" />
        <span className="text-xs font-semibold py-1 px-2">TIER {n}</span>
      </span>
    </div>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="inline-flex items-center gap-2 text-md">
      <div className="inline-flex items-center gap-1">
        <Star className="h-4 w-4 md:h-6 md:w-6 text-[orange]" />
        <span className="font-semibold text-xs md:text-xl">{value}</span>
        <span className="opacity-70 text-xs md:text-xl">({reviews})</span>
      </div>
    </div>
  );
}

type CardItemBase = {
  background: string;
  tier: number;
  rating: number;
  reviews: number;
  type: string;
  location: string;
  space: string; // "sharedspace" | "entirespace"
  price: number;
  duration: string;
  photos?: string[];
  user?: string;
  name: string;
  card2?: boolean; // 👈 toggle for V2
  approve?: boolean; // V2
  pending?: boolean; // V2
  delete?: boolean; // V2
  decline?: boolean; // V2
  unsend?: boolean; // V2
};

type CardProps<T extends CardItemBase> = {
  item: T;
  onView?: () => void;
};

export default function Card<T extends CardItemBase>({
  item,
  onView,
}: CardProps<T>) {
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Build image URLs
  const photoUrls = (item.photos || []).map((filename) => {
    const folder =
      item.space === "sharedspace" ? "shared_spaces" : "entire_spaces";
    return `https://www.cribb.africa/uploads/${folder}/${item.user}/${filename}`;
  });

  const hasPhotos = photoUrls.length > 0;
  const currentUrl = hasPhotos ? photoUrls[idx] : null;

  function prev() {
    if (!hasPhotos) return;
    setIdx((p) => (p === 0 ? photoUrls.length - 1 : p - 1));
  }

  function next() {
    if (!hasPhotos) return;
    setIdx((p) => (p === photoUrls.length - 1 ? 0 : p + 1));
  }

  useEffect(() => {
    photoUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [photoUrls]);

  useEffect(() => {
    setLoading(true);
  }, [idx]);

  // ✅ BASE CARD (shared UI)
  function BaseCard({ isCard2 }: { isCard2: boolean }) {
    return (
      <div
        className={`${
          isCard2
            ? "relative overflow-visible"
            : "w-full md:w-80"
        } rounded-4xl border-4 p-3 mt-10 shadow-[10px_10px_24px_rgba(0,0,0,0.08)] ${
          item.background
        } border-black`}
      >
        {/* IMAGE */}
        <div className="relative h-55 md:h-70 border-black border-2 w-full overflow-hidden rounded-2xl bg-gray-100">
          {currentUrl ? (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                  Loading...
                </div>
              )}

              <img
                src={currentUrl}
                alt={item.name ?? "space image"}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setLoading(false)}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  setLoading(false);
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 21l-5-5L9 21" />
                </svg>
                <div className="text-sm">No images uploaded</div>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="absolute right-2 top-2 flex items-center gap-2">
            <button
              onClick={prev}
              disabled={!hasPhotos}
              className={`grid h-8 w-8 place-items-center rounded-full text-white ring-1 ring-black ${
                hasPhotos ? "bg-black" : "bg-gray-400/60"
              }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={next}
              disabled={!hasPhotos}
              className={`grid h-8 w-8 place-items-center rounded-full text-white ring-1 ring-black ${
                hasPhotos ? "bg-black" : "bg-gray-400/60"
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* DOTS */}
          {hasPhotos && photoUrls.length > 1 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
              {photoUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 w-8 rounded-full ${
                    i === idx ? "bg-black" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div onClick={onView} className="cursor-pointer">
          <div className="mt-3 flex items-center text-black justify-between">
            <TierBadge n={item.tier} />
            <Rating value={item.rating} reviews={item.reviews} />
          </div>

          <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

          <p className="mt-3 text-xs md:text-base text-center text-black">
            {item.type} is available around{" "}
            <span className="font-semibold">{item.location}</span> for{" "}
            {item.space === "sharedspace" ? (
              <>
                a split amount of{" "}
                <span className="font-semibold">
                  ₦{Number(item.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-semibold">
                ₦{Number(item.price).toLocaleString()}
              </span>
            )}{" "}
            {item.duration}.
          </p>
        </div>
      </div>
    );
  }

  // ✅ CONDITIONAL RENDER
  if (item.card2) {
    return (
      <div className="relative w-60 md:w-80 mx-5">
        {/* FLOATING ICONS */}
        <div className="absolute -top-4 -left-5 flex flex-col gap-5 z-10">
          <HiOutlineDotsVertical className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
          {item.pending && (
            <AiOutlineLoading3Quarters className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
          )}
          {item.approve && (
            <GrCheckmark className="w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-[#D6FFC3] border-2 shadow-md" />
          )}
          {item.delete && (
            <MdDeleteForever  className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
          )}
          {item.decline && (
            <TbCancel className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
          )}
          {item.unsend && (
            <TbArrowBack  className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
          )}
          
          <FaArrowRight className="text-white w-10 h-10 md:w-11 md:h-11 p-3 rounded-full bg-black shadow-md" />
        </div>

        <BaseCard isCard2={true} />
      </div>
    );
  }

  // DEFAULT CARD
  return <BaseCard isCard2={false} />;
}