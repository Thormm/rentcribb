import { useState, useEffect } from "react";
import { Medal, Star, User, ChevronLeft, ChevronRight } from "lucide-react";

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
  photos?: string[]; // filenames from DB
  user?: string; // username folder used when saving files on backend
  name: string;
};

type CardProps<T extends CardItemBase> = {
  item: T;
};

export default function Card<T extends CardItemBase>({ item }: CardProps<T>) {
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Build full image URLs from item.photos and item.user
  const photoUrls = (item.photos || []).map((filename) => {
    const folder =
      item.space === "sharedspace" ? "shared_spaces" : "entire_spaces";
    // ensure no leading slash
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

  return (
    <div
      className={`w-full md:w-80 rounded-4xl border-4 p-3 mt-10 shadow-[10px_10px_24px_rgba(0,0,0,0.08)] ${item.background} border-black`}
    >
      {/* image placeholder with shuttle buttons */}
      <div className="relative h-55 md:h-70 border-black border-2 w-full overflow-hidden rounded-2xl bg-gray-100">
        {/* Image (or placeholder) */}
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

        {/* Shuttle buttons */}
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="previous image"
            disabled={!hasPhotos}
            className={`grid h-8 w-8 place-items-center rounded-full text-white ring-1 ring-black ${
              hasPhotos ? "bg-black" : "bg-gray-400/60 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            aria-label="next image"
            disabled={!hasPhotos}
            className={`grid h-8 w-8 place-items-center rounded-full text-white ring-1 ring-black ${
              hasPhotos ? "bg-black" : "bg-gray-400/60 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* small paginator / dots */}
        {hasPhotos && photoUrls.length > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
            {photoUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 w-8 rounded-full ${
                  i === idx ? "bg-black" : "bg-white/60"
                }`}
                aria-label={`go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* meta row */}
      <div className="mt-3 flex items-center text-black justify-between">
        <TierBadge n={item.tier} />
        <Rating value={item.rating} reviews={item.reviews} />
      </div>

      <div className="border-t-2 text-black  border-dashed border-gray-400 my-2"></div>

      {/* description */}
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
  );
}
